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
              @click="toQrcode()"
              type="primary"
              icon="el-icon-download"
            >导出二维码</el-button>
            <el-button
              style="margin-left:10px"
              type="primary"
              icon="el-icon-download"
            >
            <a style="color:#fff" href="../../../../static/file/科室导入模板.xls" download="科室导入模板.xls" >科室模板</a>
            </el-button>
            <el-button
              style="margin-left:10px"
              @click="upload()"
              type="primary"
              icon="el-icon-upload2"
              v-if="permission=='修改'"
            >导入</el-button>
            <el-button
              style="margin-left:10px"
              @click="openAdd(1)"
              type="primary"
              icon="el-icon-plus"
              v-if="permission=='修改'"
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
                        <span class="pointer"  v-if="permission=='修改'"  @click="detials(scope.$index, scope.row)">编辑</span>
                        <span class="pointer"  v-if="permission=='修改'" style="margin-left:10px"  @click="deal(scope.$index, scope.row)">删除</span>
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
    <el-dialog title="导入科室" :visible.sync="visible" width="40%"   v-loading="loading2">
        <el-form ref="ruleForm"   label-width="120px"   >
            <el-form-item label="文件："  >
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    accept=".xls"
                    :limit="1"
                    :auto-upload="false"
                    :on-change="inputChange"
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
    
    <div class="picBox" >
        <div class="flex" v-for="(item,index) in tableData" v-bind:key="index" :id="'canvasBox'+index" style="height:120px;background:#FEFF00;width:280px;">
                <div style="margin-top: 3px;" ><canvas class="canvas" :id="'canvas'+index"></canvas></div>
                <div style=" color: #000;padding-left:20px">
                    <div style="margin: 5px 0px 18px; font-size: 18px;font-weight: 600;">{{item.name}}</div>
                    <div>医疗废物追溯</div>
                    <div>yiliaofeiwuzhuisu</div>
                </div>
        </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
