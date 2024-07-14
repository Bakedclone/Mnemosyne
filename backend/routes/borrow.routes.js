import express from "express"; 
const router = express.Router();

import {borrow,confirmBooking,hist}  from "../controllers/borrow.controller.js";

router.route("/borrow").post(borrow);
router.route("/confirmBooking/:userId/:bookId").get(confirmBooking);
router.route("/history").get(hist);

export default router;