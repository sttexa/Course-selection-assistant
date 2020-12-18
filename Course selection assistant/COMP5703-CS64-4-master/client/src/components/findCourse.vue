<template>
    <body>
    <div id="head">
        <img id="head-logo" style="margin-bottom: 0;" src="../assets/USYDlogo.png" alt="USYD"/>
    </div>

    <!-- student profile -->
    <div id="stu-profile-card" style="height: 200px; padding-top: 20px;">
        <el-card style="width: 400px; background-color: rgba(255,255,255,0.38); margin-bottom: 0; margin-top: 0px;">
            <div style="height:100px; text-align: center; padding-bottom: 10px;">
                <img
                        style="width: 100px; height: 100px"
                        src="../assets/avatar2.png"/>
            </div>
            <div>
                <a href="/profile" style="font-size: 18px; color: #1983f1; font-weight: bold;">User Profile</a>
            </div>
        </el-card>
    </div>


    <div>
        <el-card
                style="padding: 0; margin: 0; width: 100%; background-color: rgb(54,54,54); color: white; border-left-color: rgb(54,54,54); border-top-width: 0;">
            <div>
                <!-- Course search component -->
                <div>
                    <el-row>
                        <el-col :span="4">
                            <div style="font-size: 24px; padding-top: 6px; font-weight: bold;">Find a unit:</div>
                        </el-col>
                        <el-col :span="20">
                            <div>
                                <el-input type="text" name="cid" id="cid" v-model="keyword"
                                          placeholder="Please enter a keyword"
                                          @change="searchCourses" @blur="searchCourses"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                </div>

                <!-- units search results dialog -->
                <div>
                    <el-dialog :visible="dialog_search" width="62%" @close="dialog_search = false"
                               style="text-align: center;">
                        <el-table
                                :data="course">
                            <el-table-column
                                    label="Unit ID"
                                    width="100">
                                <template slot-scope="scope">
                                    <a :href=course[scope.$index].outline>{{course[scope.$index].id}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="Unit Name"
                                    width="330">
                            </el-table-column>
                            <el-table-column
                                    prop="semester"
                                    label="Semester"
                                    width="90">
                            </el-table-column>
                            <el-table-column
                                    prop="prerequisite"
                                    label="Prerequisite"
                                    width="280">
                            </el-table-column>
                            <el-table-column
                                    label="Studied"
                                    width="100">
                                <template slot-scope="scope">
                                    <p style="color: rgb(164,226,20);"
                                       v-if="course_studied_pass.includes(course[scope.$index].id)"> Studied </p>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-dialog>
                </div>

            </div>
        </el-card>
        <el-card id="card-studied">
            <div style="text-align: center;">
                <h3>Studied Courses</h3>
            </div>

            <!-- Display the studied courses, which are sorted by year and semester -->
            <div id="studied_sems">
                <el-card :id="semester.studied_semester[0].year+semester.studied_semester[0].semester"
                         v-for="semester in units_studied_list"
                         :key="semester.studied_semester[0].cid+' '+semester.studied_semester[0].semester+' '+semester.studied_semester[0].year">
                    <h5>{{semester.studied_semester[0].year}} Semester {{semester.studied_semester[0].semester}}</h5>
                    <el-table
                            :data="semester.studied_semester" style="width: 100%">
                        <el-table-column
                                prop="cid"
                                label="Unit ID"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="credit"
                                label="credit Points"
                                width="180"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="result"
                                label="Unit Result"
                                width="180"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="rating"
                                label="Unit Rating"
                                width="180"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                fixed="right">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deleteRow(scope.$index, semester.studied_semester)"
                                           type="danger" plain
                                           size="small">
                                    Remove
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>
            <router-link class="link" to="/add-studied-course">Add a Studied Course</router-link>
        </el-card>

        <!-- study plan -->
        <el-card style="margin-left: 20px; margin-right: 20px; width: auto;">
            <div style="text-align: center;">
                <h3>Study Plan</h3>
            </div>

            <!-- Progress tracking component -->
            <el-card>
                <el-collapse>
                    <el-collapse-item v-bind:title=this.core_name>
                        <div id="core_div" style="font-size: 15px; text-align: left;">
                            {{core_complete}}<i class="el-icon-check" style="color: green; font-size: 30px"></i>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-bind:title=this.elective_name>
                        <div id="elective_div" style="font-size: 15px; text-align: left">
                            {{elective_complete}}<i class="el-icon-check" style="color: green; font-size: 30px"></i>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-bind:title=this.adv_name>
                        <div id="adv_div" style="font-size: 15px; text-align: left">
                            {{advElective_complete}}<i class="el-icon-check" style="color: green; font-size: 30px"></i>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-bind:title=this.major_name>
                        <div id="major_complete" style="font-size: 15px; text-align: left">
                            {{major_complete}}<i class="el-icon-check" style="color: green; font-size: 30px"></i>
                        </div>
                        <div id="major_uncomplete" style="font-size: 15px; text-align: left">
                            {{major_uncomplete}}<i class="el-icon-close" style="color: red; font-size: 30px"></i>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Major 2 Requirements" id="major_2_status">
                        <div id="major_2_complete" style="font-size: 15px; text-align: left">
                            {{major_2_complete}}<i class="el-icon-check" style="color: green; font-size: 30px"></i>
                        </div>
                        <div id="major_2_uncomplete" style="font-size: 15px; text-align: left">
                            {{major_2_uncomplete}}<i class="el-icon-close" style="color: red; font-size: 30px"></i>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="Minor Requirements" id="minor_status">
                        <div id="minor_complete" style="font-size: 15px; text-align: left">
                            {{minor_complete}}<i class="el-icon-check" style="color: green; font-size: 30px"></i>
                        </div>
                        <div id="minor_uncomplete" style="font-size: 15px; text-align: left">
                            {{minor_uncomplete}}<i class="el-icon-close" style="color: red; font-size: 30px"></i>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-card>

            <!-- Course planning component -->
            <div>
                <el-row>
                    <el-col :span="12" style="margin-bottom: 20px; padding-bottom: 20px;">
                        <div style=" background-color: rgb(215,92,64); color: white; height: 120px;">
                            <el-row>
                                <el-col :span="12">
                                    <!-- Select year for plan -->
                                    <div>
                                        <p style="font-weight: bold">Please select the year:</p>
                                    </div>
                                    <div>
                                        <el-select v-model="plan_year" clearable v-on:change="getPlanning()">
                                            <el-option :value="years">{{years}}</el-option>
                                            <el-option :value="years+1">{{years+1}}</el-option>
                                            <el-option :value="years+2">{{years+2}}</el-option>
                                            <el-option :value="years+3">{{years+3}}</el-option>
                                            <el-option :value="years+4">{{years+4}}</el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <!-- Select semester for plan -->
                                    <div>
                                        <p style="font-weight: bold">Please select the semester:</p>
                                    </div>
                                    <div>
                                        <el-select v-model="plan_semester" clearable v-on:change="getPlanning()">
                                            <el-option v-for="item in options"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div>
                            <!-- Table of available courses -->
                            <div style="width: 100%; text-align: center;">
                                <p><label style="font-weight: bold">Note</label>: Core units with *** in their names are
                                    highly discouraged for students in the selected year</p>
                                <table class="table-general" v-if="planning">
                                    <caption style="color: rgb(213,82,55); font-size: 20px; padding-bottom: 10px;">Core
                                        units
                                    </caption>
                                    <tr>
                                        <th>Course ID</th>
                                        <th class="table-head-unit-name">Name</th>
                                        <th>Credit</th>
                                        <th>Rating</th>
                                        <th style="width: auto;">Co-requisites</th>
                                    </tr>
                                    <tr v-for="c in planning.core" :key="c.id" :id="c.id">
                                        <td><a style="color: #409eff" :href=c.outline target="_blank">{{c.id}}</a></td>
                                        <td>{{c.name}}</td>
                                        <td>{{c.credit}}</td>
                                        <td>{{c.Rating}}</td>
                                        <td>{{c.corequisite}}</td>
                                        <td>
                                            <el-button type="text" @click="selectCourse(c,plan_semester,plan_year)">
                                                add
                                            </el-button>
                                        </td>
                                    </tr>
                                </table>
                                <el-collapse v-model="activeName" accordion>
                                    <el-collapse-item v-bind:title="elective_titel" name="1">
                                        <table class="table-general" v-if="planning">
                                            <caption
                                                    style="color: rgb(213,82,55); font-size: 20px; padding-bottom: 10px;">
                                                Electives units
                                            </caption>
                                            <tr>
                                                <th>Course ID</th>
                                                <th class="table-head-unit-name">Name</th>
                                                <th>Credit</th>
                                                <th>Rating</th>
                                                <th>Co-requisites</th>
                                            </tr>
                                            <tr v-for="c in planning.elective" :key="c.id" :id="c.id">
                                                <td><a style="color: #409eff" :href=c.outline
                                                       target="_blank">{{c.id}}</a></td>
                                                <td>{{c.name}}</td>
                                                <td>{{c.credit}}</td>
                                                <td>{{c.Rating}}</td>
                                                <td>{{c.corequisite}}</td>
                                                <td>
                                                    <el-button type="text"
                                                               @click="selectCourse(c,plan_semester,plan_year)">add
                                                    </el-button>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-collapse-item>
                                    <el-collapse-item v-bind:title="ad_elective_titel" name="2">
                                        <table class="table-general" v-if="planning">
                                            <caption
                                                    style="color: rgb(213,82,55); font-size: 20px; padding-bottom: 10px;">
                                                Advanced Electives
                                            </caption>
                                            <tr>
                                                <th>Course ID</th>
                                                <th class="table-head-unit-name">Name</th>
                                                <th>Credit</th>
                                                <th>Rating</th>
                                                <th>Co-requisites</th>
                                            </tr>
                                            <tr v-for="c in planning.advElective" :key="c.id" :id="c.id">
                                                <td><a style="color: #409eff" :href=c.outline
                                                       target="_blank">{{c.id}}</a></td>
                                                <td>{{c.name}}</td>
                                                <td>{{c.credit}}</td>
                                                <td>{{c.Rating}}</td>
                                                <td>{{c.corequisite}}</td>
                                                <td>
                                                    <el-button type="text"
                                                               @click="selectCourse(c,plan_semester,plan_year)">add
                                                    </el-button>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-collapse-item>
                                </el-collapse>
                            </div>
                        </div>
                    </el-col>

                    <!-- Select units for plan -->
                    <el-col :span="12"
                            style="background-color: rgb(54,54,54); height: 100%; margin-top: 20px; margin-bottom: 20px;">
                        <h2 style="color: white; margin-top: 45px; margin-bottom: 60px">Selected units for plan</h2>

                        <el-card v-for="p in selected_course" :key="p.c.id"
                                 style="margin: 5px; padding: 0 0; width: 98%;">
                            <div style="padding: 0 0; margin: 0 0;">
                                <span style="float:left;">{{p.c.id}} - {{p.c.name}}</span>
                                <span style="color: rgb(215,92,64); float: right; ">
                                        Semester {{p.semester}}, {{p.year}}
                                        <el-button type="primary" icon="el-icon-delete" size="mini"
                                                   @click="remove_selected(p.c.id,p.index)"></el-button>
                                    </span>
                                <span v-if="p.c.corequisite != 'NONE'"
                                      style="color: limegreen; font-size: 12px; float: left">
                                        <br>
                                        Co-requisite: {{p.c.corequisite}}
                                    </span>
                            </div>
                        </el-card>

                    </el-col>
                </el-row>
            </div>

            <!-- System Alert -->
            <v-dialog></v-dialog>

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
        name: "findCourse",
        data: function () {
            return {
                activeName: [],
                units_studied_list: [{
                    studied_semester: [{
                        cid: '',
                        semester: '',
                        year: '',
                        credit: '',
                        result: '',
                        rating: ''
                    }]
                }],
                options: [
                    {
                        value: '1',
                        label: '1'
                    },
                    {
                        value: '2',
                        label: '2'
                    }
                ],
                dialog_search: false,
                elective_titel: "",
                ad_elective_titel: "",
                course: [],
                course_studied: "",
                planning: "",
                semester: 1,
                selected_course: [],
                saved_selected_course: [],
                error: "",
                keyword: "",
                plan_semester: 1,
                plan_year: 1,
                course_studied_pass: [],
                course_studied_fail: [],
                last_corequisite: [],
                years: 0,
                core_complete: "",
                elective_complete: "",
                advElective_complete: "",
                major_complete: "",
                major_uncomplete: "",
                major_2_complete: "",
                major_2_uncomplete: "",
                minor_complete: "",
                minor_uncomplete: "",
                core_name: "Core (Required CP: 96)",
                elective_name: "Electives",
                adv_name: "Adv. Electives (at least 12 CP)",
                major_name: "Major Required Courses"
            };
        },
        created() {
            axios.post('student/year').then((res) => {
                this.years = res.data.year;
                this.plan_year = res.data.year;
                this.semester = res.data.semester;
                this.check_login();
                this.getCourse_studied();
                this.getPlanning();
            })
        },
        methods: {
            /*
            * Remove the selected course from the previously studied course table
            * The selected course need to be removed from both the client side and the server side.
            * A post request is sent to the server for removing the selected courses from the database.
            * After removing the course, the list of available courses will be re-evaluated based on the remaining
            * courses.
            * */
            deleteRow(index, rows) {
                var removed_course = rows[index];

                if (rows.length == 1) {
                    var removed_object_index = 0;
                    for (var i in this.units_studied_list) {
                        var current_sem = this.units_studied_list[i]
                        if (current_sem.studied_semester[0].year == removed_course.year
                            && current_sem.studied_semester[0].semester == removed_course.semester) {
                            removed_object_index = i;
                        }
                    }
                }

                rows.splice(index, 1);
                if (rows.length == 0) {
                    this.units_studied_list.splice(removed_object_index, 1)
                }
                //console.log(removed_course.cid)
                if (this.course_studied_pass.includes(removed_course.cid)) {
                    for (var i in this.course_studied_pass) {
                        if (this.course_studied_pass[i] == removed_course.cid) {
                            this.course_studied_pass.splice(i, 1)
                            break
                        }
                    }
                }
                //console.log(this.course_studied_pass)

                axios.post('studied/remove', {
                    cid: removed_course.cid, semester: removed_course.semester,
                    year: removed_course.year
                })
                this.getPlanning()
            },
            /*
            * Search courses by using the keyword in the course ID or course name
            * A post request is sent to the server for getting information about search results
            * */
            searchCourses() {
                if (this.keyword.trim() == "") {
                    // do nothing
                } else {
                    axios.get("course/search/" + this.keyword.trim())
                        .then((res) => {
                            this.course = res.data;
                        }).catch(err => {
                        console.log(err)
                    })
                    this.dialog_search = true;
                }
            },
            /*
            * Get user's studied courses
            * Reformat the information for UI
            * */
            getCourse_studied() {
                axios.get("studied").then(res => {
                    var studied_sems_card = document.getElementById("studied_sems");
                    if (res.data[0] != null) {
                        studied_sems_card.style.display = "";
                        for (var i = 0; i < res.data.length; i++) {
                            var studied_course = res.data[i];
                            //new change : Assign to units_studied_list
                            var last_element = this.units_studied_list[this.units_studied_list.length - 1].studied_semester[0]

                            if ((studied_course.year != last_element.year) ||
                                (studied_course.semester != last_element.semester)) {
                                if (last_element.year == '') {
                                    last_element.cid = studied_course.cid;
                                    last_element.semester = studied_course.semester;
                                    last_element.year = studied_course.year;
                                    last_element.credit = studied_course.credit;
                                    last_element.result = studied_course.result;
                                    last_element.rating = studied_course.rating;
                                } else {
                                    this.units_studied_list.push({
                                        studied_semester: [{
                                            cid: studied_course.cid,
                                            semester: studied_course.semester,
                                            year: studied_course.year,
                                            credit: studied_course.credit,
                                            result: studied_course.result,
                                            rating: studied_course.rating
                                        }]
                                    })
                                }
                            } else {
                                this.units_studied_list[this.units_studied_list.length - 1].studied_semester.push({
                                    cid: studied_course.cid,
                                    semester: studied_course.semester,
                                    year: studied_course.year,
                                    credit: studied_course.credit,
                                    result: studied_course.result,
                                    rating: studied_course.rating
                                })
                            }


                            if (studied_course.result == "PASS") {
                                this.course_studied_pass.push(studied_course.cid)
                            } else {
                                this.course_studied_fail.push({
                                    cid: studied_course.cid, semester: studied_course.semester,
                                    year: studied_course.year
                                })
                            }
                            if (studied_course.year != undefined && studied_course.rating != undefined) {
                                this.course_studied += "Course ID: " + studied_course.cid + ", "
                                    + "semester: " + studied_course.semester + ", " + "year: " + studied_course.year + ", " + "credit: "
                                    + studied_course.credit + ", " + "result: " + studied_course.result + ", " + "rating: " + studied_course.rating + "<br><br>";
                            } else {
                                this.course_studied += "Course ID: " + studied_course.cid + ", "
                                    + "semester: " + studied_course.semester + ", " + "credit: "
                                    + studied_course.credit + ", " + "result: " + studied_course.result + "<br><br>";
                            }
                        }
                    } else {
                        studied_sems_card.style.display = "none";
                    }
                    //console.log(this.units_studied_list[0].studied_semester)
                });
            },
            /*
            * Generate or update the progress tracking component
            * A post request is sent to the server for getting progress information about the student.
            * The information is re-formatted for UI display
            * */
            checkStudyStatus() {
                var selected = "";
                if (this.selected_course.length != 0) {
                    this.selected_course.forEach(elem => {
                        selected = selected.concat(elem.c.id + " ")
                    })
                    selected = selected.substring(0, selected.length - 1)
                }

                axios.post("/planning/status_check", {selected: selected}).then(res => {
                    var result = res.data;
                    var core_complete = result.core_complete;
                    var elective_complete = result.elective_complete;
                    var advElective_complete = result.advElective_complete;
                    var major_complete = result.major_complete;
                    var major_uncomplete = result.major_uncompleted;
                    var major_2_complete = result.major_2_completed;
                    var major_2_uncomplete = result.major_2_uncompleted;
                    var minor_complete = result.minor_completed;
                    var minor_uncomplete = result.minor_uncompleted;
                    var core_cp = result.core_cp;
                    if (core_complete.length != 0) {
                        this.core_name = "Core (Required CP: 96) (" + core_cp + "/96 CP)"
                        document.getElementById("core_div").style.display = "";
                        this.core_complete = core_complete.join();
                    } else {
                        this.core_name = "Core (Required CP: 96) (0/96 CP)"
                        document.getElementById("core_div").style.display = "none";
                    }

                    if (elective_complete.length != 0) {
                        this.elective_name = "Electives (" + elective_complete.length * 6 + " CP)"
                        document.getElementById("elective_div").style.display = "";
                        this.elective_complete = elective_complete.join();
                    } else {
                        this.elective_name = "Electives (0 CP)"
                        document.getElementById("elective_div").style.display = "none";
                    }

                    if (advElective_complete.length != 0) {
                        this.adv_name = "Adv. Electives (at least 12 CP) (" + advElective_complete.length * 6 + " CP)"
                        document.getElementById("adv_div").style.display = "";
                        this.advElective_complete = advElective_complete.join();
                    } else {
                        this.adv_name = "Adv. Electives (at least 12 CP) (0 CP)"
                        document.getElementById("adv_div").style.display = "none";
                    }

                    var major_complete_cp = 0;
                    if (major_complete.length != 0) {
                        document.getElementById("major_complete").style.display = "";
                        this.major_complete = major_complete.join()
                        major_complete_cp = major_complete.length * 6
                    } else {
                        document.getElementById("major_complete").style.display = "none";
                    }


                    if (major_uncomplete.length != 0) {
                        this.major_name = "Major Required Courses (" + major_complete_cp + "/" + (major_complete_cp +
                            major_uncomplete.length * 6) + " CP)"
                        document.getElementById("major_uncomplete").style.display = "";
                        this.major_uncomplete = major_uncomplete.join()
                    } else {
                        document.getElementById("major_uncomplete").style.display = "none";
                    }

                    document.getElementById("major_2_status").style.display = "none"
                    document.getElementById("minor_status").style.display = "none"
                    if (major_2_complete.length != 0 || major_2_uncomplete.length != 0) {
                        document.getElementById("major_2_status").style.display = ""
                        document.getElementById("minor_status").style.display = ""
                        // For major_2 progress
                        if (major_2_complete.length != 0) {
                            document.getElementById("major_2_complete").style.display = ""
                            var m_2_c = "";
                            major_2_complete.forEach(elem => {
                                if (elem.charAt(0) >= '0' && elem.charAt(0) <= '9') {
                                    var required_num = parseInt(elem[0]);
                                    var options = elem.substr(2);
                                    var regex = /[A-Z]+\d\d\d\d/g;
                                    m_2_c += "Select " + required_num + " from (" + options.match(regex).join() + "). ";
                                } else {
                                    m_2_c += elem + ", ";
                                }
                            })
                            this.major_2_complete = m_2_c.substr(0, m_2_c.length - 2);
                        } else {
                            document.getElementById("major_2_complete").style.display = "none"
                        }
                        if (major_2_uncomplete.length != 0) {
                            document.getElementById("major_2_uncomplete").style.display = ""
                            var m_2_un = "";
                            major_2_uncomplete.forEach(elem => {
                                if (elem.charAt(0) >= '0' && elem.charAt(0) <= '9') {
                                    var required_num = parseInt(elem[0]);
                                    var options = elem.substr(2);
                                    var regex = /[A-Z]+\d\d\d\d/g;
                                    m_2_un += "Select " + required_num + " from (" + options.match(regex).join() + "). ";
                                } else {
                                    m_2_un += elem + ", ";
                                }
                            })
                            this.major_2_uncomplete = m_2_un.substr(0, m_2_un.length - 2);
                        } else {
                            document.getElementById("major_2_uncomplete").style.display = "none"
                        }
                        // For minor progress
                        if (minor_complete.length != 0) {
                            document.getElementById("minor_complete").style.display = ""
                            this.minor_complete = minor_complete.join();
                        } else {
                            document.getElementById("minor_complete").style.display = "none"
                        }
                        if (minor_uncomplete.length != 0) {
                            document.getElementById("minor_uncomplete").style.display = ""
                            this.minor_uncomplete = minor_uncomplete.join()
                        } else {
                            document.getElementById("minor_uncomplete").style.display = "none"
                        }
                    }

                })
            },
            /*
            * Generate a list of available courses for course planning component
            * */
            getPlanning() {
                this.options = [
                    {
                        value: 1,
                        label: '1'
                    },
                    {
                        value: 2,
                        label: '2'
                    }
                ];
                if (this.semester == 1) {
                    var Switch = this.plan_year - this.years;
                    switch (Switch) {
                        case 0:
                            this.activeName = [];
                            this.elective_titel = "Elective courses are highly discouraged in the this academic year.";
                            this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year."
                            break;
                        case 1:
                            this.activeName = '1';
                            this.elective_titel = "Electives";
                            this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year.";
                            break;
                        case 2:
                            this.activeName = '1';
                            this.elective_titel = "Electives";
                            this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year.";
                            break;
                        case 3:
                            this.activeName = ['1', '2'];
                            this.elective_titel = "Electives";
                            this.ad_elective_titel = "Advanced electives";
                            break;
                        default:
                            this.this.activeName = ['1', '2'];
                            this.elective_titel = "Electives";
                            this.ad_elective_titel = "Advanced electives";
                    }
                } else {
                    if (this.plan_year == this.years) {
                        this.options = [
                            {
                                value: 2,
                                label: '2'
                            }
                        ];
                        this.plan_semester = 2;
                    }
                    if (this.semester - this.plan_semester == 0) {
                        var Switch = this.plan_year - this.years;
                        switch (Switch) {
                            case 0:
                                this.activeName = [];
                                this.elective_titel = "Elective courses are highly discouraged in the this academic year.";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year."
                                break;
                            case 1:
                                this.activeName = '1';
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year.";
                                break;
                            case 2:
                                this.activeName = '1';
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year.";
                                break;
                            case 3:
                                this.activeName = ['1', '2'];
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced electives";
                                break;
                            default:
                                this.this.activeName = ['1', '2'];
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced electives";
                        }
                    } else {
                        var Switch = this.plan_year - this.years;
                        switch (Switch) {
                            case 0:
                                this.activeName = [];
                                this.elective_titel = "Elective courses are highly discouraged in the this academic year.";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year."
                                break;
                            case 1:
                                this.activeName = [];
                                this.elective_titel = "Elective courses are highly discouraged in the first academic year.";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year."
                                break;
                            case 2:
                                this.activeName = '1';
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year.";
                                break;
                            case 3:
                                this.activeName = '1';
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced elective courses are highly discouraged in the this academic year.";
                                break;
                            case 4:
                                this.activeName = ['1', '2'];
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced electives";
                                break;
                            default:
                                this.this.activeName = ['1', '2'];
                                this.elective_titel = "Electives";
                                this.ad_elective_titel = "Advanced electives";
                        }
                    }
                }

                var selected = "";
                //console.log("Previous selected: "+this.selected_course)
                if (this.selected_course.length != 0) {
                    this.selected_course.forEach(elem => {
                        // console.log("Element year: "+elem.year)
                        // console.log("Current year: "+this.plan_year)
                        if (parseInt(elem.year) < parseInt(this.plan_year)) {
                            selected = selected.concat(elem.c.id + " ")
                        } else if (parseInt(elem.year) == parseInt(this.plan_year) && parseInt(elem.semester) < parseInt(this.plan_semester)) {
                            selected = selected.concat(elem.c.id + " ")
                        }
                    })
                    // The selected courses for plan before the selected year and semester
                    selected = selected.substring(0, selected.length - 1)
                }

                //console.log("Previous selected courses: "+selected)
                this.selected_course = [];
                // Requesting the list of available courses
                axios.post("/planning/available/", {
                    semester: this.plan_semester, selected: selected,
                    year: this.plan_year
                }).then(res => {
                    axios.post("/recommend/", res.data).then(res => {
                        this.planning = res.data
                        //console.log(this.planning)
                        axios.post("/planning/selectedCourses").then(res => {
                            if (res.data) {
                                for (var j in res.data) {
                                    this.selected_course.push({
                                        c: res.data[j],
                                        year: res.data[j].year,
                                        semester: res.data[j].sub_semester,
                                        index: j
                                    })
                                    this.selected_course.sort(function (a, b) {
                                        if (a.year == b.year) {
                                            return a.semester - b.semester
                                        }
                                        return a.year - b.year;
                                    });
                                }
                            }
                            this.checkStudyStatus()
                            this.refresh();
                        });
                    });
                });
            },

            refresh: function () {
                for (var i in this.planning.core) {
                    document.getElementById(this.planning.core[i].id).style.display = ""
                }
                for (var i in this.planning.elective) {
                    document.getElementById(this.planning.elective[i].id).style.display = ""
                }
                for (var i in this.planning.advElective) {
                    document.getElementById(this.planning.advElective[i].id).style.display = ""
                }
                for (var i in this.selected_course) {
                    if (this.selected_course[i].semester == this.plan_semester) {
                        var selected_elem = document.getElementById(this.selected_course[i].c.id)
                        if (selected_elem != null) {
                            document.getElementById(this.selected_course[i].c.id).style.display = "none"
                        }
                    }
                }
            },
            /*
            * Prohibition evaluation for the course planning component
            * Course prohibition is evaluated while the user tries select any course.
            * */
            prohibition_check(c, semester, year) {
                var prohibition = c.prohibition;
                var prohibition_str = prohibition;
                prohibition = prohibition.replace(/AND/g, '&&')
                prohibition = prohibition.replace(/OR/g, '||')
                var regex = /[A-Z]+\d\d\d\d/g;
                var prohibit_course = prohibition.match(regex);
                var selected_ids = []
                this.selected_course.forEach(elem => selected_ids.push(elem.c.id))
                this.course_studied_pass.forEach(elem => selected_ids.push(elem));
                if (prohibit_course != null) {
                    prohibit_course.forEach(element => {
                        if (selected_ids.includes(element)) {
                            prohibition = prohibition.replace(element, "true")
                        } else {
                            if (this.course_studied_fail.length > 0) {
                                var replaced = false;
                                for (var i in this.course_studied_fail) {
                                    if (this.course_studied_fail[i].cid == element) {
                                        if (this.course_studied_fail[i].semester == semester &&
                                            this.course_studied_fail[i].year == year) {
                                            prohibition = prohibition.replace(element, "true")
                                            replaced = true;
                                            break
                                        }
                                    }
                                }
                                if (replaced == false) {
                                    prohibition = prohibition.replace(element, "false")
                                }
                            } else {
                                prohibition = prohibition.replace(element, "false")
                            }
                        }
                    })
                    var output = eval(prohibition)
                    return {pro_output: output, pro_str: prohibition_str};
                } else {
                    return {pro_output: false, pro_str: prohibition_str};
                }

            },
            /*
            * Select courses from the list of available courses
            * After selecting a course, the course will be removed from the list and stored in the cache as
            * the selected courses for plan. Credit points requirement, co-requisites, prohibition will be checked
            * during the selecting process.
            * */
            selectCourse(c, semester, year) {
                var select_credits_sem = c.credit;
                var selected_credits = c.credit;

                for (var i in this.selected_course) {
                    var selected = this.selected_course[i]
                    selected_credits += selected.c.credit
                    if (selected.year == year && selected.semester == semester) {
                        select_credits_sem += selected.c.credit
                    }
                }

                var studied_credits = 0
                var studied_credits_sem = 0
                for (var i in this.units_studied_list) {
                    var select_sem = this.units_studied_list[i]
                    for (var j in select_sem.studied_semester) {
                        if (select_sem.studied_semester[j].result == "PASS") {
                            studied_credits += select_sem.studied_semester[j].credit
                        }
                        if (parseInt(select_sem.studied_semester[j].year) == year &&
                            parseInt(select_sem.studied_semester[j].semester) == semester) {
                            studied_credits_sem += select_sem.studied_semester[j].credit;
                        }
                    }
                }
                // console.log("Sem credits:"+select_credits_sem+", selected_credits: "+selected_credits+", studied_credits: "+
                //     studied_credits+" , studied_credits_sem: "+studied_credits_sem)

                // Credit points requirement
                if ((select_credits_sem + studied_credits_sem) <= 24 && (studied_credits + selected_credits) <= 192) {
                    var index = this.selected_course.length

                    if (this.last_corequisite.length != 0) {
                        this.last_corequisite.forEach(elem => {
                            if (document.getElementById(elem) != undefined) {
                                document.getElementById(elem).style.backgroundColor = ""
                            }
                        })
                        this.last_corequisite = []
                    }

                    // Prohibition evaluation
                    var pro_result = this.prohibition_check(c, semester, year);

                    if (!pro_result.pro_output) {
                        // Co-requisites evaluation
                        if (c.corequisite == "NONE") {
                            axios.post("/planning/time_check", {id: c.id, year: year, semester: semester}).then(res => {
                                //console.log(res.data);
                                if (res.data.message) {
                                    alert(res.data.message);
                                } else {
                                    if (!res.data.validation) {
                                        //document.getElementById(c.id).style.display = "none";
                                        var str = "";
                                        for (var i in res.data.courses) {
                                            if (res.data.courses[i].year == year && res.data.courses[i].sub_semester == semester) {
                                                str += res.data.courses[i].id;
                                                str += '\n';
                                                str += res.data.courses[i].name;
                                                str += '\n';
                                                var counter = 1;
                                                for (var j = 0; j < res.data.courses[i].time.length; j++) {
                                                    if (res.data.courses[i].time[j].semester == semester) {
                                                        str += "lecture " + counter + ":" + res.data.courses[i].time[j].weekday + " "
                                                            + res.data.courses[i].time[j].startTime + "~" + res.data.courses[i].time[j].endTime;
                                                        str += '\n';
                                                        if (res.data.courses[i].time[j + 1]) {
                                                            if (res.data.courses[i].time[j + 1].id != res.data.courses[i].time[j].id) {
                                                                counter++;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //alert(str);
                                        this.$alert(str, 'Clash exists in selected semester:', {
                                            confirmButtonText: 'OK'
                                        })
                                    }
                                    this.selected_course.push({c: c, year: year, semester: semester, index: index})
                                    this.selected_course.sort(function (a, b) {
                                        if (a.year == b.year) {
                                            return a.semester - b.semester
                                        }
                                        return a.year - b.year;
                                    });
                                    this.getPlanning();
                                    this.refresh();
                                }
                            })
                        } else {
                            // Evaluate co-requisites
                            var corequisite = c.corequisite
                            corequisite = corequisite.replace(/AND/g, '&&')
                            corequisite = corequisite.replace(/OR/g, '||')
                            var regex = /[A-Z]+\d\d\d\d/g;
                            var cor_course = corequisite.match(regex);
                            var selected_ids = []
                            this.selected_course.forEach(elem => selected_ids.push(elem.c.id))

                            cor_course.forEach(element => {
                                if (this.course_studied_pass.includes(element) || selected_ids.includes(element)) {
                                    corequisite = corequisite.replace(element, "true")
                                } else {
                                    corequisite = corequisite.replace(element, "false")
                                }
                            })

                            if (eval(corequisite)) {
                                axios.post("/planning/time_check", {
                                    id: c.id,
                                    year: year,
                                    semester: semester
                                }).then(res => {
                                    //console.log(res.data);
                                    if (res.data.message) {
                                        alert(res.data.message);
                                    } else {
                                        if (!res.data.validation) {
                                            //document.getElementById(c.id).style.display = "none";
                                            var str = "Selected semester :" + '\n';
                                            for (var i in res.data.courses) {
                                                if (res.data.courses[i].year == year && res.data.courses[i].sub_semester == semester) {
                                                    str += res.data.courses[i].id;
                                                    str += '\n';
                                                    str += res.data.courses[i].name;
                                                    str += '\n';
                                                    var counter = 1;
                                                    for (var j = 0; j < res.data.courses[i].time.length; j++) {
                                                        if (res.data.courses[i].time[j].semester == semester) {
                                                            str += "lecture " + counter + ":" + res.data.courses[i].time[j].weekday + " "
                                                                + res.data.courses[i].time[j].startTime + "~" + res.data.courses[i].time[j].endTime;
                                                            str += '\n';
                                                            if (res.data.courses[i].time[j + 1]) {
                                                                if (res.data.courses[i].time[j + 1].id != res.data.courses[i].time[j].id) {
                                                                    counter++;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            alert(str);
                                        }
                                        this.selected_course.push({
                                            c: c,
                                            year: year,
                                            semester: semester,
                                            index: index,
                                            status: true
                                        })
                                        this.selected_course.sort(function (a, b) {
                                            if (a.year == b.year) {
                                                return a.semester - b.semester
                                            }
                                            return a.year - b.year;
                                        });
                                        this.getPlanning();
                                        this.refresh();
                                    }
                                })

                            } else {
                                this.$alert("The co-requisite for " + c.id + " is " + c.corequisite + "." +
                                    "\nNote:You have to select the co-requisite before you select " + c.id
                                    + ".")
                                cor_course.forEach(elem => {
                                    if (document.getElementById(elem) != null) {
                                        this.last_corequisite.push(elem)
                                        document.getElementById(elem).style.backgroundColor = "lightgreen"
                                    }
                                })
                            }
                        }
                    } else {
                        this.$alert("You cannot select " + c.id + ". Because the prohibition for " + c.id + " is (" + pro_result.pro_str + ")");
                    }

                } else if ((studied_credits + selected_credits) > 192) {
                    this.$alert("You have reached the maximum of credit points (192 CP)")
                } else if ((studied_credits_sem + select_credits_sem) > 24) {
                    this.$alert("You cannot select " + c.id + ". You have selected or added courses with " + (studied_credits_sem + select_credits_sem - c.credit) +
                        " CP for this semester. Student cannot select courses over 24 CP for each semester. ")
                }
            },
            /*
            * Remove selected course for plan
            * The selected course will be removed from both the user interface and the cache.
            * */
            remove_selected(cid, i) {
                for (var i in this.selected_course) {
                    if (this.selected_course[i].c.id == cid) {
                        this.selected_course.splice(i, 1);
                        break;
                    }
                }
                this.selected_course.sort(function (a, b) {
                    if (a.year == b.year) {
                        return a.semester - b.semester
                    }
                    return a.year - b.year;
                });
                axios.post("/planning/remove", {id: cid}).then(res => {
                    if (!res.data.message) {
                        alert("Delete error")
                    }
                    this.getPlanning();
                })
                // document.querySelector("tr").style.display="inline";
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
    };
</script>