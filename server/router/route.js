import { Router } from "express";
const router = new Router();
import Auth from "../middleware/auth.js";

//importing all controllers
import * as Controller from '../controllers/appController.js';




// POST Methods
router.route('/Register').post(Controller.Register)
//router.route('/RegisterMail').post(); //send email
router.route('/Authetification').post((req,res)=>{res.end()}); //authenticate user
router.route('/Login').post(Controller.verifyUser, Controller.login); //login in the app



// GET Methods 
router.route('/getallIssues').get(Controller.getallIssues); // retriving all Issues from a project
router.route('/getWorklogs').get(Controller.getWorklogs); //retriving all worklogs of an issue
router.route('/user/:username').get(Controller.getUser); //user with username
router.route('/generateOTP').get(Controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(Controller.verifyOTP); //verify generated OTP
router.route('/CreateResetSession').get(Controller.createResetSession); //reset all variables

// PUT Methods
router.route('/updateuser').put(Controller.updateuser); // to update the user profile
router.route('/resetpassword').put(Controller.resetPassword); // to reset the password 

export default router;