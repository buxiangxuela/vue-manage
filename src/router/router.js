import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(Router)

//点击相同路径不会报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err);
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/home',
      name: 'home',
      redirect: '/welcome',
      component: () => import('../views/Home.vue'),
      children: [ 
        {
          path: '/welcome',
          name: '主页',
          component: () => import('../views/cate/welcome.vue')
        },
        {
          path: '/user',
          name: '用户列表',
          component: () => import('../views/cate/user.vue')
        },
        {
          path: '/roles',
          name: '角色列表',
          component: () => import('../views/cate/root/role.vue')
        }, {
          path: '/rights',
          name: '权限列表',
          component: () => import('../views/cate/root/rights.vue')
        }, {
          path: '/goods',
          name: '商品列表',
          component: () => import('../views/cate/shop/goods.vue')
        },
        {
          path: '/params',
          name: '分类参数',
          component: () => import('../views/cate/shop/params.vue')
        },
        {
          path: '/categories',
          name: '商品分类',
          component: () => import('../views/cate/shop/categories.vue')
        }


      ]
    }
  ]

})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from  代表从哪个路径跳转
  //next 是一个函数 代表放行

  if (to.path === '/login') return next();
  //获取token 
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
