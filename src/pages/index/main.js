import Vue from 'vue'
import App from './App.vue'
import '../../registerServiceWorker'
import router from './router'
import store from './store'
import '../script/axios/index'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import { MessageBox } from 'element-ui';
Vue.use(ElementUI,MessageBox)
Vue.config.productionTip = false
import tree from 'vue-table-with-tree-grid'
Vue.component('tree', tree)
//时间过滤器
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
