var StudentModel = require('../models/StudentModel');
var MajorModel = require('../models/major');
const nodemailer = require('nodemailer');
/* Check if current user has already logged in */
module.exports.Login_check = function (req, res, next) {
    if (req.session.student) {
        res.send({login: true});
    } else {
        res.send({login: false});
    }
}
/* Sign up = check if the account existing already and then save or alert user */
module.exports.Signup = function (req, res, next) {
    var params = req.body;
    if (req.session.verificationcode != params.code) {
        res.send("Verification code wrong")
    } else {
        if (req.session.student) {
            res.send("Already login");
        } else {
            console.log(params);
            StudentModel.find_byEmail(params.email, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("Query error")
                } else {
                    if (result[0] != null) {
                        res.send("Email exists")
                    } else {
                        StudentModel.Sign_up(params.id, params.name, params.email, params.password, parseInt(params.semester), parseInt(params.year), params.major, params.minor,
                            function (err, data) {
                                if (err) {
                                    console.log(err);
                                    res.send("Save unsuccessful");
                                } else {
                                    req.session.student = data;
                                    req.session.select_list = [];
                                    req.session.select_list = new Array();
                                    res.send("Save successful");
                                }
                            });

                    }
                }
            })
        }
    }
}
/* Login = check user's id & password */
module.exports.Login = function (req, res, next) {
    var params = req.body;
    if (req.session.student) {
        res.send("Already login");
    } else {
        StudentModel.Login(params.id, params.password,
            function (err, Login_result) {
                if (err) {
                    res.send("Query error");
                } else {
                    if (Login_result[0] != null) {
                        req.session.student = Login_result[0]; // Student profile always available in session
                        req.session.select_list = [];
                        req.session.select_list = new Array(); // Initiate the course list in session
                        res.send("Login successful");
                    } else {
                        res.send("Email or password not correct");
                    }
                }
            });
    }
}
/* Change information in user profile page */
module.exports.Chang_Profile = function (req, res, next) {
    var params = req.body;
    if (!req.session.student) {
        res.send("Not log in in yet");
        return
    } else {
        console.log(params);
        if (params.type == 'name') {
            StudentModel.Update_name(req.session.student.s_id, params.message, function (err, docs) {
                if (err) {
                    console.log(err);
                    res.send({message: "Saving Error"});
                } else {
                    req.session.student.s_name = params.message;
                    res.send({message: "Update successfully"});
                }
                return
            })
        }
        if (params.type == 'year') {
            StudentModel.Update_year(req.session.student.s_id, parseInt(params.message), function (err, docs) {
                if (err) {
                    console.log(err);
                    res.send({message: "Saving Error"});
                } else {
                    req.session.student.s_year = parseInt(params.message);
                    res.send({message: "Update successfully"});
                }
                return
            })
        }
        if (params.type == 'semester') {
            StudentModel.Update_semester(req.session.student.s_id, parseInt(params.message), function (err, docs) {
                if (err) {
                    console.log(err);
                    res.send({message: "Saving Error"});
                } else {
                    req.session.student.s_semester = parseInt(params.message);
                    res.send({message: "Update successfully"});
                }
                return
            })
        }
        if (params.type == 'major') {
            StudentModel.Update_major(req.session.student.s_id, params.message, function (err, docs) {
                if (err) {
                    console.log(err);
                    res.send({message: "Saving Error"});
                } else {
                    req.session.student.s_major = params.message;
                    res.send({message: "Update successfully"});

                }
                return
            })
        }
        if (params.type == 'minor') {
            StudentModel.Update_minor(req.session.student.s_id, params.message, function (err, docs) {
                if (err) {
                    console.log(err);
                    res.send({message: "Saving Error"});
                } else {
                    req.session.student.s_minor = params.message;
                    res.send({message: "Update successfully"});
                }
                return
            })
        }
    }
}
/* Return user profile page (information) to front-end */
module.exports.Profile = function (req, res, next) {
    var params = req.body;
    if (!req.session.student) {
        res.send("Not log in in yet");
        return
    } else {
        StudentModel.find_byID(req.session.student.s_id, function (err, user_result) {
            if (err) {
                res.send({message: "Query error"});
            } else {
                if (user_result[0] != null) {
                    res.send({
                        id: user_result[0].s_id, name: user_result[0].s_name, semester: user_result[0].s_semester,
                        year: user_result[0].s_year, major: user_result[0].s_major, minor: user_result[0].s_minor
                    });
                } else {
                    res.send({message: "User not found"})
                }
            }
        })
    }
}
/* Destroy the session to logout */
module.exports.Log_out = function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send({login: true, message: "Log out unsuccessfully"})
        } else {
            res.send({login: false, message: "Log out successfully"})
        }
    })
}

module.exports.S_year = function (req, res, next) {
    if (req.session.student) {
        res.send({year: req.session.student.s_year, semester: req.session.student.s_semester})
    } else {
        res.send({year: 0})
    }
}
/* Get major list from database for sign up page */
module.exports.Major_list = function (req, res, next) {
    MajorModel.findName(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            var major_list = [];
            for (var i in data) {
                var object = new Object({id: "", name: "", major2_list: []});
                object.id = data[i].id;
                object.name = data[i].name;
                for (var j in data[i].major2) {
                    object.major2_list.push(data[i].major2[j].name);
                }
                major_list.push(object);
            }
            res.send({major_list: major_list});
        }
    })
}
/* Send verification code to the email address */
module.exports.Send_email = async function (req, res, next) {
    // res.clearCookie('code');
    const email = req.body.email;

    let verificationCode = (() => {
        let Code = '';
        for (let i = 0; i < 5; i++) {
            Code += Math.floor(Math.random() * 10)
        }
        return Code;
    })();

    let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "Gaoyz32@163.com",
            pass: "IBQTWGXRPTOLSDHC"
        }
    });

    await transporter.sendMail({
        from: '"Interactive Units Selection Platform"<Gaoyz32@163.com>',
        to: email,//list of receivers
        subject: "Your System's Verificationcode",
        html: `<b>Verificationcode is：${verificationCode}</b>`
    });
    req.session.verificationcode = verificationCode;
    res.send({msg: "Verification Code Sent"})
}