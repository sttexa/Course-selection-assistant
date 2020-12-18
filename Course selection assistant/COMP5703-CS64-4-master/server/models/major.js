var mongoose = require('mongoose');

var major = new mongoose.Schema({
    id: String,
    name: String,
    core: [String],
    advElectives: [String],
    electives: [String],
    major: [String],
    major2: [
        {
            name: String,
            required: [String],
            minor: [String]
        }
    ]
}); // Set major schema for MongoDB

major.statics.writeProgram = function (id, name, core, advElectives, electives, major, major2) {
    Major.collection.insert({
        id: id, name: name, core: core, advElectives: advElectives, electives: electives, major: major, major2: major2
    })
} // Write a new program

major.statics.updateProgram = function (id, name, core, advElectives, electives, major, major2) {
    Major.collection.update(
        {id: id},
        {
            $set: {
                name: name,
                core: core,
                advElectives: advElectives,
                electives: electives,
                major: major,
                major2: major2
            }
        })
} // Update the existing program or major

major.statics.readProgram = function (id, callback) {
    return this.find({id: id}).exec(callback)
} // Find the program or major by ID

major.statics.findAll = function (callback) {
    return this.find({}).exec(callback)
} // Find all program and major

major.statics.findName = function (callback) {
    return this.aggregate([{'$project': {id: '$id', name: '$name', major2: '$major2'}}]).exec(callback)
} // Find all major and list the ID, name, major2 of this major

major.statics.removeMajor = function (id, callback) {
    Major.collection.remove({id: id})
    return "Removed Successfully"
} // Remove a major

var Major = mongoose.model("Major", major, "major");

module.exports = Major;