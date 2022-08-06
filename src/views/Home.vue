<template>
    <!-- 主体区域 -->
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>后台管理系统</span>
                <el-button @click="handleMenu" plain icon="el-icon-menu" size="mini"></el-button>
            </div>

            <el-button type="danger" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="auto">
               <common-aside ></common-aside>
            </el-aside>
            <!-- 右侧主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
import CommonAside from '../components/CommonAside.vue'//引入侧边框样式
export default {
    components:{CommonAside},
    data() {
        return {

        }
    },
    methods: {
        //切换侧边栏展开方法
        handleMenu(){
            this.$store.commit('collapseMenu')
        },
        //退出按钮的方法
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        }
    },

}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        /* 左右贴边对齐 */
        padding-left: 5px;
        /* 消除左边空白区域 */
        align-items: center;
        /* 按钮上下居中 不贴着上下 */
        color: #fff;
        font-size: 20px;

        /* 给div 设置布局  */
        >div {
            display: flex;
            align-items: center;/* 文字上下居中 */
            span{
                margin-left:20px ;/* 文字和图片隔开距离 */
            }
            img {
                height: 50px;
            }
            .el-button{
                margin-left: 20px;
            }
        }


    }

    .el-aside {
        background-color: #545c64;
    }

    .el-main {
        background-color: #EAEDF1;
    }

}
</style>