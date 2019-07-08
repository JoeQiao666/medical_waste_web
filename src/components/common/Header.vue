<template>
    <div>
        <div class="header">
            <div class="logo" @click="goIndex" >
            <!-- <img src="../../assets/img/logo.png" alt=""> -->
                医疗废物管理系统
            </div>
            <div class="header-right">
                <div class="header-user-con">
                    <div style="    font-size: 17px;">{{cName}}</div>
                    <!-- 全屏显示 -->
                    <div class="btn-fullscreen" @click="handleFullScreen">
                        <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                            <i class="el-icon-rank"></i>
                        </el-tooltip>
                    </div>
                    <!-- 用户头像 -->
                    <div class="user-avator"><img src="../../assets/img/img.jpg"></div>
                    <!-- 用户名下拉菜单 -->
                    <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{username}} <i class="el-icon-caret-bottom"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item divided  command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
         <!-- 编辑弹出框 -->
        <el-dialog title="修改密码" :visible.sync="editVisible" width="35%"  >
            <el-form ref="ruleForm"  :model="ruleForm"  :rules="rules" label-width="120px"   >
                <el-form-item label="旧密码" prop="old" required>
                    <el-input v-model="ruleForm.old"  ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new1" required>
                    <el-input v-model="ruleForm.new1"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="new2" required>
                    <el-input v-model="ruleForm.new2"  ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer"  >
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        inject:['reload'],
        data() {
            return {
                collapse: false,
                fullscreen: false,
                editVisible:false,
                name: 'linxin',
                cName:'赛虹桥社区卫生服务中心',
                ruleForm:{
                    old:'',
                    new1:'',
                    new2:'',
                },
                rules: {
                    old: [
                        { required: true, message: '请输入旧密码' }
                    ],
                    new11: [
                        { required: true, message: '请输入新密码' }
                    ],
                    new2: [
                        { required: true, message: '请确认新密码' }
                    ]
                },
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }else if(command == 'password'){
                    this.editVisible=true;
                }
            },
            // 点击logo调回首页
            goIndex(){
                    this.$router.push('/');
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.add()
                    } else {
                        return false;
                    }
                });
            },
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        font-size: 20px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 50px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 50px;
        padding-left:20px;
        cursor: pointer;
    }
    .header .logo img{
        width:30px;
        vertical-align: middle;
        transform: translateY(-2px);
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 50px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
        margin-bottom: -4px;
         margin-left: 8px;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 8px;
    }
    .user-avator img{
        display: block;
        width:30px;
        height:30px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
