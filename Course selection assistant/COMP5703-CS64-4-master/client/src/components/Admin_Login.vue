<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <!-- element ui css -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <!-- css -->
    <!--<link rel="stylesheet" href="backStage.css"> -->
    <!-- Vue.js -->

</head>
<template>
    <body>
    <div id="head">
        <img id="head-logo" src="../assets/USYDlogo.png" alt="USYD"/>
    </div>
    <div id="Admin_Login">

        <div id="login-card">
            <el-card class="box-card">
                <h3>Administrator Log in</h3>

                <el-form ref="form" method="post" label-width="80px">
                    <el-form-item label="id">
                        <el-input name="id" v-model.trim="a_id" @blur="check('id')"
                                  placeholder="Please input id"></el-input>
                    </el-form-item>
                    <el-form-item label="password">
                        <el-input name="password" v-model.trim="password" @blur="check('password')"
                                  placeholder="Please input password" show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="submit" @click="login">Log In</el-button>
                        <!-- <el-button>Clear</el-button> -->
                    </el-form-item>
                </el-form>

            </el-card>
        </div>
    </div>


    </body>
</template>
<style>
    @import "../assets/backStage.css";
</style>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<!-- element lib -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script>
    import axios from '../http'

    export default {
        name: "Admin_Login",
        data: function () {
            return {
                a_id: "",
                password: "",
                Message_id: " ",
                Message_password: " ",
            }
        },
        methods: {
            check: function (str) {
                if (str == 'id') {
                    if (this.a_id == "") {
                        this.Message_id = "ID cannot be blank";
                        return false
                    }
                    this.Message_id = " ";
                }
                if (str == 'password') {
                    if (this.password == "") {
                        this.Message_password = "Password cannot be blank"
                        return false
                    }
                    this.Message_password = " ";
                }
                return true
            },
            login: function () {
                if (this.check('id') && this.check('password')) {
                    console.log(this.a_id + this.password);
                    axios.post("/admin/adminlogin", {id: this.a_id, password: this.password})
                        .then((res) => {
                            //alert(res.data)
                            if (res.data == "admin login success") {
                                this.$router.push({path: '/adminindex'})
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        }
    }
</script>
