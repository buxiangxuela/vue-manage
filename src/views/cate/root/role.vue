<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="always">
            <el-button type="primary" @click="roleVisible = true">
                添加角色
            </el-button>
            <!-- 添加角色对话框 -->

            <el-dialog title="添加用户" :visible.sync="roleVisible" width="30%" @close="resetAddForm()"
                :close-on-click-modal="false">
                <!-- 添加用户 -->
                <el-form :model="addRoleForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetAddForm">重置</el-button>
                    <el-button type="primary" @click="addRole">确定</el-button>
                </span>
            </el-dialog>


            <el-table :data="roleList" border stripe>
                <!-- 展开查看二级三级权限 -->
                <el-table-column type="expand">
                    <!-- 作用域插槽 接受二三级列表 -->
                    <template slot-scope="scope">
                        <!-- 渲染一级权限 -->
                        <el-row :class="['btbm', 'vcenter', i1 === 0 ? 'bttop' : '']"
                            v-for="(item1, i1) in scope.row.children" :key="item1.id" style="margin:0 20px;">

                            <el-col :span="5">
                                <el-tag type="danger" closable @close="removeRightById(scope.row, item1.id)">{{
                                        item1.authName
                                }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级三级权限 -->
                            <el-col :span="19">
                                <el-row :class="['vcenter', i2 === 0 ? '' : 'bttop',]"
                                    v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                                                item2.authName
                                        }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18" style="display:flex;flex-wrap:wrap">
                                        <el-row v-for="item3 in item2.children" :key="item3.id">
                                            <el-col>
                                                <el-tag type="warn" closable
                                                    @close="removeRightById(scope.row, item3.id)">{{
                                                            item3.authName
                                                    }}</el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>

                                </el-row>
                            </el-col>

                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="权限操作">
                    <!-- 通过插槽自定义属性 -->
                    <template slot-scope="scope" style="display:flex;margin-left: 5px;">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.id)"
                            style="margin-left: 10px;">编辑
                        </el-button>
                        <el-dialog title="权限更改" :visible.sync="showVisible" width="30%" :close-on-click-modal="false"
                            @close="resetRoleForm()">
                            <el-form :model="roleForm" ref="roleFormRef" label-width="80px">
                                <el-form-item label="角色名称" prop="roleName">
                                    <el-input v-model="roleForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item label="角色描述" prop="roleDesc">
                                    <el-input v-model="roleForm.roleDesc"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <!-- <el-button @click="resetRoleForm()">取消</el-button> -->
                                <el-button type="primary" @click="editorRole()">确定</el-button>
                            </span>
                        </el-dialog>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 10px;"
                            @click="deleteRole(scope.row.id)">删除
                        </el-button>
                        <!-- 带有文本提示框的  -->
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"
                                @click="showSetDialog(scope.row)">权限分配
                            </el-button>
                        </el-tooltip>

                        <el-dialog title="权限分配" :visible.sync="showSetVisible" width="50%" :modal-append-to-body="false"
                            :close-on-click-modal="false" @close="resetSetForm()" @keyup.enter.native="allotRight">
                            <el-tree :data="rightList" :props="treeProps" node-key="id" default-expand-all
                                :default-checked-keys="defkey" show-checkbox ref="treeRef">
                            </el-tree>

                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="allotRight">确定</el-button>
                            </span>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>


            <el-dialog title="添加用户" :visible.sync="roleVisible" width="30%" @close="resetAddForm()"
                :close-on-click-modal="false">
                <!-- 添加用户 -->
                <el-form :model="addRoleForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetAddForm">重置</el-button>
                    <el-button type="primary" @click="addRole">确定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="权限分配" :visible.sync="showSetVisible" width="50%" :modal-append-to-body="false"
                :close-on-click-modal="false" @close="resetSetForm()" @keyup.enter.native="allotRight">
                <el-tree :data="rightList" :props="treeProps" node-key="id" default-expand-all
                    :default-checked-keys="defkey" show-checkbox ref="treeRef">
                </el-tree>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="allotRight">确定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<style lang="less" scoped>
/* 显示上边框 */


.el-tag {
    margin: 20px 5px;
}

.bttop {
    border-top: 1px solid #eee;
}

/* 显示下边框 */
.btbm {
    border-bottom: 1px solid #eee;
}

