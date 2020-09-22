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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
