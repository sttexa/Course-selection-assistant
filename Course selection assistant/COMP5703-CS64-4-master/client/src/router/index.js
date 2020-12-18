import Vue from 'vue'
import Router from 'vue-router'
import findCourse from "../components/findCourse";
import Student_Login from "../components/Student_Login";
import Student_Signup from "../components/Student_Signup";
import Student_Profile from "../components/Student_Profile";
import addCourseStudied from "../components/addCourseStudied";
import Admin_Login from "../components/Admin_Login";
import Admin_Index from "../components/Admin_Index";
import Admin_Signup from "../components/admin_signup";

Vue.use(Router)

const router = new Router(
    {
        mode: 'history',
        routes: [
            {
                path: '/',
                name: 'home',
                redirect: '/course',
            },
            {
                path: '/course',
                name: 'course',
                component: findCourse,
            },
            {
                path: '/login',
                name: 'student_login',
                component: Student_Login,
            },
            {
                path: '/sign_up',
                name: 'student_sign_up',
                component: Student_Signup,
            },
            {
                path: '/profile',
                name: 'student_profile',
                component: Student_Profile,
            },
            {
                path: "/add-studied-course",
                name: "add_studied",
                component: addCourseStudied
            },
            {
                path: "/main_page",
                name: "main_page",
                component: findCourse,
            },
            {
                path: '/adminlogin',
                name: 'admin_login',
                component: Admin_Login,
            },
            {
                path: '/adminindex',
                name: 'admin_index',
                component: Admin_Index,
            },
            {
                path: '/adminsignup',
                name: 'admin_signup',
                component: Admin_Signup,
            }

        ]
    }
)

export default router