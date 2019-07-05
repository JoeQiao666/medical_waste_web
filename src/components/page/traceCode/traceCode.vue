<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>科室统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="borderBox">
        <div class="flex headSelect" style="margin-bottom:10px;">
          <div class="flex">
            <img class="titleIcon" src="../../../assets/img/form.png" alt />
            <div style="margin-top: -4px;">溯源码申请</div>
          </div>

          <div class="flex funcHead">
            <div class="block">
              <span class="demonstration">申请时间：</span>
              <el-date-picker
                style="width:280px"
                v-model="date"
                type="daterange"
                range-separator="~"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
            <div class="block">
              <span class="demonstration" style="margin-left:10px" >状态</span>
               <el-select style="width:100px" v-model="status" placeholder="请选择">
                  <el-option label="全部" value="all"></el-option>
                  <el-option label="已申请" value="h1"></el-option>
                  <el-option label="已发放" value="h2"></el-option>
                </el-select>
            </div>
            <el-button
              style="margin-left:10px"
              @click="search"
              type="primary"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button
              style="margin-left:10px"
              @click="openAdd"
              type="primary"
              icon="el-icon-plus"
            >申请</el-button>
            <el-button
              style="margin-left:10px"
              @click="getExcel"
              type="primary"
              icon="el-icon-download"
            >导出报表</el-button>
          </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="count" sortable label="申请数量"></el-table-column>
          <el-table-column prop="name"  label="申请人" ></el-table-column>
          <el-table-column prop="phone"  label="联系方式" ></el-table-column>
          <el-table-column prop="time" label="申请时间" sortable ></el-table-column>
          <el-table-column prop="status" label="状态" sortable :formatter="formatter"></el-table-column>
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
    <el-dialog title="溯源码申请" :visible.sync="editVisible" width="40%"  >
        <el-form ref="ruleForm"  :model="ruleForm"  :rules="rules" label-width="120px" v-loading="loading1"  >
            <el-form-item label="溯源码数量" prop="count" required>
                  <el-input v-model="ruleForm.count" type="number" ></el-input>
            </el-form-item>
            <el-form-item label="申请人姓名" prop="name" required>
                  <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="申请人电话" prop="phone" required>
                  <el-input v-model="ruleForm.phone" type="number" ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer"  >
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <!-- <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
    </el-dialog> -->
  </div>
</template>

<script>
const moment = require("moment");
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      status:'all',
      startYear: "",
      endYear: "",
      activeName: "1",
      kName: "",
      date: "",
      cType: "day",
      type: "1",
      tableData: [
        {
          id: 1,
          count: "24",
          name: "赵旭",
          phone: "13375261245",
          time: "2017-02-12 10:22:12",
          status: 1,
        }
      ],
      total: 0,
      vFormate: "yyyy-MM-dd",
      cur_page: 1,
      editVisible:false,
      ruleForm:{
        count:'',
        name:'',
        phone:''
      },
      rules: {
          name: [
              { required: true, message: '请输入申请人姓名' }
          ],
          phone: [
              { required: true, message: '请输入申请人电话' }
          ],
          count: [
              { required: true, message: '请输入申请人数量' }
          ]
      },
    };
  },
  watch: {
    cType: {
      handler: function(val) {
        if (val == "day") {
          this.dateType = "daterange";
          this.vFormate = "yyyy-MM-dd";
          var end = moment().format("YYYY-MM-DD"),
            start = moment()
              .subtract(30, "days")
              .format("YYYY-MM-DD");
          this.date = [start, end];
        } else if (val == "month") {
          this.dateType = "monthrange";
          this.vFormate = "yyyy-MM";
          var end = moment().format("YYYY-MM"),
            start = moment()
              .subtract(1, "year")
              .format("YYYY-MM");
          this.date = [start, end];
        } else {
          var end = moment().format("YYYY"),
            start = moment()
              .subtract(1, "year")
              .format("YYYY");
          this.date = [start, end];
          this.startYear = start;
          this.endYear = end;
        }
      },
      deep: true
    }
  },
  methods: {
    // status格式化
    formatter(row, column) {
      var w = row.status;
      if (w == 1) {
        w = "已申请";
      }else{
        w = "已发放";
      }
      return w;
    },
    // 点击切换页码
    handleCurrentChange(val) {
      this.cur_page = val;
      // this.getTask();
    },
    // 导出报表
    getExcel(type) {},
    // 查询
    search() {
      console.log(this.date);
    },
    // 年选择器处理
    yearChange(val, type) {
      var d = this.date;
      if (type == 1) {
        d[0] = val;
      } else {
        d[1] = val;
      }
      if (this.startYear >= this.endYear) {
        this.endYear = "";
        d[1] = "";
      }
      this.date = d;
    },
    openAdd(){
      this.editVisible=true;
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
    }
  },
  mounted() {
    var end = moment().format("YYYY-MM-DD"),
      start = moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD");
    this.date = [start, end];
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
.radio /deep/ .el-radio {
  margin-right: 10px;
}
.radio /deep/ .el-radio:first-child {
  margin-left: 30px;
}
</style>
<style>
.btitle {
  font-size: 13px;
}
.g-guide {
  left: 50% !important;
  transform: translateX(-50%);
}
</style>

