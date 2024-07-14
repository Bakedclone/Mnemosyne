import express from "express";
// import { addRooms, getAllRooms, getAvaiableRooms,removeRoom, updateRoom } from "../controllers/roomController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { multipleUpload } from "../middlewares/multer.js";
import { addBook, getAllBooks, removeBook, updateBook } from "../controllers/bookController.js";
const router = express.Router();

// Add Book
router.route("/addbook").post(isAuthenticated, authorizeAdmin, multipleUpload, addBook)

// Remove Book
router.route("/removebook").post(isAuthenticated, authorizeAdmin, removeBook);

//  Update Book 
router.route("/updatebook").post(isAuthenticated, authorizeAdmin, updateBook);

// Get All Books
router.route("/getallbooks").get(getAllBooks);

export default router;