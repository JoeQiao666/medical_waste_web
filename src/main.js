import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './components/common/directives';
import 'font-awesome/css/font-awesome.min.css' 

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
// axios.defaults.baseURL = 'http://118.31.43.19:8080';

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         next();
//     }
// })

axios.interceptors.request.use( 
    config => { 
    config.headers['X-Requested-With']='XMLHttpRequest';
return config 
    },function(error){ 
return Promise.reject(error) 
    } 
) 
axios.interceptors.response.use(function (response) { 
// token 已过期，重定向到登录页面
if (response.data.msg == '登录失效'){ 
    router.replace({ 
                    path: '/login', 
                }) 
} 
return response 
}, function (error) { 
// Do something with response error
return Promise.reject(error) 
}) 


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')