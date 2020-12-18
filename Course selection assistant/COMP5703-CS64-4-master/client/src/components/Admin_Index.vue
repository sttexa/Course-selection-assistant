<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>Admin Index</title>
    <!-- element ui css -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <!-- css -->

    <!--<link rel="stylesheet" href="backStage.css">-->

</head>
<template>
    <body>
    <div id="head">
        <img id="head-logo" src="../assets/USYDlogo.png" alt="USYD" style="margin-right: 50%">
        <el-link disabled style="color: white; font-weight: bold;">Welcome, {{currentAdmin}}</el-link>

        <el-link id="adminManagement" href="/adminsignup"
                 style="color: rgb(79,141,221); font-weight: bold; visibility: hidden; margin-left: 40px;">
            Add Administrator
        </el-link>
        <el-button style="margin-left: 20px;margin-top: 5px;margin-right: 10px" type="danger" size="small"
                   @click=adminlogout>Log Out
        </el-button>


    </div>

    <div id="app">
        <el-tabs v-model="activeIndex" @tab-click="handleClick" id="adminNavigationBar">
            <!-- courses and majors management -->
            <el-tab-pane label="Major Management" name="1" id="CoursesAndMajorsList" align=center>

                <el-table
                        :data="majorTableData.slice(1)"
                        id="majorsTable"
                        v-if="showmajors"
                        max-height="1000">
                    <el-table-column
                            fixed
                            prop="id"
                            label="Major ID"
                            id="tableMId"
                            width="120"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="Major name"
                            id="tableMName"
                            min-width="700"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="Operation"
                            width="200">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleMajorEdit(scope.$index+1, scope.row)">
                                Edit
                            </el-button>
                            <el-button type="text" size="small" @click="handleMajorDelete(scope.$index+1, scope.row)">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="padding-top: 20px;">
                    <el-button type="primary" plain @click="addNewMajor()">Add a new major</el-button>
                </div>

                <el-dialog width="80%" title="Major details" :visible.sync="dialogMajorVisible" id="majorEditDialog"
                           custom-class="customWidthForDialog">
                    <el-form ref="form" :model="majorTableData[currentMajorIndex]" label-width="120px"
                             id="majorEditForm">
                        <el-form-item label="Major ID:">
                            <el-input
                                    placeholder="Please input new major ID"
                                    v-model.trim="majorTableData[currentMajorIndex].id" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="Major name:">
                            <el-input
                                    placeholder="Please input major name"
                                    v-model.trim="majorTableData[currentMajorIndex].name" clearable></el-input>
                        </el-form-item>
                        <div><p style="font-size: 16px;bold">Step 1: Edit Core, Adv Electives and Electives of the
                            Major.</p></div>
                        <el-collapse>
                            <el-collapse-item title="Core, Adv Electives and Electives">
                                <el-form-item label="Core units:">
                                    <el-transfer filterable :props="{key:'id',label:'id'}"
                                                 v-model="majorTableData[currentMajorIndex].core"
                                                 :data="unitTableData.slice(1)" :titles="['All units','Selected units']"
                                                 @change=changeselectedunit></el-transfer>
                                </el-form-item>
                                <el-form-item label="Adv Electives:">
                                    <el-transfer filterable :props="{key:'id',label:'id'}"
                                                 v-model="majorTableData[currentMajorIndex].advElectives"
                                                 :data="unitTableData.slice(1)" :titles="['All units','Selected units']"
                                                 @change=changeselectedunit></el-transfer>
                                </el-form-item>
                                <el-form-item label="Electives:">
                                    <el-transfer filterable :props="{key:'id',label:'id'}"
                                                 v-model="majorTableData[currentMajorIndex].electives"
                                                 :data="unitTableData.slice(1)" :titles="['All units','Selected units']"
                                                 @change=changeselectedunit></el-transfer>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                        <div><p style="font-size: 16px;bold">Step 2: Edit Major Units.</p></div>
                        <el-collapse>
                            <el-collapse-item title="Major Units (Only units selected in Step 1 can be add/removed)">
                                <el-form-item label="Major units:">
                                    <el-transfer filterable :props="{key:'id',label:'id'}"
                                                 v-model="majorTableData[currentMajorIndex].major"
                                                 :data="majorcombinelist"
                                                 :titles="['All units','Selected units']"></el-transfer>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                        <div><p style="font-size: 16px;bold">Step 3: Edit Major 2.</p></div>
                        <el-collapse>
                            <el-collapse-item title="Major 2 No.1 (Only units selected in Step 1 can be add/removed)">
                                <div style="padding-bottom: 10px;">
                                    <el-card class="box-card" id="major2Card1">
                                        <div slot="header" class="clearfix">
                                            <!-- <span>Major2 : {{majorTableData[currentMajorIndex].major2[0].name}}</span> -->
                                            <el-form-item label="Major2 Name 1:">
                                                <el-input
                                                        placeholder="Please input major2 name No.1"
                                                        v-model.trim="majorTableData[currentMajorIndex].major2[0].name"
                                                        clearable></el-input>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="Required">
                                                <el-transfer filterable :props="{key:'id',label:'id'}"
                                                             v-model="majorTableData[currentMajorIndex].major2[0].required"
                                                             :data="majorcombinelist"
                                                             :titles="['All units','Selected units']"></el-transfer>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="Minor">
                                                <el-transfer filterable :props="{key:'id',label:'id'}"
                                                             v-model="majorTableData[currentMajorIndex].major2[0].minor"
                                                             :data="majorcombinelist"
                                                             :titles="['All units','Selected units']"></el-transfer>
                                            </el-form-item>
                                        </div>
                                    </el-card>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="Major 2 No.2 (Only units selected in Step 1 can be add/removed)">
                                <div style="padding-bottom: 10px;">
                                    <el-card class="box-card" id="major2Card1">
                                        <div slot="header" class="clearfix">
                                            <!--     <span>Major2 : {{majorTableData[currentMajorIndex].major2[1].name}}</span> -->
                                            <el-form-item label="Major2 Name 2:">
                                                <el-input
                                                        placeholder="Please input major2 name No.2"
                                                        v-model.trim="majorTableData[currentMajorIndex].major2[1].name"
                                                        clearable></el-input>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="Required">
                                                <el-transfer filterable :props="{key:'id',label:'id'}"
                                                             v-model="majorTableData[currentMajorIndex].major2[1].required"
                                                             :data="majorcombinelist"
                                                             :titles="['All units','Selected units']"></el-transfer>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="Minor">
                                                <el-transfer filterable :props="{key:'id',label:'id'}"
                                                             v-model="majorTableData[currentMajorIndex].major2[1].minor"
                                                             :data="majorcombinelist"
                                                             :titles="['All units','Selected units']"></el-transfer>
                                            </el-form-item>
                                        </div>
                                    </el-card>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="Major 2 No.3 (Only units selected in Step 1 can be add/removed)">
                                <div style="padding-bottom: 10px;">
                                    <el-card class="box-card" id="major2Card1">
                                        <div slot="header" class="clearfix">
                                            <!--    <span>Major2 : {{majorTableData[currentMajorIndex].major2[2].name}}</span> -->
                                            <el-form-item label="Major2 Name 3:">
                                                <el-input
                                                        placeholder="Please input major2 name No.3"
                                                        v-model.trim="majorTableData[currentMajorIndex].major2[2].name"
                                                        clearable></el-input>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="Required">
                                                <el-transfer filterable :props="{key:'id',label:'id'}"
                                                             v-model="majorTableData[currentMajorIndex].major2[2].required"
                                                             :data="majorcombinelist"
                                                             :titles="['All units','Selected units']"></el-transfer>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="Minor">
                                                <el-transfer filterable :props="{key:'id',label:'id'}"
                                                             v-model="majorTableData[currentMajorIndex].major2[2].minor"
                                                             :data="majorcombinelist"
                                                             :titles="['All units','Selected units']"></el-transfer>
                                            </el-form-item>
                                        </div>
                                    </el-card>
                                </div>
                            </el-collapse-item>
                        </el-collapse>

                        <el-form-item style="padding-top: 10px;">
                            <el-button type="primary" @click="majorEditOnSubmit" id="buttonMajorEditSubmit">confirm
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <!--
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogMajorVisible = false">Cancel</el-button>
                        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
                    </div>
                    -->
                </el-dialog>

            </el-tab-pane>
            <!-- units management -->
            <el-tab-pane label="Unit Management" name="2" align=center>
                <div style="padding-top: 20px; padding-bottom: 20px">
                    <el-button type="primary" plain @click="addNewUnit()">+ Add a new unit</el-button>
                </div>
                <el-form ref="form" :inline="true" :model="searchbody" label-width="90px">
                    <el-form-item label="Search By:">
                        <el-select v-model="searchbody.type" placeholder="Search By">
                            <el-option label="Unit Code" value="code"></el-option>
                            <el-option label="Unit Name" value="name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Keyword:">
                        <el-input
                                placeholder="Please Input Keyword"
                                v-model.trim="searchbody.keyword">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="unitSearch">Search</el-button>
                    </el-form-item>
                </el-form>

                <el-table
                        :data="unitTableData.slice((this.currentUnitPage-1)*20+1,this.currentUnitPage*20)"
                        stripe
                        id="unitsTable"
                        v-if="showcourses"
                        max-height="700">
                    <el-table-column
                            fixed
                            prop="id"
                            label="Unit code"
                            id="tableid"
                            width="100"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="Unit name"
                            id="tablename"
                            width="120"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="Type"
                            id="tableUType"
                            width="100"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="semester"
                            label="Semester"
                            id="tableUSemester"
                            width="85"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="credit"
                            label="Credit points"
                            id="tableUCredit"
                            width="70"
                            align=center>
                    </el-table-column>

                    <el-table-column
                            prop="prerequisite"
                            label="Prerequisite"
                            id="tableUPrerequisite"
                            width="140"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="corequisite"
                            label="Corequisite"
                            id="tableUCorequisite"
                            width="150"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="prohibition"
                            label="Prohibition"
                            id="tableUProhibition"
                            width="150"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            prop="assumed"
                            label="Assumed"
                            id="tableUAssumed"
                            width="150"
                            align=center>
                    </el-table-column>
                    <el-table-column
                            style="text-align: center"
                            fixed="right"
                            label="Operation"
                            width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="small" @click="handleEdit(scope.$index+1, scope.row)">
                                Edit
                            </el-button>
                            <el-button type="danger" plain size="small"
                                       @click="handleDelete(scope.$index+1, scope.row)">Delete
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="block" style="padding-top: 10px;padding-bottom: 10px">
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            @current-change="handleCurrentChange"
                            :total="this.unitTableData.length-1"
                            :page-size="20">
                    </el-pagination>
                </div>


                <el-dialog
                        id="unitEditDrawer"
                        title="Unit Details"
                        :visible.sync="drawer"
                        :direction="direction"
                        size="61%"
                        width="70%"
                        overflow-y="auto"
                >
                    <span>
                        <el-form ref="form" :model="unitTableData[currentUnitIndex]" label-width="160px"
                                 id="unitEditForm">
                            <el-row>
                                <el-col :span="12"><div class="drawerItem">
                                    <el-form-item label="Unit Code:">
                                <el-input
                                        placeholder="Please input new unit code" name="id"
                                        @blur=checkUnitCode(unitTableData[currentUnitIndex].id)
                                        v-model.trim="unitTableData[currentUnitIndex].id" :disabled="unitiddisabled"
                                        clearable></el-input>
                                </el-form-item></div><p
                                        style="color: #F56C6C;font-size: 9px">{{alert_unitcode}}</p></el-col>

                                <el-col :span="12"><div class="drawerItem"><el-form-item label="Unit Name:">
                                <el-input
                                        placeholder="Please input new unit name" name="name"
                                        v-model="unitTableData[currentUnitIndex].name" clearable></el-input>
                            </el-form-item></div></el-col>
                            </el-row>

                            <el-form-item label="Unit Outline:">
                                <el-input
                                        placeholder="Please input new unit outline" name="outline"
                                        v-model.trim="unitTableData[currentUnitIndex].outline" clearable></el-input>
                            </el-form-item>
                            <!--
                            <el-form-item label="Semester:">
                                <el-input
                                        placeholder="Please input semester" name="semester"
                                        v-model="unitTableData[currentUnitIndex].semester" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="Credit Points:">
                                <el-input
                                        placeholder="Please input credit points" name="credit"
                                        v-model.trim="unitTableData[currentUnitIndex].credit" clearable></el-input>
                            </el-form-item>
                            -->
                            <el-row>
                                <el-col :span="12"><div class="drawerItem"><el-form-item label="Semester:">
                                <!--<el-input
                                        placeholder="Please input new semester" name="semester"
                                        v-model.trim="unitTableData[currentUnitIndex].semester"  clearable></el-input>-->
                                    <el-select v-model.trim="unitTableData[currentUnitIndex].semester"
                                               placeholder="Please Select New Semester"
                                               name="semester" style="width: 100%">
                                    <el-option :value='"1"'></el-option>
                                    <el-option :value='"2"'></el-option>
                                        <el-option :value='"1,2"'></el-option>
                                </el-select>
                            </el-form-item></div></el-col>
                                <el-col :span="12"><div class="drawerItem"><el-form-item label="Credit Points:">
                                    <el-select v-model.trim="unitTableData[currentUnitIndex].credit"
                                               placeholder="Please input credit points" name="credit"
                                               style="width: 100%">
                                        <el-option :value='3'>3</el-option>
                                        <el-option :value='6'>6</el-option>
                                        <el-option :value='12'>12</el-option>
                                    </el-select>
                                    <!--
                                <el-input
                                        placeholder="Please input credit points" name="credit"
                                        v-model.trim="unitTableData[currentUnitIndex].credit" clearable></el-input>-->
                            </el-form-item></div></el-col>
                            </el-row>
                            <el-form-item label="Prerequisite:">
                                <el-input
                                        placeholder="Using Unit Code and Connection Word (AND, OR), E.g: TEST0000 AND TEST0001"
                                        name="prerequisite"
                                        @blur=checkPrequisite(unitTableData[currentUnitIndex].prerequisite)
                                        v-model="unitTableData[currentUnitIndex].prerequisite" clearable></el-input>

                            </el-form-item>
                            <p style="color: #F56C6C;font-size: 9px">{{alert_prequisite}}</p>
                            <el-form-item label="Corequisite:">
                                <el-input
                                        placeholder="Using Unit Code and (AND, OR), E.g: TEST0000 AND TEST0001"
                                        name="corequisite"
                                        @blur=checkCorequisite(unitTableData[currentUnitIndex].corequisite)
                                        v-model="unitTableData[currentUnitIndex].corequisite" clearable></el-input>
                            </el-form-item>
                            <p style="color: #F56C6C;font-size: 9px">{{alert_corequisite}}</p>
                            <el-form-item label="Prohibition:">
                                <el-input
                                        placeholder="Using Unit Code and (AND, OR), E.g: TEST0000 AND TEST0001"
                                        name="prohibition"
                                        @blur=checkProhibition(unitTableData[currentUnitIndex].prohibition)
                                        v-model="unitTableData[currentUnitIndex].prohibition" clearable></el-input>
                            </el-form-item>
                            <p style="color: #F56C6C;font-size: 9px">{{alert_prohibition}}</p>
                            <el-form-item label="Assumed:">
                                <el-input type="textarea"
                                          :autosize="{minRows: 1, maxRows: 10}"
                                          placeholder="Please input assumed" name="assumed"
                                          v-model.trim="unitTableData[currentUnitIndex].assumed" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="Unit Type:">
                                <el-select v-model.trim="unitTableData[currentUnitIndex].type"
                                           placeholder="Please select unit type"
                                           name="type" style="width: 100%">
                                    <el-option :value='"Core"'></el-option>
                                    <el-option :value='"Electives"'></el-option>
                                    <el-option :value='"Adv Electives"'></el-option>
                                </el-select>
                                <!--<el-input
                                         placeholder="Please input unit type" name="type"
                                         v-model.trim="unitTableData[currentUnitIndex].type" clearable></el-input>-->
                             </el-form-item>

                            <el-form-item label="Permission:">
                                <el-input
                                        placeholder="Please input permission" name="permission"
                                        v-model.trim="unitTableData[currentUnitIndex].permission" clearable></el-input>
                            </el-form-item>
                            <!--
                            <el-form-item label="Special Consideration:">
                                <el-input type="textarea"
                                          :autosize="{minRows: 1, maxRows: 10}"
                                          placeholder="Please input special consideration" name="special_consideration"
                                          v-model.trim="unitTableData[currentUnitIndex].special_consideration" clearable></el-input>
                            </el-form-item>
                            -->
                            <el-form-item label="Weekday:">
                                <el-input
                                        placeholder="Input First 3 Letters from Monday to Sunday, E.g:Mon,Wed"
                                        name="weekday"
                                        v-model.trim="weekdaystr" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="Start Time:">
                                <el-input
                                        placeholder="Please input start time" name="startTime"
                                        v-model.trim="starttimestr" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="Endtime:">
                                <el-input
                                        placeholder="Please input endtime" name="endTime"
                                        v-model.trim="endtimestr" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="unitEditOnSubmit">confirm</el-button>
                                <!-- <el-button>cancel</el-button>-->
                            </el-form-item>
                        </el-form>
                    </span>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>


    </body>
