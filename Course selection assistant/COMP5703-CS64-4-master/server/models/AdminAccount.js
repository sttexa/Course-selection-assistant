var mongoose = require("mongoose");
var AdminSchema = new mongoose.Schema(
    {
        a_id: String,
        a_password: String
    }
); // Set administrator schema for MongoDB

var Admin = mongoose.model('Admin', AdminSchema, 'admin');
// Initiate the model

module.exports.Login = function (id, password, call) {
    Admin.find({a_id: id, a_password: password}, call);
} // Function of finding admin account by id and password

module.exports.findAccountById = function (id, call) {
    Admin.find({a_id: id}, call);
} // Function of finding admin account by id

module.exports.Signup = function (id, password) {
    Admin.collection.insertOne({a_id: id, a_password: password});
} // Function of adding new admin account