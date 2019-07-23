<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="borderBox">
        <div class="flex headSelect" style="margin-bottom:10px;">
          <div class="flex">
            <img class="titleIcon" src="../../../assets/img/form.png" alt />
            <div style="margin-top: -4px;">回收车列表</div>
          </div>

          <div class="flex funcHead">
            <div class="block">
              <span class="demonstration" style="margin-left:10px" >回收车名称：</span>
              <el-input style="width:140px" v-model="kName" placeholder="请输入回收车名称"></el-input>
            </div>
            <el-button
              style="margin-left:10px"
              @click="getData"
              type="primary"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button
              style="margin-left:10px"
              @click="openAdd(1)"
              type="primary"
              icon="el-icon-plus"
              v-if="permission=='修改'"
            >新增</el-button>
          </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
          >
          <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
          <el-table-column prop="name"  label="回收车名称" align="center" ></el-table-column>
          <el-table-column prop="weight"  label="回收车重量" align="center" ></el-table-column>
          <el-table-column prop="username"  label="回收员姓名" align="center"  ></el-table-column>
          <el-table-column  label="操作" width="100px" align="center" > 
                <template slot-scope="scope">
                        <span class="pointer"  v-if="permission=='修改'"  @click="detials(scope.$index, scope.row)">编辑</span>
                        <span class="pointer"  v-if="permission=='修改'" style="margin-left:10px"  @click="deal(scope.$index, scope.row)">删除</span>
                 </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="mTitle" :visible.sync="editVisible" width="40%"  >
        <el-form ref="ruleForm"  :model="ruleForm"  :rules="rules" label-width="120px" v-loading="loading1"  >
            <el-form-item label="回收车名称：" prop="name" required>
                  <el-input v-model="ruleForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="回收车重量：" prop="weight" required>
                  <el-input v-model="ruleForm.weight" ></el-input>
            </el-form-item>
            <el-form-item label="绑定回收员：" prop="recyclerId" required>
                  <el-select style="width:100%" v-model="ruleForm.recyclerId" placeholder="请选择角色">
                     <el-option
                      v-for="item in options1"
                      :key="item.id"
                      :label="item.username"
                       :value="item.id"
                      >
                    </el-option>
                  </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer"  >
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
const moment = require("moment");
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      delVisible: false,
      permission:false,
      kName:'',
      mTitle:'新增',
      tableData: [
        {
          id: 1,
          name: "赛虹桥回收车",
          username: "垃圾回收员",
          weight:12.1
        }
      ],
      total: 0,
      cur_page: 1,
      editVisible:false,
      ruleForm:{
        name:'',
        recyclerId:'',
        weight:""
      },
      rules: {
          name: [
              { required: true, message: '请输入回收车名称' }
          ],
          recyclerId: [
              { required: true, message: '请选择' }
          ],
          weight: [
              { required: true, message: '请输入回收车重量' }
          ],
      },
      options1:[

      ]
    };
  },
  methods: {
    // 点击切换页码
    handleCurrentChange(val) {
      this.cur_page = val;
      // this.getTask();
    },
    // 查询
    search() {
      console.log(this.date);
    },
    openAdd(type,row){
       if(type==1){
        this.mTitle='新增';
        this.ruleForm={
             name:'',
             roleName:''
        };
        if(this.$refs['ruleForm']){
           this.$refs['ruleForm'].resetFields();
        }
      }else{
        this.mTitle='详情';
        var form=this.ruleForm;
        for(var key in row){
          form[key]=row[key]
        }
        this.ruleForm=form;
      }
      this.editVisible=true;
    },
    detials(index,row){
      this.openAdd(2,row);
    },
    // 保存编辑
    saveEdit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.mTitle=='新增'){
                this.add()
              }else{
                this.edit()
              }
            } else {
                return false;
            }
        });
    },
     // 编辑
    edit(){
        this.loading1=true;
        this.$axios({
              method:'put',
              url:'/platform/hospital/car/editDo',
              data:this.ruleForm
          }).then((res) =>{
              if(res.data.code==0){
                  this.loading1=false;
                  this.editVisible = false;
                  this.getData()
              }else{
                  this.$message.error(res.data.msg);
              }
          }).catch((error) =>{
              console.log(error)    
        })
    },
    // 添加
    add(){
        this.loading1=true;
        this.$axios({
              method:'post',
              url:'/platform/hospital/car/addDo',
              data:this.ruleForm
          }).then((res) =>{
              if(res.data.code==0){
              this.loading1=false;
              this.editVisible = false;
              this.$message.success('添加成功');
              this.getData()
              }else{
                  this.$message.error(res.data.msg);
              }
          }).catch((error) =>{
              console.log(error)    
          })
    },
    // 删除数据
    deleteRow(){
      this.$axios({
            method:'DELETE',
            url:'/platform/hospital/car/delete?ids='+this.id,
        }).then((res) =>{
            if(res.status==200){
                this.$message.success('删除成功');
                this.delVisible=false;
                this.getData();
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
      })
    },
    deal(index,row){
      this.id=row.id;
      this.delVisible=true;
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
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/car/listPage?pageNumber='+this.cur_page+'&pageSize=10&name='+this.kName,
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
    this.getPerson();
    this.getData()
  }
};
</script>


<style scoped>
.cloudBox > div {
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 300px;
  position: relative;
}

</style>

