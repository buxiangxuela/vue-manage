import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
//引入按需 饿了么ui
import './plugins/element.js'
//引入全局样式表
import './assets/css/global.css'
//引入axios 网络请求
import axios from 'axios'
//引入vuex 进行传值
import store from './store/index.js'

//设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//设置请求拦截器
axios.interceptors.request.use(config => {
  /* console.log(config) */
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
