import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import 'font-awesome/css/font-awesome.css'
import 'animate.css'
import axios from 'axios'
import E from 'wangeditor'
import 'lodash'
import moment from 'moment'
import Cookies from 'js-cookie'
import echarts from 'echarts'
import {Message} from 'element-ui';

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.echarts = echarts;
Vue.prototype.moment = moment;
Vue.prototype.E = E;

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (Cookies.get('token')) {
            next();
        } else {
            Message.warning('请先登录');
            next({
                path: '/login'
            });
        }
    } else {
        next();
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
