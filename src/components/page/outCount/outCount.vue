<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>
         出库统计
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div v-loading="loading" >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="医废类" name="1">
           
          </el-tab-pane>
          <el-tab-pane label="盐水瓶" name="2">
           
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="borderBox">
         <div class="flex headSelect" style="margin-bottom:10px;">
                <div class='flex'>
                  <img class="titleIcon" src="../../../assets/img/time.png" alt="">
                  <div style="margin-top: -4px;">出库报表</div>
                  <div class="radio" >
                            <el-radio v-model="cType" label="day">日统计</el-radio>
                            <el-radio v-model="cType" label="month">月统计</el-radio>
                            <el-radio v-model="cType" label="year">年统计</el-radio>
                  </div>
                </div>
                
                <div class="flex funcHead">
                       
                         <div class="block" v-show="cType!=='year'" >
                               <span class="demonstration">重量统计时间：</span>
                               <el-date-picker
                                style="width:280px"
                                v-model="date"
                                :type="dateType"
                                range-separator="~"
                                :value-format="vFormate"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                              </el-date-picker>
                        </div>
                         <div class="block" v-show="cType=='year'">
                               <span class="demonstration">重量统计时间：</span>
                               <el-date-picker
                                style="width:100px"
                                v-model="startYear"
                                value-format="yyyy"
                                @change="yearChange($event,1)"
                                type="year">
                                </el-date-picker>
                                <span class="demonstration">~</span>
                                <el-date-picker
                                style="width:100px"
                                value-format="yyyy"
                                v-model="endYear"
                                @ @change="yearChange($event,2)"
                                type="year">
                              </el-date-picker>
                        </div>
                        <el-button style="margin-left:10px" @click="search"  type="primary" icon="el-icon-search">搜索</el-button>
                        <el-button style="margin-left:10px" @click="getExcel" type="primary" icon="el-icon-download">导出报表</el-button>
                </div>
         </div>
         <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading2"
              show-summary
              :summary-method="getSummaries"
              @selection-change="handleSelectionChange"
              >
              <el-table-column
                type="index"
                label="序号"
                width="55">
              </el-table-column>
                <el-table-column
                prop="time"
                label="入库时间">
              </el-table-column>
                <el-table-column
                prop="weight"
                sortable
                label="应入库总重量"
                :formatter="formatter"
              >
              </el-table-column>
              <el-table-column
                prop="weight1"
                sortable
                label="感染类总重量"
                :formatter="formatter"
              >
              </el-table-column>
            
              <el-table-column
                prop="weight2"
                label="损伤类总重量"
                sortable
                :formatter="formatter"
                >
              </el-table-column>
              <el-table-column
                prop="weight3"
                label="病理类总重量"
                sortable
                :formatter="formatter"
                >
              </el-table-column>
              <el-table-column
                prop="weight4"
                label="药物类总重量"
                sortable
                :formatter="formatter"
                >
              </el-table-column>
              <el-table-column
                prop="weight5"
                label="化学类总重量"
                sortable
                :formatter="formatter"
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
const moment = require('moment');
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      dateType:'daterange',
      startYear:'',
      endYear:'',
      activeName: "1",
      kName: "",
      date:'',
      cType:'day',
      type:'1',
      tableData:[
        {id:1,time:'2017-03-12',weight:'71.25',weight1:'21.25',weight2:'13.14',weight3:"",weight4:"",weight5:""},
      ],
      total:0,
      vFormate:'yyyy-MM-dd',
      cur_page:1,
      chooseIds:[]
    }
  },
  watch:{
     cType:{
        handler: function (val) {
           if(val=='day'){
             this.dateType='daterange';
             this.vFormate="yyyy-MM-dd";
             var end=moment().format('YYYY-MM-DD'),start=moment().subtract(30, 'days').format('YYYY-MM-DD');
             this.date=[start,end];
           }else if(val=='month'){
             this.dateType='monthrange';
             this.vFormate="yyyy-MM";
             var end=moment().format('YYYY-MM'),start=moment().subtract(1, 'year').format('YYYY-MM');
             this.date=[start,end];
           }else{
             var end=moment().format('YYYY'),start=moment().subtract(1, 'year').format('YYYY');
             this.date=[start,end];
             this.startYear=start;
             this.endYear=end;
           }
        },
        deep: true
    },
  },
  methods: {
    // status格式化
    formatter(row, column) {
      var w=row[column.property]
      if(w==''){
        w='0kg'
      }else{
        w=w+'kg'
      }
      return w;
    },
    // 点击切换页码
    handleCurrentChange(val){
          this.cur_page = val;
          // this.getTask();
    },
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
          this.type=2;
       }else{
          this.type=1;
       }
    },
    // 表格选中
    handleSelectionChange(val){
       var arr=val.map((ele)=>{
         return ele.id
       })
       this.chooseIds=arr;
    },
    // 导出报表
    getExcel(type){
     
    },
    // 合计
    getSummaries(param) {
       return ['','合计','111kg','11kg','12kg','0kg','0kg','0kg']
    },
    // 查询
    search(){
       console.log(this.date)
    },
    // 年选择器处理
    yearChange(val,type){
     var d=this.date; 
     if(type==1){
        d[0]=val;
     }else{
        d[1]=val;
     }
     if(this.startYear>=this.endYear){
          this.endYear='';
          d[1]='';
     }
     this.date=d; 

    },

  },
  mounted() {
     var end=moment().format('YYYY-MM-DD'),start=moment().subtract(30, 'days').format('YYYY-MM-DD');
     this.date=[start,end];
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
.radio  /deep/  .el-radio{
  margin-right: 10px;
}
.radio  /deep/  .el-radio:first-child{
  margin-left: 30px;
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

