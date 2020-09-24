<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！！！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row style="margin: 20px 0">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="ParamsListSelect"
            :options="ParamsList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              chiilren: 'chiilren',
              label: 'cat_name',
            }"
            @change="handleChange"
            style="margin: 0 10px"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数区域 -->
          <el-button
            type="success"
            size="mini"
            :disabled="WhetherToDisable"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTabelData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <div>
                  <el-row>
                    <el-col
                      ><el-tag
                        style="margin: 5px 5px"
                        closable
                        type="warning"
                        v-for="(item, index) in scope.row.attr_vals"
                        :key="index"
                        @close="deleteTag(index, scope.row)"
                        >{{ item }}</el-tag
                      ></el-col
                    >
                    <!-- 输入的文本框 -->
                    <el-col>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.tagInputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        style="width: 150px"
                      >
                      </el-input>
                      <el-button
                        v-else
                        class="button-new-tag"
                        size="small"
                        @click="showInput(scope.row)"
                        >添加</el-button
                      >
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <!-- 数据列表 -->
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column
              label="参数名称"
              align="center"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="info"
                    class="el-icon-edit"
                    size="mini"
                    @click="editFormData(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    class="el-icon-delete"
                    size="mini"
                    @click="deleteFormData(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态参数区域 -->
          <el-button
            type="success"
            size="mini"
            :disabled="WhetherToDisable"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTabelData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" align="center">
               <template slot-scope="scope">
                <div>
                  <el-row>
                    <el-col
                      ><el-tag
                        style="margin: 5px 5px"
                        closable
                        type="warning"
                        v-for="(item, index) in scope.row.attr_vals"
                        :key="index"
                        @close="deleteTag(index, scope.row)"
                        >{{ item }}</el-tag
                      ></el-col
                    >
                    <!-- 输入的文本框 -->
                    <el-col>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.tagInputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        style="width: 150px"
                      >
                      </el-input>
                      <el-button
                        v-else
                        class="button-new-tag"
                        size="small"
                        @click="showInput(scope.row)"
                        >添加</el-button
                      >
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column
              label="属性名称"
              align="center"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="info"
                    class="el-icon-edit"
                    size="mini"
                    @click="editFormData(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    class="el-icon-delete"
                    size="mini"
                    @click="deleteFormData(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearForm(addForm)"
    >
      <!-- 表单区域 -->
      <el-form :model="addForm" :rules="rules" :ref="addForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm(addForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="dialogVisible2"
      width="50%"
      @close="clearForm(editForm)"
    >
      <!-- 表单区域 -->
      <el-form :model="editForm" :rules="rules" :ref="editForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submiteditForm(editForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ParamsList: [], //获取的商品分类列表的数据
      ParamsListSelect: [], //双向绑定的数组
      activeName: "many", //被激活的页签的名称
      manyTabelData: [], //获取的动态参数
      onlyTabelData: [], //获取的静态参数
      dialogVisible: false, //添加参数对话框
      dialogVisible2: false, //编辑参数对话框
      addForm: {
        //添加参数的数据
        attr_name: "",
      },
      editForm: {
        //修改参数的数据
        attr_name: "",
      },
      rules: {
        attr_name: [
          { required: true, message: "内容不能为空哦！！！", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getParamsList();
  },
  methods: {
    async getParamsList() {
      //获取商品分类的数据
      const { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数分类数据失败！！！");
      }
      this.ParamsList = res.data;
    },
    handleChange() {
      //监听级联选择器发生的改变
      this.getparamsData();
    },
    async getparamsData() {
      //根据需求获取商品分类的数据
      if (this.ParamsListSelect.length !== 3) {
        this.ParamsListSelect = []; //如果没有选中三级项的时候，为空
        (this.manyTabelData = []),//动态参数表格和静态属性表单参数清空
         (this.onlyTabelData = []);
        return;
      }
      //选中三级项时发起参数列表的数据请求
      const { data: res } = await this.axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      res.data.forEach((item) => {
        //将获取到的res.data下面的attr_vals便利
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []; //空格形式分开
        item.inputVisible = false; //控制文本框的显示与隐藏
        item.tagInputValue = ""; //tag文本框的值
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表 数据失败！！！");
      }
      if (this.activeName === "many") {
        //这里是判断获取到的值渲染位置
        this.manyTabelData = res.data; //特定的动态数据
      } else {
        this.onlyTabelData = res.data; //特定的静态数据
      }
    },
    handleClick() {
      //tab标签页点击事件
      this.getparamsData();
    },
    clearForm(addForm) {
      //监听对话框的关闭事件
      this.$refs[addForm].resetFields(); //清空对话框
    },
    submitAddForm(addForm) {
      //添加参数框的确定按钮
      this.$refs[addForm].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.axios.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加参数列表数据失败！！！");
          }
          this.getparamsData();
          this.dialogVisible = false;
          return this.$message.success("添加参数列表数据成功！！！");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async editFormData(id) {
      //编辑按钮
      this.dialogVisible2 = true;
      const { data: res } = await this.axios.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询参数数据失败！！！");
      }
      this.editForm = res.data;
    },
    submiteditForm(editForm) {
      //编辑信息的提交按钮
      this.$refs[editForm].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.axios.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("查询参数数据失败！！！");
          }
          this.getparamsData();
          this.dialogVisible2 = false;
          return this.$message.success("修改参数成功！！！");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteFormData(id) {
      //删除按钮
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.axios.delete(
            `categories/${this.cateId}/attributes/${id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除数据失败！！！");
          }
          this.getparamsData();
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
    async saveAttrVals(row) {
      //将对tag标签的数据请求封装起来
      const { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("添加失败！！！");
      }
      this.$message.success("添加成功！！！");
    },
    handleInputConfirm(row) {
      //添加tag标签失去焦点或者回车键按下触发的事件
      if (row.tagInputValue.trim().length === 0) {
        //判断文本框是否为空
        row.tagInputValue = "";
        row.inputVisible = false;
        return;
      }
      //如果输入框不为空的时候，将数据加入到tag标签中
      row.attr_vals.push(row.tagInputValue.trim());
      row.inputVisible = false;
      row.tagInputValue = "";
      //添加后需要发起请求保存到数据库中
      this.saveAttrVals(row);
    },
    deleteTag(index, row) {
      //删除对于的tag标签数据
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row); //保存删除数据，并且发起数据请求
    },
    showInput(row) {
      //点击了按钮展示tag输入款
      row.inputVisible = true;
      //文本框自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  computed: {
    //判断按钮是否被禁用
    WhetherToDisable() {
      if (this.ParamsListSelect.length !== 3) {
        //没有选中三级数据的话返回true，代表禁用
        return true;
      }
      return false;
    },
    cateId() {
      //当前选中三级数据的id
      if (this.ParamsListSelect.length === 3) {
        //当选中三级数据时，返回三级数据的id
        return this.ParamsListSelect[2];
      }
      return null; //否则的话返回null
    },
    titleText() {
      //添加参数和添加属性对话框的title
      if (this.activeName === "many") {
        //判断返回的值
        return "动态参数";
      } else {
        return "静态属性";
      }
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