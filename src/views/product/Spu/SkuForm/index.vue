<template>
  <div v-loading="loading">
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          type="number"
          placeholder="价格(元)"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="(sale, index) in spuSaleAttrList"
            :key="sale.id"
          >
            <el-select placeholder="请选择" v-model="sale.saleIdAndValueId">
              <el-option
                :label="saleValue.saleAttrValueName"
                :value="`${sale.id}:${saleValue.id}`"
                v-for="(saleValue, index) in sale.spuSaleAttrValueList"
                :key="saleValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          :data="spuImageList"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" prop="prop" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售属性的数据
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据: 父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类数据: 通过数据双向绑定收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类数据: 自己写代码收集
        //设置默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      //存储到父组件传递过来的spu数据
      spu: {},
      //收集图片数据的字段,收集的数据目前缺少isDefault字段
      imageList: [],
      timer:null, //计时器
      loading: false,
    };
  },
  methods: {
    //获取skuForm的数据
    getData(category1Id, category2Id, spu) {
      //收集父组件给与的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //1.获取图片的数据2.获取销售属性的数据3.获取平台属性的数据
      Promise.all([
        this.$API.spu.reqSpuImageList(spu.id),
        this.$API.spu.reqSpuSaleAttrList(spu.id),
        this.$API.spu.reqAttrList(category1Id, category2Id, spu.category3Id),
      ])
        .then((res) => {
          let list = res[0].data;
          list.forEach((item) => {
            item.isDefault = 0;
          });
          this.spuImageList = list;
          this.spuSaleAttrList = res[1].data;
          this.attrInfoList = res[2].data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //table表格复选框按钮事件
    handleSelectionChange(selection) {
      //获取到用户选中图片的信息数据,但是需要注意,当前手机的数据当中,缺少isDefault字段
      this.imageList = selection;
    },
    //选择默认图片的排他操作
    changeDefault(row) {
      //图片列表的数据的isDefault字段变为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      //点击那个图片数据为1
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消让父组件切换场景为0
    cancel() {
      this.$emit("changeScenes", 0);
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的事件
    async save() {
      //整理参数
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      //整理平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({attrId, valueId});
        }
        return prev
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.saleIdAndValueId){
          const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(":");
          prev.push({saleAttrId, saleAttrValueId});
        }
        return prev
      },[])
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            isDefault: item.isDefault,
            spuImgId: item.id,
        }
      })
      //发送请求
      this.loading = true;
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if(result.code == 200){
        this.$message.success('添加SKU成功');
        this.timer = setTimeout(() => {
          this.cancel();
          this.loading = false;
        }, 2000);
      }
      this.$once("hook:beforeDestroy", () => {
          clearTimeout(timer);
        });
    },
  },
};
</script>

<style>
</style>