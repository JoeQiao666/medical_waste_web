<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            补操作
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </div>
    <div class="container">
      <div v-loading="loading" >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="补新增" name="1">
               <el-form ref="ruleForm" class="new"  style="width:50%;margin:auto" :model="ruleForm"  :rules="rules" label-width="120px"   >
                    <el-form-item label="科室：" prop="departmentId" required>
                         <el-select style="width:100%" v-model="ruleForm.departmentId" placeholder="请选择科室">
                            <el-option
                              v-for="item in office"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="重量(KG)" prop="weight" required>
                          <el-input v-model="ruleForm.weight" type="number"  ></el-input>
                    </el-form-item>
                    <el-form-item label="类型：" prop="typeId" required>
                         <el-select style="width:100%" v-model="ruleForm.typeId" placeholder="请选择类型">
                            <el-option
                              v-for="item in types"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="产生时间" prop="opAt" required>
                          <el-date-picker
                            style="width:100%"
                            v-model="ruleForm.opAt"
                            value-format="timestamp"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                    </el-form-item>
                    <el-form-item label="回收员：" prop="recyclerId" required>
                         <el-select style="width:100%" v-model="ruleForm.recyclerId" placeholder="请选择类型">
                            <el-option
                              v-for="item in options1"
                              :key="item.id"
                              :label="item.username"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="交接人：" prop="staffId" required>
                         <el-select style="width:100%" v-model="ruleForm.staffId" placeholder="请选择类型">
                            <el-option
                              v-for="item in options2"
                              :key="item.id"
                              :label="item.username"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
               </el-form>
               <el-button type="primary"  v-if="permission=='修改'" @click="add" style="margin:30px auto 0;display: block;" >确认新增</el-button>
          </el-tab-pane>
          <el-tab-pane label="补入库" name="2">
              <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading2"
              @selection-change="handleSelectionChange"
              >
              <el-table-column
               type="selection"
               width="50">
              </el-table-column>
              <el-table-column
                prop="opAt"
                align="center"
                :formatter="formatter"
                label="产生时间">
              </el-table-column>
                <el-table-column
                prop="typeName"
                align="center"
                sortable
                label="类型"
              >
              </el-table-column>
              <el-table-column
                prop="weight"
                align="center"
                sortable
                label="重量"
              >
              </el-table-column>
              <el-table-column
                prop="departmentName"
                align="center"
                sortable
                label="科室"
              >
              </el-table-column>
         
              </el-table>
              <div class="pagination">
                  <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total">
                  </el-pagination>
              </div>

              <div align="center" >
                <el-button  v-if="permission=='修改'" @click="addIn(1)" type="primary">全部入库</el-button>
                <el-button  v-if="permission=='修改'" @click="addIn(2)" type="primary">确认入库</el-button>
              </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      permission:false,
      activeName: "1",
      total:0,
      cur_page:1,
      chooseIds:[],
      tableData:[
      //  {id:1,time:'2018-01-12 10:12:11',type:'xx型',weight:12.11,name:'输液大厅'}
      ],
      total:0,
      cur_page:1,
      office:[],
      types:[],
      options1:[],
      options2:[],
      ruleForm:{
          departmentId:'',
          weight:'',
          typeId:'',
          opAt:'',
          recyclerId:'',
          staffId:'',
      },
      rules: {
        departmentId: [
            { required: true, message: '请选择科室' }
        ],
        weight: [
            { required: true, message: '请输入重量' }
        ],
        typeId: [
            { required: true, message: '请选择类型' }
        ],
        opAt: [
            { required: true, message: '请输入时间' }
        ],
        recyclerId: [
            { required: true, message: '请选择' }
        ],
        staffId: [
            { required: true, message: '请选择' }
        ],
      },
    }
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
          this.getData()
       }else{
       
      
       }
    },
    formatter(row){
        return moment(row.opAt).format('YYYY-MM-DD')
    },
     // 点击切换页码
    handleCurrentChange(val){
          this.cur_page = val;
          this.getData()
    },
    handleSelectionChange(val){
       var arr=val.map((ele)=>{
         return ele.id
       })
       this.chooseIds=arr.join(',');
       console.log(this.chooseIds)
    },
    add(){
        this.loading=true;
        this.$axios({
            method:'post',
            url:'/platform/hospital/rubbish/addDo',
            data:this.ruleForm
        }).then((res) =>{
            if(res.status==200){
                this.$message.success('操作成功！');
                this.loading=false;
                this.ruleForm={
                    departmentId:'',
                    weight:'',
                    typeId:'',
                    opAt:'',
                    recyclerId:'',
                    staffId:'',
                }
              this.$refs['ruleForm'].resetFields();
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    getDepartment(){
         this.$axios({
            method:'get',
            url:'/platform/hospital/department/data',
        }).then((res) =>{
            if(res.status==200){
                this.office=res.data.data;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    getType(){
        this.$axios({
            method:'get',
            url:'/platform/hospital/type/data',
        }).then((res) =>{
            if(res.status==200){
               this.types=res.data.data;
            }else{
               this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)
        })
    },
    getPerson(){
        this.$axios({
            method:'get',
            url:'/platform/sys/user/data?roleId=1',
        }).then((res) =>{
            if(res.status==200){
                this.options1=res.data;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
        this.$axios({
            method:'get',
            url:'/platform/sys/user/data?roleId=0',
        }).then((res) =>{
            if(res.status==200){
                this.options2=res.data;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    // 补入库
    addIns(){
        this.loading=true;
        this.$axios({
            method:'put',
            url:'/platform/hospital/rubbish/store?ids='+this.chooseIds,
        }).then((res) =>{
            if(res.status==200){
                 this.loading=false;
                 this.$message.success(res.data.msg);
                 this.getData();
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    addIn(t){
        if(t==1){
           var arr=this.tableData.map((ele)=>{
            return ele.id
          })
          this.chooseIds=arr.join(',');
        }
        this.addIns();
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/rubbish/listPage?isBottle=true&pageNumber='+this.cur_page+'&pageSize=10&status=0',
        }).then((res) =>{
            if(res.status==200){
                this.loading=false;
                this.tableData=res.data.list;
                this.total=res.data.totalCount;
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
    this.getDepartment()
    this.getType()
    this.getPerson()
  }
};
</script>


<style scoped>
 .new /deep/ .el-form-item{
   margin-bottom: 24px;
 }
</style>
