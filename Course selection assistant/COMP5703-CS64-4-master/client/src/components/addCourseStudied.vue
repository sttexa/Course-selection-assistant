<template>
    <div>
        <h1>Add a Studied Course</h1>

        <!-- element form -->
        <el-card style="text-align: center">

            <!-- units dialog -->
            <el-dialog :visible.sync="dialogVisible" width="70%" title="Units">
                <el-table :data="course">
                    <el-table-column prop="id" label="Unit Code" width="160"></el-table-column>
                    <el-table-column prop="name" label="Unit Name" min-width="200"></el-table-column>
                    <el-table-column prop="id" width="100">
                        <template slot-scope="scope">
                            <a :href=course[scope.$index].outline style="color: #1983f1">outline</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Studied"
                            width="100">
                        <template slot-scope="scope">
                            <p style="color: rgb(164,226,20);"
                               v-if="course_studied_list.includes(course[scope.$index].id)"> Studied </p>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button plain size="small" type="warning" @click="PutSelected(course[scope.$index])"
                                       :disabled="course_studied_list.includes(course[scope.$index].id)">
                                Select
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <!-- end of units dialog -->

            <!-- Original form start position -->
            <el-card style="background-color: rgb(54,54,54); margin: 0; width: 100%">
                <div style="text-align: center; color: white;">
                    <el-row>
                        <el-col :span="6">
                            <div>
                                <label for="code" style="font-size: large; font-weight: bold; vertical-align: middle;">Find
                                    a Course:</label>
                            </div>
                        </el-col>
                        <el-col :span="18">
                            <div>
                                <el-input type="text" id="code" v-model.trim="keyword"
                                          placeholder="Please enter the course ID or name" @change="searchCourses"
                                          @blur="searchCourses"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>

            <div v-if="!cid">
                <el-alert
                        title="Please find and select a study unit"
                        type="info"
                        show-icon>
                </el-alert>
            </div>

            <!-- new form start position -->
            <form id="addStudiedForm" method="post" v-on:submit.prevent="addStudied">

                <div id="formDiv"
                     style="text-align: left; min-width: 650px; margin-right: 30%; margin-left: 30%; visibility: hidden">
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <label v-if="cid">Course ID:</label>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div>
                                <label v-if="cid" style="color: rgb(213,82,53); font-weight: bold">{{cid}}</label>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <label v-if="cname">Course Name:</label>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div>
                                <label v-if="cname" style="color: rgb(213,82,53); font-weight: bold">{{cname}}</label>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <div>
                                <label for="semester">Semester:</label>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div>
                                <select id="semester" v-model="semester" placeholder="Please select semester"
                                        style="width: 200px;">
                                    <option disabled value="">Please select semester</option>
                                </select>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <div>
                                <label for="year">Year:</label>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div>
                                <select id="year" v-model="year" placeholder="Please select year" style="width: 200px;">
                                    <option disabled value="">Please select year</option>
                                    <option :value="years">{{years}}</option>
                                    <option :value="years+1">{{years+1}}</option>
                                    <option :value="years+2">{{years+2}}</option>
                                    <option :value="years+3">{{years+3}}</option>
                                    <option :value="years+4">{{years+4}}</option>
                                </select>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="8">
                            <div>
                                <label for="result">Pass or Not Pass:</label>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div>
                                <select id="result" v-model="result" placeholder="Please select result"
                                        style="width: 200px;">
                                    <option disabled value="">Please select one</option>
                                    <option value="PASS">Pass</option>
                                    <option value="FAIL">Not Pass</option>
                                </select>
                            </div>
                        </el-col>
                    </el-row>
                </div>

                <div v-if="cid">
                    <div style="margin-top: 20px; padding-top: 20px;"><label for="rating" style="font-weight: bold;">How
                        would you rate this course(between 1 and 5)?</label></div>
                    <div style="margin-top:5px; padding-bottom: 20px;">
                        <star-rating id="rating" :increment="0.5" :star-size="40" v-model="rating"
                                     :inline=true></star-rating>
                    </div>
                </div>

                <!--            <input type="number" id="rating" min="0" max="5" step="0.5" v-model="rating"><br><br>-->
                <div style="padding-top: 20px;">
                    <el-button type="warning" native-type="submit" style="margin-right: 20px;">Add Course</el-button>
                    <router-link to="/" style="color: #363636">cancel</router-link><!--tag="button"-->
                </div>
            </form>
        </el-card>
        <v-dialog></v-dialog>
    </div>
