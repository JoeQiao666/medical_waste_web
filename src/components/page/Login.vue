<template>
    <div class="login-wrap">
        <div class="ms-login" v-if="!findPass">
            <div class="ms-title">{{web}}</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <div class="pointer" @click="findPass = true" style="font-size:12px" >忘记密码?</div> -->
            </el-form>
        </div>
        <div class="ms-login" v-if="findPass" > 
            <div class="ms-title">找回密码</div>
            <el-form :model="ruleForm" :rules="rules2" ref="ruleForms" label-width="0px" class="ms-content">
                <el-form-item prop="email">
                    <el-input v-model="ruleForm.email" placeholder="请输入邮箱">
                        <el-button slot="prepend" icon="el-icon-takeaway-box"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForms('ruleForm')">发送</el-button>
                </div>
                <div class="pointer" @click="findPass = false" style="font-size:12px" >直接登陆</div>
            </el-form>
        </div>
    </div>
</template>

<script>
   
    export default {
        data: function(){
            return {
                findPass:false,
                web:'',
                ruleForm: {
                    username: '',
                    password: ''
                },
                ruleForms:{
                    email:''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                rules2: {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            submitForm(formName) {
                var that=this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                           this.$axios({
                                method:'post',
                                url:'/platform/login/doLogin',
                                data:this.$qs.stringify({ 
                                    username:this.ruleForm.username,
                                    password:this.ruleForm.password
                                })
                            }).then((response) =>{    
                                if(response.data.code==0){
                                    localStorage.setItem('ms_username',response.data.data.username);
                                    if(response.data.data.permission){
                                         localStorage.setItem('permission',response.data.data.permission);
                                         localStorage.setItem('departmentName',response.data.data.departmentName);
                                        this.$router.push('/');
                                    }else{
                                         this.$message('没有访问权限');
                                    }
                                
                                }else{
                                    this.$message.error(response.data.msg);
                                }     
                               
                            }).catch((error) =>{
                                console.log(error)    
                            })
                       
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitForms(formName){

            }
        },
        mounted(){
            this.$axios({
                method:'get',
                url:'/platform/hospital/name/data',
            }).then((res) =>{
                if(res.status==200){
                    localStorage.hospital=res.data.data[0].hospital;
                    localStorage.web=res.data.data[0].web;
                    this.web=res.data.data[0].web;
                }else{
                    this.$message.error(res.data.msg);
                }
            }).catch((error) =>{
                console.log(error)    
            })
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>