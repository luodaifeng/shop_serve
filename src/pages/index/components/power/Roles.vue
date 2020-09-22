<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题内容 -->
    <el-card class="box-card">
      <el-row>
        <!-- 添加角色按钮 -->
        <el-col>
          <el-button type="success">成功按钮</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表的表格 -->
      <el-table :data="rolesList" border stripe height="700">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 展开列布局 -->
            <el-row
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
              class="border_bottom"
              :class="{border_top:index==topIndex}"
            >
              <!-- 一级标签 -->
              <el-col :span="6">
                <el-tag type="success" closable @close="removePermissions(scope.row,item1.id)" >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级标签 -->
              <el-col :span="18">
                <el-row v-for="(item2) in item1.children" :key="item2.id">
                  <!-- 二级标签 -->
                  <el-col :span="6">
                    <el-tag type="warning" closable  @close="removePermissions(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标签 -->
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      class="border_bottom"
                      closable
                      @close="removePermissions(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope>
            <div>
              <el-button type="success" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              <el-button type="warning" size="mini" icon="el-icon-s-tools">分配权限</el-button>
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
      rolesList: [], //获取的值
      topIndex: 0,
    };
  },
  created() {
    this.getrolesList();
  },
  methods: {
    async getrolesList() {
      //请求roles的数据
      const { data: res } = await this.axios.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
    },
    removePermissions(row,item3_id) {
      //删除权限的操作
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
         this.axios.delete('roles/'+ row.id +'/rights/'+ item3_id).then(res=>{
             if(res.data.meta.status !==200) return this.$message.error(res.meta.msg); 
            this.getrolesList()
         })
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
.el-tag {
  margin: 7px;
}
.border_bottom {
  border-bottom: 1px solid #eee;
}
.border_top {
  border-top: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>