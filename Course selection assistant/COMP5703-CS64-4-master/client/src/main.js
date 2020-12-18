import Vue from 'vue'
import App from './App.vue'
import axios from './http';
import router from './router/index'
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import VueSimpleAlert from "vue-simple-alert";

Vue.use(ElementUI, {locale});
Vue.use(VueSimpleAlert)
Vue.config.productionTip = false

new Vue({
    router,
    axios,
    render: h => h(App),
}).$mount('#app')

