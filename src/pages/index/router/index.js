import Vue from 'vue'
import VueRouter from 'vue-router'
import menu from './menu'
Vue.use(VueRouter)
const router = new VueRouter({
  mode:'hash',
  routes: menu
})
 //挂载路由守卫
  router.beforeEach((to, from, next) => {
   //to 将要访问的路劲
   //from 代表从哪个路劲跳转而来
   //next 是一个函数，表示放行。 1.next()表示放行，2next('/login')表示强制跳转的路劲
   const tokenStr = window.sessionStorage.getItem('token') //取出token值
   if(to.path === '/login') return next() //直接访问登录页，放行
   if(!tokenStr) return next('/login') //不是直接访问登录页，没有token的话强制跳转到登录页
   next()//以上都不是，直接放行
  })
export default router
