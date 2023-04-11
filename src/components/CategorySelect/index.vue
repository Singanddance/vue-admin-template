<template>
  <div>
    <!-- 
        inline代表行内表单,代表一行可以放置多个表单元素
        :model的作用:把表单数据收集到cForm上
     -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: {
    show:{
      typr:Boolean,
      default:false
    }
  },
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //手机相应的一，二，三级分类的ID
      cForm: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
    };
  },
  mounted() {
    //组件挂载完毕,向服务器发送请求,获取一级分类
    this.getCategory1List();
  },
  methods: {
    //获取一级分类数据的方法
    async getCategory1List() {
      //获取一级分类的请求,不需要携带参数
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的select的事件回调(当一级分类发生变化时获取相应的二级分类)
    async handler1() {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2id = "";
      this.cForm.category3id = "";
      // 解构出一级分类的id
      const { category1id } = this.cForm;
      this.$emit("getCategoryId", { categoryid: category1id, level: 1 });
      let result = await this.$API.attr.reqCategory2List(category1id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //二级分类的select的事件回调(当一级分类发生变化时获取相应的三级分类)
    async handler2() {
      // 清除数据
      this.list3 = [];
      this.cForm.category3id = "";
      // 解构出二级分类的id
      const { category2id } = this.cForm;
      this.$emit("getCategoryId", { categoryid: category2id, level: 2 });

      let result = await this.$API.attr.reqCategory2List(category2id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的事件回调
    handler3() {
      //获取三级分类的ID
      const { category3id } = this.cForm;
      this.$emit("getCategoryId", { categoryid: category3id, level: 3 });
    },
  },
};
</script>

<style>
</style>