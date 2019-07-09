<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-location-outline"></i> 角色管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>科室编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="borderBox">
        <div class="flex headSelect" style="margin-bottom:10px;">
          <div class="flex">
            <img class="titleIcon" src="../../../assets/img/form.png" alt />
            <div style="margin-top: -4px;">科室编辑</div>
          </div>

          <div class="flex funcHead">
            <div class="block">
              <span class="demonstration" style="margin-left:10px" >科室名称：</span>
              <el-input style="width:140px" v-model="kName" placeholder="请输入科室名称"></el-input>
            </div>
            <el-button
              style="margin-left:10px"
              @click="search"
              type="primary"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button
              style="margin-left:10px"
              @click="exportCode()"
              type="primary"
              icon="el-icon-download"
            >导出二维码</el-button>
            <el-button
              style="margin-left:10px"
              @click="exportDemo()"
              type="primary"
              icon="el-icon-download"
            >科室模板</el-button>
            <el-button
              style="margin-left:10px"
              @click="upload()"
              type="primary"
              icon="el-icon-upload2"
            >导入</el-button>
            <el-button
              style="margin-left:10px"
              @click="openAdd(1)"
              type="primary"
              icon="el-icon-plus"
            >新增</el-button>
          </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
          >
          <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
          <el-table-column prop="name"  label="科室" align="center" ></el-table-column>
          <el-table-column prop="code"  label="二维码" align="center"  >
                <template slot-scope="scope">
                        <span class="pointer"  @click="qrCode(scope.$index, scope.row)">点击查看</span>
                 </template>
          </el-table-column>
          <el-table-column prop="time"  label="修改时间" align="center"  ></el-table-column>
          <el-table-column  label="操作" width="100px" align="center" > 
                <template slot-scope="scope">
                        <span class="pointer"  @click="detials(scope.$index, scope.row)">编辑</span>
                        <span class="pointer" style="margin-left:10px"  @click="deal(scope.$index, scope.row)">删除</span>
                 </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="mTitle" :visible.sync="editVisible" width="40%"  >
        <el-form ref="ruleForm"  :model="ruleForm"  :rules="rules" label-width="120px" v-loading="loading1"  >
            <el-form-item label="科室名称：" prop="name" required>
                  <el-input v-model="ruleForm.name" ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer"  >
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
    </el-dialog>
   
   <!-- 上传弹出框 -->
    <el-dialog title="导入科室" :visible.sync="visible" width="40%"  >
        <el-form ref="ruleForm"   label-width="120px" v-loading="loading1"  >
            <el-form-item label="文件："  >
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    accept=".xls"
                    :limit="1"
                    :auto-upload="false"
                    action="https://jsonplaceholder.typicode.com/posts/"
                   >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer"  >
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="uploads">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 二维码弹出框 -->
    <el-dialog title="二维码展示" :visible.sync="codeVisible" width="40%"  >
        <div class="flex" style="height:120px;background:#FEFF00;">
                <div style="margin-top: 2px;" ><v-Code :name="codeText" ></v-Code></div>
                <div style=" color: #000;padding-left:20px">
                    <div style="margin: 5px 0px 18px; font-size: 18px;font-weight: 600;">{{codeText.name}}</div>
                    <div>医疗废物追溯</div>
                    <div>yiliaofeiwuzhuisu</div>
                </div>
        </div>
        <span slot="footer" class="dialog-footer"  >
            <el-button type="primary"  @click="codeVisible = false">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
const moment = require("moment");
import vCode from '../../common/qrcode.vue';
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      delVisible: false,
      visible: false,
      codeVisible: false,
      codeText:'',
      kName:'',
      mTitle:'新增',
      tableData: [
        {
          id: 1,
          name: "输液大厅",
          time: "2018-10-08 14:44",
        }
      ],
      total: 0,
      cur_page: 1,
      editVisible:false,
      ruleForm:{
        name:'',
      },
      rules: {
          name: [
              { required: true, message: '请输入科室名称' }
          ],
      },
      users:[
        {name:'超级管理员',value:'1'},
        {name:'交接人',value:'2'},
        {name:'回收员',value:'3'},
        {name:'暂存点',value:'4'},
        {name:'回收公司',value:'5'},
      ]
    };
  },
  components:{
         vCode
  },
  methods: {
    // 点击切换页码
    handleCurrentChange(val) {
      this.cur_page = val;
      // this.getTask();
    },
    // 查询
    search() {
      console.log(this.date);
    },
    openAdd(type){
      if(type==1){
        this.mTitle='新增'
      }else{
        this.mTitle='详情'
      }
      this.editVisible=true;
    },
    detials(){
      this.openAdd(2);
    },
    // 保存编辑
    saveEdit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.add()
            } else {
                return false;
            }
        });
    },
    // 添加
    add(){
        this.loading1=true;
        // this.$axios({
        //       method:'post',
        //       url:'/api/customer/save',
        //       data:this.$qs.stringify({
        //           name:this.ruleForm.name,
        //           key:this.ruleForm.key,
        //           userIds:this.ruleForm.manager.join(','),
        //           status:this.ruleForm.status,
        //           xzProId:this.ruleForm.xzProId
        //       })
        //   }).then((res) =>{
        //       if(res.data.code==200){
        //       this.loading1=false;
        //       this.editVisible = false;
        //       this.getData()
        //       }else{
        //           this.$message.error(res.data.msg);
        //       }
        //   }).catch((error) =>{
        //       console.log(error)    
        //   })
    },
    // 删除数据
    deleteRow(){

    },
    deal(index,row){
      this.id=row.id;
      this.delVisible=true;
    },
    exportCode(){
      console.log(11)
    },
    upload(){
      this.visible=true
    },
    uploads(){
      this.$refs.upload.submit();
    },
    qrCode(index,row){
        this.codeText={id:row.id,name:row.name}
        this.codeVisible=true;
    }
  },
  mounted() {
 
  }
};
</script>


<style scoped>
.cloudBox > div {
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 300px;
  position: relative;
}

.upload-demo /deep/ .el-upload--text{
  height:40px;
  width:100%;
}

</style>

