<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" border stripe>
                <!-- 该标签是 索引列 只需要添加 type="index" -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status === '0'" type="danger"> 未付款</el-tag>
                        <el-tag v-else-if="scope.row.pay_status === '1'" type="success"> 已付款 </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="update_time">
                    <template slot-scope="scope">
                        {{ scope.row.update_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="auto">
                    <!-- 作用域插槽 -->
                    <template style="display:flex;margin-left: 5px;">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-left: 10px;"
                            @click="dialogVisible = true">
                        </el-button>

                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 10px;">
                        </el-button>
                        <!-- 带有文本提示框的  -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="addressDialogClosed">
                <el-form   label-width="80px" :model="addressForm" ref="addressFormRef">
                    <el-form-item label="省市区/县" prop="roleName">
                        <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="roleDesc">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressDialogClosed">取 消</el-button>
                    <el-button type="primary" >确 定</el-button>
                </span>
            </el-dialog>
            <!-- 页码 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>

import cityData from './citydata.js'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderList: [],
            dialogVisible: false,
            addressForm:{
                address1:[],
                address2:''
            },
            cityData
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        //获取订单列表
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取失败')
            /* console.log(res) */
            this.orderList = res.data.goods
            this.total = res.data.total
        },
        //监听pagesize 即选择多少条每页 改变的事件
        handleSizeChange(newSize) {
            /* console.log(`每页 ${val} 条`); */
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage) {
            /*  console.log(`当前页: ${val}`); */
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        editorDialog(id) {

            this.editorDialog = true
        },
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
            this.dialogVisible = false
        }

    }
}
</script>
