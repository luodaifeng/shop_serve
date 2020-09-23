<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" @click="getUserList()">
              <i class="el-icon-search"></i>
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="AddUser()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList" border>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-row>
              <!-- 修改按钮 -->
              <el-button type="primary" size="mini" @click="editData(scope.row.id)">
                <i class="el-icon-edit"></i>
              </el-button>
              <!-- 分配角色按钮 -->
              <el-button type="warning" size="mini" @click="assignRole(scope.row)">
                <i class="el-icon-setting"></i>
              </el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" size="mini" @click="deleteData(scope.row.id)">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <!-- 表单 -->
      <el-form :model="userForm" :ref="userForm" :rules="rules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm(userForm)">取 消</el-button>
        <el-button type="primary" @click="submitForm(userForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="dialogVisible2"
      width="50%"
      @close="editForms(reviseForm)"
    >
      <!-- 表单 -->
      <el-form :model="reviseForm" :ref="reviseForm" :rules="rules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="reviseForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="reviseForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="reviseForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitData(reviseForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisible3" width="50%">
      <!-- 主体内容 -->
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <!-- 下拉菜单 -->
          <el-select placeholder="请选择" v-model="selectMain">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="saveRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入一个合法的邮箱"));
    };
    //手机号正则
    var checkPass = (rule, value, callback) => {
      const regPass = /^[1]+[0-9]{10}$/;
      if (regPass.test(value)) {
        return callback();
      }
      callback(new Error("请输入一个合法的手机号"));
    };
    return {
      queryInfo: {
        //接收数据的参数
        query: "",
        pagenum: 1, //当前的页数
        pagesize: 2, //当前显示的消息条数
      },
      usersList: [],
      total: 0,
      dialogVisible: false, //添加用户弹出框
      dialogVisible2: false, //修改用户弹出框
      dialogVisible3: false, //分配角色弹出框
      userForm: {
        //添加用户
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      reviseForm: {
        //修改用户获取到的数据请求
      },
      userInfo: "", //需要被分配角色的用户信息
      rolesList: "", //角色列表数据
      selectMain: "", //下拉菜单的数据的id值
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: checkPass, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      //获取user的数据
      const { data: res } = await this.axios.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return console.error(res.meta.msg);
      this.usersList = res.data.users;
      this.total = res.data.total; //total是用户数量
    },
    handleSizeChange(newSize) {
      //监听page-sizes
      this.queryInfo.pagesize = newSize;
      this.getUserList(); //重新请求数据
    },
    handleCurrentChange(newCurrent) {
      //监听页码值
      this.queryInfo.pagenum = newCurrent;
      this.getUserList();
    },
    async stateSwitch(row) {
      //监听switch的值
      const { data: res } = await this.axios.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        row.mg_state = !row.mg_state; //如果获取数据失败，则取反，不进行操作
      } else {
        this.$message({
          message: "更新状态成功！！！",
          type: "success",
        });
      }
    },
    AddUser() {
      //添加用户弹出框
      this.dialogVisible = true;
    },
    submitForm(userForm) {
      //添加弹出框的确定按钮
      this.$refs[userForm].validate(async (valid) => {
        //判断是否通过正则
        if (valid) {
          const { data: res } = await this.axios.post("users", this.userForm); //获取后台数据,并且添加用户
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg); //判断状态码
          this.$message({
            message: "用户添加成功！！！",
            type: "success",
          });
          this.dialogVisible = false; //关闭对话框
          this.getUserList(); //重新获取用户列表
          this.$refs[userForm].resetFields(); //清空输入框
        } else {
          return false;
        }
      });
    },
    resetForm(userForm) {
      //弹出框的取消按钮，
      this.$refs[userForm].resetFields(); //清空input数据
      this.dialogVisible = false;
    },
    editData(id) {
      //获取要修改的数据
      this.dialogVisible2 = true;
      this.axios.get("users/" + id).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error(res.meta.msg);
        this.reviseForm = res.data.data;
      });
    },
    editForms(reviseForm) {
      //修改框关闭后的回调，将input清空
      this.$refs[reviseForm].resetFields();
    },
    submitData(reviseForm) {
      //修改框的提交按钮
      this.$refs[reviseForm].validate(async (valid) => {
        //判断是否通过正则
        if (valid) {
          //修改用户信息，并且提交修改
          const { data: res } = await this.axios.put(
            "users/" + this.reviseForm.id,
            { email: this.reviseForm.email, mobile: this.reviseForm.mobile }
          );
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg); //失败的时候抛出错误
          this.$message({
            message: "修改用户成功！！！",
            type: "success",
          });
          this.dialogVisible2 = false; //关闭对话框
          this.getUserList(); //重新获取用户列表
          this.$refs[reviseForm].resetFields(); //清空输入框
        } else {
          return false;
        }
      });
    },
    deleteData(id) {
      //删除按钮
      this.$confirm("此操作将永久删除该用户吗？？？, 是否继续?", "提示", {
        //是否删除弹框
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete("users/" + id).then((res) => {
            //点击确定按钮后，从数据库删除数据
            console.log(res.data);
            if (res.data.meta.status !== 200)
              return this.$message.error("删除用户失败！！！"); //失败的时候抛出错误
            this.getUserList(); //重新获取用户列表
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
    async assignRole(row) {
      //分配角色按钮
      this.userInfo = row;
      //获取角色列表
      const { data: res } = await this.axios.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！！！");
      this.rolesList = res.data;
      this.dialogVisible3 = true;
    },
    async saveRolesInfo() {
      //分配角色点击按钮
      if (!this.selectMain)
        return this.$message.error("用户数据不能为空！！！");
      const {
        data: res,
      } = await this.axios.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectMain,
      });
      if (res.meta.status !== 200)
        return this.$message.error("更新角色失败！！！");
      this.$message.success("更新角色成功！！！");
      this.dialogVisible3 = false;
      this.getUserList();
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