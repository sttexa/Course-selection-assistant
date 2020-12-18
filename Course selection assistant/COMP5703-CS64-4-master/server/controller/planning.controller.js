var CourseStudied = require("../models/course_studied")
var Course = require("../models/course")
var Major = require("../models/major")
var Student = require("../models/StudentModel")


/*
* Using user ID to get the studied courses
* Return the studied courses in a list, if the user has provided studied courses
* */
module.exports.studiedCourses = function (req, res) {
    var id = parseInt(req.session.student.s_id);
    CourseStudied.readCourseStudied(id, function (err, data) {
        if (err) {
            console.log("readCourseStudied: " + err)
        } else {
            console.log(data)
            if (data.length == 0) {
                res.send(data)
            } else {
                var result = [];
                for (var i in data) {
                    result.push(data[i].courseDetails)
                }
                res.send(result)
            }
        }
    })
}

/*
* Removing studied courses by user ID, course ID, semester and year
* */
module.exports.removeCourseStudied = function (req, res) {
    var sid = req.session.student.s_id;
    var cid = req.body.cid;
    var semester = parseInt(req.body.semester);
    var year = req.body.year;
    console.log("sid: " + sid + " cid: " + cid + " sem: " + semester + " year: " + year);
    CourseStudied.removeCourseStudied(parseInt(sid), cid, semester, year);
}

/*
* Find the studied course data by user ID and course ID
* */
module.exports.studiedCourseByID = function (req, res) {
    var sid = req.session.student.s_id;
    var cid = req.params.cid;
    console.log(cid)
    CourseStudied.readCourseByCode(sid, cid, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            res.send(data)
        }
    })
}

/*
* Insert new studied course
* If the student is a new user, then create a new document for storing studied courses and insert new studied courses.
* If the student has a existing document, insert new studied courses to the document.
* */
module.exports.writeStudied = function (req, res) {
    var sid = parseInt(req.session.student.s_id); //for testing
    console.log("This is the SID: " + sid);
    var cid = req.body.code;
    var name = req.body.cname;
    var semester = parseInt(req.body.semester);
    var credit = parseInt(req.body.credit);
    var result = req.body.result;
    var rating = parseFloat(req.body.rating);
    var year = req.body.year;
    // check if there is an existing record for this student
    CourseStudied.readCS(sid, function (err, data) {
        if (err) {
            console.log(err)
        } else {

            // Verify the Credit point requirement
            var selected = req.session.select_list;
            var total_cp_select = 0;
            var removed_cp = 0
            var index_remove = -1;
            if (selected.length) {
                for (var i in selected) {
                    if (parseInt(selected[i].year) == year && parseInt(selected[i].sub_semester) == semester) {
                        total_cp_select += selected[i].credit;
                    }
                    if (selected[i].id == cid) {
                        index_remove = i
                        removed_cp = selected[i].credit
                    }
                }
            }

            var total_cp_cs = 0;
            if (data.length != 0) {
                for (var j in data[0].courseDetails) {
                    var j_course = data[0].courseDetails[j]
                    if (j_course.year == year && j_course.semester == semester) {
                        total_cp_cs += j_course.credit;
                    }
                }
            }

            // Check if the student has already added courses with 24 CPs in a semester
            if ((total_cp_cs + credit + total_cp_select - removed_cp) > 24) {
                res.send({message: false});
            } else {

                // Remove the selected unit from plan if the student tries to add the same course
                if (index_remove != -1) {
                    req.session.select_list.splice(index_remove, 1);
                }

                // if no document is found, create a new one
                if (data.length == 0) {
                    CourseStudied.writeCourseStudied(sid, cid, name, semester, credit, result, rating, year);
                    res.send({message: true})
                } else {
                    CourseStudied.updateCourseStudied(sid, cid, name, semester, credit, result, rating, year);
                    res.send({message: true})
                }
            }
        }
    })

}

