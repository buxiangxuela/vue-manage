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
上传git  git init //git checkout -b login //git commit -m "登录功能"//git push -u origin login//git push -u origin master//git checkout master //git merge login //git branch -d login