/* 纵向居中对齐 */
.vcenter {
    display: flex;
    align-items: center;
}
</style>
<script>
export default {
    data() {
        return {
            //成员列表
            roleList: [],
            //权限列表
            rightList: [],
            //权限列表 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            //默认选中的id值
            defkey: [],
            //即将分配权限的id 打开分配框
            roleId: '',
            addRoleForm: {
                roleDesc: '',
                roleName: ''
            },
            addFormRules: {
                roleName: {//代表必填项
                    required: true,
                    //提示消息
                    message: '不能为空',
                    //触发时机 blur 文本框失去焦点
                    trigger: 'blur'
                }
            },
            roleForm: {

                roleDesc: '',
                roleName: ''
            },
            roleVisible: false,
            showVisible: false,
            showSetVisible: false
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        //获取角色列表
        async getRoleList() {
            const { data: res } = await this.$http.get('roles')
            /* console.log(res) */
            this.roleList = res.data
        },
        //点击编辑按钮获取对话框
        async showDialog(id) {
            const { data: res } = await this.$http.get('roles/' + id)
            /* console.log(res) */
            if (res.meta.status !== 200) return this.$message.error('获取权限状态失败！')

            this.roleForm = res.data
            this.showVisible = true

        },

        //预验证并提交编辑角色内容
        editorRole() {
            this.$refs.roleFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                /* 看id的时候 看看获取角色id 的 返回值 */
                const { data: res } = await this.$http.put('roles/' + this.roleForm.roleId,
                    {
                        roleDesc: this.roleForm.roleDesc,
                        roleName: this.roleForm.roleName
                    })
                /* console.log(res.meta.status) */
                if (res.meta.status != 200) { return this.$message.error('修改角色失败！') }
                this.$message.success('修改角色成功')
                //隐藏对话框
                this.showVisible = false
            })
        },
        //退出对话框重置
        resetRoleForm() {
            this.$refs.roleFormRef.resetFields()
            /* this.showVisible = false */
        },

        addRole() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                const { data: res } = await this.$http.post('roles', this.addRoleForm)

                if (res.meta.status != 201) { return this.$message.err('添加用户失败！') }
                this.$message.success('添加用户成功')
                //隐藏对话框
                this.roleVisible = false
            })
        },
        //退出添加对话框
        resetAddForm() {
            this.$refs.addFormRef.resetFields()
        },
        //删除按钮
        async deleteRole(id) {

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

            const { data: res } = await this.$http.delete('roles/' + id)

            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getRoleList()


        },
        //根据id删除对应权限
        async removeRightById(role, rightId) {
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

            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            /* 重新渲染该 列表的数据 */
            role.children = res.data
            /* 不需要用这个 不然会重新渲染该界面  
             this.getRoleList() */
        },
        //分配权限 的对话框
        async showSetDialog(role) {

            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            /* console.log(res) */
            if (res.meta.status !== 200) return this.$message.error('获取权限状态失败！')

            this.rightList = res.data
            this.showSetVisible = true
            this.editorRight(role, this.defkey)
            /* console.log(this.defkey) */

        },
        /* 对话框退出后清空 */
        resetSetForm() {
            this.defkey = []
        },
        //通过递归的形式，获取角色下所有三级权限id
        editorRight(node, arr) {
            //判断node数组中是否含有childern属性 没有则返回
            if (!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(item => {
                this.editorRight(item, arr)

            });
        },
        //确定 编辑并上传

        async allotRight() {
            //展开 运算符
            const keys = [
                ...this.$refs.treeRef.
                    getCheckedKeys(),
                ...this.$refs.treeRef.
                    getHalfCheckedKeys()

            ]
            /* console.log(keys) */
            const idStr = keys.join(',')

            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if (res.meta.status !== 200) return this.$message.error('分配权限状态失败！')
            this.getRoleList()
            this.showSetVisible = false
        },

        async allotRight() {
            //展开 运算符
            const keys = [
                ...this.$refs.treeRef.
                    getCheckedKeys(),
                ...this.$refs.treeRef.
                    getHalfCheckedKeys()

            ]
            /* console.log(keys) */
            const idStr = keys.join(',')

            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if (res.meta.status !== 200) return this.$message.error('分配权限状态失败！')
            this.getRoleList()
            this.showSetVisible = false
        }

    }
}
</script>