<template>
  <div v-loading="loading">
    <!-- 添加或修改spu -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- type="textarea"表示文本框  rows="4"表示设置文本框高度-->
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- 文件上传(照片墙) action图片上传地址 list-type文件列表的类型 :on-preview图片预览时触发 :on-remove删除图片时触发 file-list照片墙需要展示的数据(数组),数组里面的的元素务必有name和url属性 -->
      <el-form-item label="SPU图片">
        <el-upload
          :action="baseURL"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrNanme"
        >
          <el-option
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrNanme"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- el-tag用于展示已有的属性值列表数据 -->
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="
                  row.spuSaleAttrValueList.splice(
                    row.spuSaleAttrValueList.indexOf(tag),
                    1
                  )
                "
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 以下结构类似之前的span和input切换 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="$index"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="$event.target.blur"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row, $index)"
                >添 加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="
                  spu.spuSaleAttrList.splice(
                    spu.spuSaleAttrList.indexOf(row),
                    1
                  )
                "
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="backSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //拼接的图片上传地址
      baseURL: `${process.env.VUE_APP_BASE_API}/admin/product/fileUpload`,
      dialogImageUrl: "",
      dialogVisible: false,
      //spu属性初始化是一个空对象，在修改spu的时候,会向服务器发请求,返回商铺信息(对象),在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加spu,如果是添加spu没有向服务器发送请求,收集数据的时候没有位置,所以不能是空对象
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu的名称
        spuName: "",
        //品牌的id
        tmId: '',
        //spu图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      }, //存储spu信息属性
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //销售属性的列表(项目的全部销售属性)
      attrIdAndAttrNanme: "", //收集未选择的销售属性的id和名称
      timer:null, //计时器
      loading: false,
    };
  },
  methods: {
    //照片墙删除图片时触发
    handleRemove(file, fileList) {
      //file代表删除的那个图片
      //fileList代表照片墙删除后剩下的图片
      //收集照片墙图片的数据
      //对于已有的图片(照片墙中显示的图片,有name和URL字段),但是服务器不需要这些字段
      this.spuImageList = fileList;
    },
    //照片墙图片预览时的回调
    handlePictureCardPreview(file) {
      //将数据中的图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //控制对话框显示
      this.dialogVisible = true;
    },
    //点击修改SPU按钮初始化Spuform数据
    initSpuData(row) {
      //在修改spu的时候,需要向服务器发送请求,把服务器返回的数据(对象),赋值给spu属性
      //1.获取SPU信息的数据
      let spuResult = this.$API.spu.reqSpu(row.id);
      //2.获取品牌的信息
      let tradeMarkResult = this.$API.spu.reqTrademarkList();
      //3.获取SPU图片的数据
      let spuImageResult = this.$API.spu.reqSpuImageList(row.id);
      //4.获取平台全部的销售属性
      let saleResult = this.$API.spu.reqBaseSaleAttrList();
      Promise.all([spuResult, tradeMarkResult, spuImageResult, saleResult])
        .then((res) => {
          res.forEach((item, index) => {
            switch (index) {
              case 0:
                this.spu = item.data;
                break;
              case 1:
                this.tradeMarkList = item.data;
                break;
              case 2:
                //由于照片墙显示的数据需要数组,数组级联的元素需要有name与url字段,所以需要把服务器返回的数据进行修改
                let listArr = item.data;
                listArr.forEach((item) => {
                  item.name = item.imgName;
                  item.url = item.imgUrl;
                });
                //将整理好的数据赋值
                this.spuImageList = listArr;
                break;
              case 3:
                this.saleAttrList = item.data;
                break;
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //照片墙图片上传成功的回调函数
    handlerSuccess(response, file, fileList) {
      //response是上传成功返回的信息
      //file是上传成功的那张图片
      //fileList是所有上传成功的图片
      this.spuImageList = fileList;
    },
    //添加新的销售属性
    addSaleAttr() {
      //已经收集到需要添加的销售属性信息
      //把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrNanme.split(":");
      //向spu对象的spuSaleAttrList属性里添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //添加完毕后清空数据
      this.attrIdAndAttrNanme = "";
    },
    //添加销售属性值按钮的回调(用于切换为编辑模式)
    addSaleAttrValue(row, index) {
      //点击销售属性值中的添加按钮是,需要button变为input,通过inputVisible控制
      //挂载在销售属性上的响应式数据inputVisible,控制button和input切换(通过$set添加)
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputValue收集新增的销售属性(通过$set添加)
      this.$set(row, "inputValue", "");
      //切换为编辑模式的时候自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //添加销售属性值input的回调(用于展示添加属性和切换为查看模式)
    handleInputConfirm(row) {
      // 添加需要携带的字段 baseSaleAttrId saleAttrValueName
      //解构出销售属性值需要收集的数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //新增的的销售属性值不能重复
      let result = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue.trim();
      });
      if (result) {
        this.$message("属性值不能重复");
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增属性值
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改这个inputVisible的值为false,显示button
      row.inputVisible = false;
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数,需要整理照片墙的数据
      //图片需要携带imgName和imgUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl ? item.imgUrl : item.response.data,
        };
      });
      this.loading = true;
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        //提示
        this.$message.success("保存成功");
        //通知父组件回到场景0
        this.timer = setTimeout(() => {
          this.$emit('changeScene', 0)
          this.loading = false;
        }, 2000);
      }
      this.$once("hook:beforeDestroy", () => {
          clearTimeout(timer);
        });
      //清除数据
      Object.assign(this._data,this.$options.data());
    },
    //取消按钮的回调
    backSpu(){
      this.$emit('changeScene', 0)
      //清理数据
      // Object.assign:es6新增属性方法,可以合并对象
      //组件实例this._data,可以操作data中的响应式数据
      //this.$options可以获取配置对象,配置对象的data函数一执行,返回的响应式数据会初始化
      Object.assign(this._data,this.$options.data());
    },
    // --------------------------
    //点击添加SPU按钮的时候,发送请求的函数
    addSpuData(category3Id){
      //添加SPU的时候添加category3Id
      this.spu.category3Id = category3Id;
      //1.获取品牌的信息
      let tradeMarkResult = this.$API.spu.reqTrademarkList();
      //2.获取平台全部的销售属性
      let saleResult = this.$API.spu.reqBaseSaleAttrList();
      Promise.all([ tradeMarkResult,saleResult])
        .then((res) => {
          res.forEach((item, index) => {
            switch (index) {
              case 0:
                this.tradeMarkList = item.data;
                break;
              case 1:
                this.saleAttrList = item.data;
                break;
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台的销售属性一共三个 颜色、尺码、版本 ---saleAttrList
      //当前spu自己拥有的销售属性 ---spu.spuSaleAttrList
      let result = this.saleAttrList.filter((item) => {
        // every是数组方法,会返回一个布尔值
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>