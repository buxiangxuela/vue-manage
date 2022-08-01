import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(Router)

const router = new Router({
 routes:[
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    name:'name',
    component:Login
  },
  {
    path:'/home',
    name:'home',
    component:() => import('../views/Home.vue')
  }
 ]
  
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
//to 将要访问的路径
//from  代表从哪个路径跳转
//next 是一个函数 代表放行
 
if(to.path === '/login') return next();
//获取token 
const tokenStr = window.sessionStorage.getItem('token')
if(!tokenStr) return next('/login')
next()
})

export default router