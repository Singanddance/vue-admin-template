<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格，展示平台属性 -->
        <el-table border :data="attrList">
          <!-- 1 -->
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <!-- 2 -->
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <!-- 3 -->
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 14px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <!-- 4 -->
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <!-- 修改按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updataAttr(row)"
                style="marginRight:10px"
              ></el-button>
              <!-- elmUI的气泡确认框 -->
              <el-popconfirm
                :title="`确定删除 ${row.attrName} 吗?`"
                @onConfirm="deleteAttr(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <!-- 1 -->
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <!-- 2 -->
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要span和input来回切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; height: 24px"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <!-- 3 -->
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- elmUI的气泡确认框 -->
              <el-popconfirm
                :title="`确定删除 ${row.valueName} 吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attr",
  data() {
    return {
      category1id: "",
      category2id: "",
      category3id: "",
      //接收平台属性的字段
      attrList: [],
      //控制表格的显示和隐藏
      isShowTable: true,
      //收集新增属性|修改属性名称
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值,因为属性值可以有多个因此用数组,每一个对象都需要attrId，valueName
          //点击添加的时候才有属性
          /* {
            attrId: undefined, //属性的id
            valueName: "", //相应的属性值
          }, */
        ],
        categoryId: 0, //3级分类的id
        categoryLevel: 3, //因为服务器需要知道是几级id
      },
    };
  },
  methods: {
    //自定义事件回调
    getCategoryId({ categoryid, level }) {
      //区分三级分类相应的id,以及父组件进行存储
      if (level == 1) {
        this.category1id = categoryid;
        this.category2id = "";
        this.category3id = "";
        this.attrList = [];
      } else if (level == 2) {
        this.category2id = categoryid;
        this.category3id = "";
        this.attrList = [];
      } else {
        //代表三级分类都有了
        this.category3id = categoryid;
        //发送请求获取平台的属性
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    //当用户确定了三级分类的数据的时候,可以向服务器发哦送你个请求获取平台属性进行展示
    async getAttrList() {
      const { category1id, category2id, category3id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1id,
        category2id,
        category3id
      );
      if (result.code == 200) {
        this.attrList = result.data;
        this.isShowTable = true;
      }
    },
    //添加属性值的回调(第二页的按钮) 本质上是修改第一页的属性
    addAttrValue() {
      //向属性值的数组里添加元素
      //attrId:是属性相对应的id,目前是添加操作,所以没有id
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候,可以在已有的属性值基础之上新增新的属性值,新增属性值的时候需要把已有的属性的id带上,因为本质上是一个修改操作
        valueName: "",
        //flag属性:给每一属性值添加一个标记flag,用于切换查看模式与编辑模式,每一flag控制自己的属性值
        //当前flag,是一个响应式数据,因为attrInfo是一个响应式数据
        flag: true,
      });
      //当新增一个input时自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调(第一页的按钮)
    addAttr() {
      //切换table显示与隐藏
      this.isShowTable = false;
      //清除数据
      //收集三级分类的id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3id,
        categoryLevel: 3,
      };
    },
    //修改某一个属性按钮的回调(第一页的按钮)
    updataAttr(row) {
      //切换table显示与隐藏
      this.isShowTable = false;
      //清除数据
      //收集三级分类的id
      //需要深拷贝
      // let data = JSON.stringify(row)
      // this.attrInfo = JSON.parse(data);
      // ---------------
      //lodash中的深拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候将相应的属性值添加上相应的flag
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag= false;
        //因为VUE无法探测普通得新增 property,这样写不是响应式属性
        //参数1:哪个对象,参数2:添加新的响应式属性名,参数:新的属性值
        this.$set(item, "flag", false);
      });
    },
    //当(第二页)中的添加input失去焦点时切换为查看模式(span)
    toLook(row) {
      // 如果属性值为空不能作为新的属性值,需要给用户提示,让他输入一个其他的属性值
      if (row.valueName.trim() == "") {
        this.$message("请输入一个值");
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row:最新新增的是行之
        //判断的时候,需要把已有的数组当中新增的这个属性值去除
        if (item !== row) {
          return row.valueName.trim() == item.valueName.trim();
        }
      });
      if (isRepat) {
        this.$message("请勿重复输入");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      //row:是当前要不过户添加的最新的属性值
      //当前的编辑模式变为查看模式(input消失变为span)
      row.flag = false;
    },
    //当点击(第二页)中span的回调,变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点,实现自动聚焦
      //注意,点击span的时候,切换为input编辑模式,但是因为v-if需要重绘与重排一个input,所以不能一点击span立马获取到input
      //$nextTick:当节点渲染完毕了,会执行一98次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //气泡确认框按钮(删除)的确定回调(第二页)
    //新版的elmUI的确认事件名是confirm，(该项elmUI版本低)确认事件名是onConfirm
    deleteAttrValue(index) {
      //当前删除属性值的操作不需要发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮的回调(第二页)
    async saveAttr() {
      //进行添加属性或者修改属性的操作
      //整理参数:
      // 1.如果用户添加了属性值为空的不应该提交给服务器。
      // 2.提交给服务器的数据中不应该存在flag字段
      const res = new Map();
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤掉属性值不是空的
          if (item.valueName != "") {
            //数组去重,去除重复的属性名
            if (!res.has(item.valueName) && res.set(item.valueName, 1)) {
              //删除掉flag属性
              delete item.flag;
              return true;
            }
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平平台属性的信号量,进行切换
        this.isShowTable = true;
        this.$message.success("保存成功");
        //保存成功后,刷新页面页数据
        this.getAttrList();
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    //删除属性按钮的回调(第一页)
    async deleteAttr(row) {
      let result = await this.$API.attr.reqDeleteAttr(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        this.getAttrList();
      } else {
        this.$message("删除失败");
      }
    },
  },
};
</script>

<style>
</style>
