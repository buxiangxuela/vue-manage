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
/* 引进富文本 */
import VueEditor from 'vue-quill-editor'
//样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './plugins/charts.js'

Vue.use(VueEditor)

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

/* 时间筛选器 */
Vue.filter('dateFormat',function(originVal){
const dt = new Date(originVal)
 const y = dt.getFullYear()
 const m = (dt.getMonth() + 1 + '').padStart(2,'0')
 const d = (dt.getDate()+'').padStart(2,'0')

 const hh = (dt.getHours()+'').padStart(2,'0')
 const mm = (dt.getMinutes()+'').padStart(2,'0')
 const ss = (dt.getSeconds()+'').padStart(2,'0')

 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
