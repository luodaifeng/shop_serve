import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
// import { config } from 'vue/types/umd'
//在request拦截器中，展示进度条 NProgress.start()
//axios请求拦截器,保证获取数据的权限
axios.interceptors.request.use(config => {
NProgress.start() //显示进度条
config.headers.Authorization = window.sessionStorage.getItem('token')
return config;
},error => {
return Promise.reject(error);
});

//在Response响应拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config =>{
    NProgress.done() //隐藏进度条
    return config

})
Vue.use(VueAxios,axios)

// axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'