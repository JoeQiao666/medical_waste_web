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
                    <el-form-item label="科室：" prop="office" required>
                         <el-select style="width:100%" v-model="ruleForm.office" placeholder="请选择科室">
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
                    <el-form-item label="类型：" prop="type" required>
                         <el-select style="width:100%" v-model="ruleForm.type" placeholder="请选择类型">
                            <el-option
                              v-for="item in types"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="产生时间" prop="time" required>
                          <el-date-picker
                            style="width:100%"
                            v-model="ruleForm.time"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                    </el-form-item>
                    <el-form-item label="回收员：" prop="p1" required>
                         <el-select style="width:100%" v-model="ruleForm.p1" placeholder="请选择类型">
                            <el-option
                              v-for="item in types"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="交接人：" prop="p2" required>
                         <el-select style="width:100%" v-model="ruleForm.p2" placeholder="请选择类型">
                            <el-option
                              v-for="item in types"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              >
                            </el-option>
                          </el-select>
                    </el-form-item>
               </el-form>
               <el-button type="primary" style="margin:30px auto 0;display: block;" >确认新增</el-button>
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
                prop="time"
                align="center"
                label="产生时间">
              </el-table-column>
                <el-table-column
                prop="type"
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
                prop="name"
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
                <el-button @click="addIn(1)" type="primary">全部入库</el-button>
                <el-button @click="addIn(1)" type="primary">确认入库</el-button>
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
      activeName: "1",
      total:0,
      cur_page:1,
      chooseIds:[],
      tableData:[
       {id:1,time:'2018-01-12 10:12:11',type:'xx型',weight:12.11,name:'输液大厅'}
      ],
      total:0,
      cur_page:1,
      office:[
      ],
      types:[
      ],
      ruleForm:{
          office:'',
          weight:'',
          type:'',
          time:'',
      },
      rules: {
        office: [
            { required: true, message: '请选择科室' }
        ],
        weight: [
            { required: true, message: '请输入重量' }
        ],
        type: [
            { required: true, message: '请选择类型' }
        ],
        time: [
            { required: true, message: '请输入时间' }
        ],
      }
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
     // 点击切换页码
    handleCurrentChange(val){
          this.cur_page = val;
          this.getData()
    },
    handleSelectionChange(){
       var arr=val.map((ele)=>{
         return ele.id
       })
       this.chooseIds=arr;
    },
    add(){
        this.loading=true;
        this.$axios({
            method:'post',
            url:'/platform/hospital/rubbish/addDo',
            data:this.ruleForm
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
    // 补入库
    addIns(){
        this.loading=true;
        this.$axios({
            method:'put',
            url:'/platform/hospital/rubbish/store?ids='+this.ids,
        }).then((res) =>{
            if(res.status==200){
                this.loading=false;
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
          this.chooseIds=arr;
        }
        this.addIns();
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/position/listPage?pageNumber='+this.cur_page+'&pageSize=10&name='+this.kName,
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
    this.getDepartment()
    this.getType()
  }
};
</script>


<style scoped>
 .new /deep/ .el-form-item{
   margin-bottom: 24px;
 }
</style>
