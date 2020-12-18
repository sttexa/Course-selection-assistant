<template>
    <body id="login-body">
    <div id="head">
        <img id="head-logo" src="../assets/USYDlogo.png" alt="USYD">
    </div>

    <div>
        <!-- System guideline-->
        <el-card id="des-card">
            <p style="margin-left: 15%; margin-right: 15%; color: rgb(104,105,109);">Our platform aims to
                give students different unit
                suggestions based on their personal
                information (including major and learned units)
                to help students complete their studies. If you have
                questions about the unit selection, please use this platform without doubt!</p>
            <el-steps align-center style="color: #363636" active="5">
                <!--
                icon="el-icon-message"
                icon="el-icon-user"
                icon="el-icon-data-analysis"
                icon="el-icon-date"
                icon="el-icon-data-line"
                -->
                <el-step title="Sign up" description="Use your own Uni E-mail" style=""></el-step>
                <el-step title="Profile" description="Update your detailed information"></el-step>
                <el-step title="Processing"
                         description="Prerequisite,co-requisite and prohibition evaluation; Time conflict detection "></el-step>
                <el-step title="Planning" description="Try different unit plans and make your own plan!"></el-step>
                <el-step title="Tracking"
                         description="Track the progress of completion towards major & minor"></el-step>
            </el-steps>
        </el-card>
    </div>
    <!-- Login part-->
    <div style="margin-top: 0px; height: auto">
        <el-card id="login-card" style="margin-top: 20px; margin-bottom: auto;">
            <h3>Student Log In</h3>
            <!-- Email address-->
            <el-form id="lform" method="post" v-on:submit.prevent="login" label-width="25%">
                <el-form-item class="login-input" label="Email">
                    <el-input
                            type="text"
                            placeholder="Email"
                            name="id"
                            v-model.trim="s_id"
                            @blur="check('id')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <!-- Password-->
                <el-form-item class="login-input" label="Password">
                    <el-input
                            type="password"
                            placeholder="password"
                            name="password"
                            v-model.trim="password"
                            @blur="check('password')"
                    ></el-input>
                    <br/>
                </el-form-item>
                <div>
                    <el-button type="primary" @click="login">Login</el-button>
                </div>
                <div style="margin-top: 10px;">
                    <router-link to="/sign_up" style="font-size: 12px; font-weight: bold; color: #0088ff">Sign up?
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
        name: "Student_Login",
        data: function () {
            return {
                s_id: "",
                password: "",
                Message_id: "",
                Message_password: ""
            };
        },
        created() {
            // check if user has already logged in
            this.check_login();
        },
        methods: {
            /* check input format */
            check: function (str) {
                if (str == "id") {
                    if (this.s_id == "") {
                        this.Message_id = "ID cannot be blank";
                        this.id_message_open();
                        return false;
                    }
                    this.Message_id = " ";
                }
                if (str == "password") {
                    if (this.password == "") {
                        this.Message_password = "Password cannot be blank";
                        this.password_message_open();
                        return false;
                    }
                    this.Message_password = " ";
                }
                return true;
            },
            /* Send login information to back-end */
            login: function () {
                if (this.check("id") && this.check("password")) {
                    console.log(this.s_id + this.password);
                    axios
                        .post("users/student/login", {
                            id: this.s_id,
                            password: this.password
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
            check_login: function () {
                axios
                    .get("/users/student/login_check")
                    .then(res => {
                        console.log(res.data);
                        if (res.data.login) {
                            this.$router.push("/main_page");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            /* Alert messages */
            id_message_open: function () {
                this.$message({
                    message: this.Message_id,
                    type: 'warning'
                });
            },
            /* Alert messages */
            password_message_open: function () {
                this.$message({
                    message: this.Message_password,
                    type: 'warning'
                });
            }
        }
    };
</script>