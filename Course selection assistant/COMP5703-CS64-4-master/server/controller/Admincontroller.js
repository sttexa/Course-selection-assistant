/**
 * Created by DELL on 2020/4/15.
 */
var AdminModel = require('../models/AdminAccount');
module.exports.Adminlogin = function (req, res, next) { // Admin login, executed when staffs click 'Log In'
    var params = req.body;
    AdminModel.Login(params.id, params.password, function (err, Login_result) {
        if (err) {
            res.render('index', {title: "id or password not correct"});
        } else {
            if (Login_result.length > 0) {
                req.session.admin = params.id; //session can store staffs' detail.
                res.send("admin login success"); // this response is a sign of page turning
            } else
                res.render('index', {title: "id or password not correct"});
        }
    });
}
module.exports.Adminlogout = function (req, res, next) { //Admin logout, executed when staffs click 'Log Out'
    console.log('ok');
    req.session.admin = null; //clear the related session
    res.send('log out success');
}
module.exports.Adminsignup = function (req, res, next) { //Admin Signup, only available to super admin (whose id is 'admin')
    var params = req.body;
    if (req.session.admin == 'admin') {
        AdminModel.findAccountById(params.id, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                if (result.length > 0) { //cannot create two account with the same ID
                    res.send("Account ID exists!");
                } else {
                    AdminModel.Signup(params.id, params.password);
                    res.send("admin signup success");
                }
            }
        })
    } else {
        res.send("Only super administrator can signup");
    }

}
module.exports.getCurrentAdmin = function (req, res, next) { //return current admin ID, it will be displayed at the head of admin portal
    if (req.session.admin) {
        var adminid = req.session.admin; // get ID from session
        res.send(adminid);
    }
}