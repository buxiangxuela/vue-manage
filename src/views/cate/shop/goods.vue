<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <!-- 设置宽度 -->
                <el-col :span="70">
                    <!-- input 输入框-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <!-- 按钮添加一个点击事件创建对话框 -->
                    <el-button type="primary" @click="addVisible = true">添加商品</el-button>
                    <!-- close-on-click-modal 让对话框点击到外面后不会退出 close 关闭时间 添加后 重置表单内数据 -->
                </el-col>
            </el-row>
            <!-- 列表数据 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" width="500px"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <!-- 通过插槽自定义属性 -->
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary">
                            <i class="el-icon-edit"></i>
                        </el-button>
                        <el-button size="mini" type="danger" @click="deleteGoods(scope.row.goods_id)">
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加商品 -->
        <el-dialog title="用户信息分配" :visible.sync="addVisible" width="75%" :close-on-click-modal="false">
            <el-dialog title="图片预览" :visible.sync="picVisible" width="30%" append-to-body>
                <img :src="previewPath" alt="" class="imgPreview">
            </el-dialog>
            <el-alert title="请添加商品" type="info" center show-icon :closable="false"></el-alert>
            <!-- 进度条 -->
            <el-steps :active="activeName - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="150px">

                <!-- tab栏区域 -->
                <el-tabs v-model="activeName" :tab-position="'left'" :before-leave="beforeTab" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{
                                expandTrigger: 'hover', value: 'cat_id', label: 'cat_name'
                                , children: 'children'
                            }" clearable @change="handleChange" style="width:270px"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1" style="margin:20px 0px;">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border="">
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name + ':'" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示后台上传到的后台接口地址 -->
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headerObj"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-dialog>

    </div>
</template>
<script>
import _ from 'lodash'

export default {
    data() {

        return {
            goodsList: [],
            cateList: [],
            selectedKeys: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            addVisible: false,
            picVisible: false,
            //步骤条索引
            activeName: '0',
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                //图片的数组
                pics: [],
                //商品详情描述
                goods_introduce: '',
                /* 动态和静态参数 */
                attrs: []
            },
            addRules: {
                goods_name: {
                    //代表必填项
                    required: true,
                    //提示消息
                    message: '请输入商品名称',
                    //触发时机 blur 文本框失去焦点
                    trigger: 'blur'
                },
                goods_price: {
                    //代表必填项
                    required: true,
                    //提示消息
                    message: '请输入商品价格',
                    //触发时机 blur 文本框失去焦点
                    trigger: 'blur'
                },
                goods_weight: {
                    //代表必填项
                    required: true,
                    //提示消息
                    message: '请输入商品重量',
                    //触发时机 blur 文本框失去焦点
                    trigger: 'blur'
                },
                goods_number: {
                    //代表必填项
                    required: true,
                    //提示消息
                    message: '请输入商品数量',
                    //触发时机 blur 文本框失去焦点
                    trigger: 'blur'
                }
            },
            //动态参数
            manyTableData: [],
            onlyTableData: [],
            //图片上传组件的请求头
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',

        }
    },
    created() {
        this.getGoodsList()
        this.getCateList()
    },
    methods: {
        //获取商品列表
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
            this.goodsList = res.data.goods
            /*  console.log(res.data) */
            this.total = res.data.total
        },
        //获取三级列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('失败获取商品列表')
            /* console.log(res.data) */
            this.cateList = res.data
        },
        //监听pagesize 即选择多少条每页 改变的事件
        handleSizeChange(newSize) {
            /* console.log(`每页 ${val} 条`); */
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage) {
            /*  console.log(`当前页: ${val}`); */
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        //删除按钮
        async deleteGoods(id) {
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

            const { data: res } = await this.$http.delete('goods/' + id)

            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getGoodsList()
        },
        //级联选择器
        handleChange() {
            console.log(this.addForm.goods_cat)
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []

                return
            }
        },
        //跳转判断
        beforeTab(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请选择商品分类')
                return false
            }
        },
        //tab点击事件 不可以在跳转判断中写入
        async tabClick() {
            //id=1 证明访问动态参数tab页
            if (this.activeName === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
                if (res.meta.status !== 200) return this.$message.error('获取失败')
                //将 attr_vals 转换成数组形式
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                })
                /* console.log(res.data) */
                this.manyTableData = res.data
            } else if (this.activeName === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
                if (res.meta.status !== 200) return this.$message.error('获取失败')
                this.onlyTableData = res.data
            }
        },
        //处理图片预览效果
        handlePreview(file) {
            /* console.log(file) */
            this.previewPath = file.response.data.url
            this.picVisible = true
        },
        //处理图片移除效果
        handleRemove(file) {
            //获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            //从pics数组中，找到这个图片对应的索引值 finindex 新方法找到索引
            const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            //调用数组的splice方法，把图片信息对象，从pics数组中移除
            this.addForm.pics.splice(i, 1)
            /* 或者使用过滤数组的方法
            this.addForm.pics = this.addForm.pics.filter(item => item.pic! = filePath)
            */
        },
        //监听图片上传成功的事件
        handleSuccess(response) {
            //1 拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            //2将图片信息对象 push到pics数组中
            this.addForm.pics.push(picInfo)
            /* console.log(this.addForm) */
            /* if (response.meta.status !== 200) return this.$message.error('上传失败') */
        },
        async addGoods() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请填写必要的表单')
                }
                //执行添加的规则 深拷贝可以独立于一个对象
                const Form = _.cloneDeep(this.addForm)
                Form.goods_cat = Form.goods_cat.join(',')
                //处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
                    this.addForm.attrs.push(newInfo)
                })
                //处理静态参数
                this.onlyTableData.forEach(item => {
                    const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
                    this.addForm.attrs.push(newInfo)
                })
                Form.attrs = this.addForm.attrs
                console.log(Form)
                const { data: res } = await this.$http.post('goods', Form)
                if (res.meta.status !== 201) return this.$message.error('添加商品失败')
                this.$message.success('添加商品成功')
                this.addVisible = false

            })
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style lang="less" scoped>
.imgPreview {
    width: 100%;

}

.btnAdd {
    margin-top: 15px;
    float: right;
}
</style>
