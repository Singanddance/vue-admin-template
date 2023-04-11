<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="records" border>
      <!-- 1 -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <!-- 2 -->
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <!-- 3 -->
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <!-- 4 -->
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 88px; height: 88px"
          />
        </template>
      </el-table-column>
      <!-- 5 -->
      <el-table-column prop="weight" label="重量" width="width">
      </el-table-column>
      <!-- 6 -->
      <el-table-column prop="price" label="价格" width="width">
      </el-table-column>
      <!-- 7 -->
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pagination
      :page="page"
      :limit="limit"
      :total="total"
      @pagination="getPagination"
    ></Pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
              <img :src="img.imgUrl" alt="" style="width:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      page: 1, //当前页
      limit: 10, //代表当先显示几条
      total: 0, //总的的数据条数
      records: [], //存储SKU列表的数据
      skuInfo: {}, //存储SKU详情的数据
      drawer: false, //控制抽屉的显示|隐藏
    };
  },
  mounted() {
    //获取sku列表的方法
    this.getSkuList();
  },
  methods: {
    //分页器的回调函数,用于改变page和limit(已封装,data接收的是子组件回传的属性)
    getPagination(data) {
      let { page, limit } = data;
      this.page = page;
      this.limit = limit;
      //重新发送请求
      this.getSkuList();
    },
    //获取sku列表的方法
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message.success("上架成功");
      }
    },
    //下架
    async cancel(row) {
      let result = await this.$API.sku.reqcancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message.success("下架成功");
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    //获取SKU详情的方法
    async getSkuInfo(row) {
      //展示抽屉
      this.drawer = true;
      //获取SKU数据
      let result = await this.$API.sku.reqSkuById(row.id);
      console.log(result);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  .el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px 10px;
}
</style>