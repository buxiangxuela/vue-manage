<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="注意：只允许第三级分类设置相关参数！" type="warning" show-icon :closable="false">
            </el-alert>
            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader v-model="selectedKeys" :options="cateList" :props="{
                        expandTrigger: 'hover', value: 'cat_id', label: 'cat_name'
                        , children: 'children'
                    }" clearable @change="handleChange" style="width:270px"></el-cascader>
                </el-col>
                <el-col>
                    <el-tabs v-model="activeName" @tab-click="handleTabClick">
                        <!-- 添加动态参数的面板  确定动态 name many-->
                        <el-tab-pane label="动态参数" name="many">
                            <el-button type="primary" size="mini" :disabled="isBtDisable"
                                @click="addManyVisible = true">添加参数</el-button>
                            <!-- 动态参数表格 -->
                            <el-table :data="manyTableData" border>
                                <!-- 展开行 -->
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <el-tag v-for="(item, id) in scope.row.attr_vals" :key="id" closable
                                            @close="handleClose(id, scope.row)">{{ item }}
                                        </el-tag>
                                        <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)">
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small"
                                            @click="showInput(scope.row)">+ New
                                            Tag</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column type="index" label="#">
                                </el-table-column>
                                <el-table-column prop="attr_name" label="参数名称">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button size="mini" type="primary"
                                            @click="showEditorDialog(scope.row.attr_id)">
                                            <i class="el-icon-edit"></i>
                                            修改
                                        </el-button>
                                        <el-button size="mini" type="danger" @click="deleteCate(scope.row.attr_id)">
                                            <i class="el-icon-delete"></i>
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <!-- 添加静态属性的面板 -->
                        <el-tab-pane label="静态属性" name="only">
                            <el-button type="primary" size="mini" :disabled="isBtDisable"
                                @click="addManyVisible = true">添加属性</el-button>
                            <el-table :data="onlyTableData" border>
                                <!-- 展开行 -->
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <el-tag v-for="(item, id) in scope.row.attr_vals" :key="id" closable
                                            @close="handleClose(id, scope.row)">{{ item }}
                                        </el-tag>
                                        <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                            v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)">
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small"
                                            @click="showInput(scope.row)">+ New
                                            Tag</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column type="index" label="#">
                                </el-table-column>
                                <el-table-column prop="attr_name" label="属性名称">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button size="mini" type="primary"
                                            @click="showEditorDialog(scope.row.attr_id)">
                                            <i class="el-icon-edit"></i>
                                            修改
                                        </el-button>
                                        <el-button size="mini" type="danger" @click="deleteCate(scope.row.attr_id)">
                                            <i class="el-icon-delete"></i>
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </el-card>
        <!-- 添加动态 对话框 -->
        <el-dialog :title="'添加' + isTitle" :visible.sync="addManyVisible" width="30%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="isTitle" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClosed">取 消</el-button>
                <el-button type="primary" @click="addParam">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑参数对话框 -->
        <el-dialog :title="'修改' + isTitle" :visible.sync="editorVisible" width="30%" @close="editorDialogClosed">
            <el-form :model="editorForm" :rules="addFormRules" ref="editorFormRef" label-width="100px">
                <el-form-item :label="isTitle" prop="attr_name">
                    <el-input v-model="editorForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editorDialogClosed">取 消</el-button>
                <el-button type="primary" @click="editorParam">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>


