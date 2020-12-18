var mongoose = require('mongoose');

var course_studied = new mongoose.Schema({
    id: Number,
    courseDetails: [
        {
            cid: String,
            name: String,
            semester: Number,// 1 or 2
            credit: Number, // 3 or 6 or 12
            result: String,// PASS or FAIL
            rating: Number, //0-5 step:0.5
            year: String
        }
    ]
}); //Set Studied courses schema for MongoDB

course_studied.statics.writeCourseStudied = function (id, code, name, semester, credit, result, rating, year) {
    Course_studied.collection.insertOne({
        id: id,
        courseDetails: [{
            cid: code,
            name: name,
            semester: semester,
            credit: credit,
            result: result,
            rating: rating,
            year: year
        }]
    })
} // Write previously studied course for new user

course_studied.statics.updateCourseStudied = function (id, code, name, semester, credit, result, rating, year) {
    Course_studied.collection.updateOne(
        {"id": id},
        {
            "$push": {
                "courseDetails": {
                    cid: code, name: name, semester: semester, credit: credit, result: result, rating: rating,
                    year: year
                }
            }
        })
} // Write previously studied course for existing user

course_studied.statics.readCourseStudied = function (id, callback) {
    return this.aggregate([{'$match': {id: id}}, {'$unwind': '$courseDetails'},
        {'$sort': {'courseDetails.year': 1, 'courseDetails.semester': 1}}]).exec(callback);
} // Find studied course by ID and sort them by year and semester

course_studied.statics.readCS = function (id, callback) {
    return this.aggregate([{$match: {id: id}}]).exec(callback);
} // Find studied course by ID

course_studied.statics.readCourseByCode = function (sid, code, callback) {
    return this.find({id: sid}, {courseDetails: {$elementMatch: {cid: code}}}).exec(callback)
} // Find studied course of a student by the user ID

course_studied.statics.removeCourseStudied = function (sid, code, semester, year) {
    Course_studied.collection.updateOne(
        {"id": sid},
        {"$pull": {"courseDetails": {cid: code, semester: semester, year: year}}})
} // Remove the studied course record

course_studied.statics.readRatingByCode = function (id, code, callback) {
    return this.aggregate([{'$unwind': '$courseDetails'}, {'$match': {'courseDetails.cid': code}}, {'$match': {id: id}},
        {'$project': {Code: '$courseDetails.cid', Rating: '$courseDetails.rating'}}]).exec(callback)
} // Read course rating by course code and return code & rating

var Course_studied = mongoose.model("Course_studied", course_studied, "course_studied");

module.exports = Course_studied;