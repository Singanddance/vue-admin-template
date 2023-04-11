<template>
  <div v-loading="loading">
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经是全局组件了,可以直接使用 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 这里将来有三部分进行切换 -->
      <!-- 1 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table :data="records" style="width: 100%" border v-loading="loading">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来用hintButton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="UpdateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handelerDialog(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
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
        ></Pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"
        >添加|修改spu</SpuForm
      >
      <SkuForm v-show="scene == 2" @changeScenes="changeScenes" ref="sku"
        >添加sku</SkuForm
      >
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
    >
      <!-- table展示 -->
      <el-table :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //代表分页器第几页
      page: 1,
      //当前页展示数据的条数
      limit: 3,
      //数据总条数
      total: 0,
      //用来解决分页器新增的bug
      flag: true,
      //spu列表的数据
      records: [],
      //用来切换展示哪一个列表
      scene: 0, //0展示spu列表，1展示添加|修改spu，2展示添加sku
      loading: false,
      //控制对话框的显示|隐藏
      dialogTableVisible: false,
      spu: {},
      //存储的sku列表
      skuList: [],
    };
  },
  methods: {
    //三级联动的自定义事件,可以把子组件相应的id传递给父组件
    getCategoryId({ categoryid, level }) {
      //categoryId:获取1,2,3级分类的id  level: 为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryid;
        //清除2、3级分类的id、
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryid;
        //清除3级分类的id
        this.category3Id = "";
      } else if (level == 3) {
        this.category3Id = categoryid;
        //获取spu列表进行展示
        this.getSpuList();
      }
    },
    //获取SPU列表数据的方法
    async getSpuList() {
      //带带三个参数:page当前页数,limit每一页显示页数,category3Id
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //分页器的回调函数,用于改变page和limit(已封装,data接收的是子组件回传的属性)
    getPagination(data) {
      let { page, limit } = data;
      this.page = page;
      this.limit = limit;
      //重新发送请求
      this.getSpuList(this.page);
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件发送请求---两个
      this.$refs.spu.addSpuData(this.category3Id);
      this.page = 1;
    },
    //修改某一个spu按钮的回调
    UpdateSpu(row) {
      this.scene = 1;
      //获取子组件SPUform
      //在父组件中可以通过$ref获取子组件
      this.$refs.spu.initSpuData(row);
    },
    //SPUform自定义事件的回调(子传父),用于切换回到首页
    changeScene(scene) {
      //切换结构(场景)
      this.scene = scene;
      //子组件通知父组件切换场景,需要再次获取列表的数据惊醒展示
      this.getSpuList();
    },
    //删除SPU按钮的回调
    async deleteSpu(row) {
      this.loading = true;
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        //再次获取品牌列表的数据
        //如果当页面还有数据则停留在当前页,如果当前页没有数据则去到上一页
        if (!(this.records.length > 1)) {
          this.page = this.page - 1;
        }
        this.getSpuList();
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    //添加SKU按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法,让子组件发请求 --- 三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //SkUform自定义事件的回调(子传父),用于切换回到首页
    changeScenes(scene) {
      //切换结构(场景)
      this.scene = scene;
    },
    //点击查看按钮的回调
    async handelerDialog(spu) {
      //点击按钮时对话框为true
      this.dialogTableVisible = true;
      //保存spu的信息
      this.spu = spu;
      this.loading = true;
      //清除sku列表的数据,防止数据回显
      this.skuList = [];
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
  },
  mounted() {},
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>