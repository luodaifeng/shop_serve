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
          <el-button type="success" @click="dialogVisible2=true">添加角色</el-button>
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
                <el-tag
                  type="success"
                  closable
                  @close="removePermissions(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级标签 -->
              <el-col :span="18">
                <el-row v-for="(item2) in item1.children" :key="item2.id">
                  <!-- 二级标签 -->
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="removePermissions(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
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
          <template slot-scope="scope">
            <div>
              <el-button type="success" size="mini" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteRole(scope.row.id)"
              >删除</el-button>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-s-tools"
                @click="assignPermissions(scope.row)"
              >分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%" @close="clearRightsData">
      <!-- 树形控件 -->
      <el-tree
        :data="rolesData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="assignKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="okButton">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible2" width="50%">
      <el-form :ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm(addForm)">取 消</el-button>
        <el-button type="primary" @click="submitAddForm(addForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogVisible3" width="50%">
      <el-form v-model="editForm">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm(editForm)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [], //获取的角色列表数据
      topIndex: 0,
      dialogVisible: false, //分配权限弹出框
      dialogVisible2: false, //添加用户弹出框
      dialogVisible3: false, //编辑用户弹出框
      rolesData: [], //修改权限列表数据
      defaultProps: {
        //树形控件
        children: "children",
        label: "authName",
      },
      assignKeys: [],
      rolesId: "", //当前即将分配权限的id
      addForm: {
        //添加用户的数据
        roleName: "",
        roleDesc: "",
      },
      editForm: {//编辑用户的数据
       
      }, 
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
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
    removePermissions(row, item3_id) {
      //删除权限的操作
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete("roles/" + row.id + "/rights/" + item3_id)
            .then((res) => {
              if (res.data.meta.status !== 200)
                return this.$message.error(res.meta.msg);
              this.getrolesList();
            });
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
    async assignPermissions(row) {
      //分配权限按钮
      this.dialogVisible = true;
      //角色id
      this.rolesId = row.id;
      console.log(this.rolesId);
      // 获取权限数据
      const { data: res } = await this.axios.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesData = res.data;
      //调用递归函数
      this.getAssignKeys(row, this.assignKeys);
    },
    getAssignKeys(node, arr) {
      //通过递归的形式，获取角色下的所有三级权限的id值
      if (!node.children) {
        //递归函数的缺口是三级权限没有children值
        return arr.push(node.id); //将三级权限的ID值添加到arr数组中
      }
      node.children.forEach((item) => {
        this.getAssignKeys(item, arr);
      });
    },
    clearRightsData() {
      //监听对话框关闭事件
      this.assignKeys = []; //关闭对话框是清空数组数据，每个数据都不重复
    },
    async okButton() {
      //分配权限确定按钮
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(), //选中的id和父元素的id
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idstr = keys.join(","); //后台数据要求数组的值用','隔开
      const { data: res } = await this.axios.post(
        `roles/${this.rolesId}/rights`,
        {
          rids: idstr,
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.dialogVisible = false; //关闭对话框
      this.getrolesList(); //更新数据
      this.$message.success("添加权限成功！！！");
    },
    resetAddForm(addForm) {
      //添加用户弹出框中的取消按钮
      //添加用户弹出框、取消按钮
      this.$refs[addForm].resetFields();
      this.dialogVisible2 = false;
    },
    submitAddForm(addForm) {
      //添加用户弹出框中的确定按钮
      this.$refs[addForm].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.axios.post("roles", this.addForm); //添加角色调用数据
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.getrolesList(); //刷新数据
          this.dialogVisible2 = false;
          this.$message({
            message: "添加成功！！！",
            type: "success",
          });
        } else {
          return false;
        }
      });
    },
    deleteRole(id) {
      //删除用户操作
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.axios.delete("roles/" + id); //调用删除用户api
          if (res.meta.status !== 200)
            return this.$message.error("删除用户失败！！！");
          this.getrolesList();
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
    async editRole(id) {
      //编辑用户弹出框
      this.dialogVisible3 = true;
      const { data: res } = await this.axios.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败！！！");
      }
      this.editForm = res.data;
    },
   async submitEditForm(editForm){ //修改用户提交数据
     const {data:res} = await this.axios.put("roles/" + editForm.roleId,{
       roleName:editForm.roleName,
       roleDesc:editForm.roleDesc,
     })
     if(res.meta.status !==200) {
        return this.$message.error("删除用户失败！！！");
      }
      this.dialogVisible3 = false
      this.getrolesList();
       this.$message.success("编辑用户成功！！！");
    }
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