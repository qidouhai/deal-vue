<template>
    <div>
        <div class="order-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>订单管理</span>
        </div>

        <div class="order-inside" v-loading="loading" element-loading-text="数据查询中">
            <div class="master" id="master">
                <div style="text-align: right">
                    <span class="head-tip">（点击订单 id 即可查看）</span>
                    <el-button type="text" @click="getAgainAllOrder">全部订单</el-button>
                    <el-button type="text" @click="getNewOrder">新订单</el-button>
                    <el-button type="text" @click="getFinishOrder">已完结</el-button>
                    <el-button type="text" @click="getCancelOrder">已取消</el-button>
                </div>

                <el-table :data="orders">
                    <el-table-column type="expand" label="展开">
                        <template slot-scope="props">
                            <el-form inline label-width="80px">
                                <el-form-item label="买家 uid">
                                    <span>{{props.row.buyerUid}}</span>
                                </el-form-item>
                                <el-form-item label="买家电话">
                                    <span>{{props.row.buyerPhone}}</span>
                                </el-form-item>
                                <el-form-item label="买家地址">
                                    <span>{{props.row.buyerAddress}}</span>
                                </el-form-item>
                                <el-form-item label="买家留言">
                                    <el-tooltip :content="props.row.buyerMessage" placement="bottom-start">
                                        <span>{{props.row.buyerMessage}}</span>
                                    </el-tooltip>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>

                    <el-table-column prop="orderId" label="订单 id" width="200px">
                        <template slot-scope="scope">
                            <a @click="detail(scope.row)">{{scope.row.orderId}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyerName" label="买家姓名" min-width="120px"></el-table-column>
                    <el-table-column prop="orderAmount" label="订单总价" width="120px" :formatter="orderAmountFormat"></el-table-column>
                    <el-table-column label="订单状态">
                        <template slot-scope="scope">
                            <el-tag size="small" v-if="scope.row.orderStatus===0">新订单</el-tag>
                            <el-tag type="success" size="small" v-if="scope.row.orderStatus===1">已完结</el-tag>
                            <el-tag type="info" size="small" v-if="scope.row.orderStatus===2">已取消</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付状态">
                        <template slot-scope="scope">
                            <el-tag size="small" v-if="scope.row.payStatus===0">未支付</el-tag>
                            <el-tag type="success" size="small" v-if="scope.row.payStatus===1">已支付</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建日期" width="160px" :formatter="timeFormat"></el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row)">详情</el-button>
                            <el-button type="text" v-if="scope.row.orderStatus===0 && scope.row.payStatus===0" @click="cancel(scope.row)">取消</el-button>
                            <el-button type="text" v-if="scope.row.orderStatus===0 && scope.row.payStatus===1" @click="finish(scope.row)">完结</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination class="page" layout="total, prev, pager, next, jumper" :total="totalElements"
                               :page-size="size" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
            </div>

            <div class="detail" id="detail" v-loading="loadingDetail" element-loading-text="数据查询中">
                <el-form inline label-width="80px">
                    <el-form-item label="订单评分">
                        <el-rate v-if="row.orderRate!==0" disabled :value="row.orderRate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
                        <span v-else>暂无</span>
                    </el-form-item>
                </el-form>

                <el-form inline v-for="detail in details" label-width="80px">
                    <el-form-item label="详情 id">
                        <span>{{detail.detailId}}</span>
                    </el-form-item>
                    <el-form-item label="订单 id">
                        <span>{{detail.orderId}}</span>
                    </el-form-item>
                    <el-form-item label="商品 id">
                        <a @click="watchItem(detail.productId)">{{detail.productId}}</a>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-tooltip :content="detail.productName" placement="bottom-start">
                            <span>{{detail.productName}}</span>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="商品单价">
                        <span>{{detail.productPrice | twoDecimal}}</span>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <span>{{detail.productQuantity}}</span>
                    </el-form-item>
                </el-form>

                <div>
                    <el-button type="primary" v-if="row.orderStatus===0 && row.payStatus===0" @click="cancel(row)">取消订单</el-button>
                    <el-button type="primary" v-if="row.orderStatus===0 && row.payStatus===1" @click="finish(row)">完结订单</el-button>
                    <el-button @click="returnOrder">返回</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StoreOrder",
        data() {
            return {
                chooseOrderStatus: '',
                orders: [],
                //当前的row信息
                row: {},
                //一个订单的详情
                details: [],
                totalElements: 0,
                page: 1,
                size: 10,
                loading: false,
                loadingDetail: false
            }
        },
        mounted() {
            this.getAllOrder();
        },
        methods: {
            getAllOrder() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/seller/order/list',
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.chooseOrderStatus = '';
                    if (res.data.code === 0) {
                        this.orders = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getOrderByStatus(orderStatus) {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/seller/order/list_by_status',
                    params: {
                        orderStatus: orderStatus,
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.chooseOrderStatus = orderStatus;
                    if (res.data.code === 0) {
                        this.orders = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getAgainAllOrder() {
                this.page = 1;
                this.getAllOrder();
            },
            getNewOrder() {
                this.page = 1;
                this.getOrderByStatus(0);
            },
            getFinishOrder() {
                this.page = 1;
                this.getOrderByStatus(1);
            },
            getCancelOrder() {
                this.page = 1;
                this.getOrderByStatus(2);
            },
            orderAmountFormat(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2);
                }
            },
            timeFormat(row, column, cellValue) {
                if (cellValue) {
                    return this.moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            detail(row) {
                this.row = row;
                document.getElementById('master').style.display = 'none';
                document.getElementById('detail').style.display = 'block';
                this.loadingDetail = true;
                this.getDetail();
            },
            getDetail() {
                this.axios({
                    method: 'get',
                    url: '/seller/order/detail',
                    params: {
                        orderId: this.row.orderId
                    }
                }).then(res => {
                    this.loadingDetail = false;
                    if (res.data.code === 0) {
                        this.row = res.data.data;
                        this.details = res.data.data.orderDetailList;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            handleCurrentChange(page) {
                this.page = page;
                //为空执行所有查询
                if (this.chooseOrderStatus === '') {
                    this.getAllOrder();
                } else {
                    this.getOrderByStatus(this.chooseOrderStatus);
                }
            },
            cancel(row) {
                this.$confirm('是否确认取消该订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'post',
                        url: '/seller/order/cancel',
                        params: {
                            orderId: row.orderId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$message.success('订单取消成功');
                            if (this.chooseOrderStatus === '') {
                                this.getAllOrder();
                            } else {
                                this.getOrderByStatus(this.chooseOrderStatus);
                            }
                            if (this.row.orderId) {
                                this.getDetail();
                            }
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error('服务器连接失败');
                    });
                })
            },
            finish(row) {
                this.$confirm('是否确认完结该订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'post',
                        url: '/seller/order/finish',
                        params: {
                            orderId: row.orderId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$message.success('订单完结成功');
                            if (this.chooseOrderStatus === '') {
                                this.getAllOrder();
                            } else {
                                this.getOrderByStatus(this.chooseOrderStatus);
                            }
                            if (this.row.orderId) {
                                this.getDetail();
                            }
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error('服务器连接失败');
                    });
                })
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
            returnOrder() {
                this.details = [];
                document.getElementById('master').style.display = 'block';
                document.getElementById('detail').style.display = 'none';
            }
        },
        filters: {
            twoDecimal(value) {
                if (value || value === 0) {
                    return value.toFixed(2);
                }
            }
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

    .order-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .order-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .el-table .el-form-item {
        margin: 0;
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
    }

    .el-form-item .el-rate {
        display: inline-block;
        vertical-align: top;
        margin: 10px 0;
    }

    #detail {
        display: none;
    }

    .detail .el-form {
        border-bottom: 1px #e6e6e6 solid;
        margin-bottom: 20px;
    }

    .detail .el-form-item {
        margin: 0;
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
    }

    .head-tip {
        float: left;
        height: 40px;
        line-height: 40px;
        color: #C0C4CC;
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

        .detail .el-form-item {
            width: 100%;
        }
    }
</style>