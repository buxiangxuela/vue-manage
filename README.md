初始化项目
    设置less 版本为3.0.0 lessloader 5.0.0
    vue 2.7
1 登录
    默认进入登录页面： 路由规则中加一个从定向规则redire
    el-form 登录表单
        先使用 ：model 动态绑定 return中的form表单
        在使用：rules 添加动态规则 
        js rules中和form表单同级
        如何让js中rules验证生效
        在item中添加prop：验证对象{username/password}
    el-form-item 添加标题
    el-input 输入框
        v-model 绑定具体表单内数据
    实现重置按钮
        在form组件 添加 ref引用 获取到整个表单的实例
        在按钮添加一个点击事件
            this.$refs.loginFormRef//自己添加的引用实例.resetFields()//饿了么提供方法
    登录的预验证
        在登录按钮后 通过调用表单 函数 预验证
        添加点击事件
            this.$refs.loginFormRef//自己添加的引用实例.validate(
                valid => {}
            )//饿了么提供回调函数 使用箭头函数缩写
            如果某个方法的返回值为promise 可以将用 await 异步的方法用async 来简化操作

            弹窗 使用elui 中message 需要挂载引用 然后 this.$message.err('登陆失败')
    登录成功后行为
        登录成功后 token 保存在sessionStorage 而不是localStorage
            sessionStorage 是会话存储机制 localStorage 是持久存储机制
        路由导航守卫控制权限
            在router.js文件中加入判断token
        退出功能实现
            在home页面中添加按钮退出
            添加点击事件  
            //清空token
            window.sessionStorage.clear();
            //路由跳转
            this.$router.push("/login");
<<<<<<< HEAD
上传git  git init //git checkout -b login //git add . //git commit -m "登录功能"//git push -u origin login//git push -u origin master//git checkout master //git merge login //git branch -d login
=======
    上传git  git init //git checkout -b login //git commit -m "登录功能"//git push -u origin login//git push -u origin master//git checkout master //git merge login //git branch -d login
2 主页布局
    使用到elui的按需中的 el-container el-header ,Aside,Main,Menu,MenuIteMenuItemGroup,Submenu
    通过接口获取菜单数据
        通过axios请求拦截器添加token，保证拥有获取数据的权限
    渲染主页左侧列表 立即进行渲染 在侧边栏组件中需要加入生命周期函数
    动态绑定index出现问题是 :index="item.id+''" 在后面加一个空字符串 或者 :index="string(item.id)"
    通过vuex 进行跨域的传值 类似$bus 控制侧边栏折叠功能
        首先下载依赖 npm i vuex
        全局引用main.js  import store from '../store'
        在store中index 添加模块 tab  tab中定义方法取反 
        在全局js中加入store
        在侧边栏组件computed 下使用iscollapse方法 返回tab模块的值
    使用elui的面包屑 
    使用elcard 卡片布局
     使用el row elrol在进行排布 
    作用域插槽  父组件 ：data 获取数据 子组件 slot-scope 对获取数据进行操作并返回给父组件
    分页效果
    更新状态效果 输入传值后put接口传值给后端
    搜索功能 input 双向绑定userinfo内的query
    添加用户功能 eldialog对话框
        自定义规则 在jsdata中var一个规则
    删除按钮  使用el-messagebox组件
3权限页面
获取列表数据 type=list
角色页面
>>>>>>> 83c4178 (权限管理模块)
