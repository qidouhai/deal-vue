<template>
    <div class="report-content">
        <div class="report-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>举报管理</span>
        </div>

        <div class="report-inside" v-loading="loading" element-loading-text="数据查询中">
            <div style="text-align: right">
                <span class="head-tip">（点击商品 id 即可查看）</span>
                <el-button type="text" @click="getAgainAllReport">全部举报</el-button>
                <el-button type="text" @click="getNewReport">新举报</el-button>
                <el-button type="text" @click="getFinishReport">已处理</el-button>
                <el-button type="text" @click="getInvalidReport">已驳回</el-button>
            </div>

            <el-table :data="reports">
                <el-table-column type="expand" label="展开">
                    <template slot-scope="props">
                        <el-form inline label-width="80px">
                            <el-form-item label="举报人 uid">
                                <span>{{props.row.reporterUid}}</span>
                            </el-form-item>
                            <el-form-item label="所属店 id">
                                <span>{{props.row.storeId}}</span>
                            </el-form-item>
                            <el-form-item label="处理人 uid">
                                <span v-if="props.row.managerUid===0">暂无</span>
                                <span v-if="props.row.managerUid!==0">{{props.row.managerUid}}</span>
                            </el-form-item>
                            <el-form-item label="举报结果">
                                <span v-if="!props.row.reportResult">暂无</span>
                                <span v-if="props.row.reportResult">{{props.row.reportResult}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="商品 id" width="200px">
                    <template slot-scope="scope">
                        <a @click="watchItem(scope.row.productId)">{{scope.row.productId}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品原名" min-width="150px"></el-table-column>
                <el-table-column prop="reportReason" label="举报原因" min-width="120px"></el-table-column>
                <el-table-column label="举报状态" width="90px">
                    <template slot-scope="scope">
                        <el-tag size="small" v-if="scope.row.reportStatus===0">新举报</el-tag>
                        <el-tag type="success" size="small" v-if="scope.row.reportStatus===1">已处理</el-tag>
                        <el-tag type="info" size="small" v-if="scope.row.reportStatus===2">已驳回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="举报日期" width="160px" :formatter="timeFormat"></el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.reportStatus===0" @click="offSaleManage(scope.row.reportId)" :disabled="disabled">下架</el-button>
                        <el-button type="text" v-if="scope.row.reportStatus===0" @click="removeManage(scope.row.reportId)" :disabled="disabled">删除</el-button>
                        <el-button type="text" v-if="scope.row.reportStatus===0" @click="rejectManage(scope.row.reportId)" :disabled="disabled">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="page" layout="total, prev, pager, next, jumper" :total="totalElements"
                           :page-size="size" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ManageReport",
        data() {
            return {
                loading: false,
                disabled: false,
                totalElements: 0,
                page: 1,
                size: 10,
                chooseReportStatus: '',
                reports: [],
            }
        },
        mounted() {
            this.getAllReport();
        },
        methods: {
            getAllReport() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/product/report/list',
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.chooseReportStatus = '';
                    if (res.data.code === 0) {
                        this.reports = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getReportByStatus(reportStatus) {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/product/report/list_by_status',
                    params: {
                        reportStatus: reportStatus,
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.chooseReportStatus = reportStatus;
                    if (res.data.code === 0) {
                        this.reports = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getAgainAllReport() {
                this.page = 1;
                this.getAllReport();
            },
            getNewReport() {
                this.page = 1;
                this.getReportByStatus(0);
            },
            getFinishReport() {
                this.page = 1;
                this.getReportByStatus(1);
            },
            getInvalidReport() {
                this.page = 1;
                this.getReportByStatus(2);
            },
            watchItem(productId) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: productId
                    }
                });
                open(item.href, '');
            },
            offSaleManage(reportId) {
                this.disabled = true;
                this.$prompt('请输入商品下架原因：', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,10}$/,
                    inputErrorMessage: '长度在 1 到 10 个字符'
                }).then(({value}) => {
                    this.axios({
                        method: 'post',
                        url: '/product/report/off_sale',
                        params: {
                            reportId: reportId,
                            reportResult: value
                        }
                    }).then(res => {
                        this.disabled = false;
                        if (res.data.code === 0) {
                            this.$message.success('商品下架成功');
                            if (this.chooseReportStatus === '') {
                                this.getAllReport();
                            } else {
                                this.getReportByStatus(this.chooseReportStatus);
                            }
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                }).catch(err => {
                    this.disabled = false;
                });
            },
            removeManage(reportId) {
                this.disabled = true;
                this.$prompt('请输入商品删除原因：', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,10}$/,
                    inputErrorMessage: '长度在 1 到 10 个字符'
                }).then(({value}) => {
                    this.axios({
                        method: 'post',
                        url: '/product/report/delete',
                        params: {
                            reportId: reportId,
                            reportResult: value
                        }
                    }).then(res => {
                        this.disabled = false;
                        if (res.data.code === 0) {
                            this.$message.success('商品删除成功');
                            if (this.chooseReportStatus === '') {
                                this.getAllReport();
                            } else {
                                this.getReportByStatus(this.chooseReportStatus);
                            }
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                }).catch(err => {
                    this.disabled = false;
                });
            },
            rejectManage(reportId) {
                this.disabled = true;
                this.$confirm('是否确认驳回该举报？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'post',
                        url: '/product/report/reject',
                        params: {
                            reportId: reportId
                        }
                    }).then(res => {
                        this.disabled = false;
                        if (res.data.code === 0) {
                            this.$message.success('举报驳回成功');
                            if (this.chooseReportStatus === '') {
                                this.getAllReport();
                            } else {
                                this.getReportByStatus(this.chooseReportStatus);
                            }
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                }).catch(err => {
                    this.disabled = false;
                });
            },
            handleCurrentChange(page) {
                this.page = page;
                //为空执行所有查询
                if (this.chooseReportStatus === '') {
                    this.getAllReport();
                } else {
                    this.getReportByStatus(this.chooseReportStatus);
                }
            },
            timeFormat(row, column, cellValue) {
                if (cellValue) {
                    return this.moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss');
                }
            },
        }
    }
</script>

<style scoped>
    @import "../../assets/css/main.css";

    a {
        text-decoration: none;
    }

    a:hover {
        color: #409eff;
        cursor: pointer;
    }

    .report-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .report-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .head-tip {
        float: left;
        height: 40px;
        line-height: 40px;
        color: #C0C4CC;
    }

    .el-table .el-form-item {
        margin: 0;
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
    }

    .page {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    @media screen and (max-width: 1400px) {
        .el-table .el-form-item {
            width: 100%;
        }
    }
</style>