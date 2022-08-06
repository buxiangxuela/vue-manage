<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片效果 -->
        <el-card class="box-card" shadow="always">
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <!-- 设置宽度 -->
                <el-col :span="70">
                    <!-- input 直接使用后端接口query绑定数据 clearable清空键  clear事件是清空后获取用户列表-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <!-- 按钮添加一个点击事件创建对话框 -->
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                    <!-- close-on-click-modal 让对话框点击到外面后不会退出 close 关闭时间 添加后 重置表单内数据 -->
                    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="resetAddForm()"
                        :close-on-click-modal="false">
                        <!-- 添加用户 -->
                        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="addForm.username"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="addForm.password"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱地址" prop="email">
                                <el-input v-model="addForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号" prop="mobile">
                                <el-input v-model="addForm.mobile"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="resetAddForm">重置</el-button>
                            <el-button type="primary" @click="addUser">确定</el-button>
                        </span>
                    </el-dialog>
                </el-col>
            </el-row>
            <!-- 列表  border边框效果 stripe为斑马纹效果-->
            <el-table :data="userList" border stripe>
                <!-- 该标签是 索引列 只需要添加 type="index" -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <!-- 获取列表数据  .row 是获取行内数据 -->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"
                            active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="auto">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope" style="display:flex;margin-left: 5px;">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog(scope.row.id)"
                            style="margin-left: 10px;">
                        </el-button>
                        <el-dialog title="用户信息更改" :visible.sync="showVisible" width="30%" :close-on-click-modal="false"
                            @close="resetEditorForm()">
                            <el-form :model="editorForm" :rules="addFormRules" ref="editorFormRef" label-width="80px">
                                <el-form-item label="用户ID" prop="username">
                                    <el-input v-model="editorForm.username" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号" prop="mobile">
                                    <el-input v-model="editorForm.mobile"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="email">
                                    <el-input v-model="editorForm.email"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="editorUser()">确定</el-button>
                            </span>
                        </el-dialog>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 10px;"
                            @click="deleteUser(scope.row.id)">
                        </el-button>
                        <!-- 带有文本提示框的  -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"
                                @click="showSetDialog(scope.row)"></el-button>
                        </el-tooltip>
                        <!-- 分配角色对话框 -->
                        <el-dialog title="用户信息分配" :visible.sync="showSetVisible" width="50%"
                            :close-on-click-modal="false" @close="editDialogClosed()">
                            <div>
                                <p>当前用户：{{ userInfo.username }}</p>
                                <p>当前角色：{{ userInfo.role_name }}</p>
                            </div>
                            <div style="display:flex" ref="roleFormRef">
                                <p>分配新角色：</p>
                                <el-select v-model="selectRoleId" placeholder="请选择">
                                    <el-option v-for="item in roleList" :key="item.id" :label="item.roleName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                 <el-button @click="editDialogClosed()">退出</el-button>
                                <el-button type="primary" @click="saveRoleInfo()">确定</el-button>
                            </span>

                        </el-dialog>

                    </template>
                </el-table-column>
                <!-- 页码数 layout 展示 组件 -->

            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>
