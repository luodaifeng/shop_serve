<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearOrder"
          >
            <el-button slot="append" @click="searchOrder">
              <i class="el-icon-search"></i>
            </el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderListData" border stripe>
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          align="order_number"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          align="center"
        ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag type="danger" v-if="scope.row.pay_status === '0'"
                >未付款</el-tag
              >
              <el-tag type="success" v-else>已付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          align="center"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="">
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editAddress"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-location"
                size="mini"
                @click="positioning"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 12, 2]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addressDialog(addOrderForm)"
    >
      <!-- 表单区域 -->
      <el-form :model="addOrderForm" :rules="rules" :ref="addOrderForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            style="width: 100%"
            :options="citydata"
            v-model="addOrderForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="dialogVisible2"
      width="50%"
    >
      <el-timeline>
     <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.ftime"
      :color="activitys.color"
      placement="top">
      <!-- {{activity.context}} -->
       <el-card style="color:red">
        <h4>{{activity.context}}</h4>
      </el-card>
    </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      orderListData: [],
      total: 0,
      dialogVisible:false,
       dialogVisible2:false,
      addOrderForm:{
        address1:[],
        address2:''
      },
      activitys:{
        color:'blue'
      },
      citydata:citydata,
      progressInfo:[],
      rules:{
        address1:[
         { required: true, message: '请选择省市区/县', trigger: 'blur' },
      ],
      address2:[
         { required: true, message: '请输入详细地址', trigger: 'blur' },
      ]
      }
    };
  },
  created() {
    this.getOrderListData();
  },
  methods: {
    async getOrderListData() {
      const { data: res } = await this.axios.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败！！");
      }
      this.orderListData = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderListData();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderListData();
    },
    clearOrder() {
      this.getOrderListData();
    },
    searchOrder() {
      this.getOrderListData();
    },
    editAddress(){//修改地址弹出框
    this.dialogVisible = true
    },
    addressDialog(addOrderForm){
      this.$refs[addOrderForm].resetFields();
    },
   async positioning(){
      this.dialogVisible2 = true
      //获取物流地址
     const {data:res} = await this.axios.get('/kuaidi/'+ 804909574412544580 )
     if(res.meta.status !==200){
       return this.$message.error("获取物流数据失败！！");
     }
     console.log(res);
     this.progressInfo = res.data
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
}
</style>