</template>

<style rel="stylesheet/scss" lang="scss">
    .el-drawer {

        overflow: scroll
    }

</style>
<style>
    @import "../assets/backStage.css";
</style>
<!-- Vue.js -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<!-- element lib -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>

<script>
    import axios from '../http'

    export default {
        name: "Admin_Index",
        data: function () {
            // var courses=[];
            axios.post("/admin/getcourses")
                .then((res) => {
                    //console.log(res.data);
                    if (res.data == "Not log in in yet") {
                        this.$router.push({path: '/adminlogin'});
                    } else {
                        this.unitTableData = this.unitTableData.concat(res.data);
                        this.showcourses = true;
                    }
                })
                .catch((err) => {
                    console.log(err)
                });

            axios.post("/admin/getmajors")
                .then((res) => {
                    //console.log(res.data);
                    this.majorTableData = this.majorTableData.concat(res.data);
                    this.showmajors = true;
                })
                .catch((err) => {
                    console.log(err)
                });

            axios.post("/admin/getcurrentadmin")
                .then((res) => {
                    var currentadmin = res.data;
                    console.log(currentadmin);
                    this.currentAdmin = currentadmin;
                    if (currentadmin == "admin") {
                        document.getElementById("adminManagement").style.visibility = "";
                    }
                    ;
                })
                .catch((err) => {
                    console.log(err);
                });

            return {
                currentAdmin: '',
                adminVisible: false,
                searchbody: {
                    type: '',
                    keyword: ''
                },
                searchvalue: '',
                searchkeyword: '',
                majorTableData: [{
                    id: '',
                    name: '',
                    core: [],
                    advElectives: [],
                    electives: [],
                    major: [],
                    major2: [{
                        name: '',
                        required: [],
                        minor: []
                    }, {
                        name: '',
                        required: [],
                        minor: []
                    }, {
                        name: '',
                        required: [],
                        minor: []
                    }]
                }],
                dialogMajorVisible: false,
                currentMajorIndex: 0,

                activeIndex: '1',
                test: 'test seccess',
                showcourses: false,
                showmajors: false,
                unitTableData: [{
                    id: '',
                    name: '',
                    outline: '',
                    semester: '',
                    credit: '',
                    prerequisite: '',
                    corequisite: '',
                    prohibition: '',
                    assumed: '',
                    type: '',
                    rating: '',
                    permission: '',
                    special_consideration: '',
                    time: [
                        {
                            weekday: '',
                            startTime: '',
                            endTime: ''
                        }
                    ]
                }],
                blankdata: [{
                    id: '',
                    name: '',
                    outline: '',
                    semester: '',
                    credit: '',
                    prerequisite: '',
                    corequisite: '',
                    prohibition: '',
                    assumed: '',
                    type: '',
                    rating: '',
                    permission: '',
                    special_consideration: '',
                    time: [
                        {
                            weekday: '',
                            startTime: '',
                            endTime: ''
                        }
                    ]
                }],
                unitiddisabled: false,
                drawer: false,
                direction: 'rtl',
                currentUnitIndex: 0,
                currentUnitPage: 1,
                weekdaystr: '',
                starttimestr: '',
                endtimestr: '',
                alert_unitcode: ' ',
                alert_prequisite: ' ',
                alert_corequisite: ' ',
                alert_prohibition: ' ',
                majorcombinelist: []
            }
        },
        methods: {
            getallcourse() {
                axios.post("/admin/getcourses")
                    .then((res) => {
                        //console.log(res.data);
                        if (res.data == "Not log in in yet") {
                            this.$router.push({path: '/adminlogin'});
                        } else {
                            this.unitTableData = this.blankdata.concat(res.data);
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            },
            expandMajors(row, expandedRows) {

            },
            adminlogout() {
                axios.post("/admin/adminlogout")
                    .then((res) => {
                        if (res.data == 'log out success')
                            this.$router.push({path: '/adminlogin'});
                    }).catch((err) => {
                    console.log(err);
                })
            },
            changeselectedunit() {
                var majorconnection1 = this.majorTableData[this.currentMajorIndex].core.concat(this.majorTableData[this.currentMajorIndex].advElectives)
                var majorcconection2 = majorconnection1.concat(this.majorTableData[this.currentMajorIndex].electives);
                var majorcombine = Array.from(new Set(majorcconection2));
                var newmajorlist = [];
                for (let i = 0; i < majorcombine.length; i++) {
                    newmajorlist = newmajorlist.concat({'id': majorcombine[i]});
                }
                this.majorcombinelist = newmajorlist;
            },
            handleMajorEdit(index, row) {
                var majorconnection1 = this.majorTableData[index].core.concat(this.majorTableData[index].advElectives)
                var majorcconection2 = majorconnection1.concat(this.majorTableData[index].electives);
                var majorcombine = Array.from(new Set(majorcconection2));
                var newmajorlist = [];
                for (let i = 0; i < majorcombine.length; i++) {
                    newmajorlist = newmajorlist.concat({'id': majorcombine[i]});
                }
                this.majorcombinelist = newmajorlist;
                this.currentEditingMajor = this.majorTableData[index].id;
                this.dialogMajorVisible = true;
                this.currentMajorIndex = index;
                //console.log(index, row);
            },
            handleMajorDelete(index, row) {
                var r = confirm("Delete This Major?\n" + this.majorTableData[index].id);
                if (r == true) {
                    axios.post('/admin/admindeletemajor', {id: this.majorTableData[index].id})
                        .then((res) => {
                            alert(res.data)
                            if (res.data == "Delete successful") {
                                this.$router.go(0);
                            }
                            if (res.data == "Not log in in yet") {
                                this.$router.push({path: '/adminlogin'});
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            addNewMajor() {
                this.dialogMajorVisible = true;
                this.currentMajorIndex = 0;
                this.majorcombinelist = [];
            },
            majorEditOnSubmit() {
                if (this.currentMajorIndex == 0) {
                    if (this.majorTableData[this.currentMajorIndex].id != null && this.majorTableData[this.currentMajorIndex].id != '') {
                        axios.post("/admin/adminaddmajor",
                            {
                                id: this.majorTableData[this.currentMajorIndex].id,
                                name: this.majorTableData[this.currentMajorIndex].name,
                                core: this.majorTableData[this.currentMajorIndex].core,
                                advElectives: this.majorTableData[this.currentMajorIndex].advElectives,
                                electives: this.majorTableData[this.currentMajorIndex].electives,
                                major: this.majorTableData[this.currentMajorIndex].major,
                                major2: [{
                                    name: this.majorTableData[this.currentMajorIndex].major2[0].name,
                                    required: this.majorTableData[this.currentMajorIndex].major2[0].required,
                                    minor: this.majorTableData[this.currentMajorIndex].major2[0].minor
                                },
                                    {
                                        name: this.majorTableData[this.currentMajorIndex].major2[1].name,
                                        required: this.majorTableData[this.currentMajorIndex].major2[1].required,
                                        minor: this.majorTableData[this.currentMajorIndex].major2[1].minor
                                    },
                                    {
                                        name: this.majorTableData[this.currentMajorIndex].major2[2].name,
                                        required: this.majorTableData[this.currentMajorIndex].major2[2].required,
                                        minor: this.majorTableData[this.currentMajorIndex].major2[2].minor
                                    }]
                            })
                            .then((res) => {
                                alert(res.data)
                                if (res.data == "Add successful") {
                                    this.$router.go(0);
                                }
                                if (res.data == "Not log in in yet") {
                                    this.$router.push({path: '/adminlogin'});
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        alert("Wrong Input.");
                    }
                } else {
                    console.log("CORE:" + this.majorTableData[this.currentMajorIndex].core);
                    if (this.majorTableData[this.currentMajorIndex].id != null && this.majorTableData[this.currentMajorIndex].id == this.currentEditingMajor) {
                        axios.post("/admin/admineditmajor",
                            {
                                id: this.majorTableData[this.currentMajorIndex].id,
                                name: this.majorTableData[this.currentMajorIndex].name,
                                core: this.majorTableData[this.currentMajorIndex].core,
                                advElectives: this.majorTableData[this.currentMajorIndex].advElectives,
                                electives: this.majorTableData[this.currentMajorIndex].electives,
                                major: this.majorTableData[this.currentMajorIndex].major,
                                major2: [{
                                    name: this.majorTableData[this.currentMajorIndex].major2[0].name,
                                    required: this.majorTableData[this.currentMajorIndex].major2[0].required,
                                    minor: this.majorTableData[this.currentMajorIndex].major2[0].minor
                                },
                                    {
                                        name: this.majorTableData[this.currentMajorIndex].major2[1].name,
                                        required: this.majorTableData[this.currentMajorIndex].major2[1].required,
                                        minor: this.majorTableData[this.currentMajorIndex].major2[1].minor
                                    },
                                    {
                                        name: this.majorTableData[this.currentMajorIndex].major2[2].name,
                                        required: this.majorTableData[this.currentMajorIndex].major2[2].required,
                                        minor: this.majorTableData[this.currentMajorIndex].major2[2].minor
                                    }]
                            })
                            .then((res) => {
                                alert(res.data)
                                if (res.data == "Edit successful") {
                                    this.$router.go(0);
                                }
                                if (res.data == "Not log in in yet") {
                                    this.$router.push({path: '/adminlogin'});
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        alert("Wrong Input.");
                    }
                }
            },
            handleClick(key, keyPath) {
                //console.log(key, keyPath);
                this.getallcourse();
            },

            unitSearch() {
                if (this.searchbody.type == '')
                    alert("Please Choose Search Type.")
                else if (this.searchbody.keyword == '')
                    alert("Please Input Keyword.")
                else {
                    axios.post('/admin/adminsearchunit', {type: this.searchbody.type, keyword: this.searchbody.keyword})
                        .then((res) => {
                            this.unitTableData = this.unitTableData.slice(0, 1).concat(res.data);
                            // this.$router.go(0);
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            handleEdit(index, row) {
                this.currentEditingCourse = this.unitTableData[index].id;
                this.drawer = true;
                this.currentUnitIndex = index + (this.currentUnitPage - 1) * 20;
                this.unitiddisabled = true;
                this.weekdaystr = '';
                this.starttimestr = '';
                this.endtimestr = '';
                for (var i = 0; i < this.unitTableData[index].time.length; i++) {
                    this.weekdaystr = this.weekdaystr + this.unitTableData[index].time[i].weekday;
                    this.starttimestr = this.starttimestr + this.unitTableData[index].time[i].startTime;
                    this.endtimestr = this.endtimestr + this.unitTableData[index].time[i].endTime;
                    if (i < this.unitTableData[index].time.length - 1) {
                        this.weekdaystr = this.weekdaystr + ',';
                        this.starttimestr = this.starttimestr + ',';
                        this.endtimestr = this.endtimestr + ',';
                    }
                }

                console.log(index, row);
            },
            handleDelete(index, row) {
                var r = confirm("Delete This Unit?\n" + this.unitTableData[index + (this.currentUnitPage - 1) * 20].id);
                if (r == true) {
                    axios.post('/admin/admindeleteunit', {id: this.unitTableData[index + (this.currentUnitPage - 1) * 20].id})
                        .then((res) => {
                            alert(res.data)
                            if (res.data == "Delete successful") {
                                this.$router.go(0);
                            }
                            if (res.data == "Not log in in yet") {
                                this.$router.push({path: '/adminlogin'});
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            handleCurrentChange(val) {
                this.currentUnitPage = val;
            },
            getCurrentUnitCode() {
            },
            addNewUnit() {
                this.drawer = true;
                this.currentUnitIndex = 0;
                this.unitiddisabled = false;
            },
            checkUnitDependencies: function (udstring) {
                var tstring = udstring;
                var inlength = tstring.length;
                var backmessage;
                var andornum = 0;
                tstring = tstring.replace(/\(/g, "");
                var inlength2 = tstring.length;
                var leftbracketnum = inlength - inlength2;
                tstring = tstring.replace(/\)/g, "");
                var rightbracketnum = inlength2 - tstring.length;
                if (leftbracketnum != rightbracketnum) {
                    backmessage = new Array(false, "Brackets are not matched")
                    return backmessage;
                } else {
                    tstring = tstring.replace(/AND/g, function () {
                        andornum++;
                        return "";
                    });
                    tstring = tstring.replace(/OR/g, function () {
                        andornum++;
                        return "";
                    });
                    var tstrsplit = tstring.split("  ");
                    if (tstrsplit.length != andornum + 1) {
                        backmessage = new Array(false, "Wrong Input about Connected Word (AND, OR).");
                        return backmessage;
                    } else {
                        for (var i = 0; i < tstrsplit.length; i++) {
                            if (!(tstrsplit[i].length == 8 && /^[a-zA-Z]+$/.test(tstrsplit[i].slice(0, 4)) && /^\d+$/.test(tstrsplit[i].slice(4, 8)))) {
                                backmessage = new Array(false, "Wrong Input about the Format of Units");
                                return backmessage;
                            }
                        }
                    }
                    backmessage = new Array(true, " ");
                    return backmessage;
                }
            },
            checkUnitForm: function (unitTableData) {
                var backmessage;
                if (unitTableData[this.currentUnitIndex].id == "" || unitTableData[this.currentUnitIndex].id == null) {
                    backmessage = new Array(false, "Please Input Unit Code.")
                    return backmessage;
                    //return [false,"Please Input Unit Code."]
                }
                if (!(unitTableData[this.currentUnitIndex].id.length == 8 &&
                    /^[a-zA-Z]+$/.test(unitTableData[this.currentUnitIndex].id.slice(0, 4)) &&
                    /^\d+$/.test(unitTableData[this.currentUnitIndex].id.slice(4, 8)))) {
                    backmessage = new Array(false, "Please Input Unit Code on Correct Type.\n 4 Letters and 4 Numbers.")
                    return backmessage;
                }
                if (isNaN(unitTableData[this.currentUnitIndex].credit)) {
                    backmessage = new Array(false, "Credit Point must be number.")
                    return backmessage;
                    //return [false,"Credit Point must be number."]
                }
                if (!((this.weekdaystr.split(",").length == this.starttimestr.split(",").length) && (this.weekdaystr.split(",").length == this.endtimestr.split(",").length))) {
                    backmessage = new Array(false, "Number of Weekday, StartTime and EndTime must be consistent.")
                    return backmessage;
                }

                //this.unitTableData[this.currentUnitIndex].id!=null && this.unitTableData[this.currentUnitIndex].id!=''
                if (unitTableData[this.currentUnitIndex].prerequisite != '' &&
                    unitTableData[this.currentUnitIndex].prerequisite != 'NONE' &&
                    unitTableData[this.currentUnitIndex].special_consideration != true) {
                    var backmessage1 = this.checkUnitDependencies(unitTableData[this.currentUnitIndex].prerequisite);
                    if (backmessage1[0] == false) {
                        backmessage1[1] = backmessage1[1] + "\n Error in: Prerequisite";
                        return backmessage1;
                    } else {
                        if (unitTableData[this.currentUnitIndex].corequisite != '' && unitTableData[this.currentUnitIndex].corequisite != 'NONE') {
                            var backmessage2 = this.checkUnitDependencies(unitTableData[this.currentUnitIndex].corequisite);
                            if (backmessage2[0] == false) {
                                backmessage2[1] = backmessage2[1] + "\n Error in:Corequisite";
                                return backmessage2;
                            } else {
                                if (unitTableData[this.currentUnitIndex].prohibition != '' && unitTableData[this.currentUnitIndex].prohibition != 'NONE') {
                                    var backmessage3 = this.checkUnitDependencies(unitTableData[this.currentUnitIndex].prohibition);
                                    if (backmessage3[0] == false) {
                                        backmessage3[1] = backmessage3[1] + "\n Error in: Prohibition";
                                        return backmessage3;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (unitTableData[this.currentUnitIndex].corequisite != '' && unitTableData[this.currentUnitIndex].corequisite != 'NONE') {
                        var backmessage2 = this.checkUnitDependencies(unitTableData[this.currentUnitIndex].corequisite);
                        if (backmessage2[0] == false) {
                            backmessage2[1] = backmessage2[1] + "\n Error in:Corequisite";
                            return backmessage2;
                        } else {
                            if (unitTableData[this.currentUnitIndex].prohibition != '' && unitTableData[this.currentUnitIndex].prohibition != 'NONE') {
                                var backmessage3 = this.checkUnitDependencies(unitTableData[this.currentUnitIndex].prohibition);
                                if (backmessage3[0] == false) {
                                    backmessage3[1] = backmessage3[1] + "\n Error in: Prohibition";
                                    return backmessage3;
                                }
                            }
                        }
                    } else {
                        if (unitTableData[this.currentUnitIndex].prohibition != '' && unitTableData[this.currentUnitIndex].prohibition != 'NONE') {
                            var backmessage3 = this.checkUnitDependencies(unitTableData[this.currentUnitIndex].prohibition);
                            if (backmessage3[0] == false) {
                                backmessage3[1] = backmessage3[1] + "\n Error in: Prohibition";
                                return backmessage3;
                            }
                        }
                    }
                }
                backmessage = new Array(true, " ")
                return backmessage;
            },
            checkUnitCode(unitcode) {
                if (unitcode == "" || unitcode == null) {
                    this.alert_unitcode = "Please Input Unit Code.";
                } else if (!(unitcode.length == 8 &&
                    /^[a-zA-Z]+$/.test(unitcode.slice(0, 4)) &&
                    /^\d+$/.test(unitcode.slice(4, 8)))) {
                    this.alert_unitcode = "Please Input 4 Letters and 4 Numbers.";
                } else {
                    this.alert_unitcode = " ";
                }
            },
            checkPrequisite(prequisite) {
                if (prequisite != '') {
                    var backmessage = this.checkUnitDependencies(prequisite);
                    var mes = backmessage[1].split(/[\n]/);
                    this.alert_prequisite = mes[0];
                }
            },
            checkCorequisite(corequisite) {
                if (corequisite != '') {
                    var backmessage = this.checkUnitDependencies(corequisite);
                    var mes = backmessage[1].split(/[\n]/);
                    this.alert_corequisite = mes[0];
                }
            },
            checkProhibition(prohibition) {
                if (prohibition != '') {
                    var backmessage = this.checkUnitDependencies(prohibition);
                    var mes = backmessage[1].split(/[\n]/);
                    this.alert_prohibition = mes[0];
                }
            },
            unitEditOnSubmit() {
                if (this.currentUnitIndex == 0) {
                    //console.log(this.unitTableData[this.currentUnitIndex].id);
                    var bm;
                    bm = this.checkUnitForm(this.unitTableData);
                    if (bm[0]) {
                        var weekdaysp = this.weekdaystr.split(",");
                        var starttimesp = this.starttimestr.split(",");
                        var endtimesp = this.endtimestr.split(",");
                        var timelist = [];
                        for (var i = 0; i < weekdaysp.length; i++) {
                            timelist[i] = {
                                weekday: weekdaysp[i],
                                startTime: starttimesp[i],
                                endTime: endtimesp[i]
                            }
                        }
                        axios.post("/admin/adminaddunit",
                            {
                                id: this.unitTableData[this.currentUnitIndex].id,
                                name: this.unitTableData[this.currentUnitIndex].name,
                                outline: this.unitTableData[this.currentUnitIndex].outline,
                                semester: this.unitTableData[this.currentUnitIndex].semester,
                                credit: this.unitTableData[this.currentUnitIndex].credit,
                                prerequisite: this.unitTableData[this.currentUnitIndex].prerequisite,
                                corequisite: this.unitTableData[this.currentUnitIndex].corequisite,
                                prohibition: this.unitTableData[this.currentUnitIndex].prohibition,
                                assumed: this.unitTableData[this.currentUnitIndex].assumed,
                                type: this.unitTableData[this.currentUnitIndex].type,
                                permission: this.unitTableData[this.currentUnitIndex].permission,
                                //special_consideration:false,
                                time: timelist
                            })
                            .then((res) => {
                                alert(res.data)
                                if (res.data == "Add successful") {
                                    this.$router.go(0);
                                }
                                if (res.data == "Not log in in yet") {
                                    this.$router.push({path: '/adminlogin'});
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        alert("Wrong Input. " + bm[1]);
                    }
                } else {
                    var bm;
                    bm = this.checkUnitForm(this.unitTableData);
                    console.log(bm[0]);
                    if (bm[0] && this.unitTableData[this.currentUnitIndex].id == this.currentEditingCourse) {
                        //console.log(this.unitTableData[this.currentUnitIndex].id);
                        var weekdaysp = this.weekdaystr.split(",");
                        var starttimesp = this.starttimestr.split(",");
                        var endtimesp = this.endtimestr.split(",");
                        var timelist = [];
                        for (var i = 0; i < weekdaysp.length; i++) {
                            timelist[i] = {
                                weekday: weekdaysp[i],
                                startTime: starttimesp[i],
                                endTime: endtimesp[i]
                            }
                        }
                        axios.post("/admin/admineditunit",
                            {
                                id: this.unitTableData[this.currentUnitIndex].id,
                                name: this.unitTableData[this.currentUnitIndex].name,
                                outline: this.unitTableData[this.currentUnitIndex].outline,
                                semester: this.unitTableData[this.currentUnitIndex].semester,
                                credit: this.unitTableData[this.currentUnitIndex].credit,
                                prerequisite: this.unitTableData[this.currentUnitIndex].prerequisite,
                                corequisite: this.unitTableData[this.currentUnitIndex].corequisite,
                                prohibition: this.unitTableData[this.currentUnitIndex].prohibition,
                                assumed: this.unitTableData[this.currentUnitIndex].assumed,
                                type: this.unitTableData[this.currentUnitIndex].type,
                                permission: this.unitTableData[this.currentUnitIndex].permission,
                                //special_consideration:false,
                                time: timelist
                            })
                            .then((res) => {
                                alert(res.data)
                                if (res.data == "Edit successful") {
                                    this.$router.go(0);
                                }
                                if (res.data == "Not log in in yet") {
                                    this.$router.push({path: '/adminlogin'});
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        if (bm[1] != "")
                            alert("Wrong Input. " + bm[1]);
                        else
                            alert("Unit Code cannot be changed.");
                    }
                }
            }
        }
    }
</script>