const moment = require("moment");
import vCode from '../../common/qrcode.vue';
import html2canvas from 'html2canvas';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      loading2: false,
      delVisible: false,
      visible: false,
      codeVisible: false,
      permission:false,
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
      this.getData()
    },
    // 查询
    search() {
      console.log(this.date);
    },
    openAdd(type,row){
         this.loading1=false;
      if(type==1){
        this.mTitle='新增';
        this.ruleForm={
             name:'',
        };
        if(this.$refs['ruleForm']){
           this.$refs['ruleForm'].resetFields();
        }
      }else{
        this.mTitle='详情';
        var form=this.ruleForm;
        for(var key in row){
          form[key]=row[key]
        }
        this.ruleForm=form;
      }
      this.editVisible=true;
    },
    detials(index,row){
      this.openAdd(2,row);
    },
    // 保存编辑
    saveEdit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.mTitle=='新增'){
                this.add()
              }else{
                this.edit()
              }
            } else {
                return false;
            }
        });
    },
    // 批量添加
    allAdd(data){
        this.loading=true;
        this.$axios({
              method:'post',
              url:'/platform/hospital/department/batch',
              data:data
          }).then((res) =>{
              if(res.data.code==0){
              this.loading=false;
              this.visible = false;
              this.$message.error('添加成功');
              this.getData()
              }else{
                  this.$message.error(res.data.msg);
              }
          }).catch((error) =>{
              console.log(error)    
          })
    },
    // 添加
    add(){
        this.loading1=true;
        this.$axios({
              method:'post',
              url:'/platform/hospital/department/addDo',
              data:{
                  name:this.ruleForm.name,
              }
          }).then((res) =>{
              if(res.data.code==0){
              this.loading1=false;
              this.editVisible = false;
              this.getData()
              }else{
                  this.$message.error(res.data.msg);
              }
          }).catch((error) =>{
              console.log(error)    
          })
    },
    exportDemo(){
 
    },
    // 编辑
    edit(){
        this.loading1=true;
        this.$axios({
              method:'put',
              url:'/platform/hospital/department/editDo',
              data:this.ruleForm
          }).then((res) =>{
              if(res.data.code==0){
              this.loading1=false;
              this.editVisible = false;
              this.getData()
              }else{
                  this.$message.error(res.data.msg);
              }
          }).catch((error) =>{
              console.log(error)    
        })
    },
    inputChange(file){
      const reader = new FileReader();
			reader.onload = (e) => {
				/* Parse data */
				const bstr = e.target.result;
				const wb = XLSX.read(bstr, {type:'binary'});
				/* Get first worksheet */
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				/* Convert array of arrays */
				const data = XLSX.utils.sheet_to_json(ws, {header:1});
        /* Update state */
        data.shift();
        if(data[0]&&data[0].length!==1){
            this.$message('模板格式错误');
            this.$refs.upload.clearFiles();
            return 
        }else if(!data[0]){
            this.$message('空模板');
            this.$refs.upload.clearFiles();
            return 
        }
        var arr=data.map((ele)=>{
            return{"name":ele[0]}
        })
        this.allAdd(arr)
			};
			reader.readAsBinaryString(file.raw);
    },
    toQrcode(){
          this.loading=true;
          var imgArr=[],i=this.tableData.length-1,that=this;
          setTimeout(()=>{
              this.tableData.forEach((ele,ind)=>{
                    var canvas = document.getElementById('canvas'+ind),name={id:ele.id,name:ele.name};
                    // 生成二维码
                    QRCode.toCanvas(canvas, JSON.stringify(name),{width:120,height:120,margin:0,logo:'121212'}, function (error) {
                      if (error) console.error(error)
                    })
                    var canvasBox = document.getElementById('canvasBox'+ind);
                      // dom生成base64图片
                    html2canvas(canvasBox).then(function(canvas1) {
                        var fullQuality = canvas1.toDataURL("image/jpeg", 1.0);
                        fullQuality=fullQuality.substring(fullQuality.indexOf(',')+1);
                        imgArr.push({text:ele.name+'.png',img:fullQuality});
                        if(ind==i){
                          // 调用打包函数
                             that.wrapImageToZip(that,imgArr,'科室二维码打包');
                        }
                    });
              })
               this.loading=false;
          },500)
    },
    // 删除数据
    deleteRow(){
        this.$axios({
              method:'DELETE',
              url:'/platform/hospital/department/delete?ids='+this.id,
          }).then((res) =>{
              if(res.status==200){
                  this.$message.success('删除成功');
                  this.delVisible=false;
                  this.getData();
              }else{
                  this.$message.error(res.data.msg);
              }
          }).catch((error) =>{
              console.log(error)    
        })
    },
    deal(index,row){
      this.id=row.id;
      this.delVisible=true;
    },
    upload(){
      this.visible=true
    },
    uploads(){
      // this.$refs.upload.submit();
      console.log(this.$refs.upload)
    },
    qrCode(index,row){
        this.codeText={id:row.id,name:row.name}
        this.codeVisible=true;
    },
    getData(){
        this.loading=true;
        this.$axios({
            method:'get',
            url:'/platform/hospital/department/listPage?pageNumber='+this.cur_page+'&pageSize=10&name='+this.kName,
        }).then((res) =>{
            if(res.status==200){
                this.loading=false;
                this.tableData=res.data.list.map((ele)=>{
                    ele.time=moment(ele.opAt).format('YYYY-MM-DD HH:mm:ss')
                    return ele
                });
                this.total=res.data.totalCount;
            }else{
                this.$message.error(res.data.msg);
            }
        }).catch((error) =>{
            console.log(error)    
        })
    },
    wrapImageToZip(app,strFileList, filename){
        let that = this,
          arrImages = strFileList,
          imageCount = arrImages.length,
          numCount = 0,
          arrBase64 = [];
        arrImages.map(item => {
            numCount++;
            // arrBase64.push({ext, item});
            if (numCount == imageCount) {
              Promise.all([
                // 下面是引入依赖包
                require('jszip'),
              ]).then(([JSZip, FileSaver]) => {
                let zip = new JSZip();
                let img = zip.folder('');
                arrImages.map((ele)=>{
                  img.file(ele.text,ele.img, {base64: true});
                })
                // 图片是base64格式,但不要base64前缀
                let fileName = `${filename}.zip`;
                zip.generateAsync({type: 'blob'})
                  .then(function (content) {
                    saveAs(content, fileName);
                  });
              });
            }
       });
    }
  },
  mounted() {
    this.permission=localStorage.permission;
    this.getData()
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
  height:46px;
  width:100%;
  padding:5px 0;
}
.canvas{
  width: 250px;
  height: 120px;
}
.picBox{
  position: absolute;
  left:-100vw;
}

</style>

