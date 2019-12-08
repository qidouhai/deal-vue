<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <div class="head-info">
                    <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                    <span style="font-size: 24px">店铺信息</span>
                </div>

                <SearchPart></SearchPart>
            </div>

            <div class="main" v-if="showShop">
                <el-collapse class="store-info">
                    <el-collapse-item>
                        <template slot="title">
                            <span class="collapse-label">店铺</span>
                            <span style="margin-right: 10px">{{storeInfo.storeName}}</span>
                            <span class="collapse-label">评分</span>
                            <el-rate class="rate-star" v-if="rateScore!==0" disabled show-score :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                     text-color="#ff9900" :value="rateScore" :score-template="rateScore.toFixed(1)"></el-rate>
                            <span class="rate-number" v-if="rateScore!==0">{{rateScore.toFixed(1)}}</span>
                            <span v-if="rateScore===0">暂无</span>
                        </template>

                        <div>
                            <span class="collapse-label">卖家昵称</span>
                            <span>{{storeInfo.sellerNickname}}</span>
                        </div>
                        <div>
                            <span class="collapse-label">店铺简介</span>
                            <span>{{storeInfo.storeIntroduction}}</span>
                        </div>
                    </el-collapse-item>
                </el-collapse>

                <div class="search-store">
                    <span class="title">本店商品</span>
                    <div class="search-main">
                        <div>
                            <el-input size="small" v-model="productNameInStore" placeholder="搜本店" @keydown.enter.native="searchInStore" clearable></el-input>
                        </div>
                        <div>
                            <el-button size="small" icon="el-icon-search" plain circle @click="searchInStore"></el-button>
                        </div>
                    </div>
                </div>

                <div class="product-info">
                    <div class="product" v-for="product in products">
                        <div class="product-img" ref="productImg" :style="{height:productImgHeight}">
                            <a @click="watchItem(product)">
                                <img v-if="product.productIcon" :src="productImg(product.productIcon)" :alt="product.productName">
                                <img v-if="!product.productIcon" src="../../assets/img/default_product.png" :alt="product.productName">
                            </a>
                        </div>
                        <p class="price"><i class="fa fa-jpy" aria-hidden="true"></i>{{product.productPrice.toFixed(2)}} </p>
                        <p class="name"><a @click="watchItem(product)">{{product.productName}}</a></p>
                        <p>
                            <el-tag size="mini" v-if="product.productSecondhand===0">二手</el-tag>
                            <el-tag size="mini" type="success" v-if="product.productSecondhand===1">全新</el-tag>
                        </p>
                    </div>
                    <div class="product-empty" v-for="product in emptyNum"></div>
                </div>

                <div v-if="totalElements" class="page">
                    <el-pagination layout="total, prev, pager, next, jumper" :total="totalElements" :page-size="size"
                                   :current-page="page" @current-change="handleCurrentChange"></el-pagination>
                </div>

                <!--为空的时候显示-->
                <div v-if="showEmpty">
                    <div class="second-main">
                        <div>
                            <p class="sorry-title">&gt;w&lt; 非常抱歉，找不到相关商品！</p>
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

            <div class="second" v-if="showSorry">
                <div class="second-main">
                    <div>
                        <p class="sorry-title">&gt;w&lt; 非常抱歉，店铺找不到了！</p>
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

    export default {
        name: "ShopMain",
        components: {
            SearchPart,
            RandomGoods
        },
        data() {
            return {
                storeId: '',
                showShop: false,
                showSorry: false,
                productNameInStore: '',
                storeInfo: {
                    storeId: '',
                    sellerUid: '',
                    storeName: '',
                    sellerNickname: '',
                    storeIntroduction: '',
                    createTime: ''
                },
                rate: {
                    oneStar: '',
                    twoStar: '',
                    threeStar: '',
                    fourStar: '',
                    fiveStar: ''
                },
                products: [],
                totalElements: '',
                emptyNum: '',   //为空的个数
                page: 1,
                size: 60,
                showEmpty: false,
                productImgHeight: ''
            }
        },
        mounted() {
            this.storeId = this.$route.query.storeId;
            this.productNameInStore = this.$route.query.productName ? this.$route.query.productName : '';
            this.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
            if (!this.$route.query.storeId) {
                this.$router.push({path: '/error'});
            }
            this.getStoreInfo();
            this.getRate();
            this.getProducts();
        },
        updated() {
            this.productImgSquare();
            window.addEventListener('resize', () => {
                this.productImgSquare();
            });
        },
        methods: {
            getStoreInfo() {
                this.axios({
                    method: 'get',
                    url: '/store/info',
                    params: {
                        storeId: this.storeId
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.showShop = true;
                        this.storeInfo.storeId = res.data.data.storeId;
                        this.storeInfo.sellerUid = res.data.data.sellerUid;
                        this.storeInfo.storeName = res.data.data.storeName;
                        this.storeInfo.sellerNickname = res.data.data.sellerNickname;
                        this.storeInfo.storeIntroduction = res.data.data.storeIntroduction;
                        this.storeInfo.createTime = res.data.data.createTime;
                    } else if (res.data.code === 60) {
                        this.showSorry = true;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            getRate() {
                this.axios({
                    method: 'get',
                    url: '/store/rate',
                    params: {
                        storeId: this.storeId
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.showShop = true;
                        this.rate.oneStar = res.data.data.oneStar;
                        this.rate.twoStar = res.data.data.twoStar;
                        this.rate.threeStar = res.data.data.threeStar;
                        this.rate.fourStar = res.data.data.fourStar;
                        this.rate.fiveStar = res.data.data.fiveStar;
                    } else if (res.data.code === 60) {
                        this.showSorry = true;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            getProducts() {
                this.pushInStore();
                this.axios({
                    method: 'get',
                    url: '/product/store/search',
                    params: {
                        storeId: this.storeId,
                        productName: this.productNameInStore,
                        page: this.page
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.showShop = true;
                        this.products = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                        this.emptyNum = this.products.length > 0 ? this.size - this.products.length : 0;
                        this.showEmpty = this.products.length === 0;
                    } else if (res.data.code === 60) {
                        this.showSorry = true;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            searchInStore() {
                this.page = 1;
                this.getProducts();
            },
            pushInStore() {
                this.$router.push({
                    query: {
                        storeId: this.storeId,
                        productName: this.productNameInStore,
                        page: this.page
                    }
                });
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
            },
            productImgSquare() {
                if (this.products.length > 0 && this.$refs.productImg[0]) {
                    this.productImgHeight = this.$refs.productImg[0].offsetWidth + 'px';
                }
            },
            handleCurrentChange(page) {
                this.page = page;
                this.send();
            },
            watchItem(product) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: product.productId
                    }
                });
                open(item.href, '');
            }
        },
        computed: {
            rateScore() {
                if (this.rate.oneStar + this.rate.twoStar + this.rate.threeStar + this.rate.fourStar + this.rate.fiveStar > 0) {
                    return (this.rate.oneStar * 1 + this.rate.twoStar * 2 + this.rate.threeStar * 3 + this.rate.fourStar * 4 + this.rate.fiveStar * 5) /
                        (this.rate.oneStar + this.rate.twoStar + this.rate.threeStar + this.rate.fourStar + this.rate.fiveStar);
                } else {
                    return 0;
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

    .content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
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

    .collapse-label {
        color: #909399;
        margin-right: 10px;
    }

    .rate-number {
        display: none;
    }

    .title {
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
    }

    .search-store {
        margin-top: 20px;
    }

    .product-info {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .search-main {
        border-top: 3px #409EFF solid;
        padding-top: 20px;
        display: flex;
    }

    .search-main .el-input {
        width: 300px;
        margin-right: 10px;
    }

    .product {
        padding: 10px;
        width: 240px;
        border: 1px solid transparent;
        border-radius: 4px;
    }

    /*不足的时候补空的*/
    .product-empty {
        width: 240px;
    }

    .product:hover {
        border: 1px #409eff solid;
    }

    .product p {
        margin: 10px 0;
        overflow: hidden;
        line-height: 20px;
        color: #606266;
    }

    .product-img {
        width: 100%;
    }

    .product-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product .price {
        color: orangered;
        font-size: 20px;
    }

    .fa-jpy {
        font-size: 16px;
    }

    .product .name {
        height: 40px;
    }

    .page {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .second {

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

        .rate-star {
            display: none;
        }

        .rate-number {
            display: inline;
        }

        .product {
            width: 50%;
        }

        .product-empty {
            width: 50%;
        }

        .product-img {
            width: 100%;
        }
    }
</style>
