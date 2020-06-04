<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
                <el-form :inline="true" class="demo-form-inline">
                    <el-button
                            type="primary"
                            class="handle-del mr10"
                            @click="dialogFormVisible = true"
                    >新增</el-button>
                    <el-form-item>
                        <el-input v-model="searchMap.name" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="fetchData()">搜索</el-button>
                </el-form>
            <el-table :data="list" border style="width: 100%">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名" align="center"></el-table-column>
                <el-table-column prop="summary" label="简介" align="center"></el-table-column>
                <el-table-column label="图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.logo"
                            :preview-src-list="[scope.row.logo]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.ishot}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="labels" label="标签" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row.id)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row.id)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5,10,20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total=total>
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog  title="编辑" :visible.sync="dialogFormVisible" >
            <el-form label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="pojo.name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="pojo.summary"  placeholder="简介"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="pojo.address"  placeholder="地址"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="pojo.ishot"  placeholder="成功输入1失败输入0"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-input v-model="pojo.labels" placeholder="标签"></el-input>
                </el-form-item>
                <el-upload
                        action="http://localhost:9000/enterprise/image/"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-success="handleAvatarSuccess"
                        :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="pojo.logo" alt="">
                    </el-dialog>
                </el-upload>
                <el-form-item>
                    <el-button type="primary" @click="handleSave()">保存</el-button>
                    <el-button @click="dialogFormVisible = false" >关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import indexApi from '@/api/index';
export default {
    name: 'basetable',
    data() {
        return {
            list: [],
            total: 0, // 总记录数
            currentPage: 1, // 当前页
            pageSize: 5, // 每页大小
            searchMap: {}, // 查询条件
            dialogFormVisible: false, //对话框是否显示
            pojo: {},//增加的条件
            id:'',
            dialogImageUrl: '',
            dialogVisible: false
        };
    },
    created() {
        this.fetchData()
    },
    methods: {
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage;
            this.fetchData();
        },
        handleSizeChange: function (pageSize) {
            this.pageSize = pageSize;
            this.fetchData();
        },
        fetchData() {
            indexApi.search(this.currentPage, this.pageSize, this.searchMap).then(res => {
                this.list = res.data.rows
                this.total = res.data.total
                for(var i =0;i<this.list.length;i++){
                    if(this.list[i].ishot==1){
                        this.list[i].ishot="成功"
                    }else{
                        this.list[i].ishot="失败"
                    }
                }

            });
        },
        // 新增操作
        handleSave(){
            indexApi.update(this.id, this.pojo).then(res=>{
                if(res.flag){//如果成功
                    this.fetchData()//刷新列表
                }
                this.$message({
                    message: res.message,
                    type: (res.flag?'success':'error')
                })
            })
            this.dialogFormVisible=false//关闭窗口
        },
        // 删除操作
        handleDelete(id) {
            this.$confirm('确定要删除此数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                indexApi.deleteById(id).then(res=>{
                    this.$message({
                        message: res.message,
                        type: (res.flag?'success':'error')
                    })
                    if(res.flag){
                        this.fetchData()// 刷新数据
                    }
                })
            }).catch(() => {
            });
        },
        // 编辑操作
        handleEdit(id){
            this.id = id
            this.dialogFormVisible=true//打开窗口
            //调用查询
            if(id !== '') {
                indexApi.findById(id).then(res => {
                    if (res.flag) {
                        this.pojo = res.data
                    }
                })
            }else{
                this.pojo={}//清空表单
            }
        },
        //移除图片触发
        handleRemove(file, fileList) {
        },
        //预览图片触发
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.pojo.logo = this.dialogImageUrl;
            this.dialogVisible = true;
            console.log(this.pojo.logo)
        },
        //上传图片成功触发
        handleAvatarSuccess(res, file){
            this.dialogImageUrl = URL.createObjectURL(file.raw);;
            this.pojo.logo = res.data;
            console.log(res.data)
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
