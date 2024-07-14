import express from "express"; 
const router = express.Router();

import {getCsv,unsubscribeMail}  from "../controllers/bookUpdates.controller.js";

router.route("/getCsv").post(getCsv);
router.route("/unsubscribeMail/:token").get(unsubscribeMail);

export default router;