/*
* Express API for the course planning component
* Generate a list of available courses based on the previously studied courses, the selected semester,
* the selected courses before the semester, the major.
* */
module.exports.availableCourses = function (req, res) {
    var id = parseInt(req.session.student.s_id);
    var semester = "" + req.body.semester;
    var year = parseInt(req.body.year);
    var selected = req.body.selected.split(" ");
    Student.find_byID(id, function (err, data) {    // Find the student by user ID
        if (err) {
            console.log(err)
        } else {
            var major_name = data[0].s_major;
            var major_2name = data[0].s_minor;
            var s_year = data[0].s_year;
            var year_diff = year - s_year;
            Course.findCourseBySemester(semester, function (err, data) {
                // Find courses that are delivered in the selected semester
                if (err) {
                    console.log(err)
                } else {
                    var semester_course = [];
                    data.forEach(element => { // Courses that delivered this semester
                        semester_course.push(element.id)
                    })
                    CourseStudied.readCourseStudied(id, function (err, data) {
                        // Find the previously studied course by user ID
                        if (err) {
                            console.log(err)
                        } else {
                            var studied_courses = [];
                            var sc_same_sem = [];
                            for (var i in data) {
                                var s_course = data[i]
                                // Check which courses are passed before the selected year and semester
                                if (s_course.courseDetails.result == 'PASS') {
                                    if (s_course.courseDetails.year < year) {
                                        studied_courses.push(s_course.courseDetails.cid);
                                    } else if (s_course.courseDetails.year == year) {
                                        if (s_course.courseDetails.semester < parseInt(semester)) {
                                            studied_courses.push(s_course.courseDetails.cid);
                                        } else if (s_course.courseDetails.semester == parseInt(semester)) {
                                            sc_same_sem.push(s_course.courseDetails.cid);
                                        }
                                    }
                                } else {
                                    if (s_course.courseDetails.year == year &&
                                        s_course.courseDetails.semester == parseInt(semester)) {
                                        sc_same_sem.push(s_course.courseDetails.cid);
                                    }
                                }
                            }
                            if (selected[0] != "") {
                                studied_courses = studied_courses.concat(selected)
                            }
                            semester_course = semester_course.filter(i => studied_courses.indexOf(i) < 0)//Remove completed
                            Major.readProgram(major_name, function (err, data) {
                                // Find the program requirements by user's major
                                if (err) {
                                    console.log(err)
                                } else {
                                    var major = data[0];
                                    var core = major.core;
                                    var advElective = major.advElectives;
                                    var electives = major.electives;
                                    var major_course = major.major;
                                    var major_2_course = [];
                                    var minor_course = [];
                                    if (major_2name != null) { //if the student has major2
                                        major.major2.forEach((element) => {
                                            if (element.name == major_2name) {
                                                major_2_course = element.required;
                                                minor_course = element.minor;
                                            }
                                        })
                                    }
                                    // Remove courses that are not delivered in this semester
                                    core = core.filter(i => semester_course.indexOf(i) !== -1)
                                    advElective = advElective.filter(i => semester_course.indexOf(i) !== -1)
                                    electives = electives.filter(i => semester_course.indexOf(i) !== -1)
                                    major_course = major_course.filter(i => semester_course.indexOf(i) !== -1)
                                    if (major_2name != null) {
                                        major_2_course = major_2_course.filter(i => semester_course.indexOf(i) !== -1)
                                        minor_course = minor_course.filter(i => semester_course.indexOf(i) !== -1)
                                    }

                                    var core_result = []
                                    var advElective_result = []
                                    var electives_result = []

                                    Course.findAll(function (err, data) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            var course_info = data; // list of courses
                                            core.forEach(element => {
                                                var searched_course = course_info.filter(i => i.id == element)
                                                var prerequisite = searched_course[0].prerequisite + "";
                                                // Mark courses that are recommended for the student in the selected
                                                // year and semester. Course level is considered as the condition.
                                                if (year_diff == 0) {
                                                    if (parseInt(searched_course[0].id.charAt(4)) > 1) {
                                                        searched_course[0].name = searched_course[0].name + "***"
                                                    }
                                                } else if (year_diff == 1) {
                                                    if (parseInt(searched_course[0].id.charAt(4)) > 2) {
                                                        searched_course[0].name = searched_course[0].name + "***"
                                                    }
                                                } else if (year_diff == 2) {
                                                    if (parseInt(searched_course[0].id.charAt(4)) > 3) {
                                                        searched_course[0].name = searched_course[0].name + "***"
                                                    }
                                                }
                                                if (sc_same_sem.includes(searched_course[0].id)) {
                                                    // do nothing
                                                } else if (prerequisite === "NONE") { // if the prerequisite is "NONE"
                                                    core_result.push(searched_course[0]) // add this course to the result
                                                } else if (searched_course[0].special_consideration == true) {
                                                    if (year_diff >= 2) {
                                                        core_result.push(searched_course[0]);
                                                    }
                                                } else { // if the prerequisite is not "NONE", then do the evaluation
                                                    prerequisite = prerequisite.replace(/AND/g, '&&')
                                                    prerequisite = prerequisite.replace(/OR/g, '||')
                                                    var regex = /[A-Z]+\d\d\d\d/g;
                                                    var pre_course = prerequisite.match(regex);

                                                    pre_course.forEach(element => {
                                                        if (studied_courses.includes(element)) {
                                                            prerequisite = prerequisite.replace(element, "true")
                                                        } else {
                                                            prerequisite = prerequisite.replace(element, "false")
                                                        }
                                                    })
                                                    var meet_pre = eval(prerequisite);
                                                    // if the student has met the prerequisites,
                                                    // then add the course to the result
                                                    if (meet_pre) {
                                                        core_result.push(searched_course[0])
                                                    }
                                                }
                                            })

                                            // Similar processes are designed for the advanced electives as well as the electives
                                            advElective.forEach(element => {
                                                var searched_course = course_info.filter(i => i.id == element)
                                                var prerequisite = searched_course[0].prerequisite + "";
                                                if (sc_same_sem.includes(searched_course[0].id)) {
                                                    // do nothing
                                                } else if (prerequisite === "NONE") {
                                                    advElective_result.push(searched_course[0])
                                                } else if (searched_course[0].special_consideration == true) {
                                                    if (year_diff >= 2) {
                                                        advElective_result.push(searched_course[0]);
                                                    }
                                                } else {
                                                    prerequisite = prerequisite.replace(/AND/g, '&&')
                                                    prerequisite = prerequisite.replace(/OR/g, '||')
                                                    var regex = /[A-Z]+\d\d\d\d/g;
                                                    var pre_course = prerequisite.match(regex);
                                                    pre_course.forEach(element => {
                                                        if (studied_courses.includes(element)) {
                                                            prerequisite = prerequisite.replace(element, "true")
                                                        } else {
                                                            prerequisite = prerequisite.replace(element, "false")
                                                        }
                                                    })
                                                    var meet_pre = eval(prerequisite);

                                                    if (meet_pre) {
                                                        advElective_result.push(searched_course[0])
                                                    }
                                                }
                                            })
                                            electives.forEach(element => {
                                                var searched_course = course_info.filter(i => i.id == element)
                                                var prerequisite = searched_course[0].prerequisite + "";
                                                if (sc_same_sem.includes(searched_course[0].id)) {
                                                    // do nothing
                                                } else if (prerequisite === "NONE") {
                                                    electives_result.push(searched_course[0])
                                                } else if (searched_course[0].special_consideration == true) {
                                                    if (year_diff >= 2) {
                                                        electives_result.push(searched_course[0]);
                                                    }
                                                } else {
                                                    prerequisite = prerequisite.replace(/AND/g, '&&')
                                                    prerequisite = prerequisite.replace(/OR/g, '||')
                                                    var regex = /[A-Z]+\d\d\d\d/g;
                                                    var pre_course = prerequisite.match(regex);
                                                    pre_course.forEach(element => {
                                                        if (studied_courses.includes(element)) {
                                                            prerequisite = prerequisite.replace(element, "true")
                                                        } else {
                                                            prerequisite = prerequisite.replace(element, "false")
                                                        }
                                                    })
                                                    console.log(prerequisite)
                                                    var meet_pre = eval(prerequisite);
                                                    if (meet_pre) {
                                                        electives_result.push(searched_course[0])
                                                    }
                                                }
                                            })

                                            // Major courses that have not been completed and are delivered in this semester
                                            major_course = major_course.filter(i => studied_courses.indexOf(i) < 0)

                                            if (major_2name != null) {
                                                major_2_course = major_2_course.filter(i => studied_courses.indexOf(i) < 0)
                                                minor_course = minor_course.filter(i => studied_courses.indexOf(i) < 0)
                                                res.send({
                                                    core: core_result, advElective: advElective_result,
                                                    elective: electives_result, major_course: major_course,
                                                    major_2_course: major_2_course, minor_course: minor_course
                                                })
                                            } else {
                                                res.send({
                                                    core: core_result, advElective: advElective_result,
                                                    elective: electives_result, major_course: major_course
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

/*
* Express API for the progress tracking component
* Generate the student's progress toward the completion of degree requirements.
* The result includes required courses that have been completed and required courses that have not been completed.
* */
module.exports.checkStatus = function (req, res) {
    var id = parseInt(req.session.student.s_id);
    var selected = req.body.selected.split(" ");
    // Find student data by user ID
    Student.find_byID(id, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            var major_name = data[0].s_major;
            var major_2name = data[0].s_minor;
            // Find previously studied courses by user ID
            CourseStudied.readCourseStudied(id, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    var studied_courses = [];

                    // Check which courses are passed in the previously studied courses
                    for (var i in data) {
                        if (data[i].courseDetails.result == 'PASS') {
                            studied_courses.push(data[i].courseDetails.cid)
                        }
                    }
                    // If the student has selected any course for plan, those courses are treated as the completed course.
                    // They will also need to be considered while evaluating the progress.
                    if (selected[0] != "") {
                        studied_courses = studied_courses.concat(selected)
                    }
                    // Find the major requirements by major name
                    Major.readProgram(major_name, function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            var major = data[0];
                            var core = major.core;
                            var advElective = major.advElectives;
                            var electives = major.electives;
                            var major_course = major.major;

                            var major_2_course = [];
                            var minor_course = [];
                            if (major_2name != null) { //if the student has major2
                                major.major2.forEach((element) => {
                                    if (element.name == major_2name) {
                                        major_2_course = element.required;
                                        minor_course = element.minor;
                                    }
                                })
                            }
                            // Filtering all the completed courses in the requirements
                            var core_completed = core.filter(i => studied_courses.indexOf(i) !== -1)
                            var elective_completed = electives.filter(i => studied_courses.indexOf(i) !== -1)
                            var advElective_completed = advElective.filter(i => studied_courses.indexOf(i) !== -1)
                            var major_completed = major_course.filter(i => studied_courses.indexOf(i) !== -1)
                            var major_uncompleted = major_course.filter(i => studied_courses.indexOf(i) === -1)

                            var uncompleted_major_2 = [];
                            var completed_major_2 = [];
                            var uncompleted_minor = [];
                            var completed_minor = [];
                            // Check major 2 and minor requirements
                            if (major_2_course.length !== 0) {
                                // Check Major 2 courses
                                for (var i = 0; i < major_2_course.length; i++) {
                                    var required_course = major_2_course[i];

                                    if (required_course.length > 8) { // if the requirement has options
                                        if (required_course.charAt(0) >= '0' && required_course.charAt(0) <= '9') {
                                            var required_num = parseInt(required_course[0]);
                                            required_course = required_course.substr(2);
                                            var regex = /[A-Z]+\d\d\d\d/g;
                                            var re_course = required_course.match(regex);
                                            re_course.forEach(element => {
                                                if (studied_courses.includes(element)) {
                                                    required_num = required_num - 1;
                                                }
                                            })
                                            if (required_num > 0) {
                                                uncompleted_major_2.push(major_2_course[i])
                                            } else {
                                                completed_major_2.push(major_2_course[i])
                                            }
                                        } else {
                                            required_course = required_course.replace(/AND/g, '&&')
                                            required_course = required_course.replace(/OR/g, '||')
                                            var regex = /[A-Z]+\d\d\d\d/g;
                                            var re_course = required_course.match(regex);
                                            re_course.forEach(element => {
                                                if (studied_courses.includes(element)) {
                                                    required_course = required_course.replace(element, "true")
                                                } else {
                                                    required_course = required_course.replace(element, "false")
                                                }
                                            })
                                            var meet_pre = eval(required_course);
                                            if (!meet_pre) {
                                                uncompleted_major_2.push(major_2_course[i])
                                            } else {
                                                completed_major_2.push(major_2_course[i])
                                            }
                                        }
                                    } else {
                                        if (!studied_courses.includes(required_course)) {
                                            uncompleted_major_2.push(required_course)
                                        } else {
                                            completed_major_2.push(required_course)
                                        }
                                    }
                                }
                                // Check minor courses
                                for (var i = 0; i < minor_course.length; i++) {
                                    if (minor_course[i].length > 8) {
                                        var minor_c = minor_course[i]
                                        minor_c = minor_c.replace(/AND/g, '&&')
                                        minor_c = minor_c.replace(/OR/g, '||')
                                        var regex = /[A-Z]+\d\d\d\d/g;
                                        var minor_i = minor_c.match(regex);
                                        minor_i.forEach(element => {
                                            if (studied_courses.includes(element)) {
                                                minor_c = minor_c.replace(element, "true")
                                            } else {
                                                minor_c = minor_c.replace(element, "false")
                                            }
                                        })
                                        var meet_minor = eval(minor_c);
                                        if (!meet_minor) {
                                            uncompleted_minor.push(minor_course[i])
                                        } else {
                                            completed_minor.push(minor_course[i])
                                        }
                                    } else {
                                        if (studied_courses.includes(minor_course[i])) {
                                            completed_minor.push(minor_course[i])
                                        } else {
                                            uncompleted_minor.push(minor_course[i])
                                        }
                                    }
                                }
                            }

                            //Calculate CP for core courses
                            Course.findAll(function (err, data) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    var core_cp = 0;
                                    core_completed.forEach(elem => {
                                        for (var i = 0; i < data.length; i++) {
                                            if (data[i].id == elem) {
                                                core_cp += data[i].credit;
                                            }
                                        }
                                    })
                                    res.send({
                                        core_complete: core_completed, elective_complete: elective_completed,
                                        advElective_complete: advElective_completed, major_complete: major_completed,
                                        major_uncompleted: major_uncompleted, major_2_completed: completed_major_2,
                                        major_2_uncompleted: uncompleted_major_2, minor_completed: completed_minor,
                                        minor_uncompleted: uncompleted_minor, core_cp: core_cp
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
}

module.exports.selectedCourses = function (req, res, next) {
    console.log(req.session.select_list);
    if (req.session.select_list.length) {
        res.send(req.session.select_list)
    } else {
        res.send(false)
    }
}
/*Remove course from selected list in session*/
module.exports.remove = function (req, res, next) {
    var params = req.body;
    if (req.session.select_list.length) {
        for (var i in req.session.select_list) {
            if (req.session.select_list[i].id == params.id) {
                req.session.select_list.splice(i, 1);
                break;
            }
        }
        res.send({message: true})
    } else {
        res.send({message: false})
    }
}
/* Time conflict detection */
module.exports.timetable = function (req, res, next) {
    var params = req.body;
    var code = params.id;
    console.log(params);
    var semester = parseInt(params.semester);
    var year = parseInt(params.year);
    Course.findCourse(code, function (err, result) {
        if (err) {
            console.log(err);
            return "error";
        } else {
            for (var i = 0; i < req.session.select_list.length; i++) {
                if (code == req.session.select_list[i].id) {
                    res.send({message: "Course exists"})
                    return
                }
            }
            var data = null;
            data = result[0];
            var data_object = data.toObject();
            data_object["year"] = year; // Add year property in list node
            data_object["sub_semester"] = semester; // Add selection semester in list node
            req.session.select_list.push(data_object);
            var validation = match_time(req.session.select_list, semester, year);
            res.send({validation: validation, courses: req.session.select_list});
            return
        }
    });
}
/* Time conflict detection */
var match_time = function (course_list, semester, year) {
    var time_list = new Array();
    var time_sameID_mergeCourse = new Array();
    for (var i = 0; i < course_list.length; i++) {
        if (course_list[i].year == year) {
            time_list.push(time_Int(course_list[i].time, semester));
        }
    }
    for (var i = 0; i < time_list.length; i++) {
        for (var j = 0; j < time_list[i].length; j++) {
            time_sameID_mergeCourse.push(time_list[i][j])
        }
    }
    for (var i = 0; i < time_sameID_mergeCourse.length; i++) {
        for (var j = 0; j < time_sameID_mergeCourse[i].length; j++) {
            time_sameID_mergeCourse[i][j].startTime = parseInt(time_sameID_mergeCourse[i][j].startTime.replace(":", ""));
            time_sameID_mergeCourse[i][j].endTime = parseInt(time_sameID_mergeCourse[i][j].endTime.replace(":", ""));
        }
    } // Rearrange the list structure
    var time_permutations = null;
    time_permutations = permutations(time_sameID_mergeCourse);
    for (var i = 0; i < time_permutations.length; i++) {
        if (conflict_test(time_permutations[i])) {
            return true
        }
    }
    return false
}
/* Detect time conflict in given list */
var conflict_test = function (situation) {
    if (situation.length == 1) {
        return true;
    }
    for (var i = 0; i < situation.length - 1; i++) {
        for (var j = i + 1; j < situation.length; j++) {
            if (situation[i].weekday == situation[j].weekday) {
                if ((situation[i].startTime >= situation[j].startTime && situation[i].startTime < situation[j].endTime) ||
                    ((situation[j].startTime >= situation[i].startTime && situation[j].startTime < situation[i].endTime))) {
                    return false
                }
            }

        }
    }
    return true;
}
/* Find out all possible combination */
var permutations = function (arr) {

    var sarr = [[]];
    for (var i = 0; i < arr.length; i++) {
        var tarr = [];
        for (var j = 0; j < sarr.length; j++)
            for (var k = 0; k < arr[i].length; k++)
                tarr.push(sarr[j].concat(arr[i][k]));
        sarr = tarr;
    }
    return sarr;
}
/* Put time format into comparable format -- int */
var time_Int = function (course_time, semester) {

    var time_sameID = new Array();
    var ID = 0;
    c_time = [].concat(JSON.parse(JSON.stringify(course_time)));
    for (var i = 0; i < c_time.length; i++) {
        console.log(c_time[i]);
        console.log(parseInt(c_time[i]["semester"]));
        if (parseInt(c_time[i]["semester"]) == semester) {
            console.log(semester)
            if (time_sameID[ID] == null) {
                time_sameID[ID] = new Array();
                time_sameID[ID].push(c_time[i]);
            } else {
                if (c_time[i].id == time_sameID[ID][time_sameID[ID].length - 1].id) {
                    time_sameID[ID].push(c_time[i]);
                } else {
                    ID++;
                    time_sameID[ID] = new Array();
                    time_sameID[ID].push(c_time[i]);
                }
            }
        }
    }
    return time_sameID;
}