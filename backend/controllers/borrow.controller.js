import { Borrowings } from "../models/Borrowings.js";
import { Users } from "../models/Users.js";
import { Books } from "../models/Books.js";
import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL || "priyanshu24052@gmail.com",
        pass: process.env.GMAILPASS || "ghpj frwr gdjz ibnf"
    }
});
const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("There has been an error", error);
        } else {
            console.log(`Email sent to ${mailOptions.to} : ` + info.response);

        }
    });
}
export const borrow = async (req, res) => {
    const bookId = req.body.bookId;
    const userId = req.body.userId;

    const user = await Users.find({ _id: userId });
    const book = await Books.find({ ISBN: bookId });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    else {
        const clientEmail = user[0]["email"];
        const clientName = user[0]["username"];
        const unSubLink = `http://localhost:4000/api/v1/confirmBooking/${userId}/${bookId}`;
        const message = `
                            Hey ${clientName}!
                            <br/>
                            Thank you for Borrowing the Book ${book[0].title}
                            To Confirm, please click <a style="color:blue" href="${unSubLink}">here.</a>
                            <br/><br/>
                            Team LJ.
    
    
                        `
        var mailOptions = {
            from: process.env.GMAIL || "priyanshu24052@gmail.com",
            to: clientEmail,
            subject: 'Confirm Your Borrowing..',
            html: message
        };
        try {
            await sendMail(mailOptions)
            res.status(200).send("Done");
        }
        catch (error) {
            console.log("There has been an Error..", error);
        }
    }
}
export const confirmBooking = async (req, res) => {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    console.log(bookId,"Book is confirmed by",userId);
    try {
        const borrowAlready = await Borrowings.find({user_id:userId,book_id:bookId});
        if(borrowAlready.length == 0){
            const borrowItem = new Borrowings({
                user_id: userId,
                book_id: bookId,
                borrow_date: Date.now()
            })
            borrowItem.save()
            .then(async(savedBorrowItem) => {
                const borrowItemId = savedBorrowItem._id;
                console.log(borrowItemId)
                await Users.updateOne({_id:userId,"borrowings": { $ne: borrowItemId }},{"$push": { "borrowings": borrowItemId }});
                res.status(200).send("Done");
            });
        }
        else res.status(400).send("Fail");
    }
    catch (error) {
        res.status(400).json({ msg: `There has been an error`, error });
    }
}

export const hist = async(req,res) =>{
    const user = await Users.find({});
    const ansBorrow = {};
    const ansReturn = {};
    for(let i=0;i<user.length;i++){
        ansBorrow[user[i].username] = await histIndividualBorrow(user[i]);
        ansReturn[user[i].username] = await histIndividualReturn(user[i]);
    }
    res.status(200).json({"borrow":ansBorrow,"return":ansReturn});
}
const histIndividualBorrow = async(user) => {
    const borrowedBooks = user.borrowings;
    const borrowdBooksDetails = [];
    for(let i=0;i<borrowedBooks.length;i++){
        borrowdBooksDetails.push(await Borrowings.findById(borrowedBooks[i]));
    }
    return borrowdBooksDetails;
}
const histIndividualReturn = async(user) =>{
    const returnedBooks = user.returnings;
    const returnedBooksDetails = [];
    for(let i=0;i<returnedBooks.length;i++){
        returnedBooksDetails.push(await Borrowings.find({ISBN:borrowedBooks[i]}));
    }
    return returnedBooksDetails;
}
