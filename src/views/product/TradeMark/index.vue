<template>
  <div v-loading="loading">
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 
      表格组件
      data: 表示组件将来需要展示的数据---[数组类型]
      border: 添加边框
      注意1:elementUI当中table组件,展示的数据是以一列一列进行展示
      -----------
      column的属性
        label: 显示的标题
        width: 对应列的宽度
        align: 标题的对齐方式
        type：对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮
        prop：对应列内容的字段名
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTadeTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <Pagination
      v-if="flag"
      :page="page"
      :limit="limit"
      :total="total"
      @pagination="getPagination"
      ref="Pagination"
    ></Pagination>

    <!-- 
      对话框 
      :visible.sync控制对话框显示或隐藏
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!--
         from表单 
         :model="tmForm" tmForm tmForm,对象中的属性名称是后端接口定义好的
         Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator
      -->
      <el-form
        style="width: 80%"
        :model="tmForm"
        :rules="rules"
        ref="rulerForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            action：设置图片上传地址
            show-file-list：是否显示已上传文件列表
            :on-success="handleAvatarSuccess" 检测图片是否上传成功,上传成功会执行一次
            :before-upload="beforeAvatarUpload"  图片上传之前的回调
            -------------------
            这里收集数据,不能用v-model
          -->
          <el-upload
            class="avatar-uploader"
            :action="baseURL"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: "tradeMark",
  data() {
    //elementUI提供的自定义效验规则
    /* 
      rule 相应的规则
      value 用户输入进来的文本
      callback 放行函数
    */
    var validateTmName = (rule, value, callback) => {
      //自定义规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称长度为2-10"));
      } else {
        callback();
      }
    };
    return {
      //拼接的图片上传地址
      baseURL: `${process.env.VUE_APP_BASE_API}/admin/product/fileUpload`,
      //代表分页器第几页
      page: 1,
      //当前页展示数据的条数
      limit: 3,
      //数据总条数
      total: 0,
      flag: true,
      loading: false,
      //列表展示的数据
      list: [],
      //对话框显示或隐藏
      dialogFormVisible: false,
      //收集品牌的信息:对象身上的属性是接口定好的
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      /* 
      表单验证:
      required 表示必须输入(不能为空,和最前面星星有关系)
      message 提示信息
      trigger 用户行为(通过哪个事件触发 共有[blur,change]两个事件)
      min,max 输入内容的长度
      */
      rules: {
        //品牌名称的验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          /* {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          }, */
          //自定义效验规则的用法
          { validator: validateTmName, trigger: "change" },
        ],
        //品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  //组件乖仔完毕后请求数据
  mounted() {
    //获取列表数据的方法
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList() {
      //结构出参数
      const { page, limit } = this;
      //获取品牌列表的接口,需要带参数,因此在data中初始化两个字段,代表给服务器传递的参数

      let result = await this.$API.tradeMark.reqTradeMark(page, limit);
      if (result.code == 200) {
        let { data } = result;
        //分别是 数据总条数和列表展示的数据
        this.total = data.total;
        this.list = data.records;
      }
      this.$nextTick(() => {
        this.flag = true;
      });
    },
    //分页器的回调函数,用于改变page和limit(已封装,data接收的是子组件回传的属性)
    getPagination(data) {
      let { page, limit } = data;
      this.page = page;
      this.limit = limit;
      //重新发送请求
      this.getPageList();
    },
    //点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //修改某一个品牌
    updateTradeMark(row) {
      //row是当前用户选中的品牌信息
      // 显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回的信息直接复制给tmForm展示,也就是说tmForm存储的就是服务器返回的信息
      this.tmForm = { ...row };
    },
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      //res表示上传成功后返回给前端的数据,会返回一个图片在线地址
      //收集品牌图片数据,因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前的回调,对将要上传的图片进行判定
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加或者修改品牌
    addOrUpdateTradeMark() {
      //当全部表单验证通过,在书写业务逻辑
      this.$refs.rulerForm.validate(async (success) => {
        //如果通过验证
        if (success) {
          this.dialogFormVisible = false;
          this.loading = true;
          //发送请求(添加品牌|修改品牌)
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出消息框,提示添加成功|修改成功
            this.$message.success(
              this.tmForm.id ? "修改品牌成功" : "添加品牌成功"
            );
            //重新获取数据
            //如果添加品牌;跳转到最后一页
            if (!this.tmForm.id) {
              this.page = Math.ceil((this.total + 1) / this.limit);
              // this.$refs.Pagination.handleCurrentChange(this.page);
              this.flag = false;
              // return;
            }
            this.getPageList();
          }
          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌的操作,需要品牌ID
    deleteTadeTradeMark(row) {
      //饿了吗UI弹窗
      this.$confirm(`你确定删除${row.tmName}吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击确定按钮时候触发
          //向服务器发请求
          this.loading = true;
          let result = await this.$API.tradeMark.reqDeleteTradeMark();
          //如果请求成功的操作
          if (result.code === 200) {
            this.$message.success("删除成功!");
            //再次获取品牌列表的数据
            //如果当页面还有数据则停留在当前页,如果当前页没有数据则去到上一页
            if (!(this.list.length > 1)) {
              this.page = this.page - 1;
            }
            this.getPageList();
          } 
            setTimeout(() => {
              this.loading = false;
            }, 500);
          
        })
        .catch(() => {
          //当用户点击取消时触发
          this.$message.info("已取消删除");
        });
    },
  },
  components: {
    Pagination,
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>