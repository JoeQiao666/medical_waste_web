<template>
    <div class="sidebar">
         <!-- 折叠按钮 -->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <div class="collapse-btn" @click="collapseChage">
               <i class="el-icon-menu"></i>
            </div>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <img :src="item.icon" alt="">
                            <!-- <i :class="item.icon"></i> -->
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title"> <i :class="subItem.icon"></i><span slot="title">{{subItem.title }}</span></template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                  {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                               <i :class="subItem.icon"></i><span slot="title"> {{ subItem.title }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <img :src="item.icon" alt="">
                        <!-- <i :class="item.icon"></i> -->
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                menus:[],
                collapse: false,
                items: [
                    {
                        icon: require('../../assets/img/home.png'),
                        index: '/index',
                        title: '首页',
                        subs: [
                            {
                                index: '/index',
                                icon: 'fa fa-dot-circle-o',
                                title: '首页'
                            }
                            ]
                    },
                    {
                        icon: require('../../assets/img/chart.png'),
                        index: '/allCount',
                        title: '统计分析',
                        subs: [
                            {
                                index: '/allCount',
                                icon: 'fa fa-dot-circle-o',
                                title: '总量统计'
                            },
                            {
                                index: '/officeCount',
                                icon: 'fa fa-dot-circle-o',
                                title: '科室统计'
                            },
                            {
                                index: '/putCount',
                                icon: 'fa fa-dot-circle-o',
                                title: '入库统计'
                            },
                            {
                                index: '/outCount',
                                icon: 'fa fa-dot-circle-o',
                                title: '出库统计'
                            }
                            ]
                    },
                    {
                        icon: require('../../assets/img/qrcode.png'),
                        index: '/traceCode',
                        title: '溯源码',
                        subs: [
                            {
                                index: '/traceCode',
                                icon: 'fa fa-dot-circle-o',
                                title: '溯源码列表'
                            },
                            // {
                            //     index: '/codeAnalyze',
                            //     icon: 'fa fa-dot-circle-o',
                            //     title: '溯源码统计分析'
                            // }
                            ]
                    },
                    {
                        icon: require('../../assets/img/user.png'),
                        index: '/recycleList',
                        title: '角色管理',
                        subs: [
                            {
                                index: '/recycleList',
                                icon: 'fa fa-dot-circle-o',
                                title: '回收公司列表'
                            },
                            {
                                index: '/jobList',
                                icon: 'fa fa-dot-circle-o',
                                title: '岗位列表'
                            },
                            {
                                index: '/officeEdit',
                                icon: 'fa fa-dot-circle-o',
                                title: '科室编辑'
                            },
                            {
                                index: '/personEdit',
                                icon: 'fa fa-dot-circle-o',
                                title: '人员编辑'
                            },
                            ]
                    },
                    {
                        icon: require('../../assets/img/setting.png'),
                        index: '/operate',
                        title: '系统管理',
                        subs: [
                            {
                                index: '/operate',
                                icon: 'fa fa-dot-circle-o',
                                title: '补操作'
                            },
                            {
                                index: '/unNormal',
                                icon: 'fa fa-dot-circle-o',
                                title: '异常记录'
                            },
                            {
                                index: '/carList',
                                icon: 'fa fa-dot-circle-o',
                                title: '车辆管理'
                            },
                            {
                                index: '/warnValue',
                                icon: 'fa fa-dot-circle-o',
                                title: '警戒值'
                            },
                            {
                                index: '/nameSet',
                                icon: 'fa fa-dot-circle-o',
                                title: '名称设置'
                            },
                            ]
                    },
                ],
            }
        },
        computed:{
            onRoutes(){
                // return this.$route.path.replace('/','');
                return this.$route.path;
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            // this.getMenu()
        },
         methods: {
               getMenu(){
                    this.$axios({
                        method:'get',
                        url:'/api/menu/list',
                        data:{
                        }
                    }).then((res) =>{
                        if(res.data.code==200){
                            
                            if(res.data.data){
                    
                                this.setMenu(JSON.parse(res.data.data))
                            }else{
                                this.menus=this.items
                            }
                        }else{
                            // this.$message.error(res.data.msg);
                        }
                    }).catch((error) =>{
                        console.log(error)    
                    })
                },
                 // 侧边栏折叠
                collapseChage(){
                    this.collapse = !this.collapse;
                    bus.$emit('collapse', this.collapse);
                },
         }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 50px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 220px;
    }
    .sidebar > ul {
        height:100%;
    }
     .collapse-btn{
        text-align: right;
        color: #fff;
        cursor: pointer;
        font-size: 24px;
        padding-right: 19px;
        line-height: 50px;
    }
    .fa{
        margin-right: 8px;
        font-size:17px
    }
    .el-submenu__title img,.el-menu-item img{
        display: inline-block;
        width: 17px;
        height: 17px;
        margin-right: 5px;
        transform: translateY(-1px);
    }
</style>
