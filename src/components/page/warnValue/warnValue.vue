<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            警戒值
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </div>
    <div class="container">
      <div v-loading="loading" >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="重量误差" name="1">
               <el-form ref="ruleForm" class="new"  style="width:60%;margin:auto" :model="ruleForm"  :rules="rules" label-width="240px"   >
                    <el-form-item label="请输入警戒线值：" >
                        <div>
                              <el-radio v-model="type" label="1">数值(KG)</el-radio>
                              <el-radio v-model="type" label="2">百分比(%)</el-radio>
                        </div>
                        <div> <el-input style="width:200px" @change='inputChange' v-model="ruleForm.inputVal" ></el-input></div>
                        <div style="color:red" >当前重量警戒值：1KG</div>
                    </el-form-item>
               </el-form>
               <el-button type="primary" style="margin:30px auto 0;display: block;"  v-if="permission=='修改'"  @click="save">保存</el-button>
          </el-tab-pane>
          <el-tab-pane label="出库时间" name="2">
              <el-form ref="ruleForm2" class="new"  style="width:60%;margin:auto" :model="ruleForm2"  :rules="rules2" label-width="240px"   >
                    <el-form-item label="请输入出库时间(小时)：" prop="inputVal" required>
                         <el-input style="width:200px"  @change='inputChange2' type="number" v-model="ruleForm2.inputVal" ></el-input>
                         <div style="color:red" >国家标准为48小时之内出库</div>
                    </el-form-item>
               </el-form>
              <div align="center" >
                <el-button type="primary"  v-if="permission=='修改'" @click="save2">保存</el-button>
              </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      permission:false,
      activeName: "1",
      type:'1',
      types:[
        {id:1,name:'感染型'},
        {id:2,name:'损伤型'},
        {id:3,name:'病理型'},
      ],
      ruleForm:{
        inputVal: "",
      },
      ruleForm2:{
        inputVal: "",
      },
      rules: {
        inputVal: [
            { required: true, message: '请输入数值' }
        ],
      },
      rules2: {
        inputVal: [
            { required: true, message: '请输入数值' }
        ],
      },
    }
  },
  watch:{
    type:function(val){
        if(val==1){
          this.ruleForm.inputVal=this.data.weight
        }else{
          this.ruleForm.inputVal=this.data.percent
        }
    }
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){

       }else{
        //  this. this.getData()
       }
    },
    inputChange(e){
      if(this.type==1){
        this.data.weight=e;
      }else{
        this.data.percent=e;
      }
    },
    inputChange2(e){
        this.data.time=e;
    },
    save(){
       this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                this.add()
            } else {
                return false;
            }
        });
    },
    save2(){
       this.$refs['ruleForm2'].validate((valid) => {
            if (valid) {
                // this.add()
            } else {
                return false;
            }
        });
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/alert/data',
        }).then((res) =>{
            if(res.status==200){
                this.loading=false;
                this.data=res.data.data[0];
                this.ruleForm.inputVal=this.data.weight;
                this.ruleForm2.inputVal=this.data.time;
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
            url:'/platform/hospital/alert/editDo',
            data:this.data
        }).then((res) =>{
            if(res.status==200){
                 this.loading=false;
                 this.$message.success(res.data.msg);
                //  this.getData();
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
