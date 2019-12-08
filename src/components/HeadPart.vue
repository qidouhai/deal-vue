<template>
    <div class="container">
        <div class="content">
            <div class="big-inside">
                <ul>
                    <li @click="$router.push({path:'/'})">
                        <span>返回首页</span>
                    </li>
                </ul>

                <ul>
                    <li v-if="!token" @click="$router.push({path:'/login'})">
                        <span>Hi！请登录</span>
                    </li>

                    <li v-if="!token" @click="$router.push({path:'/register'})">
                        <span>免费注册</span>
                    </li>

                    <li v-if="token" @click="$router.push({path:'/user'})">
                        <span>{{nickname}}</span>
                        <i class="el-icon-arrow-down"></i>
                        <!--悬浮显示-->
                        <div class="item" @click.stop>
                            <div class="my-info">
                                <div class="head-icon">
                                    <router-link to="/user">
                                        <img v-if="headIcon" :src="headImg(headIcon)" alt="头像">
                                        <img v-if="!headIcon" src="../assets/img/anonymous.png" alt="头像">
                                    </router-link>
                                </div>
                                <div class="content-right">
                                    <p class="logout"><a @click="logout">退出</a></p>
                                    <p v-if="introduction">{{introduction}}</p>
                                    <p v-else>太懒了，啥都没写...</p>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li @click="$router.push({path:'/order'})">
                        <span>我的订单</span>
                    </li>

                    <li @click="$router.push({path:'/cart'})">
                        <span>我的购物车</span>
                    </li>

                    <li @click="$router.push({path:'/store'})">
                        <span>我的店铺</span>
                    </li>

                    <li v-if="role==='0'" @click="$router.push({path:'/manage'})">
                        <span>系统管理</span>
                    </li>
                </ul>
            </div>

            <div class="small-inside">
                <ul>
                    <li @click="openDrawer">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </li>
                </ul>
            </div>
        </div>

        <div class="out-content">
            <div class="drawer-shade" id="drawerShade" @click="closeDrawer"></div>

            <div class="drawer animated fadeInLeft" id="drawer">
                <ul>
                    <li @click="$router.push({path:'/'})">
                        <span>返回首页</span>
                    </li>

                    <li v-if="!token" @click="$router.push({path:'/login'})">
                        <span>Hi！请登录</span>
                    </li>

                    <li v-if="!token" @click="$router.push({path:'/register'})">
                        <span>免费注册</span>
                    </li>

                    <li v-if="token" @click="$router.push({path:'/user'})" style="padding-top: 10px">
                        <div class="head-icon">
                            <img v-if="headIcon" :src="headImg(headIcon)" alt="头像">
                            <img v-if="!headIcon" src="../assets/img/anonymous.png" alt="头像">
                        </div>
                        <span>{{nickname}}</span>
                    </li>

                    <li @click="$router.push({path:'/order'})">
                        <span>我的订单</span>
                    </li>

                    <li @click="$router.push({path:'/cart'})">
                        <span>我的购物车</span>
                    </li>

                    <li @click="$router.push({path:'/store'})">
                        <span>我的店铺</span>
                    </li>

                    <li v-if="role==='0'" @click="$router.push({path:'/manage'})">
                        <span>系统管理</span>
                    </li>

                    <li v-if="token" @click="logout">
                        <span>退出</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'

    export default {
        name: "Head",
        data() {
            return {
                token: '',
                nickname: '',
                introduction: '',
                headIcon: '',
                role: ''
            }
        },
        mounted() {
            this.token = Cookies.get('token');
            this.nickname = Cookies.get('nickname');
            if (!Cookies.get('headIcon')) {
                this.headIcon = '';
            } else {
                this.headIcon = Cookies.get('headIcon');
            }
            this.introduction = Cookies.get('introduction');
            this.role = Cookies.get('role');
        },
        methods: {
            logout() {
                this.axios({
                    method: 'get',
                    url: '/logout',
                }).then(res => {
                    if (res.data.code === 0) {
                        location.reload();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                })
            },
            headImg(src) {
                return '//static.kooriookami.top/deal/image/head/' + src;
            },
            openDrawer() {
                document.getElementById('drawer').setAttribute('class', 'drawer animated fadeInLeft');
                document.getElementById('drawer').style.display = 'block';
                document.getElementById('drawerShade').style.display = 'block';
            },
            closeDrawer() {
                document.getElementById('drawer').setAttribute('class', 'drawer animated fadeOutLeft');
                document.getElementById('drawerShade').style.display = 'none';
            }
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
        color: #909399;
    }

    a:hover {
        color: #409eff;
        cursor: pointer;
    }

    p {
        margin: 0;
        line-height: 20px;
    }

    .el-icon-arrow-down {
        margin-left: 10px;
    }

    .container {
        background: whitesmoke;
        height: 40px;
        line-height: 40px;
        color: #909399;
        overflow: hidden;
    }

    .content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    .big-inside, .small-inside {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .big-inside ul, .small-inside ul, .drawer ul {
        margin: 0;
        padding: 0;
    }

    .big-inside li, .small-inside li {
        display: inline-block;
        padding: 0 10px;
    }

    .big-inside li:hover, .small-inside li:hover {
        background: #e6e6e6;
        cursor: pointer;
    }

    .drawer-shade {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 19000;
    }

    .drawer {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        color: white;
        background: rgba(0, 0, 0, 0.8);
        animation-duration: 0.3s;
        width: 210px;
        z-index: 20000;
        overflow-y: auto;
    }

    .drawer li:hover {
        background: rgba(255, 255, 255, 0.2);
        cursor: pointer;
    }

    .drawer li {
        padding: 0 10px;
        line-height: 40px;
    }

    .item {
        z-index: 10;
        position: absolute;
        margin-left: -10px;
        padding: 10px;
        background: white;
        cursor: auto;
        border-left: 1px solid whitesmoke;
        border-right: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
        display: none;
    }

    li:hover .item {
        display: block;
    }

    .my-info {
        display: flex;
    }

    .logout {
        text-align: right;
    }

    .head-icon {
        width: 60px;
        height: 60px;
    }

    .head-icon img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 30px;
    }

    .content-right {
        width: 210px;
        overflow: hidden;
        height: 60px;
        margin-left: 10px;
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

        .big-inside {
            display: none;
        }

        .small-inside {
            display: block;
        }
    }
</style>
