import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
Vue.use(VueRouter)

const menu = [{
    path: '/',
    redirect: '/login'
  }, //默认首页
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
        }
  ]
  },
]
export default menu