export default {
    data() {
        return {
            cateList: [],
            selectedKeys: [],
            activeName: 'many',
            manyTableData: [],
            onlyTableData: [],
            /* 表单 返回值 */
            addManyVisible: false,
            addForm: {
                attr_name: ''
            },
            //添加表单的验证规则对象
            addFormRules: {
                attr_name: [{
                    required: true, message: '请输入参数', triger: blur
                }]
            },
            /* 编辑 */
            editorVisible: false,
            editorForm: {}

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('失败获取商品列表')
            /* console.log(res.data) */
            this.cateList = res.data
        },
        handleChange() {
            this.getParamsData()
        },
        //点击tab 参数改变
        handleTabClick() {
            this.getParamsData()
            /* console.log(this.activeName) */
        },
        //获取参数的列表数据
        async getParamsData() {
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                this. manyTableData = []
                this.onlyTableData = []
            
                return
            }
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                {
                    params: {
                        sel: this.activeName
                    }
                })
            if (res.meta.status !== 200) return this.$message.error('获取参数失败')
            /* console.log(res.data) */
            /* 做判断 来获取tab标签的动态参数 */
            /* 渲染动态参数的列表 */
            res.data.forEach(item => {

                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                /* 动态添加一个业务逻辑  */
                this.$set(item, "inputVisible", false)
                this.$set(item, "inputValue", '')
            })

            if (this.activeName === 'many') {
                this.manyTableData = res.data
                /* console.log(res.data) */
            } else {
                this.onlyTableData = res.data
                /* console.log(res.data)  */
            }


        },
        //关闭后重置
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
            this.addManyVisible = false
        },
        async addParam() {
            //预验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
                    {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName

                    }
                )

                if (res.meta.status != 201) { return this.$message.err('添加参数失败！') }
                this.$message.success('添加参数成功')
                this.getParamsData
                //隐藏对话框
                this.addManyVisible = false
            })
        },
        editorDialogClosed() {
            this.$refs.editorFormRef.resetFields()
            this.editorVisible = false
        },
        /* 显示编辑框内容 */
        async showEditorDialog(id) {
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
                {
                    params: { attr_sel: this.activeName }
                })
            /* console.log(res) */
            if (res.meta.status !== 200) return this.$message.error('获取权限状态失败！')

            this.editorForm = res.data
            this.editorVisible = true
        },
        /* 预验证并上传修改 */
        editorParam() {
            this.$refs.editorFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                /* 看id的时候 看看获取角色id 的 返回值 */
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editorForm.attr_id}`,
                    {
                        attr_sel: this.activeName,
                        attr_name: this.editorForm.attr_name
                    })
                /* console.log(res.meta.status) */
                if (res.meta.status != 200) { return this.$message.error('修改参数失败！') }
                this.$message.success('修改参数成功')

                //隐藏对话框
                this.editorVisible = false
            })
            this.getParamsData()
        },
        /* 删除功能 */
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

            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`,
                {
                    params: { attr_sel: this.activeName }
                })

            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getParamsData
        },
        async handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        },

        showInput(row) {
            row.inputVisible = true;
            /*函数意义： 接受一个函数作为参数，意为在dom数据发生变化并完成后就执行其中的函数 */
            this.$nextTick(_ => {
                /* 这行代码 可以获取焦点 */
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        /* 失去焦点后自动变成按钮 */
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            /* 如果没有return则做后续处理 */
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            /* 后端数据更新 */
            this.saveAttrVals(row)
        },
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    /* 对获取的数组进行拼接 */
                    attr_vals: row.attr_vals.join(',')
                })
            if (res.meta.status !== 200) return this.$message.error('更新失败')
            this.$message.success('更新成功')
        }
    },
    //添加动态参数

    /* 计算属性 */
    computed: {
        /* 判断按钮需要被禁用 */
        isBtDisable() {
            if (this.selectedKeys.length !== 3) {
                return true
            }
            return false
        },
        //当前选中的三级分类id
        cateId() {
            if (this.selectedKeys.length === 3) {
                return this.selectedKeys[2]
            }
            return null
        },
        isTitle() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'

        }

    }

}
</script>

<style lang="less" scoped>
.el-row {
    margin: 15px 0;
}

.el-tag {
    margin: 5px 8px;
}

.input-new-tag {
    margin: 5px 8px;
    width: 100px
}

.button-new-tag {
    margin: 5px 16px;
}
</style>