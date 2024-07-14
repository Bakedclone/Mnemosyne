import express from "express";
// import { addRooms, getAllRooms, getAvaiableRooms,removeRoom, updateRoom } from "../controllers/roomController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { multipleUpload } from "../middlewares/multer.js";
import { addBook, getAllBooks, removeBook } from "../controllers/bookController.js";
const router = express.Router();

// Add Book
router.route("/addbook").post(isAuthenticated, authorizeAdmin, multipleUpload, addBook)

// Remove Room
router.route("/removebook").post(isAuthenticated, authorizeAdmin, removeBook);

// //  Update Room 
// router.route("/updateroom").post(isAuthenticated, authorizeAdmin, updateRoom);

// // Get Available Rooms
// router.route("/availablerooms").post(isAuthenticated, authorizeAdmin, getAvaiableRooms);

// Get All Books
router.route("/getallbooks").get(getAllBooks);

export default router;