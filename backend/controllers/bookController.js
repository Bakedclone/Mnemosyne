import { Books } from "../models/Books.js";
import ErrorHandler from "../utils/errorHandler.js"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendMailToList } from "./bookUpdates.controller.js";

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

    const files = req.files;

    const images = [];
    // Traverse through each file and upload to Cloudinary
    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        // Convert file to data URI
        const dataUri = getDataUri(file);

        // Upload to Cloudinary
        const mycloud = await cloudinary.v2.uploader.upload(dataUri.content);

        // Store image details in the array
        const img = {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        };

        // Push img into images array
        images.push(img);
    }

    const books = await Books.create({
        ISBN, 
        title, 
        author, 
        publisher, 
        year, 
        genre, 
        quantity, 
        available,
        images
    });
    sendMailToList([books.title],[]);
    res.status(200).json({
    success: true,
    books,
    message: "New Book added Successfully."
    });
});

export const removeBook = catchAsyncError(async(req, res, next)=> {

    const book = await Books.findOne({"ISBN" : req.body.ISBN});

    if(!book)
        return next(new ErrorHandler("Book Not Found", 400));

    await book.deleteOne();

    res.status(200).json({
        success: true,
        message: "Book Remove Successfully."
    });
});

export const updateBook = catchAsyncError(async (req, res, next)=> {
    
    const { ISBN, title, author, publisher, year, genre, quantity, available } = req.body;

    if(!ISBN) 
        return next(new ErrorHandler("Enter ISBN No.", 400));
    const book = await Books.findOne({"ISBN" : ISBN});
    if(!book)
        return next(new ErrorHandler("Book Not Found", 400));
    
    if(title) book.title = title;
    if(author) book.author = author;
    if(publisher) book.publisher = publisher;
    if(year) book.year = year;
    if(genre) book.genre = genre;
    if(quantity) book.quantity = quantity;
    if(available) book.available = available;

    await book.save();

    res.status(200).json({
        success: true,
        message: `Update book ${ISBN} Successfully`
    });
});
