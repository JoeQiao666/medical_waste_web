<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          溯源码统计分析
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div v-loading="loading" >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="月" name="1">
          </el-tab-pane>
          <el-tab-pane label="季度" name="2">
          </el-tab-pane>
          <el-tab-pane label="年" name="3">
          </el-tab-pane>
        </el-tabs>
        <div class="cloudBox" >
              <div class="flex  headSelect" style="margin-bottom:30px;min-height:auto">
                  <div class="flex ">
                    <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                    <div>溯源码统计分析</div>
                  </div>
              </div>
              <div class="flex" style="align-items: normal;">
                <div style="width:100%">
                  <div class="canvas"  v-show="data1.length>0" id="mountNode1"></div>
                </div>
              </div>
        </div>
      </div>
      <div class="borderBox" style="padding-top:0" >
         <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading2"
              show-summary
              :summary-method="getSummaries"
              >
                <el-table-column
                prop="time"
                align="center"
                label="时间">
              </el-table-column>
                <el-table-column
                prop="times"
                align="center"
                sortable
                label="申请次数"
              >
              </el-table-column>
              <el-table-column
                prop="count"
                align="center"
                sortable
                label="申请总数量"
              >
              </el-table-column>
         
          </el-table>
          <div class="pagination">
              <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
          </div>
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
      title:'近30天各科室产生医废总量',
      type:'1',
      activeName: "1",
      kName: "",
      data1: [
        {
          year: "1933 ",
          sales: 38
        },
        {
          year: "1922",
          sales: 52
        },
        {
          year: "1956 年",
          sales: 61
        },
        {
          year: "1957 年",
          sales: 145
        },
        {
          year: "1958 年",
          sales: 48
        },
        {
          year: "1959 年",
          sales: 38
        },
        {
          year: "1960 年",
          sales: 38
        },
        {
          year: "1962 年",
          sales: 38
        },
            {
          year: "1983 年",
          sales: 145
        },
        {
          year: "1984 年",
          sales: 48
        },
        {
          year: "1985 年",
          sales: 38
        },
        {
          year: "1986年",
          sales: 38
        },
        {
          year: "1987 年",
          sales: 38
        }
      ],
      tableData:[
        {id:1,time:'2017-01',times:14,count:33},
      ],
      total:0,
      cur_page:1,
    }
  },
  methods: {
    // 点击切换页码
    handleCurrentChange(val){
          this.cur_page = val;
          // this.getTask();
    },
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
         this.type=2;
       }else if(tab.index==1){
          this.type=3;
       }else{
         this.type=1;
       }
      this.intChart1(this.data1)
    },
    // 初始化柱状图
    intChart1(data) {
      if(this.chart1!==undefined){
          this.chart1.changeData(data);
          return 
      }
      this.chart1 = new G2.Chart({
        container: "mountNode1",
        forceFit: true,
        height:300,
        padding: [20, 'auto', 50, 'auto']
      });
      this.chart1.source(data);
      this.chart1.legend(false);
      // 自定义模板，自定义tooltip展示
      this.chart1.tooltip({
      itemTpl: '<li>申请数量: {value}个</li>',
      position:'left'
      });
      this.chart1.interval().position("year*sales").opacity(1);
      this.chart1.render();
    },
    // 导出报表
    getExcel(type){
      if(type==1){

      }else if(type==2){
        if(this.chooseIds.length==0){
             this.$message({message:'请选择需要要导出明细的诊所！'});
        }
      }else{
          this.$confirm('确定导出全部明细?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '导出成功!'
            });
          }).catch(() => {
                 
          });
      }
    },
    // 合计
     getSummaries(param) {
       return ['合计','','10']
     }
  },
  mounted() {
     setTimeout(() => {
           this.intChart1(this.data1);
     }, 500);
  }
};
</script>


<style scoped>
.cloudBox>div{
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    min-height: 300px;
    position: relative;
}

</style>
<style>
  .btitle{
  font-size: 13px;
}
.g-guide{
  left:50% !important;
  transform: translateX(-50%);
}
</style>

