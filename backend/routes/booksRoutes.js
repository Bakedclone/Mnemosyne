import express from "express";
// import { addRooms, getAllRooms, getAvaiableRooms,removeRoom, updateRoom } from "../controllers/roomController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { addBook } from "../controllers/bookController.js";
const router = express.Router();

// Add Book
router.route("/addbook").post(isAuthenticated, authorizeAdmin, addBook)

// // Remove Room
// router.route("/removeroom").post(isAuthenticated, authorizeAdmin, removeRoom);

// //  Update Room 
// router.route("/updateroom").post(isAuthenticated, authorizeAdmin, updateRoom);

// // Get Available Rooms
// router.route("/availablerooms").post(isAuthenticated, authorizeAdmin, getAvaiableRooms);

// // Get All Rooms
// router.route("/getallrooms").get(isAuthenticated, authorizeAdmin, getAllRooms);

export default router;