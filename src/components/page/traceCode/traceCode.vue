<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>溯源码列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="borderBox">
        <div class="flex headSelect" style="margin-bottom:10px;">
          <div class="flex">
            <img class="titleIcon" src="../../../assets/img/form.png" alt />
            <div style="margin-top: -4px;">溯源码列表</div>
          </div>

          <div class="flex funcHead">
            <div class="block">
              <span class="demonstration">时间：</span>
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
                  <el-option label="科室出库" value="0"></el-option>
                  <el-option label="暂存点入库" value="1"></el-option>
                  <el-option label="暂存点出库" value="2"></el-option>
                </el-select>
            </div>
            <el-button
              style="margin-left:10px"
              @click="getData"
              type="primary"
              icon="el-icon-search"
            >搜索</el-button>
            <!-- <el-button
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
            >导出报表</el-button> -->
          </div>
        </div>
         <el-table
              :data="tableData"
              style="width: 100%"
              id="table"
              v-loading="loading"
              >
              <el-table-column
                type="index"
                label="序号"
                sortable
                width="80">
              </el-table-column>
              <el-table-column
                prop="createdTime"
                sortable
                label="新增时间"
                width="160">
              </el-table-column>
                <el-table-column
                prop="departmentName"
                label="科室">
              </el-table-column>
                <el-table-column
                prop="weight"
                sortable
                label="重量"
              >
              </el-table-column>
              <el-table-column
                prop="typeName"
                sortable
                label="类型"
              >
              </el-table-column>
            
              <el-table-column
                prop="status"
                label="记录状态"
                :formatter="formatter"
                >
              </el-table-column>
              <el-table-column
                prop="operatorName"
                label="操作人"
                >
              </el-table-column>
              <el-table-column
                prop="staffName"
                label="交接人"
                >
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
    <el-dialog title="溯源码申请" :visible.sync="editVisible" width="40%"  >
        <el-form ref="ruleForm"  :model="ruleForm"  :rules="rules" label-width="120px" v-loading="loading1"  >
            <el-form-item label="溯源码数量" prop="count" required>
                  <el-input v-model="ruleForm.count" type="number" ></el-input>
            </el-form-item>
            <el-form-item label="申请人姓名" prop="name" required>
                  <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="申请人电话" prop="phone" required>
                  <el-input v-model="ruleForm.phone"  ></el-input>
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
const moment = require("moment");
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      status:'',
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
              var is='';
              if(row.status==0){
                  is='科室出库';
              }else if(row.status==1){
                  is='暂存点入库';
              }else{
                  is='暂存点出库';
              }
              return is;
    },
    // 点击切换页码
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
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
   getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/rubbish/listPage?isBottle=true&pageNumber='+this.cur_page+'&pageSize=10&start='+this.date[0]+'&end='+this.date[1]+'&status='+this.status,
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
   }
  },
  mounted() {
    var end = moment().format("YYYY-MM-DD"),
      start = moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD");
    this.date = [start, end];
    this.getData();
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

