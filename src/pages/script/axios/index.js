import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
//axios请求拦截器,保证获取数据的权限
axios.interceptors.request.use(config => {
console.log(config);
config.headers.Authorization = window.sessionStorage.getItem('token')
return config;
},error => {
return Promise.reject(error);
});
Vue.use(VueAxios,axios)

// axios.defaults.baseURL ='http://127.0.0.1/'