<script>
export default {
    data() {
        //验证邮箱规则
        var checkEmail = (rules, value, cb) => {
            //使用正则表达式 ppt有
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if (regEmail.test(value)) {
                //合法邮箱
                return cb()
            }
            else if (!value) {
                return cb()
            }
            cb(new Error('请输入合法邮箱'))

        }
        //验证手机号规则
        var checkMobile = (rules, value, cb) => {
            //使用手机的正则表达式
            const regMobile = /^1[3456789]{1}\d{9}$/
            if (regMobile.test(value)) {
                //合法邮箱
                return cb()
            }
            else if (!value) {
                return cb()
            }
            cb(new Error('请输入合法手机号'))
        }
        return {
            //获取用户列表的参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            //获取用户列表
            userList: [],
            //总数组合数
            total: 0,
            dialogVisible: false,
            showVisible: false,
            showSetVisible: false,
            //添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            //添加表单验证规则对象
            addFormRules: {
                //验证用户名
                username: [
                    {   //代表必填项
                        required: true,
                        //提示消息
                        message: '请输入登录名称',
                        //触发时机 blur 文本框失去焦点
                        trigger: 'blur'
                    },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
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
                ],
                email: [
                    {

                        //提示消息
                        message: '请输入邮箱',
                        //触发时机 blur 文本框失去焦点
                        trigger: 'blur'
                    },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {
                        //提示消息
                        message: '请输入手机号',
                        //触发时机 blur 文本框失去焦点
                        trigger: 'blur'
                    },
                    { validator: checkMobile, trigger: 'blur' }
                ],


            },
            //添加编辑用户表单
            editorForm: {
                username: '',
                mobile: '',
                email: ''
            },
            //用户分配角色和姓名
            userInfo: {},
            roleList: [],
            selectRoleId: ''
        }
    },
    //创建生命周期函数
    created() {
        //获取用户数据方法
        this.getUserList()
    },
    methods: {

        async getUserList() {
            //获取用户列表
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            /*  console.log(res) */
            //判断状态码
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
            this.userList = res.data.users
            /*  console.log(res.data.users) */
            this.total = res.data.total
        },
        //监听pagesize 即选择多少条每页 改变的事件
        handleSizeChange(newSize) {
            /* console.log(`每页 ${val} 条`); */
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage) {
            /*  console.log(`当前页: ${val}`); */
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        //监听switch状态改变修改用户状态
        async userStateChange(userInfo) {
            /* console.log(userInfo) */
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.err('更新用户状态失败！')
            }
            this.$message.success('更新状态成功！')
        },
        //重置按钮重置新建表单
        resetAddForm() {
            this.$refs.addFormRef.resetFields()
        },
        resetEditorForm() {
            this.$refs.editorFormRef.resetFields()
        },
        
        /* resetSetForm() {
            
            showSetVisible:false
        }, */
        //添加用户的处理
        addUser() {
            //表单的预校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                const { data: res } = await this.$http.post('users', this.addForm)

                if (res.meta.status != 201) { return this.$message.error('添加用户失败！') }
                this.$message.success('添加用户成功')
                //隐藏对话框
                this.dialogVisible = false
            })
            this.getUserList()
        },
        //显示编辑用户的对话框 附加id 使得遍历的每个元素都可以显示
        async showDialog(id) {
            //动态的id 需要如此处理
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) return this.$message.err('查询用户失败！')
            this.editorForm = res.data

            /* console.log(res) */
            this.showVisible = true
        },
        //预验证修改并提交用户信息
        editorUser() {
            this.$refs.editorFormRef.validate(async valid => {
                if (!valid) return;
                /* console.log(valid) */
                const { data: res } = await this.$http.put('users/' + this.editorForm.id,
                    {
                        mobile: this.editorForm.mobile,
                        email: this.editorForm.email
                    })
                /* console.log(res.meta.status) */
                if (res.meta.status != 200) { return this.$message.error('修改用户失败！') }
                this.$message.success('修改用户成功')
                //隐藏对话框
                this.showVisible = false
            })
            this.getUserList()
        },
        //删除按钮
        async deleteUser(id) {

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

            const { data: res } = await this.$http.delete('users/' + id)

            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getUserList()

        },
        //分配  用户 对话框
        async showSetDialog(userInfo) {

            this.userInfo = userInfo
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色失败')
            this.roleList = res.data
            /* console.log(this.roleList) */
            this.showSetVisible = true
        },
        //保存用户角色更改
       async saveRoleInfo(){
            if(!this.selectRoleId){
                return this.$message.error('请选择角色选择')
            }
           const {data:res} =  await this.$http.put(`users/${this.userInfo.id}/role`,{
            rid : this.selectRoleId
           })
            if(res.meta.status !== 200) return this.$message.error('更新角色失败')
            this.$message.success('更新角色成功')
            this.getUserList()
            this.showSetVisible = false
        },
        //关闭分配对话框
        editDialogClosed(){
            this.selectRoleId = ''
            this.userInfo
            this.showSetVisible = false
        }
    }
}
</script>
<style lang="less" scoped>
</style>