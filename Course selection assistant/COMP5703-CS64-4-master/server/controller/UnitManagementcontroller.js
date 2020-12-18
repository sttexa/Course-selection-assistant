/**
 * Created by DELL on 2020/4/18.
 */

var CourseModel = require('../models/course');

module.exports.getAllCourse = function (req, res, next) { //get all units, executed at the first time of loading management page (Admin_Index.vue)
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        CourseModel.findAll(function (err, allcourse_result) {
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                res.send(allcourse_result); //responses are all data in database
            }
        })
    }
}

module.exports.searchCourse = function (req, res, next) { //search units, staffs should select the type: unit code or unit name,
    var params = req.body;
    if (!req.session.admin) { // available only at the logging status
        res.send("Not log in in yet");
        return
    } else {
        if (params.type == "code") { // if using unit code
            var searchkey = params.keyword.toUpperCase(); //change to upper case
            CourseModel.findCoursesByCode(searchkey, function (err, result) { //this function allows to search by part of keyword.
                if (err) {
                    console.log(err);
                    res.send("Query error")
                } else {
                    res.send(result);
                }
            })
        } else { // if using unit name
            CourseModel.findCoursesByName(params.keyword, function (err, result) { // allow to search by part of keyword
                if (err) {
                    console.log(err);
                    res.send("Query error")
                } else {
                    res.send(result);
                }
            })
        }

    }
}
module.exports.addCourse = function (req, res, next) { //add course, executed when staffs click 'Confirm' after finishing details input
    var params = req.body;
    var coid = params.id.toUpperCase();
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        CourseModel.findCourse(coid, function (err, result) { // ensure that there is no unit with the same unit code
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                if (result[0] != null) {
                    res.send("Course exists")
                } else {
                    if (params.prerequisite == '') { //providing default value if staffs did not input anything.
                        params.prerequisite = 'NONE';
                    }
                    if (params.corequisite == '') {
                        params.corequisite = 'NONE';
                    }
                    CourseModel.writeCourse(coid, params.name, params.outline, params.semester,
                        parseInt(params.credit), params.prerequisite, params.corequisite, params.prohibition, params.assumed, params.type,
                        0, params.permission, params.time, function (err) {
                            if (err) {
                                res.send("Add unsuccessful");
                            } else {
                                res.send("Add successful");
                            }
                        });
                    res.send("Add successful");
                }
            }
        })
    }
}
module.exports.updateCourse = function (req, res, next) {
    var params = req.body;
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        CourseModel.findCourse(params.id, function (err, result) { // ensure that there is a unit with the same unit code
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                if (result == null) {
                    res.send("No Found Course")
                } else {
                    if (params.prerequisite == '') {
                        params.prerequisite = 'NONE';
                    }
                    if (params.corequisite == '') {
                        params.corequisite = 'NONE';
                    }
                    CourseModel.updateCourse(params.id, params.name, params.outline, params.semester, parseInt(params.credit), params.prerequisite,
                        params.corequisite, params.prohibition, params.assumed, params.type, params.permission,
                        params.time, function (err) {
                            if (err) {
                                res.send("Edit unsuccessful");
                            } else {
                                res.send("Edit successful");
                            }
                        });
                    res.send("Edit successful");
                }
            }
        })
    }
}
module.exports.deleteCourse = function (req, res, next) { // remove a unit, executed when staffs click 'delete' for a specific unit
    var params = req.body;
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        CourseModel.findCourse(params.id, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                if (result == null) {
                    res.send("No Found Course")
                } else {
                    CourseModel.removeCourse(params.id, function (err) {
                        if (err) {
                            console.log(err);
                            res.send("Delete Unsuccessful")
                        } else {
                            res.send("Delete successful")
                        }
                    });
                    res.send("Delete successful")
                }
            }
        })
    }
}