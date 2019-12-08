<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <div class="head-info">
                    <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                    <span style="font-size: 24px">购物车</span>
                </div>

                <SearchPart></SearchPart>
            </div>

            <div class="main">
                <span class="title">全部商品 {{totalElements}}</span>
                <div class="cart-head">
                    <div class="head-title">
                        <div class="cart-choose">选择</div>
                        <div class="cart-product">商品</div>
                        <div class="cart-price">单价</div>
                        <div class="cart-quantity">数量</div>
                        <div class="cart-amount">小计</div>
                        <div class="cart-operate">操作</div>
                    </div>
                </div>

                <div v-for="storeId in storeIds">
                    <div class="store-title">
                        <div class="cart-choose">
                            <el-checkbox-group v-model="checkedStoreIds" :max="1">
                                <el-checkbox :label="storeId" :disabled="storeDisabled(storeId)" @change="selectStore(storeId)">{{''}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <span>店铺：</span>
                        <a @click="watchStore(storeId)">{{showStoreName(storeId)}}</a>
                    </div>

                    <div class="cart-main">
                        <div v-for="cart in carts">
                            <div class="cart-info" v-if="storeId===cart.storeId" :id="cart.cartId">
                                <div class="cart-left">
                                    <div class="cart-choose">
                                        <el-checkbox-group v-model="checkedProductIds">
                                            <el-checkbox :label="cart.productId" :disabled="productDisabled(cart)" @change="selectProduct(cart)">{{''}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div class="cart-icon">
                                        <el-popover placement="right" trigger="hover" :open-delay="300">
                                            <div class="popover-icon">
                                                <img v-if="cart.productIcon" :src="productImg(cart.productIcon)" @click="watchItem(cart)">
                                                <img v-if="!cart.productIcon" src="../../assets/img/default_product.png" @click="watchItem(cart)">
                                            </div>
                                            <img v-if="cart.productIcon" :src="productImg(cart.productIcon)" @click="watchItem(cart)" slot="reference">
                                            <img v-if="!cart.productIcon" src="../../assets/img/default_product.png" @click="watchItem(cart)" slot="reference">
                                        </el-popover>
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
                                        <el-input-number size="mini" v-model="cart.productQuantity" :min="1" :max="cart.productStock"
                                                         @change="updateQuantity(cart)" :disabled="cart.productStatus===1"></el-input-number>
                                    </div>
                                    <div class="cart-amount">
                                        <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                                        <span class="amount-font">{{cart.productQuantity*cart.productPrice | twoDecimal}}</span>
                                    </div>
                                    <div class="cart-operate">
                                        <a @click="remove(cart)">删除</a>
                                    </div>
                                    <div class="cart-down">
                                        <span v-if="cart.productStatus===1">（已下架）</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--为空的时候显示-->
                <div v-if="showEmpty" class="show-empty">
                    <span>你的购物车中还没有商品，</span>
                    <a @click="$router.push({path:'/product'})">前去购物</a>
                </div>

                <div v-if="totalElements" class="page">
                    <el-pagination layout="total, prev, pager, next, jumper" :total="totalElements" :page-size="size"
                                   :current-page="page" @current-change="handleCurrentChange"></el-pagination>
                </div>

                <div ref="bottomReference"></div>

                <div v-if="carts.length > 0" class="settle-account" ref="settleAccount">
                    <div class="select-quantity">
                        <span>已选择</span>
                        <span class="amount-font"> {{checkedProductIds.length}} </span>
                        <span>件商品</span>
                    </div>

                    <div class="select-amount">
                        <span>总价：</span>
                        <span class="amount-font"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                        <span class="amount-font" style="font-size: 18px;vertical-align: bottom">{{selectAmount}}</span>
                        <el-tooltip content="不含运费" placement="top">
                            <i class="el-icon-warning tip-icon"></i>
                        </el-tooltip>
                    </div>

                    <div class="select-button">
                        <el-button type="primary" @click="buy" :disabled="checkedProductIds.length===0">去结算</el-button>
                    </div>
                </div>

                <RandomGoods style="margin-top: 20px"></RandomGoods>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchPart from '@/components/SearchPart.vue'
    import RandomGoods from '@/components/RandomGoods.vue'

    export default {
        name: "CartInfo",
        components: {
            SearchPart,
            RandomGoods
        },
        data() {
            return {
                carts: [],  //原始数据
                upCarts: [],    //在架中
                storeIds: [],  //记录不重复的店铺id
                totalElements: '',
                page: 1,
                size: 10,
                checkedStoreIds: [],  //选择的店铺id,最多选一个
                checkedProductIds: [],  //选择的商品id
                enabledStoreId: '',  //当前选择的店铺
                showEmpty: false
            }
        },
        mounted() {
            this.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
            this.getCartInfo();
        },
        updated() {
            this.settlePosition();
            this.productDown();
            window.addEventListener('scroll', () => {
                this.settlePosition();
            });
            window.addEventListener('resize', () => {
                this.settlePosition();
            });
        },
        methods: {
            getCartInfo() {
                this.push();
                this.axios({
                    method: 'get',
                    url: '/buyer/cart/list',
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.carts = res.data.data.content;
                        //把在架商品存放进upCarts中
                        this.upCarts = [];
                        for (let i = 0; i < this.carts.length; i++) {
                            if (this.carts[i].productStatus === 0) {
                                this.upCarts.push(this.carts[i]);
                            }
                            //移除选中下架的商品
                            for (let j = 0; j < this.checkedProductIds.length; j++) {
                                if (this.carts[i].productStatus === 1 && this.carts[i].productId === this.checkedProductIds[j]) {
                                    this.checkedProductIds.splice(j);
                                }
                            }
                        }
                        this.totalElements = res.data.data.totalElements;
                        this.showEmpty = this.carts.length === 0;
                        this.filterStore();
                    } else if (res.data.code === 55) {
                        //显示购物车失效商品数量
                        let message = `你的购物车中有 ${res.data.message} 件商品失效`;
                        this.$alert(message, '提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            callback: action => {
                                this.checkedStoreIds = [];
                                this.checkedProductIds = [];
                                this.enabledStoreId = '';
                                this.getCartInfo();
                            }
                        });
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
            handleCurrentChange(page) {
                this.checkedStoreIds = [];
                this.checkedProductIds = [];
                this.enabledStoreId = '';
                this.page = page;
                this.push();
                this.getCartInfo();
            },
            push() {
                this.$router.push({
                    query: {
                        page: this.page
                    }
                });
            },
            updateQuantity: _.debounce(function (cart) {
                this.axios({
                    method: 'post',
                    url: '/buyer/cart/update',
                    params: {
                        productId: cart.productId,
                        productQuantity: cart.productQuantity
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.getCartInfo();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            }, 300),
            remove(cart) {
                this.$confirm('是否确认删除该商品？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'delete',
                        url: '/buyer/cart/delete',
                        params: {
                            productId: cart.productId
                        }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$message.success('商品删除成功');
                            this.checkedStoreIds = [];
                            this.checkedProductIds = [];
                            this.enabledStoreId = '';
                            this.getCartInfo();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                    });
                })
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
            },
            selectStore(storeId) {
                if (this.checkedStoreIds.length === 0) {
                    this.checkedProductIds = [];
                    this.enabledStoreId = '';
                } else {
                    this.checkedProductIds = [];
                    for (let i = 0; i < this.upCarts.length; i++) {
                        if (storeId === this.upCarts[i].storeId) {
                            if (this.checkedProductIds.indexOf(this.upCarts[i].productId) === -1) {
                                this.checkedProductIds.push(this.upCarts[i].productId);
                            }
                        }
                    }
                }
            },
            selectProduct(cart) {
                if (this.checkedProductIds.length > 0) {
                    this.enabledStoreId = cart.storeId;
                } else {
                    this.enabledStoreId = '';
                }

                let count = 0;
                for (let i = 0; i < this.upCarts.length; i++) {
                    if (cart.storeId === this.upCarts[i].storeId) {
                        count++;
                    }
                }
                if (this.checkedProductIds.length === count) {
                    this.checkedStoreIds.push(cart.storeId);
                } else {
                    this.checkedStoreIds = [];
                }
            },
            storeDisabled(storeId) {
                if (this.checkedStoreIds.length > 0) {
                    return storeId !== this.checkedStoreIds[0];
                } else {
                    return this.enabledStoreId !== '' && storeId !== this.enabledStoreId;
                }
            },
            productDisabled(cart) {
                if (cart.productStatus === 1) {
                    return true;
                } else if (this.checkedStoreIds.length > 0) {
                    return cart.storeId !== this.checkedStoreIds[0];
                } else {
                    return this.enabledStoreId !== '' && cart.storeId !== this.enabledStoreId;
                }
            },
            productDown() {
                if (this.carts.length > 0) {
                    for (let i = 0; i < this.carts.length; i++) {
                        if (this.carts[i].productStatus === 1) {
                            document.getElementById(this.carts[i].cartId).style.background = 'whitesmoke';
                            document.getElementById(this.carts[i].cartId).style.color = '#C0C4CC';
                            document.getElementById(this.carts[i].cartId).getElementsByClassName('amount-font')[0].style.color = '#C0C4CC';
                            document.getElementById(this.carts[i].cartId).getElementsByClassName('amount-font')[1].style.color = '#C0C4CC';
                            document.getElementById(this.carts[i].cartId).getElementsByClassName('cart-price')[0].style.color = '#C0C4CC';
                        } else {
                            document.getElementById(this.carts[i].cartId).removeAttribute('style');
                            document.getElementById(this.carts[i].cartId).getElementsByClassName('amount-font')[0].removeAttribute('style');
                            document.getElementById(this.carts[i].cartId).getElementsByClassName('amount-font')[1].removeAttribute('style');
                            document.getElementById(this.carts[i].cartId).getElementsByClassName('cart-price')[0].removeAttribute('style');
                        }
                    }
                }
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
            settlePosition() {
                if (this.$refs.bottomReference && this.$refs.settleAccount) {
                    //滚动条高度
                    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    //定位固定的高度
                    let bottomHeight = this.$refs.bottomReference.offsetTop;
                    //浏览器宽度
                    let clientWidth = document.documentElement.clientWidth;
                    //浏览器高度
                    let clientHeight = document.documentElement.clientHeight;
                    //页面缩放比
                    let ratio = clientWidth < 420 ? clientWidth / 420 : 1;
                    //加上bar的高度
                    if (scrollTop < (bottomHeight - clientHeight + 50) - (clientHeight - ratio * clientHeight) / ratio) {
                        this.$refs.settleAccount.style.position = 'fixed';
                        this.$refs.bottomReference.style.height = '50px';
                    } else {
                        this.$refs.settleAccount.removeAttribute('style');
                        this.$refs.bottomReference.removeAttribute('style');
                    }
                }
            },
            buy() {
                let buys = [];
                for (let i = 0; i < this.checkedProductIds.length; i++) {
                    for (let j = 0; j < this.carts.length; j++) {
                        if (this.checkedProductIds[i] === this.carts[j].productId) {
                            buys.push({productId: this.checkedProductIds[i], productQuantity: this.carts[j].productQuantity});
                        }
                    }
                }
                this.$router.push({
                    path: '/buy',
                    query: {
                        buys: JSON.stringify(buys)
                    }
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
                    for (let j = 0; j < this.checkedProductIds.length; j++) {
                        if (this.carts[i].productId === this.checkedProductIds[j]) {
                            amount += this.carts[i].productPrice * this.carts[i].productQuantity;
                        }
                    }
                }
                return amount.toFixed(2);
            }
        },
        watch: {
            carts: function () {
                this.$nextTick(function () {
                    this.productDown();
                });
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
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
    }

    .cart-head {
        border-top: 3px #409EFF solid;
        height: 43px;
        line-height: 40px;
        background: whitesmoke;
    }

    .head-title {
        display: flex;
    }

    .store-title {
        margin-top: 20px;
        line-height: 30px;
    }

    .cart-main {
        /*第一个不用消除重叠*/
        margin-top: 1px;
    }

    .cart-info {
        display: flex;
        height: 130px;
        border: 1px #e6e6e6 solid;
        padding: 20px 0;
        /*为了消除重叠border*/
        margin-top: -1px;
    }

    .cart-info:hover {
        background: whitesmoke;
    }

    .cart-choose {
        width: 54px;
        text-align: center;
        display: inline-block;
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

    .popover-icon {
        height: 220px;
        width: 220px;
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
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
    }

    .cart-price .fa-jpy, .cart-amount .fa-jpy {
        font-size: 12px;
    }

    .cart-quantity {
        width: 150px;
    }

    .cart-quantity .el-input-number {
        margin-top: -6px;
        width: 100px;
    }

    .cart-amount {
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
    }

    .amount-font {
        color: orangered;
        font-weight: bold;
    }

    .cart-operate {
        width: 100px;
    }

    .cart-down {
        font-size: 13px;
        position: absolute;
        left: 10px;
        bottom: 0;
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

    .settle-account {
        height: 50px;
        line-height: 50px;
        background: whitesmoke;
        display: flex;
        justify-content: flex-end;
        z-index: 1;
        width: 1200px;
        bottom: 0;
    }

    .select-quantity, .select-amount {
        margin-right: 10px;
    }

    .settle-account .tip-icon {
        margin-left: 10px;
        color: #409EFF;
    }

    .select-button .el-button {
        font-size: 18px;
        height: 50px;
        font-weight: bold;
        color: white;
        border-radius: 0;
    }

    @media screen and (max-width: 1400px) {
        .content {
            max-width: 960px;
        }

        .settle-account {
            width: 960px;
        }

        .cart-name {
            width: 300px;
        }
    }

    @media screen and (max-width: 1120px) {
        .content {
            max-width: 720px;
        }

        .settle-account {
            width: 720px;
        }

        .cart-name {
            width: 200px;
        }

        .cart-price {
            width: 90px;
        }

        .cart-quantity {
            width: 120px;
        }

        .cart-amount {
            width: 90px;
        }

        .cart-operate {
            width: 50px;
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

        .cart-choose {
            width: 34px;
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
            order: 4;
        }

        .cart-quantity {
            width: 50%;
            padding: 0 10px;
            text-align: right;
            line-height: 36px;
            order: 5;
        }

        .cart-amount {
            display: none;
        }

        .cart-operate {
            width: 50%;
            padding: 0 10px;
            text-align: right;
            line-height: 26px;
            order: 3;
        }

        .cart-down {
            width: 50%;
            position: static;
            padding: 0 10px;
            line-height: 26px;
            order: 2;
        }

        .settle-account {
            width: 100%;
            left: 0;
            right: 0;
        }
    }
</style>
