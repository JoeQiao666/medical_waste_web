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
      <div  >
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
                        <el-button style="margin-left:10px" @click="getTable"  type="primary" icon="el-icon-search">搜索</el-button>
                        <el-button style="margin-left:10px" @click="getExcel" type="primary" icon="el-icon-download">导出报表</el-button>
                </div>
         </div>
         <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading"
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
                prop="storeTime"
                label="入库时间">
              </el-table-column>
              <el-table-column
                prop="storeTimes"
                label="入库次数">
              </el-table-column>
                <el-table-column
                prop="total"
                sortable
                label="应入库总重量"
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
              :data="tableData2"
              id="out-table"
              style="width: 100%"
              v-loading="loading1"
              @selection-change="handleSelectionChange"
              >
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
                <el-table-column
                prop="createdTime"
                label="新增时间">
              </el-table-column>
               <el-table-column
                prop="departmentName"
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
                prop="typeName"
                sortable
                label="类型"
                width="100"
              >
              </el-table-column>
            
              <el-table-column
                prop="weight2"
                label="记录状态"
                >
                暂存点已入库
              </el-table-column>
              <el-table-column
                prop="recyclerName"
                label="操作人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                prop="staffName"
                label="交接人"
                width="80"
                >
              </el-table-column>
              <el-table-column
                 label="操作"
                 width="150" align="center">
                 <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row,2)">查看详情</span>
                        <span style="margin-left:10px"  v-if="permission=='修改'" class="pointer"  @click="edit(scope.$index, scope.row)">编辑</span>
                 </template>
              </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination background @current-change="handleCurrentChange2" layout="total, prev, pager, next, jumper" :total="total2">
              </el-pagination>
          </div>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="tableVisble2" width="80%"  >
      <div class="cTitle" >垃圾编号： {{details.id}}</div>
      <div class="flex detailBox">
          <div>
             <div class="ball" style="background:#67C23A" >科室出库</div>
             <div class="infoBox infoBox1">
                <div><span>所属类型：</span> {{details.typeName}}</div>
                <div><span>垃圾重量：</span> {{details.weight}}kg </div>
                <div><span>垃圾回收员：</span> {{details.recyclerName}}</div>
                <div><span>垃圾回收时间：</span> {{details.createdTime}}</div>
                <div><span>垃圾交接人：</span> {{details.staffName}}</div>
                <div><span>异常信息：</span> -</div>
             </div>
          </div>
          <div>
             <div class="ball" style="background:#E6A23C" >暂存点入库</div>
             <div class="infoBox">
                <div><span>暂存点交接人：</span> {{details.administratorName}}</div>
                <div><span>暂存点入库时间：</span> {{details.storeTime}}</div>
                <div><span>暂存点核对重量：</span> {{details.weight}}kg</div>
             </div>
          </div>
          <div>
             <div class="ball" style="background:#F56C6C" >暂存点出库</div>
             <div class="infoBox">
                <div><span>所属回收公司：</span> {{details.companyName}}</div>
                <div><span>回收公司回收员：</span>- </div>
                <div><span>回收时间：</span>{{details.recycleTime}}</div>
             </div>
          </div>
      </div>
    </el-dialog>

        <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="40%"  >
        <el-form ref="ruleForm"  :model="ruleForm"  label-width="120px" v-loading="loading2"  >
              <el-form-item label="类型：" prop="status">
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio v-for="(item,index) in types" :key="index" :label="item.id">{{item.name}}</el-radio>
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
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      loading2: false,
      permission:false,
      dateType:'daterange',
      types:[],
      columns:[],
      startYear:'',
      endYear:'',
      activeName: "1",
      kName: "",
      date:'',
      cType:'day',
      type:'1',
      tableData:[
      ],
      tableData2:[
      ],
      total:0,
      total1:0,
      total2:0,
      vFormate:'yyyy-MM-dd',
      cur_page:1,
      cur_page2:1,
      chooseIds:[],
      tableVisble1:false,
      tableVisble2:false,
      editVisible:false,
      ruleForm:{type:''},
      details:{
        administratorId:'',
        typeName:'',
        weight:'',
        staffName:'',
        recycleTime:'',
        createdTime:'',
        companyName:"",
        administratorName :"",
        administratorName :"",
      }
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
           this.getTable()
        },
        deep: true
    },
  },
  methods: {
    // 重量格式化
    formatter(row, column) {
      var w=row[column.property];
      if(w==undefined){
          return '-';
      }
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
          this.getTable();
    },
    // 点击切换页码二级
    handleCurrentChange2(val){
          this.cur_page2 = val;
          this.getDetailTable();
    },
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
          this.type=2;
       }else{
          this.type=1;
       }
       this.getType();
       this.getTable();
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
      if(this.activeName==2){
            window.open('/platform/hospital/rubbish/exportWeightByDepartment?isBottle=true&status=1')
      }else{
            window.open('/platform/hospital/rubbish/exportWeightByDepartment?isBottle=false&status=1')
      }
       
    },
    // 导出报表二级
    getExcel1(type){
         /* generate workbook object from table */
         var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
         /* get binary string as output */
         var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
         try {
             FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
         } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
         return wbout
    },
    // 导出报表三级
    getExcel2(type){
     
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
            sums[index] = '合计';
            return;
          }else if(column.label=="操作记录"){
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (prev*100 + curr*100)/100;
              } else {
                return prev;
              }
            }, 0);

            if(index!==2){
               sums[index] += ' kg';
            }
  
          } 
        });

        return sums;
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
         this.storeTime=row.storeTime;
         this.getDetailTable(row.storeTime);
       }else if(t==2){
         row.storeTime=moment(parseFloat(row.storeAt*1000)).format('YYYY-MM-DD HH:mm:ss');
         row.recycleTime=moment(parseFloat(row.recycleAt*1000)).format('YYYY-MM-DD HH:mm:ss');
         this.details=row;
         this.tableVisble2=true;
       }
    },
    // 打开编辑
    edit(index,row){
     this.editVisible=true;
     this.editId=row.id;
     this.ruleForm.type=row.typeId;
    },
    // 保存编辑
    saveEdit(){
        this.loading2=true;
        this.$axios({
            method:'put',
            url:'/platform/hospital/rubbish/editType?id='+this.editId+'&typeId='+this.ruleForm.type,
        }).then((res) =>{
            if(res.status==200){
               this.loading2=false;
               this.editVisible=false;
               this.getDetailTable(this.storeTime);
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    // 入库统计
    getTable(){
        this.loading=true;
        var url='';
        var date=[];
        this.date?date=this.date:date=[null,null];
        this.activeName==1?url='/platform/hospital/rubbish/weightPerType?formatType='+this.cType+'&start='+ date[0]+'&end='+date[1]+'&isBottle=false&status=1&pageNumber='+this.cur_page+'&pageSize=10':url='/platform/hospital/rubbish/weightPerType?formatType='+this.cType+'&start='+ date[0]+'&end='+date[1]+'&isBottle=true&status=1&pageNumber='+this.cur_page+'&pageSize=10';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
            if(res.status==200){
               this.loading=false;
               // 声明表格头
               var columns=[];
              //  表格数据处理
               var arr=res.data.list.map((ele,ind1)=>{
                 var obj={storeTime:ele.storeTime,total:ele.total,storeTimes:1};
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
    // 获取当条入库详情
    getDetailTable(date){
        this.loading1=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/listPageByDate?formatType='+this.cType+'&date='+date+'&isBottle=false&status=1&pageNumber='+this.cur_page2+'&pageSize=10':url='/platform/hospital/rubbish/listPageByDate?formatType='+this.cType+'&date='+date+'&isBottle=true&status=1&pageNumber='+this.cur_page2+'&pageSize=10';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
            if(res.status==200){
               this.loading1=false;
               this.tableData2=res.data.list;
               this.total2=res.data.totalCount;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    getType(){
        var url='';
        this.activeName==1?url='/platform/hospital/type/data?isBottle=false':url='/platform/hospital/type/data?isBottle=true';
        this.$axios({
            method:'get',
            url:url
        }).then((res) =>{
            if(res.status==200){
               this.types=res.data.data;
               var a={type:res.data.data[0].id};
               this.ruleForm=a;
            }else{
               this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    }
  },
  mounted() {
     this.permission=localStorage.permission;
     var end=moment().format('YYYY-MM-DD'),start=moment().subtract(30, 'days').format('YYYY-MM-DD');
     this.date=[start,end];
     this.getType();
     this.getTable();
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
  padding-left: 22%;
  margin:20px 0;
}
.infoBox>div{
  margin-bottom: 6px;
}
.infoBox span{
  /* width: 112px; */
  display: inline-block;
}
/* .infoBox1 span{
  width: 98px;
} */
</style>


