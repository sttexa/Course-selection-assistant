var Course = require("../models/course")
var Major = require("../models/major")

module.exports.findAllCourse = function (req, res) {
    Course.findAll(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            res.json(data)
        }
    })
}

module.exports.findAllCNameID = function (req, res) {
    Course.findAll(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            var list = [];
            data.forEach(course => {
                var CIDname = course.id + " " + course.name
                list.push(CIDname)
            });
            res.send(list);
        }
    })
}

module.exports.findCourseByID = function (req, res) {
    var cid = req.params.cid;
    Course.findCourse(cid, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            res.send(data)
        }
    })
}

module.exports.findProgram = function (req, res) {
    var pid = req.params.pid;
    Major.readProgram(pid, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data[0])
            res.send(data[0])
        }
    })
}

module.exports.findProgramCore = function (req, res) {
    var pid = req.params.pid;
    Major.readProgram(pid, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            res.send(data[0].core)
        }
    })
}

module.exports.findCourseByKeyword = function (req, res) {
    var keyword = req.params.keyword;
    Course.findCourseByKeyWord(keyword, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data.length)
            res.send(data)
        }
    })
}