/**
 * Created by DELL on 2020/4/8.
 */

//routes for adminlogin.ejs, after login success it will turn to adminloginsuccess.ejs

var express = require('express');
var router = express.Router();
const mongodbClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

router.get('/', function (req, res, next) {
    res.render('adminlogin', {title: 'adminlogin'});
});
router.post('/', function (req, res) {
    var inputadmin = {
        "name": req.body.admin,
        "password": req.body.password
    };
    mongodbClient.connect(url, (err, client) => {
        if (err)
            throw err;
        else {
            var db = client.db("unittestdb");
            db.collection("adminaccount").find(inputadmin).toArray(function (err, result) {
                console.log(result);
                console.log(result.length);
                if (err)
                    throw err;
                else {
                    if (result.length > 0) {
                        console.log(result);
                        res.render('adminloginsuccess', {title: 'adminloginsuccess'});
                    } else {
                        res.render('adminlogin', {title: 'adminlogin'});
                    }
                }

            });
        }
    });
});
module.exports = router;