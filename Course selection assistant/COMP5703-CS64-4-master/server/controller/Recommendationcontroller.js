var course_studiedModel = require('../models/course_studied');
var courseModel = require('../models/course');
var studentModel = require('../models/StudentModel')

module.exports.Save = function (req, res, next) {
    var params = req.body;
    courseModel.findCourse(params.course_code, function (err, course_result) {
        if (err) {
            console.log("find course detailes by course code error");
        } else {
            course_studiedModel.readCourseByCode(params.course_code, function (err, studied_result) {
                if (err) {
                    console.log("find studied course by course code error");
                } else {
                    var rating = (course_result[0].rating * studied_result.length + params.rating) / (studied_result.length + 1);
                    courseModel.update_rating(params.id, rating, function (err, docs) {
                        if (err) {
                            console.log(err);
                            res.json("Saving Error");
                        } else {
                            res.json("Rating successful");
                        }
                    })
                }
            })
        }
    })
} // Save the studied course record to database and update the average rating of the course

module.exports.Load_rating = function (req, res, next) {
    var Code = [];
    var responses = req.body;
    var ID = req.session.student.s_id;
    var major = req.session.student.s_major;
    var promises = [];
    for (var i in responses.core) {
        Code.push(responses.core[i].id)
    }
    for (var i in responses.advElective) {
        Code.push(responses.advElective[i].id)
    }
    for (var i in responses.elective) {
        Code.push(responses.elective[i].id)
    }
    studentModel.find_byMajor(major, function (err, result) {
        // Average rating only relates to people having same major
        if (err) {
            console.log(err);
        } else {
            for (var i in Code) {
                for (var j in result) {
                    promises.push(new Promise(function (resolve, reject) {
                        course_studiedModel.readRatingByCode(parseInt(result[j].id), Code[i], function (err, data) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                if (data[0] == null) {
                                    resolve(null)
                                } else {
                                    var Arr = {
                                        Code: data[0].Code,
                                        Rating: parseInt(data[0].Rating)
                                    }
                                    resolve(Arr);
                                }
                            }
                        })
                    }))
                }
            }
            Promise.all(promises).then(function (results) {
                console.log(results);
                var Array = [];
                for (var i in Code) {
                    var sum_rating = 0;
                    var sum_num = 0;
                    for (var j in results) {
                        if (results[j] != null) {
                            if (results[j].Code == Code[i]) {
                                sum_rating += results[j].Rating;
                                sum_num++;
                            }
                        }
                    }
                    Array.push(new Object({'Code': Code[i], 'Rating': (sum_rating / sum_num).toFixed(3)}))
                }
                console.log(Array);
                for (var i in responses.core) {
                    for (var j in Array) {
                        if (Array[j].Code == responses.core[i].id) {
                            if (Array[j].Rating) {
                                responses.core[i].Rating = Array[j].Rating;
                            } else {
                                responses.core[i].Rating = "NONE";
                            }
                        }
                    }
                }
                for (var i in responses.advElective) {
                    for (var j in Array) {
                        if (Array[j].Code == responses.advElective[i].id) {
                            if (Array[j].Rating) {
                                responses.advElective[i].Rating = Array[j].Rating;
                            } else {
                                responses.advElective[i].Rating = "NONE";
                            }
                        }
                    }
                }
                for (var i in responses.elective) {
                    for (var j in Array) {
                        if (Array[j].Code == responses.elective[i].id) {
                            if (Array[j].Rating) {
                                responses.elective[i].Rating = Array[j].Rating;
                            } else {
                                responses.elective[i].Rating = "NONE";
                            }
                        }
                    }
                }
                console.log(responses.core)
                res.send(responses);
            });
        }
    })
} // Load the average rating of all available courses and send them to the main page in a particular format