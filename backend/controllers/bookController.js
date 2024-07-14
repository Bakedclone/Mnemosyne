// import { Rooms } from "../models/Rooms.js";
import { Books } from "../models/Books.js";
import ErrorHandler from "../utils/errorHandler.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const getAllBooks = async (req, res, next) => {
    const books = await Books.find();
    res.status(200).json({
        success: true,
        books,
    });
};

export const addBook = catchAsyncError(async(req, res, next)=> {

    const { ISBN, title, author, publisher, year, genre, quantity, available } = req.body;
    
    if(!ISBN || !title || !author || !publisher || !year || !genre || !quantity || !available) 
        return next(new ErrorHandler("Enter all fields", 400));

    const findbook = await Books.find({"ISBN" : ISBN});

    if(findbook.length > 0)
    return next(new ErrorHandler("ISBN is already exsist", 400));

    const books = await Books.create({
        ISBN, 
        title, 
        author, 
        publisher, 
        year, 
        genre, 
        quantity, 
        available
    });

    res.status(200).json({
    success: true,
    books,
    message: "New Book added Successfully."
    });
});

// export const removeRoom = catchAsyncError(async(req, res, next)=> {

//     const room = await Rooms.findById(req.body._id);

//     if(!room)
//         return next(new ErrorHandler("Room Not Found", 400));

//     await room.deleteOne();

//     res.status(200).json({
//         success: true,
//         message: "Room Remove Successfull."
//     });
// });

// export const updateRoom = catchAsyncError(async (req, res, next)=> {
    
//     const { Propertyid, MonthlyRent, SharingCapacity, Occupied, facilities, description } = req.body;

//     const room = await Rooms.findById(req.body._id);
//     if(!room)
//         return next(new ErrorHandler("Room Not Found", 400));
    
//     if(SharingCapacity) room.SharingCapacity = SharingCapacity;
//     if(Propertyid) room.Propertyid = Propertyid;
//     if(MonthlyRent) room.MonthlyRent = MonthlyRent;
//     if(Occupied) room.Occupied = Occupied;
//     if(facilities) {
//         const myArray = facilities.split(",");
//         room.facilities = myArray;
//     }
//     if(description) room.description = description;


//     await room.save();

//     res.status(200).json({
//         success: true,
//         message: `Update Room ${req.body._id} Successfully`
//     });
// });


// export const getAvaiableRooms = catchAsyncError(async (req, res, next)=> {

//     const propertyid = req.body.Propertyid;

//     const rooms = await Rooms.find({
//         Propertyid: propertyid,
//         $expr: { $lt: ["$Occupied", "$SharingCapacity"] }
//     });

//     res.status(200).json({
//         success: true,
//         rooms,
//     });
// });
