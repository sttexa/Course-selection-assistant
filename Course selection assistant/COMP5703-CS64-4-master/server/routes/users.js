var express = require('express');
var router = express.Router();
var studentController = require('../controller/Student.controller');

/* GET users listing. */
/* Users connection test */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* Route requests to correct controller */
router.post('/student/email', studentController.Send_email); // Send verification code to email address
router.post('/student/signup', studentController.Signup); // Sign up and save to database
router.post('/student/login', studentController.Login);  // Login
router.post('/student/change_profile', studentController.Chang_Profile); //Change information in user profile
router.post('/student/profile', studentController.Profile); // Send profile page to front-end
router.get('/student/login_check', studentController.Login_check); // Check if current user has already logged in
router.get('/student/log_out', studentController.Log_out); // Log out
module.exports = router;
