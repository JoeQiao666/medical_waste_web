<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            名称设置
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </div>
    <div class="container">
      <div v-loading="loading" >
        <el-form ref="ruleForm" class="new"  style="width:60%;margin:auto" :model="ruleForm"  :rules="rules" label-width="240px"   >
            <el-form-item label="医院名称：" prop="name1" required>
                    <el-input style="width:200px"   v-model="ruleForm.name1" ></el-input>
            </el-form-item>
            <el-form-item label="后台名称：" prop="name2" required>
                    <el-input style="width:200px"    v-model="ruleForm.name2" ></el-input>
            </el-form-item>
            <el-form-item label="PDA平台名称：" prop="name3" required>
                    <el-input style="width:200px"    v-model="ruleForm.name3" ></el-input>
            </el-form-item>
        </el-form>
        <div align="center" >
        <el-button type="primary"  v-if="permission=='修改'" @click="save">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      permission:false,
      types:[
        {id:1,name:'感染型'},
        {id:2,name:'损伤型'},
        {id:3,name:'病理型'},
      ],
      id:'',
      ruleForm:{
        name1: "",
        name2: "",
        name3: "",
      },
      rules: {
        name1: [
            { required: true, message: '医院名称' }
        ],
        name2: [
            { required: true, message: '后台名称' }
        ],
        name3: [
            { required: true, message: 'PDA平台名称' }
        ],
      },
    }
  },
  methods: {
    save(){
       this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                this.add()
            } else {
                return false;
            }
        });
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/name/data',
        }).then((res) =>{
            if(res.status==200){
                this.loading=false;
                this.data=res.data.data[0];
                this.ruleForm.name1=this.data.hospital;
                this.ruleForm.name2=this.data.client;
                this.ruleForm.name3=this.data.web;
                this.id=this.data.id;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    add(){
        this.loading=true;
        this.$axios({
            method:'put',
            url:'/platform/hospital/name/editDo',
            data:{
                id:this.id,
                hospital:this.ruleForm.name1,
                client:this.ruleForm.name2,
                web:this.ruleForm.name3,
            }
        }).then((res) =>{
            if(res.status==200){
                 this.loading=false;
                 this.$message.success(res.data.msg);
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
  },
  mounted() {
    this.permission=localStorage.permission;
    this.getData()
  }
};
</script>


<style scoped>
 .new /deep/ .el-form-item{
   margin-bottom: 24px;
 }
</style>
