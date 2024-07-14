import express from "express";
import { RequestStay, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, getUser, login, logout, register, resetPassword, updateProfile, updateProfilePicture, updateUserType, uploadAadharcard, uploadPanCard } from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();

// To register new user
router.route("/register").post(singleUpload, register);

// Login
router.route("/login").post(login);

// Logout
router.route("/logout").get(logout);

// Get my profile
router.route("/me").get(isAuthenticated ,getMyProfile);


// Delete my profile
router.route("/me").delete(isAuthenticated ,deleteMyProfile);

// ChangePassword
router.route("/changepassword").put(isAuthenticated, changePassword);

// UpdateProfile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

// UpdateProfilePicture
router.route("/updateprofilepicture").put(isAuthenticated, singleUpload, updateProfilePicture);

// UploadAadharCard
router.route("/uploadaadharcard").put(isAuthenticated, singleUpload, uploadAadharcard);

// UploadPanCard
router.route("/uploadpancard").put(isAuthenticated, singleUpload, uploadPanCard);

// ForgetPassword
router.route("/forgetpassword").post(forgetPassword);

// ResetPassword
router.route("/resetpassword/:token").put(resetPassword);


// Admin Routes

// GetAllusers
router.route("/admin/getallusers").get(isAuthenticated, authorizeAdmin, getAllUsers);

// Get User
router.route("/admin/getuser").post(isAuthenticated, authorizeAdmin, getUser);

// UpdateUserType
router.route("/admin/user/:id").get(isAuthenticated, authorizeAdmin, updateUserType).delete(isAuthenticated, authorizeAdmin, deleteUser);

// Request a stay
router.route("/booknow").post(isAuthenticated, RequestStay);

export default router;