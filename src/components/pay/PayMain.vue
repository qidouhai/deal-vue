<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <div class="head-info">
                    <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                    <span style="font-size: 24px">支付页</span>
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
                <div class="pay-info">
                    <span class="title">支付确认</span>
                    <div class="pay-main">
                        <div class="pay-check">
                            <el-form label-width="100px">
                                <el-form-item label="订单号：">
                                    <span>{{orderInfo.orderId}}</span>
                                </el-form-item>
                                <el-form-item label="商品名称：">
                                    <span v-for="orderDetail in orderInfo.orderDetailList">
                                        <span style="margin-right: 10px">{{orderDetail.productName}}</span>
                                    </span>
                                </el-form-item>
                                <el-form-item label="交易金额：">
                                    <i class="fa fa-jpy" v-if="orderInfo.orderAmount" style="font-size: 12px" aria-hidden="true"></i>
                                    <span>{{orderInfo.orderAmount | twoDecimal}}</span>
                                </el-form-item>
                                <el-form-item label="购买时间：">
                                    <span>{{timeFormat(orderInfo.createTime)}}</span>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div class="pay-foot" v-if="orderInfo.orderDetailList.length > 0">
                            <span>请支付：</span>
                            <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                            <span class="amount-font" style="font-size: 18px;vertical-align: bottom">{{orderInfo.orderAmount | twoDecimal}}</span>
                        </div>

                        <div class="pay-button" v-if="orderInfo.payStatus===0 && orderInfo.orderStatus===0">
                            <el-button :disabled="payDisabled" @click="cancel">取消订单</el-button>
                            <el-button type="primary" :disabled="payDisabled" @click="pay">确认支付</el-button>
                        </div>

                        <div class="pay-message">
                            <el-alert v-if="orderInfo.payStatus===1 && orderInfo.orderStatus===0" title="订单已支付" type="success" :closable="false" show-icon></el-alert>
                            <el-alert v-if="orderInfo.payStatus===1 && orderInfo.orderStatus===1" title="订单已完结" type="success" :closable="false" show-icon></el-alert>
                            <el-alert v-if="orderInfo.payStatus===0 && orderInfo.orderStatus===2" title="订单已取消" type="info" :closable="false" show-icon></el-alert>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PayMain",
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
                payDisabled: false
            }
        },
        mounted() {
            this.orderId = this.$route.query.orderId;
            if (!this.$route.query.orderId) {
                this.$router.push({path: '/error'});
            }
            this.getOrderInfo();
        },
        methods: {
            getOrderInfo() {
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
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                }
            },
            timeFormat(value) {
                if (value) {
                    return this.moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            pay() {
                this.payDisabled = true;
                this.axios({
                    method: 'post',
                    url: '/buyer/order/pay',
                    params: {
                        orderId: this.orderId
                    }
                }).then(res => {
                    this.payDisabled = false;
                    if (res.data.code === 0) {
                        this.$message.success('订单支付成功');
                        this.getOrderInfo();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.payDisabled = false;
                    this.$message.error('服务器连接失败');
                });
            },
            cancel() {
                this.$confirm('是否确认取消该订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'post',
                        url: '/buyer/order/cancel',
                        params: {
                            orderId: this.orderId
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

    .pay-main {
        border-top: 3px #409EFF solid;
        padding-top: 20px;
    }

    .pay-foot {
        height: 40px;
        line-height: 40px;
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        padding: 0 10px;
        background: whitesmoke;
    }

    .pay-button {
        display: flex;
        justify-content: flex-end;
    }

    .pay-button, .pay-message {
        margin-top: 20px;
    }

    .el-form {
        margin: -12px 0;
    }

    .el-form-item {
        margin: 0;
    }

    .amount-font {
        color: orangered;
        font-weight: bold;
    }

    @media screen and (max-width: 1400px) {
        .content {
            max-width: 960px;
        }
    }

    @media screen and (max-width: 1120px) {
        .content {
            max-width: 720px;
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

        .pay-button .el-button {
            width: 50%;
        }
    }
</style>