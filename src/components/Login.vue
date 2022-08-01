<template>
    <div class="login_container">
        <img src="../assets/logo.png" alt="">

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="55px" class="login-form">
            <el-form-item prop="username" label="账号">
                <el-input type="text" v-model="loginForm.username" placeholder="请选择账号">
                    <i slot="prefix" class="el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input show-password v-model="loginForm.password" placeholder="请选择密码">
                    <i slot="prefix" class="el-icon-lock"></i>
                </el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="login()">登录</el-button>
                <el-button type="info" @click="resetLoginForm()">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //这是登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            //这是表单的验证规则对象
            loginFormRules: {
                //验证用户名
                username: [
                    {   //代表必填项
                        required: true,
                        //提示消息
                        message: '请输入登录名称',
                        //触发时机 blur 文本框失去焦点
                        trigger: 'blur'
                    },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                //验证密码是否符合
                password: [
                    {   //代表必填项
                        required: true,
                        //提示消息
                        message: '请输入密码',
                        //触发时机 blur 文本框失去焦点
                        trigger: 'blur'
                    },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        //重置点击事件
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                //如果值 为false 则直接返回
                if (!valid) return;
                //如果成功 则请求一个post地址(文档的路径)
                const { data: res } = await this.$http.post('login', this.loginForm);
                /* console.log(res) */
                if (res.meta.status !== 200) return this.$message.error('登录失败');
                this.$message.success('登录成功')
                /* 1 将登录成功之后 token，保存到客户端的 sessionStorage中
                    1.1 项目中除了登录以外的其他API接口，必须在登录之后才能访问
                    1.2 token只因在当前网站打开期间生效，所以将token保存在sessionStorage中
                2. 通过编程式导航跳转到后台主页，路由地址是/home
                 */
                //保存
                window.sessionStorage.setItem('token',res.data.token);
                //跳转
                this.$router.push('/home')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.login_container {

    border-radius: 15px;
    width: 370px;
    height: 200px;
    padding: 30px 15px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    img {
        width: 80px;
        height: 80px;

        position: absolute;
        left: 50%;
        transform: translate(-50%, -90%);

    }

    .login-form {
        margin: 30px;

        .btns {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>