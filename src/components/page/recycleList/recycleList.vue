<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 角色管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>回收公司列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="borderBox">
        <div class="flex headSelect" style="margin-bottom:10px;">
          <div class="flex">
            <img class="titleIcon" src="../../../assets/img/form.png" alt />
            <div style="margin-top: -4px;">回收公司列表</div>
          </div>

          <div class="flex funcHead">
            <div class="block">
              <span class="demonstration" style="margin-left:10px" >公司名称：</span>
              <el-input style="width:140px" v-model="kName" placeholder="请输入公司名称"></el-input>
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
            >新增</el-button>
          </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
          >
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="name"  label="回收公司名称"></el-table-column>
          <el-table-column prop="telephone"  label="回收公司电话" width="150px" ></el-table-column>
          <el-table-column prop="chargeName"  label="负责人姓名" width="140px" ></el-table-column>
          <el-table-column prop="chargePhone" label="负责人电话" width="140px"  ></el-table-column>
          <el-table-column prop="address" label="地址" ></el-table-column>
          <el-table-column  label="操作" width="100px">
                <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row)">详情</span>
                        <span class="pointer" style="margin-left:10px"  @click="deal(scope.$index, scope.row)">删除</span>
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
            <el-form-item label="回收公司地区：" prop="region" required>
                   <el-cascader
                      style="width:100%"
                      placeholder="请选择地区"
                      v-model="ruleForm.region"
                      @change="regionChange"
                      :props="{ expandTrigger: 'hover' }"
                      :options="options">
                   </el-cascader>
            </el-form-item>
            <el-form-item label="回收公司名称：" prop="name" required>
                  <el-input v-model="ruleForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="详细地址：" prop="address" required>
                  <el-input v-model="ruleForm.address" ></el-input>
            </el-form-item>
            <el-form-item label="回收公司电话：" prop="telephone" required>
                  <el-input v-model="ruleForm.telephone" ></el-input>
            </el-form-item>
            <el-form-item label="负责人姓名：" prop="chargeName" required>
                  <el-input v-model="ruleForm.chargeName" ></el-input>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="chargePhone" required>
                  <el-input v-model="ruleForm.chargePhone" ></el-input>
            </el-form-item>
            <el-form-item label="负责人性别：" prop="gender" >
                  <el-radio v-model="ruleForm.gender" :label="1">男</el-radio>
                  <el-radio v-model="ruleForm.gender" :label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="负责人年龄" prop="age" required>
                  <el-input v-model="ruleForm.age" type="number"  ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description" >
                  <el-input v-model="ruleForm.description"  ></el-input>
            </el-form-item>
            <el-form-item label="卡号" prop="cardNumber" required>
                  <el-input v-model="ruleForm.cardNumber"  ></el-input>
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
import { regionData } from 'element-china-area-data'
var rData=[];
regionData.map((ele)=>{
  if(ele.label=="江苏省"){
      rData.push(ele)
  }
})
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      delVisible: false,
      kName:'',
      mTitle:'新增',
      tableData: [],
      total: 0,
      cur_page: 1,
      editVisible:false,
      ruleForm:{
        region:'',
        name:'',
        address:'',
        telephone:'',
        chargeName:'',
        chargePhone:'',
        gender:1,
        age:'',
        cardNumber:'',
        description:'',
      },
      rules: {
          region: [
              { required: true, message: '请选择地区' }
          ],
          name: [
              { required: true, message: '请选择公司名称' }
          ],
          address: [
              { required: true, message: '请输入详细地址' }
          ],
          telephone: [
              { required: true, message: '请输入回收公司电话' }
          ],
          chargeName: [
              { required: true, message: '请输入负责人姓名' }
          ],
          chargePhone: [
              { required: true, message: '请输入负责人电话' }
          ],
          age: [
              { required: true, message: '请输入负责人年龄' }
          ],
          gender: [
              { required: true, message: '请输入负责人年龄' }
          ],
          cardNumber: [
              { required: true, message: '请输入卡号' }
          ],

      },
      options:rData,
    };
  },
  methods: {
    // 点击切换页码
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData()
    },
    // 查询
    search() {
      console.log(this.date);
    },
    openAdd(type,row){
       this.loading1=false;
      if(type==1){
        this.ruleForm={
          region:'',
          name:'',
          address:'',
          telephone:'',
          chargeName:'',
          chargePhone:'',
          gender:1,
          age:'',
          cardNumber:'',
          description:'',
        };
        if(this.$refs['ruleForm']){
           this.$refs['ruleForm'].resetFields();
        }
        this.mTitle='新增';
      }else{
        if(this.$refs['ruleForm']){
           this.$refs['ruleForm'].resetFields();
        }
        var form=this.ruleForm;
        for(var key in row){
          form[key]=row[key]
        }
        this.ruleForm=form;
        this.mTitle='详情'
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
               if( this.mTitle=='新增'){
                this.add()
               }else{
                this.edit();
               }
            } else {
                return false;
            }
        });
    },
    // 添加
    add(){
        this.loading1=true;
        var data=this.ruleForm;
        delete data.region;
        this.$axios({
              method:'post',
              url:'/platform/hospital/company/addDo',
              data:data
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
    // 编辑
    edit(){
        this.loading1=true;
        var data=this.ruleForm;
        data.city= JSON.stringify({name:data.city,value:data.region[1]});
        data.county=JSON.stringify({name:data.county,value:data.region[2]});
        delete data.region;
        this.$axios({
              method:'put',
              url:'/platform/hospital/company/editDo',
              data:data
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
    // 删除数据
    deleteRow(){
        this.$axios({
            method:'DELETE',
            url:'/platform/hospital/company/delete?ids='+this.id,
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
    regionChange(e){
      var city='',county='';
      rData[0].children.forEach((ele)=>{
         if(ele.value==e[1]){
           city={name:ele.label,value:ele.value};
           ele.children.forEach((ele2)=>{
                if(ele2.value==e[2]){
                   county={name:ele2.label,value:ele2.value}
                }
           })
         }
      })
      this.ruleForm.city= JSON.stringify(city);
      this.ruleForm.county=JSON.stringify(county);
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/company/listPage?pageNumber='+this.cur_page+'&pageSize=10&name='+this.kName,
        }).then((res) =>{
            if(res.status==200){
                this.loading=false;
                this.tableData=res.data.list.map((ele)=>{
                    ele.region=['320100',JSON.parse(ele.city).value,JSON.parse(ele.county).value];
                    ele.city=JSON.parse(ele.city).name;
                    ele.county=JSON.parse(ele.county).name;
                    return ele
                });
                this.total=res.data.totalCount;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    }
  },
  mounted() {
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

