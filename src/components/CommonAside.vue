<template>

    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" background-color="#545c64" active-text-color="#ffd04b"
        text-color="#fff" @open="handleOpen" @close="handleClose" :collapse="isCollapse" >
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item @click="clickMenu(subItem)" :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{ subItem.authName }}</span>
                </template>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>
<style  lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    height: 100%;
    border: none;

    h3 {
        color: #fff;
        text-align: center;
        line-height: 48px;

    }
}
</style>

<script>


export default {
    //立即渲染侧边栏数据
    created() {
        this.getMenuList()
    },

    data() {
        return {

            menuList: [],
            //创建对象 对应图标
            iconsObj: {
                '125': 'el-icon-user-solid',
                '103': 'el-icon-s-opportunity',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-marketing'
            }
        };
    },

    methods: {

        //获取侧边栏表单数据
        async getMenuList() {
            //解构res的promise请求
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.status)
           /*  console.log(res) */
            this.menuList = res.data
        },

        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
       
        clickMenu(item) {
            this.$router.push({
                name: item.authName
            })
           
        }

    },
    computed:{
         isCollapse() {
            //直接使用全局注入的store中tab模块
            return this.$store.state.tab.isCollapse
        }
    }

}
</script>