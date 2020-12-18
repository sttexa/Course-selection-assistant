var express = require('express');
var router = express.Router();
var planningController = require('../controller/planning.controller');
var programCourseController = require('../controller/Program.course.controller');
var recommendationController = require('../controller/Recommendationcontroller');
var studentController = require('../controller/Student.controller')

/* GET home page. */
/* Original test */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET form page. */

/* Route requests to correct controller */

router.post('/planning/available', planningController.availableCourses)
router.post('/planning/selectedCourses', planningController.selectedCourses)
router.post('/planning/time_check', planningController.timetable)
router.post('/planning/remove', planningController.remove)
router.post('/planning/status_check', planningController.checkStatus)
router.get('/studied', planningController.studiedCourses) // List of studied courses
router.get('/studied/:cid', planningController.studiedCourseByID)
router.post('/recommend', recommendationController.Load_rating)
router.post('/studied/add', planningController.writeStudied) //sending form to add studied course
router.post('/studied/remove', planningController.removeCourseStudied)
router.post('/student/year', studentController.S_year)
router.post('/student/major_list', studentController.Major_list)
router.get('/course', programCourseController.findAllCourse)
router.get('/course/list', programCourseController.findAllCNameID)
router.get('/course/:cid', programCourseController.findCourseByID)
router.get('/course/search/:keyword', programCourseController.findCourseByKeyword)// List of courses related to keyword
router.get('/program/:pid', programCourseController.findProgram)

module.exports = router;
