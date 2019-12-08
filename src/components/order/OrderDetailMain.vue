<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <div class="head-info">
                    <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                    <span style="font-size: 24px">订单详情</span>
                </div>

                <div class="step-part">
                    <el-steps :active="active" finish-status="success">
                        <el-step title="提交订单"></el-step>
                        <el-step title="支付订单"></el-step>
                        <el-step title="完结订单"></el-step>
                    </el-steps>
                </div>
            </div>

            <div class="main">
                <div class="order-status">
                    <span class="title">订单状态</span>
                    <div class="status-main">
                        <div>
                            <el-form label-width="100px">
                                <el-form-item label="订单状态：">
                                    <el-tag size="small" type="warning" v-if="orderInfo.payStatus===0 && orderInfo.orderStatus===0">未支付</el-tag>
                                    <el-tag size="small" v-if="orderInfo.payStatus===1 && orderInfo.orderStatus===0">已支付</el-tag>
                                    <el-tag size="small" type="success" v-if="orderInfo.payStatus===1 && orderInfo.orderStatus===1">已完结</el-tag>
                                    <el-tag size="small" type="info" v-if="orderInfo.payStatus===0 && orderInfo.orderStatus===2">已取消</el-tag>
                                </el-form-item>
                                <el-form-item label="订单操作：">
                                    <span>
                                        <a v-if="orderInfo.payStatus===0 && orderInfo.orderStatus===0" @click="payOrder(orderInfo.orderId)">去支付</a>
                                    </span>
                                    <span>
                                        <a v-if="orderInfo.payStatus===0 && orderInfo.orderStatus===0" @click="cancelOrder(orderInfo.orderId)">取消</a>
                                    </span>
                                </el-form-item>
                                <el-form-item v-if="orderInfo.payStatus===1 && orderInfo.orderStatus===1" label="订单评分：">
                                    <el-rate v-model="orderInfo.orderRate" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                             :disabled="rateDisabled" @change="rateOrder"></el-rate>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>

                <div class="order-info">
                    <span class="title">订单信息</span>
                    <div class="info-main">
                        <el-form label-width="100px">
                            <el-form-item label="订单编号：">
                                <span>{{orderInfo.orderId}}</span>
                            </el-form-item>
                            <el-form-item label="收货地址：">
                                <span>{{orderInfo.buyerName}}</span>
                                <span>{{orderInfo.buyerPhone}}</span>
                                <span>{{orderInfo.buyerAddress}}</span>
                            </el-form-item>
                            <el-form-item label="买家留言：">
                                <span>{{orderInfo.buyerMessage}}</span>
                            </el-form-item>
                            <el-form-item label="创建时间：">
                                <span>{{timeFormat(orderInfo.createTime)}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div class="seller-info">
                    <span class="title">卖家信息</span>
                    <div class="seller-main">
                        <el-form label-width="100px">
                            <el-form-item label="店铺名称：">
                                <a @click="watchStore(orderInfo.storeId)">{{orderInfo.storeName}}</a>
                            </el-form-item>
                            <el-form-item label="真实姓名：">
                                <span>{{orderInfo.sellerRealname}}</span>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                <span>{{orderInfo.sellerPhone}}</span>
                            </el-form-item>
                            <el-form-item label="店铺地址：">
                                <span>{{orderInfo.storeAddress}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div class="order-detail">
                    <span class="title">订单列表</span>
                    <div class="cart-head">
                        <div class="head-title">
                            <div class="cart-product">商品</div>
                            <div class="cart-price">单价</div>
                            <div class="cart-quantity">数量</div>
                            <div class="cart-amount">小计</div>
                        </div>
                    </div>

                    <div class="cart-main">
                        <div v-for="orderDetail in orderInfo.orderDetailList">
                            <div class="cart-info">
                                <div class="cart-left">
                                    <div class="cart-icon">
                                        <img v-if="orderDetail.productIcon" :src="productImg(orderDetail.productIcon)" @click="watchItem(orderDetail.productId)">
                                        <img v-if="!orderDetail.productIcon" src="../../assets/img/default_product.png" @click="watchItem(orderDetail.productId)">
                                    </div>
                                </div>

                                <div class="cart-right">
                                    <div class="cart-product">
                                        <div class="cart-name">
                                            <a @click="watchItem(orderDetail.productId)">{{orderDetail.productName}}</a>
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
                                </div>
                            </div>
                        </div>

                        <div class="cart-foot">
                            <div>
                                <span>实付款：</span>
                                <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                                <span class="amount-font" style="font-size: 18px;vertical-align: bottom">{{orderInfo.orderAmount | twoDecimal}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrderDetailMain",
        data() {
            return {
                orderId: '',
                orderInfo: {
                    orderId: '',
                    buyerUid: '',
                    buyerName: '',
                    buyerPhone: '',
                    buyerAddress: '',
                    buyerMessage: '',
                    sellerUid: '',
                    orderAmount: '',
                    orderStatus: '',
                    payStatus: '',
                    orderRate: '',
                    createTime: '',
                    updateTime: '',
                    orderDetailList: [],
                    storeId: '',
                    storeName: '',
                    sellerRealname: '',
                    sellerPhone: '',
                    storeAddress: ''
                },
                active: -1,
                rateDisabled: true
            }
        },
        mounted() {
            this.orderId = this.$route.query.orderId;
            if (!this.$route.query.orderId) {
                this.$router.push({path: '/error'});
            }
            this.getOrderDetail();
        },
        methods: {
            getOrderDetail() {
                if (this.orderId) {
                    this.axios({
                        method: 'get',
                        url: '/buyer/order/detail',
                        params: {
                            orderId: this.orderId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.orderInfo.orderId = res.data.data.orderId;
                            this.orderInfo.buyerUid = res.data.data.buyerUid;
                            this.orderInfo.buyerName = res.data.data.buyerName;
                            this.orderInfo.buyerPhone = res.data.data.buyerPhone;
                            this.orderInfo.buyerAddress = res.data.data.buyerAddress;
                            this.orderInfo.buyerMessage = res.data.data.buyerMessage;
                            this.orderInfo.sellerUid = res.data.data.sellerUid;
                            this.orderInfo.orderAmount = res.data.data.orderAmount;
                            this.orderInfo.orderStatus = res.data.data.orderStatus;
                            this.orderInfo.payStatus = res.data.data.payStatus;
                            this.orderInfo.orderRate = res.data.data.orderRate;
                            this.orderInfo.createTime = res.data.data.createTime;
                            this.orderInfo.updateTime = res.data.data.updateTime;
                            this.orderInfo.orderDetailList = res.data.data.orderDetailList;
                            this.orderInfo.storeId = res.data.data.storeId;
                            this.orderInfo.storeName = res.data.data.storeName;
                            this.orderInfo.sellerRealname = res.data.data.sellerRealname;
                            this.orderInfo.sellerPhone = res.data.data.sellerPhone;
                            this.orderInfo.storeAddress = res.data.data.storeAddress;

                            if (this.orderInfo.payStatus === 0 && this.orderInfo.orderStatus === 0) {
                                this.active = 1;
                            }
                            if (this.orderInfo.payStatus === 0 && this.orderInfo.orderStatus === 2) {
                                this.active = 1;
                            }
                            if (this.orderInfo.payStatus === 1 && this.orderInfo.orderStatus === 0) {
                                this.active = 2;
                            }
                            if (this.orderInfo.payStatus === 1 && this.orderInfo.orderStatus === 1) {
                                this.active = 3;
                            }
                            this.rateDisabled = this.orderInfo.orderRate !== 0;
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                }
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
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
                            this.getOrderDetail();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                })
            },
            rateOrder() {
                this.$confirm('是否确认给出 ' + this.orderInfo.orderRate + ' 星评价？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.rateDisabled = true;
                    this.axios({
                        method: 'post',
                        url: '/buyer/order/rate',
                        params: {
                            orderId: this.orderInfo.orderId,
                            orderRate: this.orderInfo.orderRate
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$message.success('订单评分成功');
                            this.getOrderDetail();
                        } else {
                            this.$message.warning(res.data.message);
                            this.rateDisabled = false;
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                        this.rateDisabled = false;
                    });
                })
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
            watchItem(productId) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: productId
                    }
                });
                open(item.href, '');
            },
            timeFormat(value) {
                if (value) {
                    return this.moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
                }
            },
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

    .step-part {
        line-height: normal;
        padding-top: 20px;
        width: 480px;
    }

    .content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
    }

    .title {
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
    }

    .info-main, .seller-main, .status-main {
        border-top: 3px #409EFF solid;
        padding-top: 20px;
    }

    .order-info, .seller-info, .order-detail {
        margin-top: 20px;
    }

    .el-form {
        margin: -12px 0;
    }

    .el-form-item {
        margin: 0;
    }

    .el-form-item span {
        margin-right: 10px;
    }

    .el-form-item .el-rate {
        display: inline-block;
        vertical-align: top;
        margin: 10px 10px 10px 0;
    }

    .cart-head {
        border-top: 3px #409EFF solid;
        height: 43px;
        line-height: 40px;
        background: whitesmoke;
    }

    .head-title {
        display: flex;
        padding: 0 10px;
    }

    .cart-main {
        /*第一个不用消除重叠*/
        margin-top: 21px;
    }

    .cart-info {
        display: flex;
        height: 80px;
        border: 1px #e6e6e6 solid;
        padding: 10px;
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
        width: 58px;
        height: 58px;
        border: 1px #e6e6e6 solid;
    }

    .cart-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cart-icon img:hover {
        cursor: pointer;
    }

    .cart-name {
        margin-left: 10px;
        width: 560px;
    }

    .cart-name a {
        margin-top: -2px;
        line-height: 20px;
        height: 40px;
        overflow: hidden;
        display: block;
    }

    .cart-price {
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
    }

    .cart-price .fa-jpy, .cart-amount .fa-jpy {
        font-size: 12px;
    }

    .cart-quantity {
        width: 150px;
    }

    .cart-amount {
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
    }

    .check-message p {
        width: 70px;
        margin: 0;
        line-height: 32px;
        white-space: nowrap;
    }

    .amount-font {
        color: orangered;
        font-weight: bold;
    }

    .check-amount p {
        margin: 0;
        line-height: 24px;
        text-align: right;
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

    @media screen and (max-width: 1400px) {
        .content {
            max-width: 960px;
        }

        .cart-name {
            width: 360px;
        }
    }

    @media screen and (max-width: 1120px) {
        .content {
            max-width: 720px;
        }

        .cart-name {
            width: 240px;
        }

        .cart-price {
            width: 120px;
        }

        .cart-quantity {
            width: 120px;
        }

        .cart-amount {
            width: 120px;
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

        .step-part {
            width: 100%;
        }

        .cart-head {
            height: 0;
        }

        .head-title {
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
            line-height: 28px;
            order: 2;
        }

        .cart-quantity {
            width: 50%;
            padding: 0 10px;
            text-align: right;
            line-height: 28px;
            order: 3;
        }

        .cart-amount {
            display: none;
        }
    }
</style>
