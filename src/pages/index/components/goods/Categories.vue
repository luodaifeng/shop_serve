<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card class="box-card">
      <el-row>
        <!-- 添加角色按钮 -->
        <el-col>
          <el-button
            type="success"
            @click="(dialogVisible = true), getParenCateData()"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <tree
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        style="margin: 20px 0"
      >
        <!-- 是否有效的模板 -->
        <template slot="isok" slot-scope="scope">
          <div>
            <i
              v-if="scope.row.cat_deleted === false"
              class="el-icon-success"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" style="color: lightgreen" v-else></i>
          </div>
        </template>
        <!-- 排序的模板 -->
        <template slot="order" slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级 </el-tag>
          </div>
        </template>
        <template slot="operation" slot-scope="scope">
          <div>
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="editData(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteData(scope.row.cat_id)"
              >删除</el-button
            >
          </div>
        </template>
      </tree>
    </el-card>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[2, 4, 8, 10]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearselsct(addCateForm)"
    >
      <!-- 表单区域 -->
      <el-form
        :model="addCateForm"
        :rules="rules"
        :ref="addCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源  props用来配置对象-->
          <el-cascader
            v-model="selsctParenCateData"
            :options="parenCateData"
            @change="handleChange"
            clearable
            change-on-select
            style="width: 100%"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              chiilren: 'chiilren',
            }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate(addCateForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑分类的弹出框 -->
    <el-dialog title="编辑分类" :visible.sync="dialogVisible2" width="50%">
      <el-form ref="editCateForm" :model="editCateForm">
        <el-form-item label="分类名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [], //商品分类的数据
      querInfo: {
        //接口的查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        //为table指定列
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          // template定义为模板列
          type: "template",
          //模板列的名称
          template: "isok",
        },
        {
          label: "排序",
          prop: "cat_level",
          // template定义为模板列
          type: "template",
          //模板列的名称
          template: "order",
        },
        {
          label: "操作",
          // template定义为模板列
          type: "template",
          //模板列的名称
          template: "operation",
        },
      ],
      dialogVisible: false, //添加用户弹出框
      dialogVisible2: false, //编辑分类的弹出框
      addCateForm: {
        cat_name: "", //将要添加分类的名称
        cat_pid: 0, //父级的ID
        cat_level: 0, //默认添加一级分类
      }, //添加用户的表单数据
      editCateForm: {
        cat_name: "", //编辑分类的数据
      },
      parenCateData: [], //获取的父级分类列表
      selsctParenCateData: [], //数据双向绑定的父级列表值
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //获取商品分类数据
      const { data: res } = await this.axios.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！！！");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      //监听分页器pagesize的该变
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newNum) {
      //监听分页器pagenum的该变
      this.querInfo.pagenum = newNum;
      this.getCateList();
    },
    async getParenCateData() {
      //获取父级分类数据
      //获取父级分类的数据列表
      const { data: res } = await this.axios.get("categories", {
        params: {
          type: 2, //只获取二级数据
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！！！");
      }
      this.parenCateData = res.data;
    },
    handleChange() {
      //监听选择器的值
      console.log(this.selsctParenCateData);
      if (this.selsctParenCateData.length > 0) {
        //分类父级的ID,length-1,代表最后一位
        this.addCateForm.cat_pid = this.selsctParenCateData[
          this.selsctParenCateData.length - 1
        ];
        //当前分类的等级赋值
        this.addCateForm.cat_level = this.selsctParenCateData.length;
      } else {
        //没有length的话代表为一级
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate(addCateForm) {
      //添加新的分类
      console.log(this.addCateForm);
      this.$refs[addCateForm].validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.axios.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品分类失败！！！");
        }
        this.$message.success("添加商品分类成功！！！");
        this.getCateList();
        this.dialogVisible = false;
      });
    },
    clearselsct(addCateForm) {
      //对话框关闭时重置表单
      this.$refs[addCateForm].resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      //清空数据双向绑定的值
      this.selsctParenCateData = [];
    },
    deleteData(id) {
      //删除按钮
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.axios.delete("categories/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除商品分类失败！！！");
          }
          this.getCateList();
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
    async editData(id) {
      //查询分类信息的数据请求
      this.dialogVisible2 = true;
      const { data: res } = await this.axios.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询商品失败！！！");
      }
      this.editCateForm = res.data;
    },
    async submitEditData() {
      const { data: res } = await this.axios.put(
        "categories/" + this.editCateForm.cat_id,{cat_name: this.editCateForm.cat_name} //请求体
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("编辑商品分类失败！！！");
      }
      this.$message.success("编辑商品分类成功！！！");
      this.getCateList();
      this.dialogVisible2 = false;
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
  margin: 20px 0;
}

.el-table {
  margin: 20px 0;
  font-size: 12px;
  text-align: center;
}
</style>