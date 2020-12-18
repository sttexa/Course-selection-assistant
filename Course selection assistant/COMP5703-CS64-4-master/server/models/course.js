var mongoose = require('mongoose');

var course = new mongoose.Schema({
    id: String,
    name: String,
    outline: String,
    semester: String,
    credit: Number,
    prerequisite: String,
    corequisite: String,
    prohibition: String,
    assumed: String,
    type: String,
    rating: Number,
    permission: String,
    special_consideration: Boolean, //If the prerequisite is special
    time: [
        {
            weekday: String,
            startTime: String,
            endTime: String
        }
    ]
}); // Set course schema for MongoDB

// The reason why we use String instead of Date for startTime and endTime is that
// https://stackoverflow.com/a/56537756

course.statics.writeCourse = function (id, name, outline, semester, credit, prerequisite, corequisite, prohibition, assumed, type,
                                       rating, permission, time) {
    Course.collection.insert({
        id: id,
        name: name,
        outline: outline,
        semester: semester,
        credit: credit,
        prerequisite: prerequisite,
        corequisite: corequisite,
        prohibition: prohibition,
        assumed: assumed,
        type: type,
        rating: rating,
        permission: permission,
        time: time
    })
} // Function of inserting new course

course.statics.updateCourse = function (id, name, outline, semester, credit, prerequisite, corequisite, prohibition, assumed, type,
                                        permission, time) {
    Course.collection.update(
        {id: id},
        {
            $set: {
                name: name,
                outline: outline,
                semester: semester,
                credit: credit,
                prerequisite: prerequisite,
                corequisite: corequisite,
                prohibition: prohibition,
                assumed: assumed,
                type: type,
                permission: permission,
                time: time
            }
        })
} // Function of updating the existing course

course.statics.findCourse = function (id, callback) {
    return this.find({id: id}).exec(callback)
} // Function of finding course by id

course.statics.findCourseCode = function (callback) {
    return this.aggregate([{'$project': {id: '$id'}}]).exec(callback)
} // Function of listing all course IDs

course.statics.findAll = function (callback) {
    return this.find({}).exec(callback)
} // Function of listing all course data

course.statics.removeCourse = function (id, callback) {
    Course.collection.remove({id: id})
    return "Removed Successfully"
} // Function of removing course by id
/* Update user's rating of the course */
course.statics.update_rating = function (id, rating, callback) {
    Course.collection.update({"id": id}, {$set: {"rating": rating}}, callback)
}
/* Find course by available semesters */
course.statics.findCourseBySemester = function (semester, callback) {
    semester = "" + semester;
    return this.find({"semester": {$regex: semester}}).exec(callback);
}

course.statics.findCourseByKeyWord = function (keyword, callback) {
    return this.find({
        $or: [{"id": {$regex: keyword, $options: "i"}},
            {"name": {$regex: keyword, $options: "i"}}]
    }).exec(callback);
} // Function of finding course by keyword in id or name

course.statics.findCoursesByCode = function (code, callback) {
    return this.find({"id": {$regex: code}}).exec(callback);
} // Function of finding course by id (Admin portal)

course.statics.findCoursesByName = function (name, callback) {
    return this.find({"name": {$regex: name, $options: 'i'}}).exec(callback);
} // Function of finding course by name (Admin portal)

var Course = mongoose.model("Course", course, "course");
// Initiate the model

module.exports = Course;