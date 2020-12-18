<template>
    <body id="login-body">
    <div id="head">
        <img id="head-logo" src="../assets/USYDlogo.png" alt="USYD"/>
    </div>
    <!-- avatar -->
    <div id="signup-card">
        <el-card class="box-card" id="profile-card">
            <div style="height:100px; text-align: center; padding-bottom: 10px;">
                <img
                        style="width: 100px; height: 100px"
                        src="../assets/avatar2.png"/>
            </div>

            <div style="font-size: 20px; text-align: center; padding-top: 20px; padding-bottom: 20px; color: rgb(231,82,55);">
                Student ID: {{s_id}}
            </div>
             <!-- profile information -->
            <el-row :gutter="20" style="height: 40px;">
                <el-col :span="6">
                    <div style="font-size: 20px; font-weight: bold;">Name:</div>
                </el-col>
                <el-col :span="6">
                    <div style="font-size: 20px; color: #303133;">{{s_name}}</div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <el-input v-if="edit_name" v-model="s_name"></el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-button
                                type="primary"
                                plain
                                v-if="edit_name"
                                v-on:click="update('name',s_name), edit_name=!edit_name">confirm
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="text-align: right;">
                        <el-link type="primary" v-if="!edit_name" v-on:click="edit_name=!edit_name">edit</el-link>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="height: 40px;">
                <el-col :span="6">
                    <div style="font-size: 20px; font-weight: bold;">Start Year:</div>
                </el-col>
                <el-col :span="6">
                    <div style="font-size: 20px; color: #303133;">{{year}}</div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <el-input v-if="edit_year" v-model="year"></el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-button
                                type="primary"
                                plain
                                v-if="edit_year"
                                v-on:click="update('year',year), edit_year=!edit_year"
                        >confirm
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="text-align: right;">
                        <el-link type="primary" v-if="!edit_year" v-on:click="edit_year=!edit_year">edit</el-link>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="height: 40px;">
                <el-col :span="6">
                    <div style="font-size: 20px; font-weight: bold;">Start semester:</div>
                </el-col>
                <el-col :span="6">
                    <div style="font-size: 20px; color: #303133;">{{semester}}</div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <el-select v-model="semester" clearable v-on:change="edit_semester=true" style="width: 60%;">
                            <el-option value="1">1</el-option>
                            <el-option value="2">2</el-option>
                        </el-select>
                        <!--<el-input v-if="edit_minor" v-model="minor"></el-input>-->
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-button
                                type="primary"
                                plain
                                v-if="edit_semester"
                                v-on:click="update('semester',semester), edit_semester=false">confirm
                        </el-button>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="height: 40px;">
                <el-col :span="6">
                    <div style="font-size: 20px; font-weight: bold;">Major:</div>
                </el-col>
                <el-col :span="6">
                    <div style="font-size: 20px; color: #303133;">{{major}}</div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <el-select v-model="major" clearable v-on:change="edit_major=true" style="width: 60%;">
                            <el-option v-for="(item,index) in majors" :key="index" :value="item.id">{{item.name}}
                            </el-option>
                        </el-select>
                        <br/>
                        <!--<el-input v-if="edit_major" v-model="major"></el-input>-->
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-button
                                type="primary"
                                plain
                                v-if="edit_major"
                                v-on:click="update('major',major), edit_major=false">confirm
                        </el-button>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="height: 40px;">
                <el-col :span="6">
                    <div style="font-size: 20px; font-weight: bold;">Major 2 (Minor):</div>
                </el-col>
                <el-col :span="6">
                    <div style="font-size: 20px; color: #303133;">{{minor}}</div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <el-select v-model="minor" clearable v-on:change="change_edit()" style="width: 60%;">
                            <el-option v-for="(item,index) in minors" :key="index" :value="item">{{item}}</el-option>
                        </el-select>
                        <!--<el-input v-if="edit_minor" v-model="minor"></el-input>-->
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-button
                                type="primary"
                                plain
                                v-if="edit_minor"
                                v-on:click="update('minor',minor), edit_minor=false">confirm
                        </el-button>
                    </div>
                </el-col>
            </el-row>

            <div>{{message}}</div>

            <div style="margin-left: 66%; margin-top: 20px; padding-top: 20px;">
                <el-button type="danger" plain v-on:click="log_out">Log out</el-button>
                <div style="margin-top: 10px; padding-left: 25px;">
                    <a style="color: #1983f1" href="/main_page">back</a>
                </div>
            </div>
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
        name: "Student_Profile",
        data: function () {
            return {
                s_id: "",
                edit_id: false,
                s_name: "",
                edit_name: false,
                year: "",
                edit_year: false,
                semester: "",
                edit_semester: false,
                major: "",
                edit_major: false,
                minor: "",
                edit_minor: false,
                message: "",
                input_value: "",
                majors: [1, 2, 3],
                minors: []
            };
        },
        created: function () {
            // check if user has already logged in
            this.check_login();
            axios // get profile data from back-end
                .post("users/student/profile")
                .then(res => {
                    console.log(res.data);
                    this.s_id = res.data.id;
                    this.s_name = res.data.name;
                    this.year = res.data.year;
                    this.semester = res.data.semester;
                    this.major = res.data.major;
                    this.minor = res.data.minor ? res.data.minor : "None";
                    this.message = res.data.message;
                    axios.post("/student/major_list",)
                        .then(res => {
                            this.majors = res.data.major_list;
                            this.check_login();
                            this.chang_major2();
                        })
                })
                .catch(err => {
                    console.log(err);
                });
        },
        methods: {
            /* send and update profile data */
            update: function (type, message) {
                axios
                    .post("users/student/change_profile", {type: type, message: message})
                    .then(res => {
                        console.log(res);
                        this.message = res.message;
                    })
                    .catch(err => {
                        console.log(err);
                    });
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
            /* make major 2 editable */
            change_edit: function () {
                this.chang_major2();
                this.edit_minor = true;
            },
            check_login: function () {
                axios
                    .get("/users/student/login_check")
                    .then(res => {
                        console.log(res.data);
                        if (!res.data.login) {
                            this.$router.push("/login");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            /* log out */
            log_out: function () {
                axios
                    .get("/users/student/log_out")
                    .then(res => {
                        console.log(res.data);
                        alert(res.data.message);
                        if (!res.data.login) {
                            this.$router.push("/login");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    };
</script>

<style scoped>
</style>