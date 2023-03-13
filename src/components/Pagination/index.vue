<template>
  <!-- 
      分页器
      当前第几页、数据总条数、每一页展示的条数、连续页码数
      current-page：当前第几页
      total：分页器的数据条数
      page-size：每一页展示的条数
      page-sizes：可以设置每一页展示多少数据
      layout：可以实现分页器的布局
      pager-count：页码按钮的数量 如果是7 连续页码为5
      ----------------------
      @size-change 某一页展示数据的条数改变时会触发
      @current-change 当前页码 改变时会触发
     -->
  <el-pagination
    style="margin-top: 20px; textAlign: center"
    :current-page="page"
    :total="total"
    :page-size="limit"
    :pager-count="7"
    :page-sizes="[3, 5, 10]"
    @current-change="handleCurrentChange"
    @size-change="handleSizeList"
    layout="prev, pager,next,->,sizes,total"
  >
  </el-pagination>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    page: { type: Number, default: 0 },
    limit: { type: Number, default: 0 },
  },
  // ['total','page','limit'],
  name: "pagination",
  data() {
    return {
      pageVal:0
    }
  },
  watch:{
    page(val,oldVal){
      this.pageVal=val
      console.log(val,oldVal);
    }
  },
  methods: {
    handleCurrentChange(pager) {
      //pager表示点击选中的页码
      //将pager回传到父组件
      console.log(111,this.page);
      this.$emit("pagination", { page: pager, limit: this.limit });
    },
    //当分页器某一页需要展示数据的条数发生变化的时候触发,
    handleSizeList(limit) {
      //limit表示点击page-sizes选中要展示的条数
      //将limit回传到父组件
      this.$emit("pagination", { page: this.page, limit: limit });
    },
  },
};
</script>

<style>
</style>