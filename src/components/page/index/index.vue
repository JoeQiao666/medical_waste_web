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
          <div class="flex cloudBox" style="align-items: normal;">
            <div style="width:75%">
              <div class="flex headSelect" style="margin-bottom:50px">
                <div>{{title}}</div>
              </div>
              <div class="canvas" ref="ele" v-show="data1.length>0" id="mountNode1"></div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="盐水瓶" name="2">盐水瓶</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      title:'近30天回收医废总重量',
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
      ]
    };
  },
  methods: {
    handleClick() {},
    intChart1(data) {
      if(this.chart1!==undefined){
          this.chart1.changeData(dv);
          return 
      }
      this.chart1 = new G2.Chart({
        container: "mountNode1",
        forceFit: true,
        height:300
      });
       this.chart1.source(data);
       this.chart1.scale("sales", {
        tickInterval: 20
      });
       this.chart1.interval().position("year*sales");
       this.chart1.render();
    }
  },
  mounted() {
     this.intChart1(this.data1);
  }
};
</script>


<style scoped>
.cloudBox>div{
    width:48%;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    min-height: 345px;
    position: relative;
}
</style>
