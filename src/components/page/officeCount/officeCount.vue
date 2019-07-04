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
            <div class="cloudBox" >
              <div class="flex  headSelect" style="margin-bottom:50px;min-height:auto">
                  <div class="flex ">
                    <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                    <div>近30天各科室产生医废总量</div>
                  </div>
              </div>
              <div class="flex" style="align-items: normal;">
                <div style="width:100%">
                  <div class="canvas"  v-show="data1.length>0" id="mountNode1"></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="盐水瓶" name="2">
            <div class="cloudBox" >
              <div class="flex  headSelect" style="margin-bottom:50px;min-height:auto">
                <div class="flex ">
                  <img class="titleIcon" src="../../../assets/img/day.png" alt="">
                    <div>近30天各科室产生盐水瓶总重量</div>
                </div>
              </div>
              <div class="flex" style="align-items: normal;">
                <div style="width:100%">
                  <div class="canvas"  v-show="data3.length>0" id="mountNode3"></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
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
                prop="name"
                label="科室">
              </el-table-column>
                <el-table-column
                prop="weight"
                sortable
                label="重量"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                sortable
                label="类型"
              >
              </el-table-column>
            
              <el-table-column
                prop="status"
                label="记录状态"
                sortable
                :formatter="formatter"
                >
              </el-table-column>
              <el-table-column
                prop="p1"
                label="操作人"
                sortable
                :formatter="formatter"
                >
              </el-table-column>
              <el-table-column
                prop="p2"
                label="交接人"
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
      data1: [
        {
          year: "输液大厅",
          sales: 38
        },
        {
          year: "急诊（门诊）",
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
                  is='激活';
              }else{
                  is='关闭';
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
           setTimeout(()=>{
            this.intChart2(this.data3)
           },500)
       }else{
          setTimeout(()=>{
            this.intChart1(this.data1)
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
        padding: [20, 'auto', 50, 'auto']
      });
      this.chart1.source(data);
      // 自定义模板，自定义tooltip展示
      this.chart1.tooltip({
      itemTpl: '<li>总重量: {value}</li>',
      position:'left'
      });
      this.chart1.interval().position("year*sales").opacity(1).label('value', {
        useHtml: true,
        htmlTemplate: function htmlTemplate(text, item) {
          var a = item.point;
          return '<span class="g2-label-item"><p class="g2-label-item-value">' + a.sales + 'kg</p></div>';
        }
      });
      this.chart1.render();
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
      this.chart3.interval().position("year*sales").opacity(1).label('value', {
        useHtml: true,
        htmlTemplate: function htmlTemplate(text, item) {
          var a = item.point;
          return '<span class="g2-label-item"><p class="g2-label-item-value">' + a.sales + 'kg</p></div>';
        }
      });
      this.chart3.render();
    },
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

