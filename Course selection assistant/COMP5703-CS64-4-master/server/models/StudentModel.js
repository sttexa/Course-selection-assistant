var mongoose = require("mongoose");
/*Set student schema for MongoDB */
var StudentSchema = new mongoose.Schema(
    {
        s_id: String,
        s_name: String,
        s_email: String,
        s_password: String,
        s_semester: Number,
        s_year: Number,
        s_major: String,
        s_minor: String
    }
);
/* Save information above to database */
var Student = mongoose.model('Student', StudentSchema, 'student'); // Initiate the model
module.exports.Sign_up =
    function (id, name, email, password, semester, year, major, minor, call) {
        var newStudent = new Student(
            {
                s_id: id,
                s_name: name,
                s_email: email,
                s_password: password,
                s_semester: semester,
                s_year: year,
                s_major: major,
                s_minor: minor
            }
        );
        newStudent.save(call);
    }
/* Login = find user by id and password */
module.exports.Login = function (id, password, call) {
    Student.find({s_email: id, s_password: password}, call);
}
/* Function of finding user by id */
module.exports.find_byID = function (id, call) {
    Student.find({s_id: id}, call);
}
/* Function of finding user by email */
module.exports.find_byEmail = function (email, call) {
    Student.find({s_email: email}, call);
}
/* Function of finding user by Major */
module.exports.find_byMajor = function (major, call) {
    Student.aggregate([{'$match': {s_major: major}}, {'$project': {id: '$s_id'}}], call)
}
/* Update user name */
module.exports.Update_name = function (id, name, call) {
    Student.updateOne({'s_id': id}, {$set: {'s_name': name}}, call);
}
/* Update start year */
module.exports.Update_year = function (id, year, call) {
    Student.updateOne({'s_id': id}, {$set: {'s_year': year}}, call);
}
/* Update start semester */
module.exports.Update_semester = function (id, semester, call) {
    Student.updateOne({'s_id': id}, {$set: {'s_semester': semester}}, call);
}
/* Update user's major */
module.exports.Update_major = function (id, major, call) {
    Student.updateOne({'s_id': id}, {$set: {'s_major': major}}, call);
}
/* Update user's second major or minor */
module.exports.Update_minor = function (id, minor, call) {
    Student.updateOne({'s_id': id}, {$set: {'s_minor': minor}}, call);
}