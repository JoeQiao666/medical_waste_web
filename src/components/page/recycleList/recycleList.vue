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
              @click="search"
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
          <el-table-column prop="cName"  label="回收公司名称"></el-table-column>
          <el-table-column prop="phone1"  label="回收公司电话" width="150px" ></el-table-column>
          <el-table-column prop="name"  label="负责人姓名" width="140px" ></el-table-column>
          <el-table-column prop="phone2" label="负责人电话" width="140px"  ></el-table-column>
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
                      :options="options">
                   </el-cascader>
            </el-form-item>
            <el-form-item label="回收公司名称：" prop="name" required>
                  <el-select style="width:100%" v-model="ruleForm.name" placeholder="请选择回收公司">
                     <el-option
                      v-for="item in companies"
                      :key="item.value"
                      :label="item.name"
                       :value="item.value"
                      >
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="详细地址：" prop="address" required>
                  <el-input v-model="ruleForm.address" ></el-input>
            </el-form-item>
            <el-form-item label="回收公司电话：" prop="address" required>
                  <el-input v-model="ruleForm.phone" ></el-input>
            </el-form-item>
            <el-form-item label="负责人姓名：" prop="name2" required>
                  <el-input v-model="ruleForm.name2" ></el-input>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="phone2" required>
                  <el-input v-model="ruleForm.phone2" ></el-input>
            </el-form-item>
            <el-form-item label="负责人性别：" prop="sex" >
                  <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
                  <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="负责人年龄" prop="age" required>
                  <el-input v-model="ruleForm.age" type="number"  ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="dsc" required>
                  <el-input v-model="ruleForm.dsc"  ></el-input>
            </el-form-item>
            <el-form-item label="卡号" prop="number" required>
                  <el-input v-model="ruleForm.number"  ></el-input>
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
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      delVisible: false,
      kName:'',
      mTitle:'新增',
      tableData: [
        {
          id: 1,
          count: "24",
          cName: "南京汇和环境工程技术有限公司",
          name: "温家宏",
          phone1: "0510-23234567",
          phone2: "13375261245",
          address:'南京市六合区化学工业园方水东路8号'
        }
      ],
      total: 0,
      cur_page: 1,
      editVisible:false,
      ruleForm:{
        region:'',
        name:'',
        address:'',
        phone:'',
        name2:'',
        phone2:'',
        sex:'1',
        age:'',
        number:'',
        dsc:'',
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
          phone: [
              { required: true, message: '请输入回收公司电话' }
          ],
          name2: [
              { required: true, message: '请输入负责人姓名' }
          ],
          phone2: [
              { required: true, message: '请输入负责人电话' }
          ],
          age: [
              { required: true, message: '请输入负责人年龄' }
          ],
          dsc: [
              { required: true, message: '请输入描述' }
          ],
          number: [
              { required: true, message: '请输入卡号' }
          ],

      },
      options:regionData,
      companies:[
        {name:'南京苏宁有限公司',value:'1101'},
        {name:'广州恒大有限公司',value:'1102'},
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
    openAdd(type){
      if(type==1){
        this.mTitle='新增'
      }else{
        this.mTitle='详情'
      }
      this.editVisible=true;
    },
    detials(){
      this.openAdd(2);
    },
    // 保存编辑
    saveEdit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.add()
            } else {
                return false;
            }
        });
    },
    // 添加
    add(){
        this.loading1=true;
        // this.$axios({
        //       method:'post',
        //       url:'/api/customer/save',
        //       data:this.$qs.stringify({
        //           name:this.ruleForm.name,
        //           key:this.ruleForm.key,
        //           userIds:this.ruleForm.manager.join(','),
        //           status:this.ruleForm.status,
        //           xzProId:this.ruleForm.xzProId
        //       })
        //   }).then((res) =>{
        //       if(res.data.code==200){
        //       this.loading1=false;
        //       this.editVisible = false;
        //       this.getData()
        //       }else{
        //           this.$message.error(res.data.msg);
        //       }
        //   }).catch((error) =>{
        //       console.log(error)    
        //   })
    },
    // 删除数据
    deleteRow(){

    },
    deal(index,row){
      this.id=row.id;
      this.delVisible=true;
    }
  },
  mounted() {
 
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

