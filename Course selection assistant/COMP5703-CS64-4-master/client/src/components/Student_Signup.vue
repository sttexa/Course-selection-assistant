<template>
    <body>
    <div id="head">
        <img id="head-logo" src="../assets/USYDlogo.png" alt="USYD"/>
    </div>
    <div>
        <el-card id="signup-card">
            <h3>Student Sign up</h3>
            <!-- input sign up information-->
            <el-form id="sform" method="post" v-on:submit.prevent="sign_up" label-width="25%">
                <el-form-item class="login-input" label="Email">
                    <el-input
                            type="text"
                            placeholder="Uni email"
                            name="email"
                            v-model.trim="s_email"
                            @blur="check('email')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Name">
                    <el-input
                            type="text"
                            placeholder="Real name"
                            name="name"
                            v-model.trim="s_name"
                            @blur="check('name')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Password" style="font-size: 12px;">
                    <el-input
                            type="password"
                            placeholder="password"
                            name="password"
                            v-model.trim="password"
                            @blur="check('password')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Confirm password" style="font-size: 12px;">
                    <el-input
                            type="password"
                            placeholder="confirm password"
                            name="confirm_password"
                            v-model.trim="confirm_password"
                            @blur="check('confirm password')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Major" style="font-size: 12px;">
                    <el-select v-model="major" clearable v-on:change="check('major')" @blur="check('major')"
                               style="width: 100%;">
                        <el-option v-for="(item,index) in majors" :key="index" :value="item.id">{{item.name}}
                        </el-option>
                    </el-select>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Major 2 (Minor)" style="font-size: 12px;">
                    <el-select v-model="minor" clearable v-on:change="check('minor')" @blur="check('minor')"
                               style="width: 100%;">
                        <el-option v-for="(item,index) in minors" :key="index" :value="item">{{item}}</el-option>
                    </el-select>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Start Year" style="font-size: 12px;">
                    <el-input
                            type="text"
                            placeholder="start year"
                            name="year"
                            v-model.trim="year"
                            @blur="check('year')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Start Semester of the year" style="font-size: 12px;">
                    <el-select v-model="semester" clearable style="width: 100%;">
                        <el-option value="1">1</el-option>
                        <el-option value="2">2</el-option>
                    </el-select>
                    <br/>
                </el-form-item>
                <el-form-item class="login-input" label="Verification code">
                    <el-input
                            type="text"
                            placeholder="Verification code"
                            name="Verification_code"
                            v-model.trim="s_code"
                            @blur="check('Code')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <!-- buttons-->
                <div style="margin-top: 20px;">
                    <el-button type="primary" plain :disabled="BtnDisable" @click="Verify" style="margin-right: 50px;">
                        Verify
                    </el-button>
                    <el-button type="primary" :disabled="BtnDisable" @click="sign_up">Submit</el-button>
                </div>
                <div style="margin-top: 20px; ">
                    <router-link
                            to="/login"
                            style="margin-top: 20px; font-size: 12px; color: #1983f1;">Already have the account?
                    </router-link>
                </div>
            </el-form>
        </el-card>
    </div>
    </body>
</template>

<!-- Vue.js -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<!-- element lib -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<!-- CSS -->
<style>
    @import "../assets/studentPages.css";
    @import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
</style>

