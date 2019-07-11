<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 首页
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
         <div class="cloudBox" v-loading="loading" >
              <div class="flex  headSelect" style="margin-bottom:50px;min-height:auto">
                  <div class="flex ">
                    <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                    <div>{{title}}</div>
                  </div>
              </div>
              <div class="flex" style="align-items: normal;">
                <div style="width:70%">
                  <div class="canvas"   id="mountNode1"></div>
                </div>
                <div style="width:30%">
                  <div class="canvas"   id="mountNode2"></div>
                </div>
              </div>
         </div>
      </div>
      <div class="borderBox">
         <div class="flex " style="margin-bottom:10px;">
                <img class="titleIcon" src="../../../assets/img/today.png" alt="">
                <div>今日医疗废物运转记录</div>
         </div>
         <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loading2"
              >
              <el-table-column
                type="index"
                label="序号"
                sortable
                width="80">
              </el-table-column>
              <el-table-column
                prop="createTime"
                sortable
                label="新增时间"
                width="100">
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
      title:'近30天回收医废总重量',
      type:'1',
      loading2: false,
      activeName: "1",
      data1: [],
      data2:[{
        type: '感染性',
        value: 7140
      }, {
        type: '损伤性',
        value: 3875
      }, {
        type: '病理性',
        value: 2267
      }],
      tableData:[
      
      ],
      total:0,
      cur_page:1,
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
    handleCurrentChange(val){
          this.cur_page = val;
          // this.getTask();
    },
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
           this.type=2;
           this.title='近30天回收盐水瓶总重量';
       }else{
           this.type=1;
           this.title='近30天回收医废总重量';
       }
       this.getData()
       this.getPercent()
       this.getToday()
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
        padding:'auto'
      });
      this.chart1.source(data);
      // 自定义模板，自定义tooltip展示
      this.chart1.tooltip({
      itemTpl: '<li>总重量: {value}</li>',
      position:'left'
      });
      this.chart1.interval().position("date*weight");
      this.chart1.render();
    },
    // 初始化饼图
    intBar1(data){
      var startAngle = -Math.PI / 2 - Math.PI / 4;
      var ds = new DataSet();
      var dv = ds.createView().source(data);
        dv.transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent'
        });
        if(this.chart2!==undefined){
            this.chart2.changeData(dv);
            return 
        }
        this.chart2 = new G2.Chart({
            container: 'mountNode2',
            forceFit: true,
            height: 300,
            padding: 'auto'
        });
        this.chart2.source(dv);
        this.chart2.legend(true);
        this.chart2.coord('theta', {
            radius: 0.75,
            innerRadius: 0.7,
            startAngle: startAngle,
            endAngle: startAngle + Math.PI * 2
        });
        this.chart2.intervalStack().position('value').color('type', [ '#00FF7F', '#46A3FC','#DC143C']).opacity(1).label('percent', {
            formatter: function formatter(val,item) {
              return item.point.type+':'+parseFloat(val * 100).toFixed(2) + '%';
            }
        }).select;
        this.chart2.tooltip({
            itemTpl: '<li>{name} : {value}%</li>',
            crosshairs: {
            type: 'line'
            },
            showTitle: false
        });
        this.chart2.guide().html({
          position: ['50%', '50%'],
          html: '<div class="g2-guide-html"><p class="btitle">近30天各类型占比</p></div>'
        });
        this.chart2.render();
    },
    // 近30天回收医废总重量
    getData(){
        this.loading=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/weightPerDayInLastMonth?isBottle=false':url='/platform/hospital/rubbish/weightPerDayInLastMonth?isBottle=true';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
          console.log(res.data)
            if(res.status==200){
               this.loading=false;
               var arr=res.data.map((ele)=>{
                 return {date:' '+ele.date,weight:ele.weight}
               })
               this.intChart1(arr)
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    // 近30天各类型占比
    getPercent(){
        this.loading=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/percentInLastMonth?isBottle=false':url='/platform/hospital/rubbish/percentInLastMonth?isBottle=true';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
          console.log(res.data)
            if(res.status==200){
               this.loading=false;
               var arr=res.data.map((ele)=>{
                 return {value:ele.percent,type:ele.name}
               })
               this.intBar1(arr)
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    // 今日医疗废物运转记录
    getToday(){
        this.loading2=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/listPage?isBottle=false&pageNumber='+this.cur_page+'&pageSize=10':url='/platform/hospital/rubbish/listPage?isBottle=true&pageNumber='+this.cur_page+'&pageSize=10'
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
            if(res.status==200){
               this.loading2=false;
               this.tableData=res.data.list;
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
     setTimeout(() => {
           this.getData()
           this.getPercent()
           this.getToday()
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

