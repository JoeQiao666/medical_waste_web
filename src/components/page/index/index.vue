<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 首页
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" v-loading="loading">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="医废类" name="1">
          <div class="cloudBox" >
             <div class="flex  headSelect" style="margin-bottom:50px;min-height:auto">
                <div class="flex ">
                  <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                   <div>近30天回收医废总重量</div>
                </div>
                 <div>
                      <el-radio v-model="date" label="one">30天</el-radio>
                      <el-radio v-model="date" label="all">12个月</el-radio>
                </div>
             </div>
            <div class="flex" style="align-items: normal;">
              <div style="width:70%">
                <div class="canvas"  v-show="data1.length>0" id="mountNode1"></div>
              </div>
              <div style="width:30%">
                <div class="flex headSelect" style="margin-bottom:50px">
                  <div></div>
                </div>
                <div class="canvas"  v-show="data2.length>0" id="mountNode2"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="盐水瓶" name="2">
           <div class="cloudBox" >
            <div class="flex  headSelect" style="margin-bottom:50px;min-height:auto">
              <div class="flex ">
                <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                  <div>近30天回收盐水瓶总重量</div>
              </div>
                <div>
                    <el-radio v-model="date" label="one">30天</el-radio>
                    <el-radio v-model="date" label="all">12个月</el-radio>
              </div>
            </div>
            <div class="flex" style="align-items: normal;">
              <div style="width:70%">
                <div class="canvas"  v-show="data3.length>0" id="mountNode3"></div>
              </div>
              <div style="width:30%">
                <div class="flex headSelect" style="margin-bottom:50px">
                  <div></div>
                </div>
                <div class="canvas"  v-show="data4.length>0" id="mountNode4"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="borderBox">
         <div class="flex " style="margin-bottom:50px;">
                <img class="titleIcon" src="../../../assets/img/today.png" alt="">
                <div>今日医疗废物运转记录</div>
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
      date:'one',
      activeName: "1",
      data1: [
        {
          year: "1951 年",
          sales: 38
        },
        {
          year: "1952 年",
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
      data3: [
        {
          year: "1951 年",
          sales: 38
        },
        {
          year: "1952 年",
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
      data4:[{
        type: '感染性',
        value: 7140
      }, {
        type: '损伤性',
        value: 3875
      }, {
        type: '病理性',
        value: 2267
      }],
    }
  },
  methods: {
    handleClick(tab, event) {
       if(tab.index==1){
           setTimeout(()=>{
            this.intChart2(this.data3)
            this.intBar2(this.data4)
           },500)
       }else{
          setTimeout(()=>{
            this.intChart1(this.data1)
            this.intBar1(this.data2)
           },500)
       }
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
      this.chart1.interval().position("year*sales");
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
        this.chart2.guide().html({
          position: ['50%', '50%'],
          html: '<div class="g2-guide-html"><p class="btitle">近30天各类型占比</p></div>'
        });
        this.chart2.render();
    },
    // 初始化柱状图2
    intChart2(data) {
      if(this.chart3!==undefined){
          this.chart3.changeData(data);
          return 
      }
      this.chart3 = new G2.Chart({
        container: "mountNode3",
        forceFit: true,
        height:300,
        padding:'auto'
      });
      this.chart3.source(data);
      // 自定义模板，自定义tooltip展示
      this.chart3.tooltip({
      itemTpl: '<li>总重量: {value}</li>',
      position:'left'
      });
      this.chart3.interval().position("year*sales");
      this.chart3.render();
    },
    // 初始化饼图2
    intBar2(data){
      var startAngle = -Math.PI / 2 - Math.PI / 4;
      var ds = new DataSet();
      var dv = ds.createView().source(data);
        dv.transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent'
        });
        if(this.chart4!==undefined){
            this.chart4.changeData(dv);
            return 
        }
        this.chart4 = new G2.Chart({
            container: 'mountNode4',
            forceFit: true,
            height: 300,
            padding: 'auto'
        });
        this.chart4.source(dv);
        this.chart4.legend(true);
        this.chart4.coord('theta', {
            radius: 0.75,
            innerRadius: 0.7,
            startAngle: startAngle,
            endAngle: startAngle + Math.PI * 2
        });
        this.chart4.intervalStack().position('value').color('type', [ '#00FF7F', '#46A3FC','#DC143C']).opacity(1).label('percent', {
            formatter: function formatter(val,item) {
              return item.point.type+':'+parseFloat(val * 100).toFixed(2) + '%';
            }
        }).select;
        this.chart4.guide().html({
          position: ['50%', '50%'],
          html: '<div class="g2-guide-html"><p class="btitle">近30天各类型占比</p></div>'
        });
        this.chart4.render();
    },
  },
  mounted() {
     setTimeout(() => {
           this.intChart1(this.data1);
           this.intBar1(this.data2);
     }, 500);
 
  }
};
</script>


<style scoped>
.cloudBox>div{
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    min-height: 345px;
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

