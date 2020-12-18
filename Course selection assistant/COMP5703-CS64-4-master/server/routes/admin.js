/**
 * Created by DELL on 2020/4/8.
 */

//routes for adminlogin.ejs, after login success it will turn to adminloginsuccess.ejs

var express = require('express');
var router = express.Router();
var adminController = require('../controller/Admincontroller');
var unitManagementController = require('../controller/UnitManagementcontroller');
var majorManagementController = require('../controller/MajorManagementcontroller');
var session = require('express-session');


router.use(session({
    secret: 'test secret',
    cokkie: {maxAge: 60 * 1000 * 300} //过期时间 ms
}))
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.post('/adminlogin', adminController.Adminlogin);
router.post('/adminsearchunit', unitManagementController.searchCourse);
router.post('/adminaddunit', unitManagementController.addCourse);
router.post('/admineditunit', unitManagementController.updateCourse);
router.post('/admindeleteunit', unitManagementController.deleteCourse);
router.post('/adminlogout', adminController.Adminlogout);
router.post('/getcourses', unitManagementController.getAllCourse);
router.post('/getmajors', majorManagementController.getAllMajor);
router.post('/adminaddmajor', majorManagementController.addMajor);
router.post('/admineditmajor', majorManagementController.updateMajor);
router.post('/admindeletemajor', majorManagementController.deleteMajor);
router.post('/adminsignup', adminController.Adminsignup);
router.post('/getcurrentadmin', adminController.getCurrentAdmin);

module.exports = router;