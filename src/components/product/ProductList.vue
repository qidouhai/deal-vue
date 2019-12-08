<template>
    <div class="container">
        <div class="head content">
            <div class="head-info">
                <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                <span style="font-size: 24px">商品搜索</span>
            </div>

            <div class="search-part">
                <div class="search-input-part">
                    <el-input v-model="productName" placeholder="搜一搜好货" @keydown.enter.native="search" clearable>
                        <el-select v-model="categoryType" slot="prepend">
                            <el-option label="全部类目" value=""></el-option>
                            <el-option v-for="category in categories" :label="category.categoryName" :value="category.categoryType"></el-option>
                        </el-select>
                    </el-input>
                </div>

                <div class="search-button-part">
                    <el-button type="primary" @click="search">搜索</el-button>
                </div>
            </div>
        </div>

        <div class="main content">
            <div class="main-option">
                <a class="title" id="all" @click="option('all')">全部商品</a>
                <a class="title" id="old" @click="option('old')">二手</a>
                <a class="title" id="new" @click="option('new')">全新</a>
            </div>

            <div class="main-nav" v-show="mainNavShow">
                <el-breadcrumb class="nav-info" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>当前类目</el-breadcrumb-item>
                    <el-breadcrumb-item>{{convertCategory(returnCategoryType)}}</el-breadcrumb-item>
                </el-breadcrumb>

                <div class="nav-option">
                    <a id="c0" @click="searchByCategory('')">全部类目</a>
                </div>
                <div class="nav-option" v-for="category in categories">
                    <a :id="'c'+category.categoryType" @click="searchByCategory(category.categoryType)">{{category.categoryName}}</a>
                </div>
            </div>

            <div class="main-body">
                <div class="product" v-for="product in products">
                    <div class="product-img" ref="productImg" :style="{height:productImgHeight}">
                        <a @click="watchItem(product)">
                            <img v-if="product.productIcon" :src="productImg(product.productIcon)" :alt="product.productName">
                            <img v-if="!product.productIcon" src="../../assets/img/default_product.png" :alt="product.productName">
                        </a>
                    </div>
                    <p class="price"><i class="fa fa-jpy" aria-hidden="true"></i>{{product.productPrice.toFixed(2)}} </p>
                    <p class="name"><a @click="watchItem(product)">{{product.productName}}</a></p>
                    <p class="store"><a @click="watchStore(product)">{{product.storeName}}</a></p>
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
                <div class="sorry-main">
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
    </div>
</template>

<script>
    import RandomGoods from '@/components/RandomGoods.vue'

    export default {
        name: "ProductList",
        components: {
            RandomGoods
        },
        data() {
            return {
                productName: '',
                categoryType: '',
                returnCategoryType: '',    //获取数据之后的类目
                productSecondhand: '',
                products: [],
                categories: [],
                totalElements: '',
                emptyNum: '',   //为空的个数
                page: 1,
                size: 60,
                showEmpty: false,
                productImgHeight: '',
                mainNavShow: false
            }
        },
        mounted() {
            this.getCategory();
            this.productName = this.$route.query.productName ? this.$route.query.productName : '';
            this.categoryType = this.$route.query.categoryType ? parseInt(this.$route.query.categoryType) : '';
            this.productSecondhand = this.$route.query.productSecondhand ? parseInt(this.$route.query.productSecondhand) : '';
            this.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
            this.optionChosen();
            this.send();
        },
        updated() {
            this.navChosen();
            this.productImgSquare();
            window.addEventListener('resize', () => {
                this.productImgSquare();
            });
        },
        methods: {
            send() {
                this.push();
                this.axios({
                    method: 'get',
                    url: '/product/search',
                    params: {
                        productName: this.productName,
                        categoryType: this.categoryType,
                        productSecondhand: this.productSecondhand,
                        page: this.page
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.products = res.data.data.content;
                        this.returnCategoryType = this.categoryType;
                        this.totalElements = res.data.data.totalElements;
                        this.emptyNum = this.products.length > 0 ? this.size - this.products.length : 0;
                        this.showEmpty = this.products.length === 0;
                        this.mainNavShow = true;
                        this.navChosen();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            search() {
                this.page = 1;
                this.send();
            },
            getCategory() {
                this.axios({
                    method: 'get',
                    url: '/category/list'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.categories = res.data.data;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                })
            },
            convertCategory(value) {
                if (this.categories) {
                    for (let i = 0; i < this.categories.length; i++) {
                        if (value === this.categories[i].categoryType) {
                            return this.categories[i].categoryName;
                        } else if (value === '') {
                            return '全部类目';
                        }
                    }
                }
            },
            searchByCategory(categoryType) {
                this.categoryType = categoryType;
                this.search();
            },
            optionChosen() {
                if (this.productSecondhand === '') {
                    document.getElementById('all').style.color = '#409eff';
                } else if (this.productSecondhand === 0) {
                    document.getElementById('old').style.color = '#409eff';
                } else if (this.productSecondhand === 1) {
                    document.getElementById('new').style.color = '#409eff';
                }
            },
            option(value) {
                document.getElementById('all').removeAttribute('style');
                document.getElementById('old').removeAttribute('style');
                document.getElementById('new').removeAttribute('style');
                document.getElementById(value).style.color = '#409eff';
                if (value === 'all') {
                    this.productSecondhand = '';
                } else if (value === 'old') {
                    this.productSecondhand = 0;
                } else if (value === 'new') {
                    this.productSecondhand = 1;
                }
                this.page = 1;
                this.send();
            },
            navChosen() {
                this.$nextTick(() => {
                    for (let i = 0; i <= this.categories.length; i++) {
                        document.getElementById('c' + i).removeAttribute('style');
                    }
                    if (this.returnCategoryType === '') {
                        document.getElementById('c0').style.color = '#409eff';
                    } else {
                        document.getElementById('c' + this.returnCategoryType).style.color = '#409eff';
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
            push() {
                this.$router.push({
                    query: {
                        productName: this.productName,
                        categoryType: this.categoryType,
                        productSecondhand: this.productSecondhand,
                        page: this.page
                    }
                });
            },
            watchStore(product) {
                let shop = this.$router.resolve({
                    path: '/shop',
                    query: {
                        storeId: product.storeId
                    }
                });
                open(shop.href, '');
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

    .head-info img:hover {
        transform: rotate(3600deg);
        transition-duration: 10s;
    }

    .main-option {
        border-bottom: 3px #409EFF solid;
    }

    .title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        margin-right: 20px;
        color: #606266;
    }

    .nav-info {
        margin-bottom: 20px;
        color: #606266;
    }

    .main-nav {
        margin-top: 20px;
        margin-right: -20px;
        margin-bottom: -20px;
        color: #606266;
    }

    .nav-option {
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 20px;
    }

    .main-body {
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
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

    .empty {
        font-size: 20px;
        color: #909399;
    }

    .fa-jpy {
        font-size: 16px;
    }

    .product .name {
        height: 40px;
    }

    .product .store {
        height: 20px;
        color: #909399;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .sorry-main {
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

    .page {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
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

        .main-nav {
            margin-right: 0;
        }

        .nav-option {
            display: none;
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
