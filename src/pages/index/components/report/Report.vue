<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="main" :style="{ width: '750px', height: '400px' }"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
        options: { //后端返回的折线图书不完整的，需要整合代码
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  created() {
  },
  methods: {
    //折线图
 async drawLine() {
      let myChart = echarts.init(document.getElementById("main"));
       const { data: res } = await this.axios.get("reports/type/1");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      //合并两个对象
      const returnedTarget = Object.assign(this.options,res.data);
      myChart.setOption(returnedTarget);
    },
  },
  //生命周期dom渲染完毕，初始化echarts实例
  mounted() {
    this.drawLine();
  },
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin: 20px;
  font-size: 12px;
}
.box-card {
  margin: 20px;
}
.el-table {
  margin: 20px 0;
  font-size: 12px;
  text-align: center;
}
</style>