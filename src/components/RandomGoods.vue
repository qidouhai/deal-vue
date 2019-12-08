<template>
    <div class="random-content">
        <span class="title">随便看看</span>
        <el-button size="mini" plain icon="el-icon-refresh" style="float: right" @click="getRandomGoods">换一换</el-button>
        <div class="random-main">
            <div class="good-product" v-for="good in showGoods">
                <div class="good-product-img" ref="productImg" :style="{height:productImgHeight}">
                    <a @click="watchGood(good)">
                        <img v-if="good.productIcon" :src="productImg(good.productIcon)" :alt="good.productName">
                        <img v-if="!good.productIcon" src="../assets/img/default_product.png" :alt="good.productName">
                    </a>
                </div>
                <p class="good-name"><a @click="watchGood(good)">{{good.productName}}</a></p>
                <p class="good-price"><i class="fa fa-jpy" aria-hidden="true"></i>{{good.productPrice | twoDecimal}} </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RandomGoods",
        data() {
            return {
                goods: [],
                showGoods: [],
                number: 6,  //随机查询数量
                productImgHeight: ''
            }
        },
        mounted() {
            this.getRandomGoods();
        },
        updated() {
            this.productImgSquare();
            window.addEventListener('resize', () => {
                this.productImgSquare();
                this.showGoodsMethod();
            });
        },
        methods: {
            getRandomGoods() {
                this.axios({
                    method: 'get',
                    url: '/product/random',
                    params: {
                        number: this.number
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        this.showGoods = [];
                        this.goods = res.data.data;
                        this.showGoodsMethod();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                })
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
            },
            productImgSquare() {
                if (this.goods.length > 0 && this.$refs.productImg[0]) {
                    this.productImgHeight = this.$refs.productImg[0].offsetWidth + 'px';
                }
            },
            showGoodsMethod() {
                let width = window.innerWidth;
                if (width > 1400 && this.showGoods.length !== 6) {
                    this.showGoods = this.goods.slice(0, 6);
                } else if (width > 1120 && width <= 1400 && this.showGoods.length !== 5) {
                    this.showGoods = this.goods.slice(0, 5);
                } else if (width > 840 && width <= 1120 && this.showGoods.length !== 4) {
                    this.showGoods = this.goods.slice(0, 4);
                } else if (width <= 840 && this.showGoods.length !== 3) {
                    this.showGoods = this.goods.slice(0, 3);
                }
            },
            watchGood(good) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: good.productId
                    }
                });
                open(item.href, '');
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
    a {
        text-decoration: none;
    }

    a:hover {
        color: #409eff;
        cursor: pointer;
    }

    .title {
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
    }

    .random-main {
        border-top: 3px #409EFF solid;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow: hidden;
        padding-top: 20px;
    }

    p {
        margin: 5px 0;
        overflow: hidden;
        line-height: 18px;
        color: #606266;
        font-size: 13px;
    }

    .good-product {
        padding: 10px;
        width: 200px;
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .good-product:hover {
        border: 1px #409eff solid;
    }

    .good-product-img {
        width: 100%;
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
        max-height: 18px;
    }

    @media screen and (max-width: 1400px) {
        .good-product {
            width: 20%;
        }
    }

    @media screen and (max-width: 1120px) {
        .good-product {
            width: 25%;
        }
    }

    @media screen and (max-width: 840px) {
        .good-product {
            width: 33.33%;
        }
    }
</style>