</template>
<script>
    import axios from "../http";
    import StarRating from 'vue-star-rating';

    export default {
        name: "addCourseStudied",
        data: function () {
            return {
                course: [],
                cname: "",
                cid: "",
                keyword: "",
                semester: "",
                credit: "",
                result: "",
                rating: 0,
                year: "",
                dialogVisible: false,
                years: 0,
                start_sem: 0,
                course_studied_list: [],
                course_studied_all: [],
                prohibition_s: ""
            }
        },
        components: {
            StarRating
        },
        created() {
            axios.post('student/year').then((res) => {
                this.getCourse_studied()
                this.years = res.data.year;
                this.start_sem = res.data.semester;
                this.check_login();
            })
        },
        methods: {
            /*
            * Get user's previously studied courses
            * */
            getCourse_studied() {
                axios.get("studied").then(res => {
                    if (res.data[0] != null) {
                        for (var i = 0; i < res.data.length; i++) {
                            var studied_course = res.data[i];
                            this.course_studied_all.push(studied_course)
                            if (studied_course.result == "PASS") {
                                this.course_studied_list.push(studied_course.cid)
                            }
                        }
                    }
                });
            },
            /*
            * Search courses by using keyword in course ID or course name
            * Generate a list of search results
            * */
            searchCourses() {
                if (this.keyword.trim() == "") {
                    // do nothing
                } else {
                    axios.get("course/search/" + this.keyword.trim())
                        .then((res) => {
                            this.dialogVisible = true;
                            this.course = res.data;
                        }).catch(err => {
                        console.log(err)
                    })
                }
            },
            /*
            * Generate a form for adding studied course after user selects the course they want to add
            * The selected course ID, name and semester options would be generated based on the selected course.
            * */
            PutSelected(c) {
                this.dialogVisible = false;
                document.getElementById("formDiv").style.visibility = ""
                this.cid = c.id;
                this.cname = c.name;
                this.credit = c.credit;
                this.prohibition_s = c.prohibition;
                this.course = []

                var selector = document.getElementById("semester")

                selector.innerHTML = "";

                var sem = c.semester.split(",");
                for (var i in sem) {
                    var opt = document.createElement("OPTION");
                    opt.setAttribute("value", sem[i])
                    var text = document.createTextNode(sem[i]);
                    opt.appendChild(text)
                    selector.appendChild(opt)
                }
            },
            /*
            * Submit the form, if the form is completed and the requirements are satisfied
            * The function first checks if the user wants to add a course which is completed before the time they start
            * the degree. Then, it checks the credit points requirement for each semester. Finally, the functions checks
            * if the course prohibition is violated. If all requirements are not violated, then the function will add
            * the course.
            * */
            addStudied: function () {
                if (this.semester != "" && this.result != "" && this.rating != ""
                    && this.year != "" && this.cid != "" && this.cname != "") {

                    if (this.years >= parseInt(this.year) && this.start_sem > parseInt(this.semester)) {
                        this.$alert('Sorry, you cannot add this course in Semester ' + this.semester + ', ' + this.year +
                            '. Because your degree has been started from Semester ' + this.start_sem + ', ' + this.years + '.')
                    } else {
                        var total_cp = 0
                        for (var i = 0; i < this.course_studied_all.length; i++) {
                            var cs_i = this.course_studied_all[i];

                            if (cs_i.year == parseInt(this.year) && cs_i.semester == parseInt(this.semester)) {
                                total_cp += cs_i.credit;
                            }
                        }
                        if ((total_cp + parseInt(this.credit)) > 24) {
                            this.$alert('Sorry, you cannot add this course. Because you have added previously studied courses ' +
                                'with ' + total_cp + ' CP in the selected semester. Student cannot select courses over 24 ' +
                                'CP for each semester. If you add ' + this.cid + " , the total CP for the semester would be " +
                                (total_cp + this.credit) + " CP.")
                        } else {
                            var pro_result = this.prohibition_check();
                            if (!pro_result.pro_output) {
                                axios.post('studied/add', {
                                    code: this.cid, cname: this.cname, semester: this.semester,
                                    result: this.result, rating: this.rating, year: this.year, credit: this.credit
                                }).then(res => {
                                    if (!res.data.message) {
                                        this.$alert("Sorry, you cannot add this course. Because the total CP of studied courses" +
                                            " and selected courses in the plan for this semester is over 24 CP.")
                                    } else {
                                        this.$message({
                                            message: 'Add studied course successfully',
                                            type: 'success'
                                        });
                                        setTimeout(() => this.$router.push('/'), 500);
                                    }
                                })

                            } else {
                                this.$alert("Sorry, you cannot add " + this.cid + ". Because the prohibition for " + this.cid +
                                    " is (" + pro_result.pro_str + "). You have added " + pro_result.pro_c + " as your previously" +
                                    " completed courses.")
                            }
                        }
                    }
                } else {
                    this.$message({
                        message: 'Please fill in the required information.',
                        type: 'warning'
                    });
                }
            },
            /*
            * Check if the course prohibition of the selected course is violated.
            * */
            prohibition_check() {
                var prohibition = this.prohibition_s;
                var prohibition_str = prohibition;
                prohibition = prohibition.replace(/AND/g, '&&')
                prohibition = prohibition.replace(/OR/g, '||')
                var regex = /[A-Z]+\d\d\d\d/g;
                var prohibit_course = prohibition.match(regex);
                var studied_ids = []
                var pro_courses = "";
                for (var i = 0; i < this.course_studied_all.length; i++) {
                    var cs_i = this.course_studied_all[i];
                    if (cs_i.year == parseInt(this.year) && cs_i.semester == parseInt(this.semester)) {
                        studied_ids.push(cs_i.cid)
                    }
                }
                if (prohibit_course != null) {
                    prohibit_course.forEach(element => {
                        if (this.course_studied_list.includes(element) || studied_ids.includes(element)) {
                            prohibition = prohibition.replace(element, "true")
                            pro_courses += element + ", "
                        } else {
                            prohibition = prohibition.replace(element, "false")
                        }
                    })
                    var output = eval(prohibition)
                    return {
                        pro_output: output, pro_str: prohibition_str,
                        pro_c: pro_courses.substr(0, pro_courses.length - 2)
                    };
                } else {
                    return {
                        pro_output: false, pro_str: prohibition_str,
                        pro_c: "no course"
                    }
                }


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
            }
        }
    }
</script>
<style scoped>

</style>