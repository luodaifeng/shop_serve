import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
import user from './user'
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
    children: [{
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
      },
      user
      ,
      {
        path: '/rights',
        name: 'Rights',
        component: Rights,
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles,
      },
      {
        path: '/categories',
        name: 'Categories',
        component: Categories,
      },
      {
        path: '/params',
        name: 'Params',
        component: Params,
      },
      {
        path: '/goods',
        name: 'List',
        component: List,
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: Add,
      },
      {
        path: '/orders',
        name: 'Order',
        component: Order,
      },
      {
        path: '/reports',
        name: 'Report',
        component: Report,
      }
    ]
  },
]
export default menu