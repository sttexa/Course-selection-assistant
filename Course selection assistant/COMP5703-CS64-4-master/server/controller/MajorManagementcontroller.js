var MajorModel = require('../models/major');

module.exports.getAllMajor = function (req, res, next) { // get all majors, executed at the first time of loading management page (Admin_Index.vue)
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        MajorModel.findAll(function (err, allmajor_result) {
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                res.send(allmajor_result); //return all majors in the database
            }
        })
    }
}
module.exports.addMajor = function (req, res, next) { //add a major, executed when staffs click 'Confirm' after finishing all details input
    var params = req.body;
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        MajorModel.readProgram(params.id, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                if (result[0] != null) {
                    res.send("Major exists")
                } else {
                    MajorModel.writeProgram(params.id, params.name, params.core, params.advElectives, params.electives, params.major, params.major2);
                    res.send("Add successful");
                }
            }
        })
    }
}

module.exports.updateMajor = function (req, res, next) { //edit an existing major
    var params = req.body;
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        MajorModel.readProgram(params.id, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                if (result == null) {
                    res.send("No Found Major")
                } else {
                    MajorModel.updateProgram(params.id, params.name, params.core, params.advElectives, params.electives, params.major, params.major2);
                    res.send("Edit successful");
                }
            }
        })
    }
}

module.exports.deleteMajor = function (req, res, next) { //remove an existing major
    var params = req.body;
    if (!req.session.admin) {
        res.send("Not log in in yet");
        return
    } else {
        MajorModel.readProgram(params.id, function (err, result) {
            if (err) {
                console.log(err);
                res.send("Query error")
            } else {
                if (result == null) {
                    res.send("No Found Major")
                } else {
                    MajorModel.removeMajor(params.id, function (err) {
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