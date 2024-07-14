import multer from "multer";
import csv from 'csv-parser';
import fs from "fs";
import nodemailer from "nodemailer";
import { Books } from "../models/Books.js";
import { Users } from "../models/Users.js";
// import dotenv from 'dotenv'.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL || "priyanshu24052@gmail.com",
        pass: process.env.GMAILPASS || "ghpj frwr gdjz ibnf"
    }
});

const processRowSingle = async (toInsertInBulk) => {
    let failedCnt = 0;
    for (let i = 0; i < toInsertInBulk.length; i++) {
        try {
            const row = toInsertInBulk[i];
            const userToSave = new Books(row);
            await userToSave.save();
        } catch (error) {
            if (error.code === 11000) {
                console.log(`Duplicate key error for ISBN: ${toInsertInBulk[i].ISBN}`);
            } else {
                console.log("There has been an Error", error);
            }
            failedCnt++;
        } finally {
            console.log("Finished processing single row");
        }
    }
    return failedCnt;
};
// Processes CSV file via streaming it and then inserts all the data from a batch into mongo db server.
const readCsv = async (res,req, pathForCsv, fallbackValues,titles) => {
    let toInsertInBulk = [];
    let bookName = [];
    const batchSize = 100;
    let currentSizeOfBatch = 0;
    let successCnt = 0;
    let failureCnt = 0;
    try {

        const readStream = fs.createReadStream(pathForCsv)
            .pipe(csv())
            .on('data', async function (row) {
                const dataToPush = {};
                const rowKeys = Object.keys(row);
                for (let i = 0; i < rowKeys.length; i++) {
                    dataToPush[rowKeys[i]] = row[rowKeys[i]].trim();
                    if(i==0)
                    bookName.push(row['title']);
                }
                toInsertInBulk.push(dataToPush);
                currentSizeOfBatch++;
                if (currentSizeOfBatch >= batchSize) {
                    readStream.pause();
                    try {
                        await Books.insertMany(toInsertInBulk, { ordered: false });
                        successCnt += toInsertInBulk.length;
                    } catch (error) {
                        console.log("Bulk insert error, Trying for Single Files.");
                        const tempLen = toInsertInBulk.length;
                        const tempFailedCnt = await processRowSingle(toInsertInBulk);
                        failureCnt += tempFailedCnt;
                        successCnt += tempLen - tempFailedCnt;
                    } finally {
                        toInsertInBulk = [];
                        currentSizeOfBatch = 0;
                        readStream.resume();
                    }
                }

            })
            .on('end', async function () {
                if (toInsertInBulk.length > 0) {
                    try {
                        await Books.insertMany(toInsertInBulk, { ordered: false });
                        successCnt += toInsertInBulk.length;
                    } catch (error) {
                        console.log("Bulk insert error, Trying for single files");
                        const tempFailedCnt = await processRowSingle(toInsertInBulk);
                        failureCnt += tempFailedCnt;
                    } finally {
                        console.log("Batch Processing Finished!!");
                    }
                }
                console.log("Number of files Successfully processed:", successCnt);
                console.log("Number of files Unsuccessfully processed:", failureCnt);
                if (req.file) {
                    try {
                        await fs.promises.unlink(pathForCsv);
                        console.log(`Temporary file deleted: ${pathForCsv}`);
                    } catch (error) {
                        console.error(`Error deleting temporary file: ${error}`);
                    }
                }
                sendMailToList(bookName,titles);
                res.status(200).json({ msg: `Process Done` });
            })
            .on("error", function (e) {
                console.log("There has been an error", e);
            });
    }
    catch (error) {
        console.log("Error in processing file:", error);
    }
};

const upload = multer({ dest: 'uploads/' });
export const getCsv = async (req, res) => {
    try {
        console.log("Yes Entered");
        const preExistingBooks = await Books.find({});
        const titles = preExistingBooks.map(book => book.title);
        await upload.single('csvFile')(req, res, async (err) => {
            if (err) {
                // Handle upload errors (e.g., file size limits exceeded)
                console.error('Error uploading file:', err);
                return res.status(400).json({ msg: "Error uploading file." });
            }

            if (req.file) {
                const filePath = req.file.path;
                await readCsv(res, req,filePath,0,titles);
            } else {
                res.status(400).json({ msg: "No CSV file uploaded." });
            }
        });
    } catch (error) {
        res.status(400).json({ msg: "There has been an error", error: error });
    } finally {
        if (req.file) {
            try {
                await fs.promises.unlink(filePath);
                console.log(`Temporary file deleted: ${filePath}`);
            } catch (error) {
                console.error(`Error deleting temporary file: ${error}`);
            }
        }
    }
}



const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("There has been an error", error);
        } else {
            console.log(`Email sent to ${mailOptions.to} : ` + info.response);
        }
    });
}
// Used for sending email to all listed users in mongodb.
export const sendMailToList = async (listOfBooksPrev,titles) => {
    try {
        const user = await Users.find({type:"user"});
        let listOfBooks = [];
        listOfBooksPrev.forEach(item => {
            if (!titles.includes(item)) {
                listOfBooks.push(item);
            }
        });
        console.log(listOfBooks,listOfBooksPrev,titles);
        if(listOfBooks.length > 0){
            for await (const currentUser of user) {
                if (currentUser.emailSub) {
                    const clientEmail = currentUser.email;
                    const clientName = currentUser.username;
                    const unSubLink = `http://localhost:4000/api/unsubscribeMail/${clientEmail}`;
                    const message = `
                            Hey ${clientName}!
                            <br/>
                            Thank you for signing up with your email ${clientEmail}. We have new books ${listOfBooks.join(', ')}.
                            Check Out the Latest books on the website.
                            <br/><br/>
                            Team LJ.
    
    
                            <center>To unsubscribe, please click <a style="color:blue" href="${unSubLink}">here.</a><center>
                        `
                    var mailOptions = {
                        from: process.env.GMAIL || "priyanshu24052@gmail.com",
                        to: clientEmail,
                        subject: 'Hey There.. We Have New Collection Of Books!!',
                        html: message
                    };
                    try {
                        await sendMail(mailOptions)
                    }
                    catch (error) {
                        console.log("There has been an Error..", error);
                    }
                }
                else {
                    console.log("User has not subscribed to email list " + currentUser.email);
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}
// Used by the client to unsubscribe mailing services.
export const unsubscribeMail = async (req, res) => {
    console.log("Please Unsub " + req.params.token);
    try {
        await user.updateOne({ email: req.params.token }, { emailSub: false })
        res.status(200).json({ msg: "Done" });
    }
    catch (error) {
        res.status(400).json({ msg: `There has been an error`, error });
    }
}