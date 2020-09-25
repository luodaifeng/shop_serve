<template>
  <div>
    <!-- 头部区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 警告框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->

      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- table栏区域 -->
      <el-form
        :model="addForm"
        :rules="rules"
        :ref="addForm"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--  渲染表单的item项-->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTabData"
              :key="index"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到后台api地址 -->
            <!-- on-preview 是点击图片触发的事件（图片放大）-->
            <!-- on-remove 是点击插号的时候触发的事件 -->
            <!-- headers绑定请求头 -->
            <!-- on-success 文件上传成功时的钩子 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="success" @click="add(addForm)">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 查看图片弹出框 -->
    <el-dialog :visible.sync="dialogVisible">
      <img :src="uploadImgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import _ from 'lodash'
export default {
  components:{
    quillEditor
  },
  data() {
    return {
      activeIndex: "0", //步骤条默认索引
      tabPosition: "left", //table栏布局方向
      cateList: [], //商品分类的数据
      manyTabData: [], //获取的动态参数列表
      onlyTabData: [], //获取的静态参数列表
      content:'',
      headersObj: {
        //上传图片的请求头中携带token
        Authorization: window.sessionStorage.getItem("token"),
      },
      dialogVisible: false, //查看图片弹出框
      addForm: {
        //添加商品的表单数据
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [], //商品所属的分类数组的id
        pics: [], //上传图片的数组
        goods_introduce:'',//商品情况描述
        attrs:[]
      },
      uploadImgUrl: "", //上传图片的真是路径
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //获取所有商品分类数据
      const { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败！！");
      }
      this.cateList = res.data;
    },
    handleChange() {
      //级联选择器选中项的变化
      if (this.addForm.goods_cat.length !== 3) {
        //判断只能选择三级分类
        this.addForm.goods_cat = []; //否则清空
        this.$message.error("只能选选三级分类哦！！！！！");
      }
      console.log('级联选择器选接收的参数只能是数组');
      console.log(this.addForm.goods_cat);
    },
    beforeLeave(activeName, oldActiveName) {
      //标签页切换
      // console.log(activeName, oldActiveName);
      //oldActiveName 即将离开的标签页
      //activeName //即将进入的标签页
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === "0") {
        this.$message.error("请先选择商品分类！！！！！");
        return false;
      }
    },
    async tabClick() {
      //tab点击时触发
      // console.log(this.activeIndex); //打印对应的tab索引值
      if (this.activeIndex === "1") {
        //判断是是否点击的是商品参数，如果是商品参数，则发起动态参数列表的数据请求
        const { data: res } = await this.axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表数据失败！！");
        }
        res.data.forEach((item) => {
          //将获取到的attr_vals值分割为字符串
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTabData = res.data;
      } else if (this.activeIndex === "2") {
        //判断是是否点击的是商品属性，如果是商品属性，则发起静态参数列表的数据请求
        const { data: res } = await this.axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态参数列表数据失败！！");
        }
        console.log(res.data);
        this.onlyTabData = res.data;
      }
    },
    handlePreview(file) {
      //处理图片预览效果
      //  console.log(file); //file获取点击图片的返回参数
      const ImgUrl = file.response.data.url;
      this.uploadImgUrl = ImgUrl;
      this.dialogVisible = true;
    },
    handleRemove(file) {
      //处理移除图片的操作
      // console.log(file);//移除图片返回的参数
      //1.获取移除图片的临时路径
      const filePath = file.response.data.tmp_path;
      //2.从pics中找到对应的索引值
      const index = this.addForm.pics.findIndex((x) => x.pic === filePath);
      //3.从pics数组中参数对于的图片临时路径
      this.addForm.pics.splice(index, 1);
    },
    handleSuccess(response) {
      //监听图片上传成功的钩子
      // console.log(response); //成功后返回的参数
      //1.拼接后端所需上传的参数
      const res = { pic: response.data.tmp_path };
      this.addForm.pics.push(res); //然后加入到addForm.pics的数组中
    },
    add(addForm){ //添加商品按钮
      console.log('深拷贝前');
      console.log(this.addForm);
      this.$refs[addForm].validate(async valid =>{
        if(!valid){
          return  this.$message.error("请填写必要的表单项！！");
        }
        //调用商品添加的数据请求
        //lodash中的cloneDeep()深拷贝方法
          const newForm =  _.cloneDeep(this.addForm) //深拷贝addForm
          newForm .goods_cat = this.addForm.goods_cat.join(',')
          //处理动态参数
          this.manyTabData.forEach(item=>{
           const newInfo = {
             attr_id:item.attr_id,
             attr_value:item.attr_vals.join(',')
           }
          newForm.attrs.push(newInfo)
          }),
           //处理静态参数
          this.onlyTabData.forEach(item=>{
           const newInfo = {
             attr_id:item.attr_id,
             attr_value:item.attr_vals
           }
            newForm.attrs.push(newInfo)
          })    
          newForm.attrs = this.addForm.attrs
           console.log(`深拷贝后:`);
           console.log(newForm);
           //发起添加商品请求
           const {data:res} = await this.axios.post('goods',newForm)
           if(res.meta.status !==201){
             return this.$message.error("添加商品失败！！！");
           }
           this.$message.success("添加商品成功！！！")
           this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      //拿到三级分类的id
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
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
.el-steps {
  margin: 20px 0;
}
.el-step__title {
  font-size: 12px;
}
.el-table {
  margin: 20px 0;
  font-size: 12px;
  text-align: center;
}
.quill-editor{
  margin:0 0 20px;
}

</style>