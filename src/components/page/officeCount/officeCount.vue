<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          科室统计
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
        <div class="cloudBox" >
              <div class="flex  headSelect" style="margin-bottom:30px;min-height:auto">
                  <div class="flex ">
                    <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                    <div>{{title}}</div>
                  </div>
              </div>
              <div class="flex" style="align-items: normal;">
                <div style="width:100%">
                  <div align="left" style="font-size:14px" >赛虹桥卫生服务中心</div>
                  <div class="canvas"  id="mountNode1"></div>
                </div>
              </div>
        </div>
      </div>
      <div class="borderBox">
         <div class="flex headSelect" style="margin-bottom:10px;">
                <div class='flex'>
                  <img class="titleIcon" src="../../../assets/img/time.png" alt="">
                  <div style="margin-top: -4px;">各科室重量统计</div>
                </div>
                <div class="flex funcHead">
                         <div class="block">
                               <span class="demonstration">重量统计时间：</span>
                               <el-date-picker
                                style="width:280px"
                                v-model="date"
                                :picker-options="pickerOptions"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                              </el-date-picker>
                        </div>
                        <div class="flex" style="margin-left:10px">
                          <span class="demonstration" style="width:66px">科室名称：</span>
                          <el-input style="width:140px" v-model="kName" placeholder="请输入科室名称"></el-input>
                        </div >
                        <el-button style="margin-left:10px" @click="getTable" type="primary" icon="el-icon-search">搜索</el-button>
                        <el-dropdown @command="getExcel">
                            <el-button type="primary" style="margin-left:10px" >
                              导出报表<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown"  >
                              <el-dropdown-item  command="1" >总览表</el-dropdown-item>
                              <el-dropdown-item  command="2" >明细表</el-dropdown-item>
                              <el-dropdown-item  command="3" >明细总览表</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
                type="selection"
                width="55">
              </el-table-column>
                <el-table-column
                prop="departmentName"
                label="科室">
              </el-table-column>
                <el-table-column
                prop="total"
                sortable
                label="总重量"
                :formatter="formatter"
              >
              </el-table-column>
              <el-table-column
                    :prop="item"
                    sortable
                    :label="item"
                    :formatter="formatter"
                    v-for="(item,ind) in columns"
                    :key="ind"
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
      kName: '',
      date:'',
      columns:[],
      data1: [
      ],
      tableData:[
        {id:1,name:'输液大厅',weight:'71.25',weight1:'21.25',weight2:'13.14',weight3:"",weight4:"",weight5:""},
      ],
      total:0,
      cur_page:1,
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      chooseIds:[]
    }
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
          this.getTable();
    },
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
         this.type=2;
         this.title='近30天各科室产生盐水瓶总重量';
       }else{
         this.type=1;
         this.title='近30天各科室产生医废总量';
       }
        this.getData();
        this.getTable();
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
      itemTpl: '<li>总重量: {value}</li>',
      position:'left'
      });
      this.chart1.interval().position("departmentName*total").opacity(1).label('value', {
        useHtml: true,
        htmlTemplate: function htmlTemplate(text, item) {
          var a = item.point;
          return '<span class="g2-label-item"><p class="g2-label-item-value">' + a.total + 'kg</p></div>';
        }
      }).color('departmentName', ['#7f8da9', '#fec514', '#db4c3c', '#daf0fd']);
      this.chart1.render();
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
      const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '';
            return;
          }else if (index === 1) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' kg';
          } 
        });

        return sums;
     },
     getData(){
        this.loading=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/weightPerDayInLastMonthByDepartment?isBottle=false':url='/platform/hospital/rubbish/weightPerDayInLastMonthByDepartment?isBottle=true';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
            if(res.status==200){
               this.loading=false;
               this.intChart1(res.data)
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    // 各科室重量统计
    getTable(){
        this.loading2=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/weightPerDayByDepartment?start='+ this.date[0]+'&end='+this.date[1]+'&name='+this.kName+'&pageNumber='+this.cur_page+'&pageSize=10&isBottle=false':url='/platform/hospital/rubbish/weightPerDayByDepartment?start='+ this.date[0]+'&end='+this.date[1]+'&name='+this.kName+'&pageNumber='+this.cur_page+'&pageSize=10&isBottle=true';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
            if(res.status==200){
               this.loading2=false;
              // 声明表格头
               var columns=[];
              //  表格数据处理
               var arr=res.data.list.map((ele,ind1)=>{
                 var obj={departmentName:ele.departmentName,total:ele.total};
                 ele.typeNames=ele.typeNames.split(',');
                 ele.totals=ele.totals.split(',');
                 ele.typeNames.forEach((ele1,ind)=>{
                     obj[ele1]= parseFloat(ele.totals[ind]);
                     if(ind1==0){
                      columns.push(ele1)
                     }
                 })
                 return  obj
               })
              //  动态表格头
               this.columns=columns;
               this.tableData=arr;
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
     var end = moment().format("YYYY-MM-DD"), start = moment().subtract(30, "days").format("YYYY-MM-DD");
     this.date = [start, end];
     setTimeout(() => {
           this.getData();
           this.getTable();
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

