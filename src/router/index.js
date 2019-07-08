import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '华数网管系统' },
            children:[
                {
                    path: '/index',
                    component: resolve => require(['../components/page/index/index.vue'], resolve),
                    meta: { title: '首页' }
                },
                {
                    path: '/allCount',
                    component: resolve => require(['../components/page/allCount/allCount.vue'], resolve),
                    meta: { title: '总量统计' }
                },
                {
                    path: '/officeCount',
                    component: resolve => require(['../components/page/officeCount/officeCount.vue'], resolve),
                    meta: { title: '科室统计' }
                },
                {
                    path: '/putCount',
                    component: resolve => require(['../components/page/putCount/putCount.vue'], resolve),
                    meta: { title: '入库统计' }
                },
                {
                    path: '/outCount',
                    component: resolve => require(['../components/page/outCount/outCount.vue'], resolve),
                    meta: { title: '出库统计' }
                },
                {
                    path: '/traceCode',
                    component: resolve => require(['../components/page/traceCode/traceCode.vue'], resolve),
                    meta: { title: '溯源码申请' }
                },
                {
                    path: '/codeAnalyze',
                    component: resolve => require(['../components/page/codeAnalyze/codeAnalyze.vue'], resolve),
                    meta: { title: '溯源码统计分析' }
                },
                {
                    path: '/recycleList',
                    component: resolve => require(['../components/page/recycleList/recycleList.vue'], resolve),
                    meta: { title: '回收公司列表' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