<script>
    import axios from "../http";

    export default {
        name: "Student_Signup",
        data: function () {
            return {
                s_email: "",
                s_name: "",
                s_code: "",
                password: "",
                confirm_password: "",
                major: "",
                majors: [1, 2, 3],
                minor: "",
                minors: [],
                semester: "1",
                year: "",
                Message_id: "",
                Message_name: "",
                Message_email: "",
                Message_password: "",
                Message_confirm_password: "",
                Message_major: "",
                Message_minor: "",
                Message_year: "",
                Message_Code: "",
                BtnDisable: false
            };
        },
        created() {
            // check if user has already logged in
            axios.post("/student/major_list",)
                .then(res => {
                    console.log(res.data)
                    this.majors = res.data.major_list;
                    this.check_login();
                })
        },
        methods: {
            /* check input format */
            check: function (str) {
                if (str == "name") {
                    if (this.s_name == "") {
                        this.Message_name = "Name cannot be blank";
                        this.name_message_open();
                        return false;
                    }
                    this.Message_name = " ";
                }
                if (str == "email") {
                    if (this.s_email == "") {
                        this.Message_email = "Email cannot be blank";
                        this.email_message_open();
                        return false;
                    } else {
                        if (!this.s_email.endsWith("@uni.sydney.edu.au")) {
                            this.Message_email = "Email's format incorrect"
                            this.email_message_open();
                            return false;
                        }
                    }
                    this.Message_email = " ";
                }
                if (str == "password") {
                    if (this.password == "") {
                        this.Message_password = "Password cannot be blank";
                        this.password_message_open();
                        return false;
                    } else {
                        if (this.password.length > 20 || this.password.length < 8) {
                            this.Message_password = "Password length failed verificaiton";
                            this.password_message_open();
                            return false;
                        }
                    }
                    this.Message_password = " ";
                }
                if (str == "confirm password") {
                    if (this.confirm_password != this.password) {
                        this.Message_confirm_password = "Conform password incorrect";
                        this.confirm_password_message_open();
                        return false;
                    }
                    this.Message_confirm_password = " ";
                }
                if (str == "major") {
                    this.chang_major2();
                    if (this.major == "") {
                        this.Message_major = "Major cannot be blank";
                        this.major_message_open();
                        return false;
                    }
                    this.Message_major = " ";
                }
                if (str == "minor") {
                    if (this.minor == this.major) {
                        this.Message_minor = "Minor cannot be the same as major";
                        this.minor_message_open();
                        return false;
                    }
                    this.Message_minor = " ";
                }
                if (str == "year") {
                    if (this.year == "") {
                        this.Message_year = "Year cannot be blank";
                        this.year_message_open();
                        return false;
                    }
                    this.Message_year = " ";
                }
                if (str == "Code") {
                    if (this.s_code == "") {
                        this.Message_Code = "Verification code cannot be blank";
                        this.verification_code_message_open();
                        return false;
                    }
                    this.Message_Code = " ";
                }
                return true;
            },
            /* change major 2 list when major 1 changed */
            chang_major2: function () {
                for (var i in this.majors) {
                    if (this.major == this.majors[i].id) {
                        this.minors = this.majors[i].major2_list;
                        this.minors.push(null);
                        break;
                    }
                }
            },
            /* send information and sign up */
            sign_up: function () {
                if (
                    this.check("id") &&
                    this.check("name") &&
                    this.check("email") &&
                    this.check("password") &&
                    this.check("confirm password") &&
                    this.check("major") &&
                    this.check("minor") &&
                    this.check("year") &&
                    this.check("Code")
                ) {
                    var hash = 0;
                    for (var i = 0; i < this.s_email.length; i++) {
                        var char = this.s_email.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }

                    axios
                        .post("users/student/signup", {
                            id: hash,
                            name: this.s_name,
                            email: this.s_email,
                            password: this.password,
                            major: this.major,
                            minor: this.minor,
                            semester: this.semester,
                            year: this.year,
                            code: this.s_code
                        })
                        .then(res => {
                            alert(res.data);
                            this.check_login();
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            /* verify email with verification code */
            Verify: function () {
                if (this.check("email")) {
                    this.BtnDisable = true;
                    axios.post("users/student/email", {email: this.s_email}).then(res => {
                        alert(res.data.msg);
                        this.BtnDisable = false;
                    })
                }
            },
            check_login: function () {
                axios
                    .get("/users/student/login_check")
                    .then(res => {
                        console.log(res.data);
                        if (res.data.login) {
                            this.$router.push("/profile");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            /* alert messages */
            id_message_open: function () {
                this.$message({
                    message: this.Message_id,
                    type: 'warning'
                });
            },
            name_message_open: function () {
                this.$message({
                    message: this.Message_name,
                    type: 'warning'
                });
            },
            email_message_open: function () {
                this.$message({
                    message: this.Message_email,
                    type: 'warning'
                });
            },
            password_message_open: function () {
                this.$message({
                    message: this.Message_password,
                    type: 'warning'
                });
            },
            confirm_password_message_open: function () {
                this.$message({
                    message: this.Message_confirm_password,
                    type: 'warning'
                });
            },
            major_message_open: function () {
                this.$message({
                    message: this.Message_major,
                    type: 'warning'
                });
            },
            minor_message_open: function () {
                this.$message({
                    message: this.Message_minor,
                    type: 'warning'
                });
            },
            year_message_open: function () {
                this.$message({
                    message: this.Message_year,
                    type: 'warning'
                });
            },
            verification_code_message_open: function () {
                this.$message({
                    message: this.Message_Code,
                    type: 'warning'
                });
            },
        }
    };
</script>

<style scoped>
</style>