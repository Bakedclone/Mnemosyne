import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({

    _id:{
        type:String,
        required:[true, "Please enter your username"]
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: validator.isEmail,
    },
    address:{
        type:String
    },
    phoneNumber: {
        type: Number,
      },
    password:{
        type:String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be atleast 6 character"],
        select: false,
    },
    type: {
        type: String,
        enum: ["admin", "user", "tenant"],
        default: "user",
    },
    photo: {
        public_id : {
            type: String,
        },
        url: {
            type: String,
        }
    },
    aadharcard: {
        public_id : {
            type: String,
        },
        url: {
            type: String,
        }
    },
    pancard: {
        public_id : {
            type: String,
        },
        url: {
            type: String,
        }
    },
    subscription: {
        id: String,
        status: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String, 
    resetPasswordExpire: String,

})

schema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
}) 

schema.methods.getJWTToken = function() {
    return jwt.sign({_id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
};

schema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
};

schema.methods.getResetToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 6*60*1000;

    return resetToken;
}
export const Users = mongoose.model("Users", schema, "Users");
