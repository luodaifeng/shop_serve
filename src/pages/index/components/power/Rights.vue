<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" border  height="800" stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
        <el-table-column prop="path" label="路径" align="center"></el-table-column>
        <el-table-column prop="level" label="权限等级" align="center">
            <template slot-scope="scope">
                <div>
                  <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
                  <el-tag type="warning" v-else-if="scope.row.level == 1">二级</el-tag>
                  <el-tag type="danger" v-else>三级</el-tag>
                </div>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],//权限列表的数据
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() { 
      const { data: res } = await this.axios.get("rights/list");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightsList = res.data;
    },
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