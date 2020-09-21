import Vue from 'vue'
import App from './App.vue'
import '../../registerServiceWorker'
import router from './router'
import store from './store'
import '../script/axios/index'
import './assets/css/global.css'
import '../element.js/element'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
// import '../element.js/element'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
