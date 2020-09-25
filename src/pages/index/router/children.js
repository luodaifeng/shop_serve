import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
const children = [{
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
  },
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
  }
]

export default children