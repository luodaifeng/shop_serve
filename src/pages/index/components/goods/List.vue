<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearListData"
          >
            <el-button slot="append" @click="searchListData">
              <i class="el-icon-search"></i>
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表数据区域 -->
      <el-table :data="goodsListData" border stripe>
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          align="center"
          width="170px"
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          align="center"
          width="240px"
        >
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230px">
          <template slot-scope="scope">
            <el-row>
              <!-- 修改按钮 -->
              <el-button type="primary" size="mini">
                <i class="el-icon-edit"></i>
              </el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                size="mini"
                @click="deleteListData(scope.row)"
              >
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
        :page-sizes="[5, 7, 10]"
        :page-size="queryInfo.pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      goodsListData: [], //商品列表的数据
      total: 0, //总数据条数
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    async getListData() {
      //获取商品列表的数据
      const { data: res } = await this.axios.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.goodsListData = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newsSize) {
      //监听页数
      this.queryInfo.pagesize = newsSize;
      this.getListData();
    },
    handleCurrentChange(newsNum) {
      //监听条数
      this.queryInfo.pagenum = newsNum;
      this.getListData();
    },
    searchListData() {
      //搜索按钮
      this.getListData();
    },
    clearListData() {
      //清空按钮
      this.getListData();
    },
    deleteListData(row) {
      //删除数据操作
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {//确定删除时发起请求
          const { data: res } = await this.axios.delete(
            "goods/" + row.goods_id
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除商品失败！！");
          }
          this.getListData();
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
  goAddpage(){
      this.$router.push('/goods/add')
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