<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加按钮 -->

            <el-button type="primary" @click="showAddDialog">
                添加分类
            </el-button>

            <!-- 表格 -->
            <el-table :data="goodList" row-key="cat_id" border :tree-props="{ children: 'children' }">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="cat_name" label="分类名称" srotable width="300"></el-table-column>
                <el-table-column label="是否有效" prop="cat_pid" width="200">
                    <!-- 获取列表数据  .row 是获取行内数据 -->
                    <template slot-scope="scope">
                        <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color:lightgreen"></i>
                        <i class="el-icon-error" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column label="权限等级" prop="cat_level">
                    <!-- 通过插槽自定义属性 -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level === 0"> 一 级 </el-tag>
                        <el-tag v-else-if="scope.row.cat_level === 1" type="success"> 二 级 </el-tag>
                        <el-tag v-else type="info"> 三 级 </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <!-- 通过插槽自定义属性 -->
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="showEditorDialog(scope.row.cat_id)">
                            <i class="el-icon-edit"></i>
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="deleteCate(scope.row.cat_id)">
                            <i class="el-icon-delete"></i>
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="goodInfo.pagenum" :page-sizes="[1, 5, 10, 20]" :page-size="goodInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加商品" :visible.sync="cateVisible" width="40%" :close-on-click-modal="false"
            @close="resetCateVisible">
            <el-form :model="addGoodForm" :rules="addGoodRules" ref="addGoodRef" label-width="120px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addGoodForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" prop="password">
                    <!-- options 用来指定数据源 -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="{
                        expandTrigger: 'hover', value: 'cat_id', label: 'cat_name'
                        , children: 'children', checkStrictly: 'true'
                    }" clearable @change="parentChange"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetCateVisible">退出</el-button>
                <el-button type="primary" @click="addGood">确定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="用户信息更改" :visible.sync="editorVisible" width="30%" :close-on-click-modal="false"
            @close="editorVisible = false">
            <el-form :model="editorForm" :rules="addGoodRules" ref="editorFormRef" label-width="80px">
                <el-form-item label="商品ID" prop="cat_name">

                    <el-input v-model="editorForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">

                <el-button type="primary" @click="editorChange()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

export default {
    data() {
        return {
            /* 添加对话框 */
            cateVisible: false,
            /* 获取商品分类参数 */
            goodInfo: {
                /* type: [1,2,3], */
                /* 当前页码值 */
                pagenum: 1,
                /* 每页显示多少条 */
                pagesize: 5
            },
            /* 总页数 */
            total: 0,
            goodList: [],
            //添加商品
            addGoodForm: {
                //分类名称
                cat_name: '',
                //父级分类ID
                cat_pid: 0,
                cat_level: ''
            },
            //添加规则
            addGoodRules: {
                cat_name: [
                    {   //代表必填项
                        required: true,
                        //提示消息
                        message: '请输入登录名称',
                        //触发时机 blur 文本框失去焦点
                        trigger: 'blur'
                    }]
            },
            //父级分类列表
            parentCateList: [],
            //双向绑定必须是数组 不是具体值
            selectedKeys: [],
            //编辑表单
            editorForm: {
                cat_id: '',
                cat_name: ''
            },
            editorVisible: false
        }
    },
    created() {
        this.getGoodList()
    },
    methods: {
        /* 获取商品分类 */
        async getGoodList() {
            const { data: res } = await this.$http.get('categories', { params: this.goodInfo })

            /* console.log(res.data.result) */
            if (res.meta.status !== 200) return this.$message.error('失败获取商品列表')
            this.goodList = res.data.result
            this.total = res.data.total
        },
        handleSizeChange(newSize) {
            /* console.log(`每页 ${val} 条`); */
            this.goodInfo.pagesize = newSize
            this.getGoodList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage) {
            /*  console.log(`当前页: ${val}`); */
            this.goodInfo.pagenum = newPage
            this.getGoodList()
        },
        showAddDialog() {
            //获取父级分类列表
            this.getParentCateList()
            this.cateVisible = true
        },
        //获取父级分类
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2, } })
            if (res.meta.status !== 200) return this.$message.error('获取父级分类失败')
            this.parentCateList = res.data
        },
        //选择项发生变换触发函数
        parentChange() {
            /* console.log(this.selectedKeys) */
            //添加判断 如果数组中的length 大于 0 则证明选择父级 反之 则没选中任何父级
            if (this.selectedKeys.length > 0) {
                //父级分类发生变化
                this.addGoodForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                //为当前分类等级赋值
                this.addGoodForm.cat_level = this.selectedKeys
                return
            }
            else {
                this.addGoodForm.cat_pid = 0
                this.addGoodForm.cat_level = 0
            }
        },
        //重置
        resetCateVisible() {
            this.$refs.addGoodRef.resetFields()
            this.cateVisible = false
        },
        //添加按钮
        async addGood() {


            this.$refs.addGoodRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                const { data: res } = await this.$http.post('categories', this.addGoodForm)

                if (res.meta.status != 201) { return this.$message.error('添加商品失败！') }
                this.$message.success('添加商品成功')
                //隐藏对话框
                this.cateVisible = false
            })
            this.getGoodList()
        },
        //editor 编辑
        async showEditorDialog(id) {
            const { data: res } = await this.$http.get('categories/' + id)
            if (res.meta.status !== 200) return this.$message.err('查询商品失败！')
            /* console.log(res.data) */
            this.editorForm = res.data
            this.editorVisible = true
        },

        editorChange() {

            this.$refs.editorFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                const { data: res } = await this.$http.put('categories/' + this.editorForm.cat_id, { cat_name: this.editorForm.cat_name })
                /* console.log(res.meta.status) */
                if (res.meta.status != 200) { return this.$message.error('修改商品失败！') }
                this.$message.success('修改商品成功')
                //隐藏对话框
                this.editorVisible = false
                this.getGoodList()
            })
            
        },
        //删除按钮
        async deleteCate(id) {

            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            //如果确认删除 ，返回值为字符串
            //如果取消删除，返回值为cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }

            const { data: res } = await this.$http.delete('categories/' + id)

            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getGoodList()

        }
    }
}
</script>
<style lang="less" scoped>
</style>