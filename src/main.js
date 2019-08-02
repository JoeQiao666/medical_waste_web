import 'babel-polyfill'
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