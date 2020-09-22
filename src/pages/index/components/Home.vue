<template>
  <div style="height:100%">
    <!-- 头部 -->
    <header>
      <h2>代丰的后台管理系统</h2>
      <el-button @click="clearToken">退出</el-button>
    </header>
    <!-- 主体 -->
    <main>
      <div class="left" style="width:200px">
        <div class="shrink" @click="shrink">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router = true
        >
          <el-submenu :index="index+'1'" v-for="(item,index) in menuList" :key="item.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="iconfont[item.id]" style="margin-right:20px"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item.path" v-for="(item) in item.children" :key="item.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="right">
        <router-view></router-view> 
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [], //左侧菜单数据
      iconfont: { //一级菜单的小图标
        125: "el-icon-user-solid",
        103: "el-icon-s-help",
        101: "el-icon-s-goods",
        102: "el-icon-platform-eleme",
        145: "el-icon-s-data",
      },
      isCollapse: false,
    };
  },
  methods: {
    clearToken() {
      //退出按钮，清除token，回退到登录页面
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      //获取侧边栏数据
      const { data: res } = await this.axios.get("menus");
      if (res.meta.status !== 200) return console.log(res.meta.msg);
      this.menuList = res.data;
    },
    shrink() {
      //侧边栏收缩
      this.isCollapse = !this.isCollapse;
      let left = document.querySelector(".left");
      this.isCollapse
        ? (left.style.width = "64px")
        : (left.style.width = "200px");
    },
  },
  created() {
    this.getMenuList();
  },
};
</script>
<style lang="less" scoped>
header {
  width: 100%;
  height: 80px;
  background: #373b41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 40px;
  h2 {
    color: cornsilk;
  }
}
main {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    background: #333744;
    overflow: hidden;
    transition: 0s;
  }
  .right {
    width: 100%;
    // height: 100%;
    background: #eaedf1;
  }
  .shrink {
    width: 100%;
    height: 40px;
    background: black;
    color: white;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 6px;
  }
}
</style>