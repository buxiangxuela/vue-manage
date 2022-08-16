<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="width:600px;height:400px;">
            <div id="main" style="width:600px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            reportList: []
        }
    },
    created() {},
  async  mounted() {
        var myChart = echarts.init(document.getElementById('main'))
            const { data: res } = await this.$http.get('reports/type/1')
            if (res.meta.status !== 200) return this.$message.error('获取报表失败')
            /* console.log(res) */
            myChart.setOption(res.data)
    }
}
</script>