import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';


/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser,controller.login); // login in app

/** GET Methods */

//router.route('/assigneddata').get(controller.getAllAssignees)

router.route('/usersdata').get(controller.getUserdata)
router.route('/bonusdata').get(controller.BonusLoggedShifts)
router.route('/validation').get(controller.getUsersWithLoggedShifts)
router.route('/gettodayshifts').get(controller.getUsersWithShiftsToday)
router.route('/getdata').get(controller.getCurrentWeekData)
router.route('/getshifts').get(controller.getShiftsByWeekForCurrentWeek)

router.route('/fetchs').get(controller.getShiftsForCurrentWeek)
router.route('/weekissues').get(controller.getIssueDataForCurrentWeek)
router.route('/weekly').get(controller.getIssuesForCurrentWeek)


//router.route('/fetchw').get(controller.fetchworklogs)


router.route('/teams').get(controller.connectMS)
router.route('/issues').get(controller.getIssues)
router.route('/worklogs').get(controller.worklogs)
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables


/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password


export default router;