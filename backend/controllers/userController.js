import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js"
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";

// Model Import
import { Users } from "../models/Users.js";

export const register = catchAsyncError(async(req, res, next)=> {

    const { username, email, password, type } = req.body;
    
    if(!username || !email || !password) 
    return next(new ErrorHandler("Enter all fields", 400));

    let user = await Users.findOne({ email });
    if (user) return next(new ErrorHandler("User already exist", 409));


    user = await Users.create({
        username,
        email,
        password,
        type,
    })

    sendToken(res, user, "Registered Successfully.", 201);
});

export const login = catchAsyncError(async(req, res, next)=> {

    const { email, password } = req.body;

    if(!email || !password) 
        return next(new ErrorHandler("Please enter Email and Password", 400));

    const user = await Users.findOne({ email }).select("+password");
    // user = await Users.findOne({ _id });

    if (!user) return next(new ErrorHandler("User does't exist", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Invalid Email or Password",401));

    sendToken(res, user, `Welcome Back, ${user._id}`, 201);
});

export const logout = catchAsyncError(async (req, res, next)=> {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true, 
        sameSite: "none",
    }).json({
        success: true,
        message: "Logout Successfully."
    })
});

export const getMyProfile = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.findById(req.user._id);
    
    res.status(200).json({
        success: true,
        user,
    });
})

export const deleteMyProfile = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.findById(req.user._id);
    
    if(user.photo.public_id)
        await cloudinary.v2.uploader.destroy(user.photo.public_id);
    if(user.pancard.public_id)
        await cloudinary.v2.uploader.destroy(user.pancard.public_id);
    if(user.aadharcard.public_id)
        await cloudinary.v2.uploader.destroy(user.aadharcard.public_id);

    await user.deleteOne();

    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User Deleted Successfully.",
    });
});

export const changePassword = catchAsyncError(async (req, res, next)=> {
    
    const { oldPassword, newPassword } = req.body;

    if( !oldPassword || !newPassword )
        return next(new ErrorHandler("Please enter all fields", 400));

    const user = await Users.findById(req.user._id).select("+password");
    
    const isMatch = await user.comparePassword(oldPassword);

    if(!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully."
    });
})

export const updateProfile = catchAsyncError(async (req, res, next)=> {
    
    const { name, email, phoneNumber, address } = req.body;

    const user = await Users.findById(req.user._id);
    
    if(name) user.name = name;
    if(email) user.email = email;
    if(phoneNumber) user.phoneNumber = phoneNumber;
    if(address) user.address = address;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Update Profile Successfully."
    });
})

export const updateProfilePicture = catchAsyncError(async (req, res, next)=> {
    
    const file = req.file;
    const user = await Users.findById(req.user._id);
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    
    if(user.photo.public_id)
        await cloudinary.v2.uploader.destroy(user.photo.public_id);

    user.photo = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    }
    user.save();
    res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully."
    });
})

export const uploadAadharcard = catchAsyncError(async (req, res, next)=> {
    
    const file = req.file;
    const user = await Users.findById(req.user._id);
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    
    if(user.aadharcard.public_id)
        await cloudinary.v2.uploader.destroy(user.aadharcard.public_id);

    user.aadharcard = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    }
    user.save();
    res.status(200).json({
        success: true,
        message: "Aadhar Card Updated Successfully."
    });
})

export const uploadPanCard = catchAsyncError(async (req, res, next)=> {
    
    const file = req.file;
    const user = await Users.findById(req.user._id);
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    
    if(user.pancard.public_id)
        await cloudinary.v2.uploader.destroy(user.aadharcard.public_id);

    user.pancard = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    }

    user.save();
    res.status(200).json({
        success: true,
        message: "Pan Card Updated Successfully."
    });
})


export const forgetPassword = catchAsyncError(async (req, res, next)=> {
    
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if(!user) return next(new ErrorHandler("Email doesn't exist", 400));

    const resetToken = await user.getResetToken();
    
    await user.save();
    const url = `${process.env.FRONTEND_URL}/auth/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;

    await sendEmail(user.email, "HappyLiving Reset Password", message);

    res.status(200).json({
        success: true,
        message: `Reset Token has been sent to ${user.email}`,
    });
})

export const resetPassword = catchAsyncError(async (req, res, next)=> {
    
    const { token } = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        }
    });

    if(!user) return next(new ErrorHandler("Token is invalid or has been expired.", 401));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: `Password changed Successfully.`,
    });
})

// Admin Controllers

export const getAllUsers = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.find({});

    res.status(200).json({
        success: true,
        user,
    });
})

export const getUser = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.find({_id: req.body._id});

    if(!user) {
        res.status(404).json({
            success: false,
            message: "User Not Found.",
        });
    }

    res.status(200).json({
        success: true,
        user,
    });
})

export const updateUserType = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.findById(req.params.id);

    if(user.type === "user") user.type = "admin";
    // else user.type = "user"; 

    await user.save();

    res.status(200).json({
        success: true,
        message: "User type updated Successfully.",
    });
});

export const deleteUser = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.findById(req.params.id);

    if(!user) return next(new ErrorHandler("User not found.", 404));
    
    if(user.photo.public_id)
        await cloudinary.v2.uploader.destroy(user.photo.public_id);
    if(user.pancard.public_id)
        await cloudinary.v2.uploader.destroy(user.pancard.public_id);
    if(user.aadharcard.public_id)
        await cloudinary.v2.uploader.destroy(user.aadharcard.public_id);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully.",
    });
});

export const RequestStay = catchAsyncError(async (req, res, next)=> {
    
    const user = await Users.findById(req.user._id);
    const { SharingCapacity, PropertyID, Description, CheckINDate } = req.body;

    const to = process.env.MY_MAIL;
    const subject = `HappyLiving. Request for Stay by ${user._id}`;
    const message = `User : ${user._id} has requested a stay at \nProperty : ${PropertyID} \nhaving Sharing Capacity : ${SharingCapacity}` + (Description ? `\nDescription : ${Description}` : ('.'));

    await sendEmail(to, subject, message);



    res.status(200).json({
        success: true,
        message: "Your Request is send Successfully. Landlord will contact you with in 24hrs.",
    });
});