<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          入库统计
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
                width="50">
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
              <el-table-column
                 label="操作记录"
                 width="100" align="center">
                 <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row,1)">点击查看</span>
                 </template>
              </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
          </div>
      </div>
    </div>

    <el-dialog title="操作记录" :visible.sync="tableVisble1" width="80%"  >
        <div align="right" style="margin-top: -40px;" ><el-button @click="getExcel1" type="primary" icon="el-icon-download">导出报表</el-button></div>
        <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading2"
              show-summary
              :summary-method="getSummaries1"
              @selection-change="handleSelectionChange"
              >
              <el-table-column
                type="index"
                label="序号"
                width="50">
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
              <el-table-column
                 label="操作记录"
                 width="100" align="center">
                 <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row,2)">点击查看</span>
                 </template>
              </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination background @current-change="handleCurrentChange1" layout="total, prev, pager, next, jumper" :total="total1">
              </el-pagination>
          </div>
    </el-dialog>
    <el-dialog title="操作记录" :visible.sync="tableVisble2" width="80%"  >
        <div align="right" style="margin-top: -40px;" ><el-button @click="getExcel2" type="primary" icon="el-icon-download">导出报表</el-button></div>
        <el-table
              :data="tableData3"
              style="width: 100%"
              v-loading="loading2"
              @selection-change="handleSelectionChange"
              >
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
                <el-table-column
                prop="time"
                label="新增时间">
              </el-table-column>
               <el-table-column
                prop="name"
                sortable
                label="科室"
              >
              </el-table-column>
                <el-table-column
                prop="weight"
                sortable
                label="重量"
                :formatter="formatter"
              >
              </el-table-column>
              <el-table-column
                prop="weight1"
                sortable
                label="类型"
                width="100"
                :formatter="formatterType"
              >
              </el-table-column>
            
              <el-table-column
                prop="weight2"
                label="记录状态"
                :formatter="formatterStatus"
                >
              </el-table-column>
              <el-table-column
                prop="p1"
                label="操作人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="p2"
                label="交接人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                 label="操作"
                 width="150" align="center">
                 <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row,3)">查看详情</span>
                        <span style="margin-left:10px" class="pointer"  @click="edit(scope.$index, scope.row)">编辑</span>
                 </template>
              </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination background @current-change="handleCurrentChange2" layout="total, prev, pager, next, jumper" :total="total2">
              </el-pagination>
          </div>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="tableVisble3" width="80%"  >
      <div class="cTitle" >垃圾编号： 54bbbb1Hbbbb3b7637dddd5d9859rJAs</div>
      <div class="flex detailBox">
          <div>
             <div class="ball" style="background:#67C23A" >科室出库</div>
             <div class="infoBox infoBox1">
                <div><span>所属类型：</span> 感染性</div>
                <div><span>垃圾重量：</span> 4.48kg </div>
                <div><span>垃圾回收员：</span> 回收员1</div>
                <div><span>垃圾回收时间：</span> 2019-07-04 15:52</div>
                <div><span>垃圾交接人：</span> 姜柳柳</div>
                <div><span>异常信息：</span> -</div>
             </div>
          </div>
          <div>
             <div class="ball" style="background:#E6A23C" >暂存点入库</div>
             <div class="infoBox">
                <div><span>暂存点交接人：</span> 暂存点复核员</div>
                <div><span>暂存点入库时间：</span> 2019-07-04 16:10 </div>
                <div><span>暂存点核对重量：</span> 4.48kg</div>
             </div>
          </div>
          <div>
             <div class="ball" style="background:#F56C6C" >暂存点出库</div>
             <div class="infoBox">
                <div><span>所属回收公司：</span> -</div>
                <div><span>回收公司回收员：</span>- </div>
                <div><span>回收时间：</span>-</div>
             </div>
          </div>
      </div>
    </el-dialog>

        <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="40%"  >
        <el-form ref="ruleForm"  :model="ruleForm"  label-width="120px" v-loading="loading1"  >
              <el-form-item label="类型：" prop="status">
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio label="0">感染类</el-radio>
                        <el-radio label="1">损伤类</el-radio>
                        <el-radio label="2">病理类</el-radio>
                        <el-radio label="3">药物类</el-radio>
                        <el-radio label="4">化学类</el-radio>
                    </el-radio-group>
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
const moment = require('moment');
export default {
  data() {
    return {
      loading: false,
      loading1: false,
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
        {id:1,time:'2017-03-12 10:55:55',weight:'71.25',weight1:'21.25',weight2:'13.14',weight3:"",weight4:"",weight5:""},
      ],
      tableData3:[
        {id:1,time:'2017-03-12 10:55:55',name:'综合病区',weight:'4.48',type:'1',status:'1',p1:'回收员',p2:'江达生'},
        {id:2,time:'2018-04-14 16:35:55',name:'口腔科',weight:'4.48',type:'2',status:'2',p1:'回收员',p2:'江达生'},
      ],
      total:0,
      total1:0,
      total2:0,
      vFormate:'yyyy-MM-dd',
      cur_page:1,
      cur_page1:1,
      cur_page2:1,
      chooseIds:[],
      tableVisble1:false,
      tableVisble2:false,
      tableVisble3:false,
      editVisible:false,
      ruleForm:{type:'0'}
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
    // 重量格式化
    formatter(row, column) {
      var w=row[column.property]
      if(w==''){
        w='0kg'
      }else{
        w=w+'kg'
      }
      return w;
    },
    // 状态格式化
    formatterStatus(row, column) {
      var w=row.status
      if(w==1){
        w='暂存点已入库'
      }else{
        w='暂存点未入库'
      }
      return w;
    },
    // 类型格式化
    formatterType(row, column) {
      var w=row.type
      if(w==1){
        w='感染性'
      }else{
        w='损伤性'
      }
      return w;
    },
    // 点击切换页码
    handleCurrentChange(val){
          this.cur_page = val;
          // this.getTask();
    },
    // 点击切换页码二级
    handleCurrentChange1(val){
          this.cur_page1 = val;
          // this.getTask();
    },
    // 点击切换页码三级
    handleCurrentChange2(val){
          this.cur_page1 = val;
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
    // 导出报表二级
    getExcel1(type){
     
    },
    // 导出报表三级
    getExcel2(type){
     
    },
    // 合计
    getSummaries(param) {
       return ['','合计','111kg','11kg','12kg','0kg','0kg','0kg']
    },
    // 合计2
    getSummaries1(param) {
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
    // 查看表格详情
    detials(index,row,t){
       if(t==1){
         this.tableVisble1=true;
       }else if(t==2){
         this.tableVisble2=true;
       }else{
         this.tableVisble3=true;
       }
    },
    // 打开编辑
    edit(index,row){
     this.editVisible=true;
    },
    // 保存编辑
    saveEdit(){
     this.editVisible=false;
    }
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
.cTitle{
  margin-top:-30px;
  text-align: center;
  font-size: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}
.detailBox{
  justify-content: space-around;
  margin-top: 30px;
  align-items: baseline;
}
.detailBox>div{
  width: 33%;
}
.ball{
  width:100px;
  height: 100px;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  text-align: center;
  line-height: 100px;
  margin: auto;
}
.infoBox{
  padding-left: 25%;
  margin:20px 0;
}
.infoBox span{
  width: 112px;
  display: inline-block;
}
.infoBox1 span{
  width: 98px;
}
</style>


