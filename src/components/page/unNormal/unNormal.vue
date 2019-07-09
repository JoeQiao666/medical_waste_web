<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            异常记录
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </div>
    <div class="container">
          <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading"
          >
          <el-table-column
            prop="time"
            align="center"
            label="入库时间">
          </el-table-column>
            <el-table-column
            prop="weight"
            align="center"
            sortable
            label="复核重量"
          >
          </el-table-column>
          <el-table-column
            prop="weight"
            align="center"
            sortable
            label="上传重量"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            label="状态"
            :formatter="formatter"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
                 label="操作"
                 width="150" align="center">
                 <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row)">查看详情</span>
                 </template>
          </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
          </div>

    </div>

      <!-- 详情弹出框 -->
    <el-dialog title="导入科室" :visible.sync="visible" width="40%"  >
        <el-form   label-width="120px"  >
            <el-form-item label="文件："  >
                 <el-input value="detail" ></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      visible: false,
      total:0,
      cur_page:1,
      tableData:[
       {id:1,time:'2018-01-12 10:12:11',type:'xx型',weight:12.11,name:'输液大厅',status:1,detail:'12123123123'}
      ],
      total:0,
      cur_page:1,
      detail:''
    }
  },
  methods: {
     // 点击切换页码
    handleCurrentChange(val){
          this.cur_page = val;
          // this.getTask();
    },
    formatter(row){
      var is=''
      if(row.status==1){
        is='已确认'
      }else{
        is='未确认'
      }
      return is
    },
    detials(index,row){
      this.detail=row.detail;
      this.visible=true;
    }
  },
  mounted() {

 
  }
};
</script>


<style scoped>
 .new /deep/ .el-form-item{
   margin-bottom: 24px;
 }
</style>
