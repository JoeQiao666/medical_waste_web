<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 统计分析
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            总量统计
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
              <div class="flex  headSelect" style="margin-bottom:50px;min-height:auto">
                  <div class="flex ">
                    <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                    <div>{{title}}</div>
                  </div>
              </div>
              <div class="flex" style="align-items: normal;">
                <div style="width:70%;height:calc(100vh - 368px)"   ref='box' >
                  <div class="canvas"  id="mountNode1"></div>
                </div>
                <div style="width:30%">
                  <div class="canvas"  id="mountNode2"></div>
                </div>
              </div>
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
      title:'近12月入库医废总量统计',
      type:'1',
      activeName: "1",
      data1: [
      
      ],
      data2:[],
    }
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
       if(tab.index==1){
          this.type=2;
          this.title='近12月入库盐水瓶总量统计';
       }else{
          this.type=1;
          this.title='近12月入库医废总量统计';
       }
       this.getData()
       this.getPercent()
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
        height:this.$refs.box.offsetHeight,
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
            height: this.$refs.box.offsetHeight,
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
       this.chart2.intervalStack().position('value').color('type', [ '#00FF7F', '#46A3FC','#DC143C']).opacity(1).select;
        this.chart2.tooltip({
            itemTpl: '<li>{name} : {value}%</li>',
            crosshairs: {
            type: 'line'
            },
            showTitle: false
        });
        this.chart2.guide().html({
          position: ['50%', '50%'],
          html: '<div class="g2-guide-html"><p class="btitle">近12个月各类型占比</p></div>'
        });
        this.chart2.render();
    },
     // 近近12个月回收医废总重量
    getData(){
        this.loading=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/weightPerMonthInLastYear?isBottle=false':url='/platform/hospital/rubbish/weightPerMonthInLastYear?isBottle=true';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
            if(res.status==200){
               this.loading=false;
               var arr=res.data.map((ele)=>{
                 return {date:ele.date,weight:ele.weight}
               })
               this.intChart1(arr)
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    // 近近12个月各类型占比
    getPercent(){
        this.loading=true;
        var url='';
        this.activeName==1?url='/platform/hospital/rubbish/percentInLastYear?isBottle=false':url='/platform/hospital/rubbish/percentInLastYear?isBottle=true';
        this.$axios({
            method:'get',
            url:url,
        }).then((res) =>{
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
  },
  mounted() {
     setTimeout(() => {
           this.getData()
           this.getPercent()
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

