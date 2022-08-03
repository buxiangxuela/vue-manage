import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab.js'

//全局使用
Vue.use(Vuex)
// 对store 进行暴露
export default new Vuex.Store({
//放置模块
    modules:{
        tab
    }
    
})