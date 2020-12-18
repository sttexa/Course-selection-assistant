<template>
    <body>
    <div id="head">
        <img id="head-logo" src="../assets/USYDlogo.png" alt="USYD"/>
    </div>
    <div id="Admin_Login">

        <div id="login-card">
            <el-card class="box-card">
                <h3>Administrator Sign up</h3>

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
                        <el-button type="primary" plain @click="signup">Sign Up</el-button>
                        <el-link href="/adminindex" style="margin-left: 20px;">back</el-link>
                    </el-form-item>
                </el-form>

            </el-card>
        </div>
    </div>


    </body>
</template>

<script>
    import axios from '../http'

    export default {
        name: "admin_signup",
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
            signup: function () {
                if (this.check('id') && this.check('password')) {
                    axios.post("/admin/adminsignup", {id: this.a_id, password: this.password})
                        .then((res) => {
                            alert(res.data);
                            if (res.data == "admin signup success") {
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

<style scoped>

</style>