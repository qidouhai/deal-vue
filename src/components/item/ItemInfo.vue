<template>
    <div class="container">
        <!--头部，背景色及高度设置区域-->
        <div class="head">
            <!--头部主体宽度，居中自适应-->
            <div class="content">
                <!--头部内容物-->
                <div class="head-inside">
                    <div class="head-info">
                        <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                        <span style="font-size: 24px">商品信息</span>
                    </div>

                    <SearchPart></SearchPart>
                </div>
            </div>
        </div>

        <div class="nav" v-if="showItem">
            <div class="content">
                <div class="nav-inside">
                    <div>
                        <span>商品类目</span>
                        <i class="el-icon-arrow-right" style="margin: 0 5px"></i>
                        <a @click="searchCategory">{{item.categoryName}}</a>
                    </div>
                    <div class="nav-right">
                        <el-button type="text" class="report" :disabled="disabled" @click="reportDialogVisible=true">举报</el-button>
                    </div>
                    <el-dialog title="举报商品" :visible.sync="reportDialogVisible" :width="dialogWidth" :before-close="cancelReport" :close-on-click-modal="false">
                        <el-input type="textarea" v-model="reportReason" :rows="3" placeholder="请输入举报理由" maxlength="64"></el-input>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancelReport">取消</el-button>
                            <el-button type="primary" @click="report" :disabled="reportReason.length===0">确定</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </div>

        <div class="main" v-if="showItem">
            <div class="content">
                <!--商品的图片和选择购买区域-->
                <div class="main-first">
                    <div class="product-img" ref="productImg" :style="{height:productImgHeight}">
                        <a @click="imgDialogVisible = true">
                            <img v-if="item.productIcon" :src="productImg(item.productIcon)" :alt="item.productName">
                            <img v-if="!item.productIcon" src="../../assets/img/default_product.png" :alt="item.productName">
                        </a>

                        <el-dialog title="大图" :visible.sync="imgDialogVisible" :width="imgDialogWidth">
                            <img v-if="item.productIcon" :src="productImg(item.productIcon)" :alt="item.productName">
                            <img v-if="!item.productIcon" src="../../assets/img/default_product.png" :alt="item.productName">
                        </el-dialog>
                    </div>

                    <div class="product-info">
                        <p>
                            <el-tag v-if="item.productSecondhand===0" size="small">二手</el-tag>
                            <el-tag v-if="item.productSecondhand===1" size="small" type="success">全新</el-tag>
                            <span class="name">{{item.productName}}</span>
                        </p>
                        <div class="price">
                            <el-form :model="item" label-width="50px">
                                <el-form-item label="售价">
                                    <div class="price-font">
                                        <i class="fa fa-jpy" aria-hidden="true"></i>
                                        <span>{{item.productPrice | twoDecimal}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="店铺">
                                    <a @click="watchStore">{{item.storeName}}</a>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div class="choose">
                            <el-form ref="form" :model="item" label-width="50px">
                                <el-form-item label="数量">
                                    <el-input-number size="small" v-model="item.productQuantity" :min="1" :max="item.productStock" :disabled="disabled"></el-input-number>
                                    <span class="stock">库存 {{item.productStock}} 件</span>
                                    <span class="item-down" v-if="item.productStatus===1">（已下架）</span>
                                </el-form-item>
                                <el-form-item>
                                    <span class="tip" v-if="item.cartProductQuantity">（购物车已有 {{item.cartProductQuantity}} 件）</span>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div class="buy-btn">
                            <el-button type="primary" plain @click="buy" :disabled="disabled">立即购买</el-button>
                            <el-button type="primary" @click="addToCart" :disabled="disabled || cartDisabled">加入购物车</el-button>
                        </div>
                    </div>
                </div>

                <!--商品介绍区域-->
                <div class="main-second">
                    <!--其他同类商品推荐区域-->
                    <div class="other-product">
                        <div class="store-search">
                            <el-input size="small" v-model="productNameInStore" placeholder="搜本店" @keydown.enter.native="searchInStore" clearable>
                                <el-button slot="append" icon="el-icon-search" @click="searchInStore"></el-button>
                            </el-input>
                        </div>

                        <!--推荐同类商品-->
                        <div class="recommend">
                            <span class="recommend-title">同类好货</span>
                            <div class="good-product" v-for="good in goods">
                                <div class="good-product-img">
                                    <a @click="watchItem(good)">
                                        <img v-if="good.productIcon" :src="productImg(good.productIcon)" :alt="good.productName">
                                        <img v-if="!good.productIcon" src="../../assets/img/default_product.png" :alt="good.productName">
                                    </a>
                                </div>
                                <p class="good-name"><a @click="watchItem(good)">{{good.productName}}</a></p>
                                <p class="good-price"><i class="fa fa-jpy" aria-hidden="true"></i>{{good.productPrice | twoDecimal}} </p>
                            </div>
                        </div>
                    </div>

                    <!--产品介绍区域-->
                    <div class="description">
                        <span class="title">商品介绍</span>
                        <div v-html="item.productDescription" class="description-inside wang-editor"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="second" v-if="showSorry">
            <div class="content">
                <div class="second-main">
                    <div>
                        <p class="sorry-title">&gt;w&lt; 非常抱歉，商品找不到了！</p>
                        <p>你可以：</p>
                        <ul class="sorry-ul">
                            <li>
                                <p>检查刚才的输入</p>
                            </li>
                            <li>
                                <p>去其他地方逛逛</p>
                            </li>
                        </ul>
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
    import Cookies from 'js-cookie'

    export default {
        name: "ItemInfo",
        components: {
            SearchPart,
            RandomGoods
        },
        data() {
            return {
                disabled: true,
                imgDialogVisible: false,
                reportDialogVisible: false,
                imgDialogWidth: '',
                productImgHeight: '',
                item: {
                    productId: '',
                    sellerUid: '',
                    sellerNickname: '',
                    storeId: '',
                    storeName: '',
                    productName: '',
                    productStock: 0,    //初始库存设为0
                    productSecondhand: '',
                    productPrice: '',
                    productDescription: '',
                    productIcon: '',
                    productStatus: '',
                    categoryName: '',
                    categoryType: '',
                    productQuantity: '',
                    cartProductQuantity: ''
                },
                goods: [],
                productNameInStore: '',
                reportReason: '',
                showItem: false,
                showSorry: false
            }
        },
        mounted() {
            this.item.productId = this.$route.query.productId;
            this.getItemInfo();
        },
        updated() {
            this.productImgSquare();    //设置product-img为正方形
            this.imgDialog();   //设置dialog宽度
            window.addEventListener('resize', () => {
                this.productImgSquare();
                this.imgDialog();
            });
        },
        methods: {
            getItemInfo() {
                this.axios({
                    method: 'get',
                    url: '/product/id',
                    params: {
                        productId: this.item.productId
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.showItem = true;
                        this.item.productId = res.data.data.productId;
                        this.item.sellerUid = res.data.data.sellerUid;
                        this.item.sellerNickname = res.data.data.sellerNickname;
                        this.item.storeId = res.data.data.storeId;
                        this.item.storeName = res.data.data.storeName;
                        this.item.productName = res.data.data.productName;
                        this.item.productStock = res.data.data.productStock;
                        this.item.productSecondhand = res.data.data.productSecondhand;
                        this.item.productPrice = res.data.data.productPrice;
                        this.item.productDescription = res.data.data.productDescription;
                        this.item.productIcon = res.data.data.productIcon;
                        this.item.productStatus = res.data.data.productStatus;
                        this.item.categoryName = res.data.data.categoryName;
                        this.item.categoryType = res.data.data.categoryType;
                        this.item.cartProductQuantity = res.data.data.cartProductQuantity;
                        this.disabled = this.item.productStatus === 1;
                        //寻找同类好货
                        this.findGoods();
                    } else if (res.data.code === 30) {
                        this.showSorry = true;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
            },
            productImgSquare() {
                if (this.$refs.productImg) {
                    this.productImgHeight = this.$refs.productImg.offsetWidth + 'px';
                }
            },
            imgDialog() {
                if (document.body.clientWidth >= 640) {
                    this.imgDialogWidth = '600px';
                } else {
                    this.imgDialogWidth = document.body.clientWidth - 20 + 'px';
                }
            },
            searchCategory() {
                let item = this.$router.resolve({
                    path: '/product',
                    query: {
                        categoryType: this.item.categoryType
                    }
                });
                open(item.href, '');
            },
            searchInStore() {
                this.$router.push({
                    path: '/shop',
                    query: {
                        storeId: this.item.storeId,
                        productName: this.productNameInStore
                    }
                });
            },
            findGoods() {
                this.axios({
                    method: 'get',
                    url: '/product/search',
                    params: {
                        categoryType: this.item.categoryType,
                        size: 3
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.goods = res.data.data.content;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                });
            },
            watchStore() {
                let shop = this.$router.resolve({
                    path: '/shop',
                    query: {
                        storeId: this.item.storeId
                    }
                });
                open(shop.href, '');
            },
            watchItem(good) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: good.productId
                    }
                });
                open(item.href, '');
            },
            checkLogin() {
                let token;
                token = Cookies.get('token');
                if (!token) {
                    this.$router.push({
                        path: '/login'
                    });
                }
            },
            cancelReport() {
                this.reportDialogVisible = false;
                this.reportReason = '';
            },
            report() {
                this.checkLogin();

                this.axios({
                    method: 'post',
                    url: '/product/report/create',
                    data: {
                        productId: this.item.productId,
                        reportReason: this.reportReason
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('举报成功');
                        this.reportDialogVisible = false;
                        this.reportReason = '';
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            buy() {
                this.checkLogin();
                let buyerUid;
                let buys = [];

                this.axios({
                    method: 'get',
                    url: '/user/info'
                }).then(res => {
                    if (res.data.code === 0) {
                        buyerUid = res.data.data.uid;
                        if (this.item.sellerUid === buyerUid) {
                            this.$message.warning('不能购买自己的商品');
                        } else {
                            buys.push({productId: this.item.productId, productQuantity: this.item.productQuantity});
                            this.$router.push({
                                path: '/buy',
                                query: {
                                    buys: JSON.stringify(buys)
                                }
                            });
                        }
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            addToCart() {
                this.checkLogin();

                this.axios({
                    method: 'post',
                    url: '/buyer/cart/add',
                    params: {
                        productId: this.item.productId,
                        productQuantity: this.item.productQuantity
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.getItemInfo();
                        this.$message.success('已成功添加至购物车');
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                })
            }
        },
        computed: {
            dialogWidth: function () {
                if (document.documentElement.clientWidth > 840) {
                    return '480px';
                } else {
                    return '400px';
                }
            },
            cartDisabled: function () {
                return this.item.productStock - this.item.cartProductQuantity - this.item.productQuantity < 0;
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
    @import "../../assets/css/html.css";

    a {
        text-decoration: none;
    }

    a:hover {
        color: #409eff;
        cursor: pointer;
    }

    .container {

    }

    .head {
        height: 80px;
        line-height: 80px;
        padding: 0 10px;
    }

    .head-inside {
        display: flex;
        justify-content: space-between;
    }

    .head-info img {
        height: 28px;
        vertical-align: top;
        margin: 26px 10px 26px 0;
    }

    .nav {
        height: 44px;
        line-height: 44px;
        background: whitesmoke;
        padding: 0 10px;
        color: #606266;
    }

    .nav-inside {
        display: flex;
        justify-content: space-between;
    }

    .report {
        margin: 0;
        color: #909399;
    }

    .report:hover {
        color: #409EFF;
    }

    .content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
    }

    .main {
        margin-top: 20px;
        padding: 0 10px;
    }

    .main-first {
        display: flex;
        justify-content: space-between;
    }

    .product-img {
        width: 400px;
        height: 400px;
        border: 1px #e6e6e6 solid;
    }

    .product-img img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    .product-info {
        position: relative;
        width: 780px;
    }

    .product-info .el-tag {
        margin-right: 10px;
    }

    .product-info p {
        margin: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 24px;
        max-height: 48px;
        line-height: 24px;
        color: #606266;
    }

    .el-form-item {
        margin: 0;
    }

    .choose {
        margin-top: 10px;
    }

    .el-form-item .stock {
        margin-left: 10px;
        color: #909399;
    }

    .el-form-item .tip {
        color: #909399;
    }

    .item-down {
        font-size: 13px;
        color: #C0C4CC;
    }

    .product-info .name {
        font-size: 16px;
        font-weight: bold;
    }

    .product-info .price {
        border-top: 3px #409EFF solid;
        background: whitesmoke;
        padding: 10px 0;
    }

    .price-font {
        color: orangered;
        font-size: 28px;
    }

    .fa-jpy {
        font-size: 18px;
    }

    .buy-btn {
        position: absolute;
        bottom: 0;
        margin-top: 20px;
    }

    .main-second {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

    .other-product {
        width: 200px;
    }

    .store-search {
        line-height: 40px;
    }

    .recommend {
        margin-top: 20px;
        border: 1px #e6e6e6 solid;
    }

    .recommend p {
        margin: 5px 0;
        overflow: hidden;
        line-height: 18px;
        color: #606266;
        font-size: 13px;
    }

    .recommend-title {
        background: whitesmoke;
        display: block;
        color: #909399;
        line-height: 40px;
        padding-left: 10px;
    }

    .description {
        width: 980px;
    }

    .description .title {
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
    }

    .description-inside {
        border-top: 3px #409EFF solid;
        padding-top: 7px;
    }

    .good-product {
        padding: 10px;
    }

    .good-product-img {
        width: 178px;
        height: 178px;
    }

    .good-product-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .good-product .good-price {
        color: orangered;
        font-size: 18px;
    }

    .good-price .fa-jpy {
        font-size: 14px;
    }

    .good-product .good-name {
        max-height: 36px;
    }

    .second {
        padding: 0 10px;
    }

    .second-main {
        display: flex;
        justify-content: center;
    }

    .sorry-title {
        font-size: 20px;
        font-weight: bold;
    }

    .sorry-ul {
        list-style-type: decimal;
    }

    @media screen and (max-width: 1400px) {
        .content {
            max-width: 960px;
        }

        .product-info {
            width: 540px;
        }

        .description {
            width: 740px;
        }
    }

    @media screen and (max-width: 1120px) {
        .content {
            max-width: 720px;
        }

        .product-img {
            width: 300px;
            height: 300px;
        }

        .product-info {
            width: 400px;
        }

        .description {
            width: 500px;
        }
    }

    @media screen and (max-width: 840px) {
        .content {
            max-width: 480px;
        }

        .head-inside {
            display: block;
        }

        .head-info {
            display: none;
        }

        .main-first {
            display: block;
        }

        .product-img {
            width: 100%;
        }

        .product-info {
            width: 100%;
        }

        .buy-btn {
            position: relative;
            display: flex;
            justify-content: space-between;
        }

        .buy-btn .el-button {
            width: 50%;
        }

        .main-second {
            display: block;
        }

        .other-product {
            display: none;
        }

        .description {
            width: 100%;
        }
    }
</style>
