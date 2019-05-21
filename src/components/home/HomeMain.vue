<template>
    <div>
        <div class="content animated fadeIn" id="bg">
            <div class="inside-color" id="color">
                <div class="inside-main">
                    <div class="title" id="title" onselectstart="return false">
                        <h1>
                            <span>CAMPU</span>
                            <span style="font-weight: bold">SEARCH</span>
                        </h1>
                        <p>只需搜寻你想要的</p>

                        <div class="search">
                            <div class="search-input">
                                <el-input v-model="productName" @keydown.enter.native="search" placeholder="搜一搜好货" clearable>
                                    <el-select v-model="categoryType" slot="prepend">
                                        <el-option label="全部类目" value=""></el-option>
                                        <el-option v-for="category in categories" :label="category.categoryName" :value="category.categoryType.toString()"></el-option>
                                    </el-select>
                                </el-input>
                            </div>

                            <div class="search-button">
                                <el-button plain icon="el-icon-search" circle @click="search"></el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="background-info" id="backgroundInfo" onselectstart="return false">
                    <a>背景图片来自：{{currentAuthor}}</a>
                    <a @click="lastBackground"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a>
                    <a @click="nextBackground"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a>
                </div>

                <div class="wave" id="wave"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchPart",
        data() {
            return {
                productName: '',
                categoryType: '',
                categories: [],
                backgroundImage: [
                    {img: 'bg_home1.jpg', author: '石姬SHIK'},
                    {img: 'bg_home2.jpg', author: '泡小芙'},
                    {img: 'bg_home3.jpg', author: 'LENSINK'},
                    {img: 'bg_home4.jpg', author: 'HDWallSource'},
                    {img: 'bg_home5.jpg', author: '泡小芙'}
                ],
                currentBackground: '',   //存放的backgroundImage下标
                currentAuthor: ''
            }
        },
        mounted() {
            this.getCategory();
            this.initialBackground();
            this.bigScreen();
            window.addEventListener('resize', () => {
                this.bigScreen();
            })
        },
        methods: {
            search() {
                this.$router.push({
                    path: '/product',
                    query: {
                        productName: this.productName,
                        categoryType: this.categoryType
                    }
                })
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
            initialBackground() {
                this.currentBackground = Math.floor(Math.random() * this.backgroundImage.length);
                document.getElementById('bg').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/' + this.backgroundImage[this.currentBackground].img + ')';
                this.currentAuthor = this.backgroundImage[this.currentBackground].author;
            },
            lastBackground() {
                this.currentBackground--;
                if (this.currentBackground < 0) {
                    this.currentBackground = this.backgroundImage.length - 1;
                }
                document.getElementById('color').style.background = 'black';
                setTimeout(() => {
                    document.getElementById('color').style.background = 'transparent';
                    document.getElementById('bg').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/' + this.backgroundImage[this.currentBackground].img + ')';
                }, 150);
                this.currentAuthor = this.backgroundImage[this.currentBackground].author;
            },
            nextBackground() {
                this.currentBackground++;
                if (this.currentBackground > this.backgroundImage.length - 1) {
                    this.currentBackground = 0;
                }
                document.getElementById('color').style.background = 'black';
                setTimeout(() => {
                    document.getElementById('color').style.background = 'transparent';
                    document.getElementById('bg').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/' + this.backgroundImage[this.currentBackground].img + ')';
                }, 150);
                this.currentAuthor = this.backgroundImage[this.currentBackground].author;
            },
            bigScreen() {
                if (document.getElementById('wave') && document.getElementById('backgroundInfo')) {
                    let clientWidth = document.documentElement.clientWidth;
                    let clientHeight = document.documentElement.clientHeight;
                    let marginTopAndBottom = 210 / 1080 * clientHeight;

                    if (clientWidth > 1920) {
                        document.getElementById('wave').style.display = 'none';
                        document.getElementById('backgroundInfo').style.bottom = '30px';
                    } else {
                        document.getElementById('wave').removeAttribute('style');
                        document.getElementById('backgroundInfo').removeAttribute('style');
                    }

                    if (document.getElementById('wave').style.display === 'none') {
                        if (clientHeight > 1080) {
                            document.getElementById('title').style.margin = `${marginTopAndBottom}px auto`;
                        } else {
                            document.getElementById('title').style.margin = `210px auto`;
                        }
                    } else {
                        if (clientHeight > 1080) {
                            document.getElementById('title').style.margin = `${marginTopAndBottom}px auto ${marginTopAndBottom - 60}px`;
                        } else {
                            document.getElementById('title').removeAttribute('style');
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/main.css";

    .content {
        background: black no-repeat center;
        background-size: cover;
        position: relative;
        overflow: hidden;
    }

    .inside-color {
        overflow: hidden;
        background: transparent;
        transition: background 0.15s linear;
    }

    .inside-main {
        padding: 0 10px;
    }

    .title {
        max-width: 640px;
        margin: 210px auto 150px;
    }

    .title h1 {
        font-weight: normal;
        color: white;
        font-size: 100px;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .title h1 span {
        font-family: K, serif;
    }

    .title p {
        text-align: center;
        color: white;
        font-size: 24px;
        letter-spacing: 24px;
        margin-bottom: 80px;
    }

    .title h1:hover, .title p:hover {
        cursor: default;
    }

    .search {
        display: flex;
        justify-content: space-between;
    }

    .search-button {
        margin-left: 10px;
    }

    .search-input .el-select {
        width: 110px;
    }

    .search-input {
        width: 590px;
    }

    .background-info {
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        right: 20px;
        bottom: 60px;
        position: absolute;
    }

    .background-info a:hover {
        cursor: pointer;
        color: white;
    }

    .background-info i {
        position: relative;
        top: 2px;
        font-size: 20px;
        margin-left: 10px;
    }

    .wave {
        height: 60px;
        background: url("../../assets/img/wave.png") no-repeat center;
        background-size: cover;
    }

    @media screen and (max-width: 840px) {
        .title {
            max-width: 480px;
        }

        .title h1 {
            font-size: 72px;
        }

        .title p {
            font-size: 20px;
            letter-spacing: 20px;
            margin-bottom: 60px;
        }

        .search-input {
            width: 430px;
        }

        .background-info {
            bottom: 30px;
            right: 10px;
        }

        .wave {
            background: transparent;
        }
    }

    @media screen and (max-width: 560px) {
        .title {
            margin: 150px auto;
        }

        .title h1 {
            font-size: 66px;
        }

        .title p {
            font-size: 18px;
            letter-spacing: 18px;
            margin-bottom: 40px;
        }

        .background-info {
            bottom: 20px;
        }
    }
</style>