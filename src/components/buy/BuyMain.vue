<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <div class="head-info">
                    <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                    <span style="font-size: 24px">结算页</span>
                </div>

                <div class="step-part">
                    <el-steps :active="0" finish-status="success">
                        <el-step title="提交订单"></el-step>
                        <el-step title="支付订单"></el-step>
                        <el-step title="完结订单"></el-step>
                    </el-steps>
                </div>
            </div>

            <div class="main">
                <div class="choose-address">
                    <span class="title">选择收货地址</span>
                    <div class="address-main">
                        <div class="address" :id="address.addressId" v-for="address in showAddresses" @click="checkAddress(address.addressId)">
                            <div class="address-head">
                                <span>{{address.buyerName}}</span>
                                <span>收</span>
                                <el-tag size="mini" v-if="address.defaultAddress===1" style="float: right;margin: 0">默认地址</el-tag>
                            </div>
                            <div style="margin-top: 5px">
                                <span>{{address.buyerAddress}}</span>
                                <span>{{address.buyerPhone}}</span>
                            </div>
                            <div class="choose-triangle" v-if="checkedAddressId===address.addressId"></div>
                            <div class="choose-check" v-if="checkedAddressId===address.addressId">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                        </div>

                        <div class="address-empty" v-for="address in emptyNum"></div>
                        <!--为空的时候显示-->
                        <div v-if="showEmpty">
                            <span class="empty">你还没有收货地址，快去管理收货地址吧！</span>
                        </div>
                    </div>

                    <div class="address-foot">
                        <div>
                            <el-button type="text" v-if="showMore && showButton" @click="moreAddresses">更多地址</el-button>
                            <el-button type="text" v-if="!showMore && showButton" @click="lessAddresses">收起地址</el-button>
                        </div>
                        <div>
                            <el-button type="text" @click="manageAddress">管理收货地址</el-button>
                            <el-button type="text" @click="getUserAddress">刷新地址</el-button>
                        </div>
                    </div>
                </div>

                <div class="check-list">
                    <span class="title">确认订单信息</span>
                    <div class="cart-head">
                        <div class="head-title">
                            <div class="cart-product">商品</div>
                            <div class="cart-price">单价</div>
                            <div class="cart-quantity">数量</div>
                            <div class="cart-amount">小计</div>
                        </div>
                    </div>

                    <div v-for="storeId in storeIds">
                        <div class="store-title">
                            <span>店铺：</span>
                            <a @click="watchStore(storeId)">{{showStoreName(storeId)}}</a>
                        </div>

                        <div class="cart-main">
                            <div v-for="cart in carts">
                                <div class="cart-info" v-if="storeId===cart.storeId">
                                    <div class="cart-left">
                                        <div class="cart-icon">
                                            <img v-if="cart.productIcon" :src="productImg(cart.productIcon)" @click="watchItem(cart)">
                                            <img v-if="!cart.productIcon" src="../../assets/img/default_product.png" @click="watchItem(cart)">
                                        </div>
                                    </div>

                                    <div class="cart-right">
                                        <div class="cart-product">
                                            <div class="cart-name">
                                                <a @click="watchItem(cart)">{{cart.productName}}</a>
                                            </div>
                                        </div>
                                        <div class="cart-price">
                                            <i class="fa fa-jpy" aria-hidden="true"></i>
                                            <span>{{cart.productPrice | twoDecimal}}</span>
                                        </div>
                                        <div class="cart-quantity">
                                            <span>x{{cart.productQuantity}}</span>
                                        </div>
                                        <div class="cart-amount">
                                            <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                                            <span class="amount-font">{{cart.productQuantity*cart.productPrice | twoDecimal}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="check-message">
                        <p>订单留言：</p>
                        <el-input size="small" v-model="checkedBuyerMessage" placeholder="自己和卖家均可见" maxlength="64" clearable></el-input>
                    </div>
                </div>

                <div class="check-amount">
                    <p>
                        <span>应付金额：</span>
                        <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                        <span class="amount-font" style="font-size: 18px;vertical-align: bottom">{{selectAmount}}</span>
                    </p>
                    <p>寄送至：{{checkedBuyerAddress}}</p>
                    <p>收货人：<span style="margin-right: 5px">{{checkedBuyerName}}</span>{{checkedBuyerPhone}}</p>
                </div>

                <div class="creat-order">
                    <el-button class="submit-button" type="primary" :disabled="buyDisabled || checkedAddressId===''" @click="create">提交订单</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BuyMain",
        data() {
            return {
                buys: [],
                productIds: [],
                carts: [],  //原始数据
                storeIds: [],  //记录不重复的店铺id
                addresses: [],
                showAddresses: [],  //展示指定数量地址
                checkedAddressId: '',
                checkedBuyerName: '',
                checkedBuyerPhone: '',
                checkedBuyerAddress: '',
                checkedBuyerMessage: '',
                size: 12,
                emptyNum: '',   //为空的个数
                showEmpty: false,
                showButton: false,
                showMore: true,
                buyDisabled: false
            }
        },
        mounted() {
            this.buys = this.$route.query.buys ? JSON.parse(this.$route.query.buys) : [];
            if (!this.$route.query.buys) {
                this.$router.push({path: '/error'});
            }
            this.getUserAddress();
            this.getProductIds();
            this.getProductList();
        },
        updated() {
            window.addEventListener('resize', () => {
                this.showAddressesMethod();
            });
        },
        methods: {
            getProductIds() {
                for (let i = 0; i < this.buys.length; i++) {
                    this.productIds.push(this.buys[i].productId);
                }
            },
            getProductList() {
                this.axios({
                    method: 'post',
                    url: '/product/in_list',
                    data: {
                        productIds: JSON.stringify(this.productIds)
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.carts = res.data.data;
                        for (let i = 0; i < this.buys.length; i++) {
                            for (let j = 0; j < this.carts.length; j++) {
                                if (this.buys[i].productId === this.carts[j].productId) {
                                    this.carts[j].productQuantity = this.buys[i].productQuantity;
                                }
                            }
                        }
                        this.filterStore();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            filterStore() {
                //筛选出不重复的storeId
                this.storeIds = [];
                for (let i in this.carts) {
                    if (this.storeIds.indexOf(this.carts[i].storeId) === -1) {
                        this.storeIds.push(this.carts[i].storeId)
                    }
                }
            },
            showStoreName(storeId) {
                for (let i in this.carts) {
                    if (this.carts[i].storeId === storeId) {
                        return this.carts[i].storeName;
                    }
                }
            },
            getUserAddress() {
                this.axios({
                    method: 'get',
                    url: '/user/address/info'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.addresses = res.data.data;
                        this.emptyNum = this.addresses.length > 0 ? this.size - this.addresses.length : 0;
                        this.showEmpty = this.addresses.length === 0;
                        this.showAddresses = [];
                        this.sortAddresses();
                        this.getDefaultAddress();
                        this.showAddressesMethod();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            getDefaultAddress() {
                //默认的地址
                for (let i = 0; i < this.addresses.length; i++) {
                    if (this.addresses[i].defaultAddress === 1) {
                        this.checkedAddressId = this.addresses[i].addressId;
                        this.checkedStyle(this.checkedAddressId);
                    }
                }
            },
            checkedStyle(addressId) {
                this.removeStyle();
                this.$nextTick(function () {
                    if (document.getElementById(addressId)) {
                        document.getElementById(addressId).style.border = '1px solid #409EFF';
                    }
                })
            },
            removeStyle() {
                for (let i = 0; i < this.addresses.length; i++) {
                    if (document.getElementById(this.addresses[i].addressId)) {
                        document.getElementById(this.addresses[i].addressId).removeAttribute('style');
                    }
                }
            },
            checkAddress(addressId) {
                this.checkedAddressId = addressId;
            },
            manageAddress() {
                let address = this.$router.resolve({
                    path: '/user/address'
                });
                open(address.href, '');
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
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
            watchItem(cart) {
                if (cart.productStatus === 0) {
                    let item = this.$router.resolve({
                        path: '/item',
                        query: {
                            productId: cart.productId
                        }
                    });
                    open(item.href, '');
                }
            },
            sortAddresses() {
                this.addresses = this.addresses.sort((a, b) => a.defaultAddress - b.defaultAddress).reverse();
            },
            showAddressesMethod() {
                if (this.showMore === true) {
                    let width = window.innerWidth;
                    if (width > 1400 && this.showAddresses.length !== 4) {
                        this.showButton = this.addresses.length > 4;
                        if (!(this.showAddresses.length === this.addresses.length && this.addresses.length <= 4)) {
                            this.showAddresses = this.addresses.slice(0, 4);
                        }
                    } else if (width > 1120 && width <= 1400 && this.showAddresses.length !== 3) {
                        this.showButton = this.addresses.length > 3;
                        if (!(this.showAddresses.length === this.addresses.length && this.addresses.length <= 3)) {
                            this.showAddresses = this.addresses.slice(0, 3);
                        }
                    } else if (width > 840 && width <= 1120 && this.showAddresses.length !== 2) {
                        this.showButton = this.addresses.length > 2;
                        if (!(this.showAddresses.length === this.addresses.length && this.addresses.length <= 2)) {
                            this.showAddresses = this.addresses.slice(0, 2);
                        }
                    } else if (width <= 840 && this.showAddresses.length !== 1) {
                        this.showButton = this.addresses.length > 1;
                        if (!(this.showAddresses.length === this.addresses.length && this.addresses.length <= 1)) {
                            this.showAddresses = this.addresses.slice(0, 1);
                        }
                    }
                } else {
                    this.showAddresses = this.addresses;
                }
            },
            moreAddresses() {
                this.showMore = false;
                this.showAddressesMethod();
            },
            lessAddresses() {
                this.showMore = true;
                this.showAddressesMethod();
            },
            create() {
                this.buyDisabled = true;
                this.axios({
                    method: 'post',
                    url: '/buyer/order/create',
                    data: {
                        name: this.checkedBuyerName,
                        phone: this.checkedBuyerPhone,
                        address: this.checkedBuyerAddress,
                        message: this.checkedBuyerMessage,
                        sellerUid: this.carts[0].sellerUid,
                        items: JSON.stringify(this.buys),
                    }
                }).then(res => {
                    this.buyDisabled = false;
                    if (res.data.code === 0) {
                        this.$message.success('订单提交成功');
                        this.$router.push({
                            path: '/pay',
                            query: {
                                orderId: res.data.data.orderId
                            }
                        })
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.buyDisabled = false;
                    this.$message.error('服务器连接失败');
                });
            }
        },
        filters: {
            twoDecimal(value) {
                if (value || value === 0) {
                    return value.toFixed(2);
                }
            }
        },
        computed: {
            selectAmount: function () {
                let amount = 0;
                for (let i = 0; i < this.carts.length; i++) {
                    amount += this.carts[i].productPrice * this.carts[i].productQuantity;
                }
                return amount.toFixed(2);
            }
        },
        watch: {
            checkedAddressId: function () {
                this.checkedStyle(this.checkedAddressId);
                for (let i = 0; i < this.addresses.length; i++) {
                    if (this.addresses[i].addressId === this.checkedAddressId) {
                        this.checkedBuyerName = this.addresses[i].buyerName;
                        this.checkedBuyerPhone = this.addresses[i].buyerPhone;
                        this.checkedBuyerAddress = this.addresses[i].buyerAddress;
                    }
                }
            }
        }
    }
</script>

<style scoped>
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

    .address-main {
        border-top: 3px #409EFF solid;
        display: flex;
        flex-wrap: wrap;
        margin-right: -20px;
    }

    /*不足的时候补空的*/
    .address-empty {
        width: 280px;
        margin-right: 20px;
        flex-grow: 1;
    }

    .address {
        width: 280px;
        margin-right: 20px;
        margin-top: 20px;
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        position: relative;
    }

    .address:hover {
        cursor: pointer;
        border: 1px solid #409EFF;
    }

    .address span {
        margin-right: 5px;
        line-height: 20px;
    }

    .choose-triangle {
        width: 0;
        height: 0;
        /*实际是28px*/
        border: 14px solid;
        border-color: transparent #409EFF #409EFF transparent;
        border-bottom-right-radius: 4px;
        position: absolute;
        right: -1px;
        bottom: -1px;
    }

    .choose-check {
        position: absolute;
        right: 1px;
        bottom: 0;
        color: white;
    }

    .address-head {
        padding-bottom: 5px;
        border-bottom: 1px solid #e6e6e6;
    }

    .address-foot {
        display: flex;
        justify-content: space-between;
    }

    .check-list {

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

    .store-title {
        margin-top: 10px;
        line-height: 30px;
    }

    .cart-main {
        /*第一个不用消除重叠*/
        margin-top: 1px;
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

    .check-message {
        margin-top: 20px;
        display: flex;
    }

    .check-message p {
        width: 70px;
        margin: 0;
        line-height: 32px;
        white-space: nowrap;
    }

    .check-message .el-input {
        width: 410px;
    }

    .amount-font {
        color: orangered;
        font-weight: bold;
    }

    .check-amount {
        margin-top: 20px;
        background: whitesmoke;
        padding: 10px;
    }

    .check-amount p {
        margin: 0;
        line-height: 24px;
        text-align: right;
    }

    .creat-order {
        margin-top: 20px;
    }

    .submit-button {
        float: right;
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

        .submit-button {
            width: 100%;
        }
    }
</style>
