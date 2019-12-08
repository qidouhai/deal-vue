<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <div class="head-info">
                    <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                    <span style="font-size: 24px">订单列表</span>
                </div>

                <SearchPart></SearchPart>
            </div>

            <div class="main">
                <a class="title" id="all" @click="option('all')">全部订单</a>
                <a class="title" id="unpaid" @click="option('unpaid')">待支付</a>
                <a class="title" id="unevaluated" @click="option('unevaluated')">待评价</a>
                <div class="cart-head">
                    <div class="head-title">
                        <div class="cart-product">商品</div>
                        <div class="cart-price">单价</div>
                        <div class="cart-quantity">数量</div>
                        <div class="cart-amount">小计</div>
                        <div class="cart-operate">操作</div>
                    </div>
                </div>

                <div v-for="orderMaster in orderMasters">
                    <div class="store-title">
                        <span style="font-weight: bold;margin-right: 10px">{{timeFormat(orderMaster.createTime)}}</span>
                        <span class="order-id">订单号：<a @click="watchDetail(orderMaster.orderId)">{{orderMaster.orderId}}</a></span>
                        <span>店铺：</span>
                        <a @click="watchStore(orderMaster.storeId)">{{orderMaster.storeName}}</a>
                    </div>

                    <div class="cart-main">
                        <div v-for="orderDetail in orderMaster.orderDetailList">
                            <div class="cart-info" :id="orderDetail.orderId">
                                <div class="cart-left">
                                    <div class="cart-icon">
                                        <img v-if="orderDetail.productIcon" :src="productImg(orderDetail.productIcon)" @click="watchItem(orderDetail)">
                                        <img v-if="!orderDetail.productIcon" src="../../assets/img/default_product.png" @click="watchItem(orderDetail)">
                                    </div>
                                </div>

                                <div class="cart-right">
                                    <div class="cart-product">
                                        <div class="cart-name">
                                            <a @click="watchItem(orderDetail)">{{orderDetail.productName}}</a>
                                        </div>
                                    </div>
                                    <div class="cart-price">
                                        <i class="fa fa-jpy" aria-hidden="true"></i>
                                        <span>{{orderDetail.productPrice | twoDecimal}}</span>
                                    </div>
                                    <div class="cart-quantity">
                                        <span>x{{orderDetail.productQuantity}}</span>
                                    </div>
                                    <div class="cart-amount">
                                        <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                                        <span class="amount-font">{{orderDetail.productQuantity*orderDetail.productPrice | twoDecimal}}</span>
                                    </div>
                                    <div class="cart-operate">
                                        <a v-if="orderMaster.payStatus===0 && orderMaster.orderStatus===0" @click="payOrder(orderMaster.orderId)">去支付</a>
                                        <a v-if="orderMaster.payStatus===0 && orderMaster.orderStatus===0" @click="cancelOrder(orderMaster.orderId)">取消</a>
                                        <a v-if="orderMaster.payStatus===1 && orderMaster.orderStatus===1 && orderMaster.orderRate===0"
                                           @click="watchDetail(orderMaster.orderId)">去评分</a>
                                        <a @click="watchDetail(orderMaster.orderId)">订单详情</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="cart-foot">
                        <div style="margin-right: 10px">
                            <el-tag size="small" type="warning" v-if="orderMaster.payStatus===0 && orderMaster.orderStatus===0">未支付</el-tag>
                            <el-tag size="small" v-if="orderMaster.payStatus===1 && orderMaster.orderStatus===0">已支付</el-tag>
                            <el-tag size="small" type="success" v-if="orderMaster.payStatus===1 && orderMaster.orderStatus===1">已完结</el-tag>
                            <el-tag size="small" type="info" v-if="orderMaster.payStatus===0 && orderMaster.orderStatus===2">已取消</el-tag>
                        </div>

                        <div style="margin-right: 10px;color: #67C23A" v-if="orderMaster.buyerMessage">
                            <el-tooltip class="item" effect="dark" :content="orderMaster.buyerMessage" placement="bottom">
                                <i class="fa fa-commenting" aria-hidden="true"></i>
                            </el-tooltip>
                        </div>

                        <div>
                            <span>实付款：</span>
                            <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                            <span class="amount-font" style="font-size: 18px;vertical-align: bottom">{{orderMaster.orderAmount | twoDecimal}}</span>
                        </div>
                    </div>
                </div>

                <!--为空的时候显示-->
                <div v-if="showEmpty" class="show-empty">
                    <span>找不到相关订单</span>
                </div>

                <div v-if="totalElements" class="page">
                    <el-pagination layout="total, prev, pager, next, jumper" :total="totalElements" :page-size="size"
                                   :current-page="page" @current-change="handleCurrentChange"></el-pagination>
                </div>
                <RandomGoods style="margin-top: 20px"></RandomGoods>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchPart from '@/components/SearchPart.vue'
    import RandomGoods from '@/components/RandomGoods'

    export default {
        name: "OrderMain",
        components: {
            SearchPart,
            RandomGoods
        },
        data() {
            return {
                orderStatus: '',
                payStatus: '',
                orderRate: '',
                orderMasters: [],
                totalElements: '',
                page: 1,
                size: 20,
                showEmpty: false
            }
        },
        mounted() {
            this.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
            this.orderStatus = this.$route.query.orderStatus ? parseInt(this.$route.query.orderStatus) : '';
            this.payStatus = this.$route.query.payStatus ? parseInt(this.$route.query.payStatus) : '';
            this.orderRate = this.$route.query.orderRate ? parseInt(this.$route.query.orderRate) : '';
            this.optionChosen();
            this.getOrderInfo();
        },
        methods: {
            getOrderInfo() {
                this.push();
                this.axios({
                    method: 'get',
                    url: '/buyer/order/list',
                    params: {
                        orderStatus: this.orderStatus,
                        payStatus: this.payStatus,
                        orderRate: this.orderRate,
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.orderMasters = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                        this.showEmpty = this.orderMasters.length === 0;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            optionChosen() {
                if (this.orderStatus === '' && this.payStatus === '' && this.orderRate === '') {
                    document.getElementById('all').style.color = '#409eff';
                } else if (this.orderStatus === 0 && this.payStatus === 0) {
                    document.getElementById('unpaid').style.color = '#409eff';
                } else if (this.orderStatus === 1 && this.payStatus === 1 && this.orderRate === 0) {
                    document.getElementById('unevaluated').style.color = '#409eff';
                }
            },
            option(value) {
                document.getElementById('all').removeAttribute('style');
                document.getElementById('unpaid').removeAttribute('style');
                document.getElementById('unevaluated').removeAttribute('style');
                document.getElementById(value).style.color = '#409eff';
                if (value === 'all') {
                    this.orderStatus = '';
                    this.payStatus = '';
                    this.orderRate = '';
                } else if (value === 'unpaid') {
                    this.orderStatus = 0;
                    this.payStatus = 0;
                    this.orderRate = '';
                } else if (value === 'unevaluated') {
                    this.orderStatus = 1;
                    this.payStatus = 1;
                    this.orderRate = 0;
                }
                this.page = 1;
                this.getOrderInfo();
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.push();
                this.getOrderInfo();
            },
            push() {
                this.$router.push({
                    query: {
                        page: this.page,
                        orderStatus: this.orderStatus,
                        payStatus: this.payStatus,
                        orderRate: this.orderRate
                    }
                });
            },
            watchStore(storeId) {
                let shop = this.$router.resolve({
                    path: '/shop',
                    query: {
                        storeId: storeId
                    }
                });
                open(shop.href, '');
            },
            watchItem(orderDetail) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: orderDetail.productId
                    }
                });
                open(item.href, '');
            },
            timeFormat(value) {
                if (value) {
                    return this.moment.unix(value).format('YYYY-MM-DD');
                }
            },
            payOrder(orderId) {
                let pay = this.$router.resolve({
                    path: '/pay',
                    query: {
                        orderId: orderId
                    }
                });
                open(pay.href, '');
            },
            cancelOrder(orderId) {
                this.$confirm('是否确认取消该订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'post',
                        url: '/buyer/order/cancel',
                        params: {
                            orderId: orderId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$message.success('订单取消成功');
                            this.getOrderInfo();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                })
            },
            watchDetail(orderId) {
                let detail = this.$router.resolve({
                    path: '/order/detail',
                    query: {
                        orderId: orderId
                    }
                });
                open(detail.href, '');
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

    .container {
        padding: 0 10px;
    }

    .head {
        height: 80px;
        line-height: 80px;
        display: flex;
        justify-content: space-between;
    }

    .head-info img {
        height: 28px;
        vertical-align: top;
        margin: 26px 10px 26px 0;
    }

    .content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
    }

    .title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        margin-right: 20px;
        color: #606266;
    }

    .cart-head {
        border-top: 3px #409EFF solid;
        height: 43px;
        line-height: 40px;
        background: whitesmoke;
    }

    .head-title {
        display: flex;
        padding-left: 10px;
    }

    .store-title {
        margin-top: 20px;
        line-height: 30px;
    }

    .order-id {
        margin-right: 10px;
    }

    .cart-main {
        /*第一个不用消除重叠*/
        margin-top: 1px;
    }

    .cart-info {
        display: flex;
        height: 130px;
        border: 1px #e6e6e6 solid;
        padding: 20px 0 20px 20px;
        /*为了消除重叠border*/
        margin-top: -1px;
    }

    .cart-info:hover {
        background: whitesmoke;
    }

    .cart-left {
        display: flex;
    }

    .cart-product, .cart-right {
        flex-grow: 1;
        display: flex;
        position: relative;
    }

    .cart-icon {
        width: 88px;
        height: 88px;
        border: 1px #e6e6e6 solid;
    }

    .cart-icon img, .popover-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cart-icon img:hover, .popover-icon img:hover {
        cursor: pointer;
    }

    .cart-name {
        margin: 0 10px;
        width: 480px;
    }

    .cart-name a {
        margin-top: -2px;
        line-height: 20px;
        height: 40px;
        overflow: hidden;
        display: block;
    }

    .cart-price {
        width: 120px;
        white-space: nowrap;
        overflow: hidden;
    }

    .cart-price .fa-jpy, .cart-amount .fa-jpy {
        font-size: 12px;
    }

    .cart-quantity {
        width: 120px;
    }

    .cart-amount {
        width: 120px;
        white-space: nowrap;
        overflow: hidden;
    }

    .cart-operate {
        width: 120px;
    }

    .cart-operate a {
        display: block;
        margin: 0 0 10px;
    }

    .amount-font {
        color: orangered;
        font-weight: bold;
    }

    .cart-foot {
        height: 40px;
        line-height: 40px;
        margin-top: -1px;
        border: 1px #e6e6e6 solid;
        display: flex;
        justify-content: flex-end;
        padding: 0 10px;
        background: whitesmoke;
    }

    .show-empty {
        margin-top: 20px;
        font-size: 16px;
    }

    .page {
        display: flex;
        justify-content: flex-end;
        margin: 20px 0;
    }

    @media screen and (max-width: 1400px) {
        .content {
            max-width: 960px;
        }

        .cart-name {
            width: 300px;
        }
    }

    @media screen and (max-width: 1120px) {
        .content {
            max-width: 720px;
        }

        .cart-name {
            width: 200px;
        }

        .cart-price {
            width: 90px;
        }

        .cart-quantity {
            width: 90px;
        }

        .cart-amount {
            width: 90px;
        }

        .cart-operate {
            width: 90px;
        }
    }

    @media screen and (max-width: 840px) {
        .content {
            max-width: 480px;
        }

        .head {
            display: block;
        }

        .head-info {
            display: none;
        }

        .cart-head {
            height: 0;
        }

        .head-title {
            display: none;
        }

        .order-id {
            display: none;
        }

        .cart-right {
            flex-wrap: wrap;
        }

        .cart-product {
            width: 100%;
            order: 1;
        }

        .cart-name {
            width: 100%;
        }

        .cart-price {
            width: 50%;
            padding: 0 10px;
            color: orangered;
            font-size: 16px;
            line-height: 36px;
            order: 3;
        }

        .cart-quantity {
            width: 50%;
            padding: 0 10px;
            text-align: right;
            line-height: 36px;
            order: 4;
        }

        .cart-amount {
            display: none;
        }

        .cart-operate {
            width: 100%;
            padding: 0 10px;
            text-align: right;
            order: 2;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }

        .cart-operate a {
            margin: 0;
        }
    }
</style>
