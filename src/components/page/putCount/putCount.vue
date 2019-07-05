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
      </div>
      <div class="borderBox">
         <div class="flex headSelect" style="margin-bottom:10px;">
                <div class='flex'>
                  <img class="titleIcon" src="../../../assets/img/time.png" alt="">
                  <div style="margin-top: -4px;">入库报表</div>
                  <div class="radio" >
                            <el-radio v-model="type" label="day">日统计</el-radio>
                            <el-radio v-model="type" label="mouth">月统计</el-radio>
                            <el-radio v-model="type" label="yaer">年统计</el-radio>
                  </div>
                </div>
                
                <div class="flex funcHead">
                       
                         <div class="block">
                               <span class="demonstration">重量统计时间：</span>
                               <el-date-picker
                                style="width:280px"
                                v-model="date"
                                type="daterange"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                              </el-date-picker>
                        </div>
                        <el-button style="margin-left:10px" type="primary" icon="el-icon-search">搜索</el-button>
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
                prop="name"
                label="科室">
              </el-table-column>
                <el-table-column
                prop="weight"
                sortable
                label="总重量"
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
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      activeName: "1",
      kName: "",
      date:'',
      type:'day',
      tableData:[
        {id:1,name:'输液大厅',weight:'71.25',weight1:'21.25',weight2:'13.14',weight3:"",weight4:"",weight5:""},
      ],
      total:0,
      cur_page:1,
      chooseIds:[]
    }
  },
    // watch:{
  //    date:{
  //       handler: function (old,newV) {
  //          console.log(newV)
  //       },
  //       deep: true
  //   },
  // },
  methods: {
    // status格式化
    formatter(row, column) {
      var w=row[column.property]
      if(w==''){
        w='-'
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
          
       }else{
         
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
       console.log(param)
       return ['','合计','111kg','11kg','12kg','-','-','-']
     }
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    console.log(start,end)
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

