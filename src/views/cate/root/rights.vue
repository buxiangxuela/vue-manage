<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="always">
            <el-table :data="rightList" border stripe >
             <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <!-- 通过插槽自定义属性 -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
                        <el-tag v-else type="info">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //权限列表
            rightList: []
        }
    },
    created() {
        this.getRightList()
    },
    methods: {
        //获取所有权限列表
        async getRightList() {
            const { data: res } = await this.$http.get('rights/list')
            /* console.log(res) */
            this.rightList = res.data
        }
    }
}
</script>