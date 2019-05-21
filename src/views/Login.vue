<template>
    <div class="container">
        <header>
            <div class="header-content">
                <img src="../assets/img/logo.svg" alt="logo" ondragstart="return false">
                <span class="login-text">欢迎登录</span>
                <router-link to="/" class="home-text">返回首页</router-link>
            </div>
        </header>

        <main id="main">
            <div class="main-top-content">
                <span>{{welcome}}</span>
            </div>

            <div class="main-content">
                <div class="inside">
                    <div class="login-img"></div>

                    <div class="login-form" v-loading="loading" element-loading-text="正在登录中">
                        <p>账号登录</p>
                        <el-form ref="form" :model="form" :rules="rules">
                            <el-form-item prop="username">
                                <el-input v-model="form.username" placeholder="请输入用户名" clearable>
                                    <i slot="prefix" class="iconfont icon-zhanghao"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" v-model="form.password" placeholder="请输入密码" clearable show-password
                                          @keydown.enter.native="login('form')">
                                    <i slot="prefix" class="iconfont icon-zhanghaomima"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" :disabled="disabled" @click="login('form')">登&emsp;录</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="register-msg">
                            <span>还没有账号？</span>
                            <router-link to="/register">立即注册</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <FootPart></FootPart>
    </div>
</template>

<script>
    import FootPart from '@/components/FootPart.vue'
    import Cookies from 'js-cookie'
    import {Message} from 'element-ui';

    export default {
        name: "Login",
        components: {
            FootPart
        },
        beforeRouteEnter(to, from, next) {
            if (Cookies.get('token')) {
                next({
                    path: '/'
                });
                Message.warning('请勿重复登录');
            } else {
                next();
            }
        },
        data() {
            return {
                disabled: false,
                loading: false,
                welcome: '',
                dawn: '(╯‵□′)╯︵┻━┻，还没睡，你是夜猫子做的吗？',   //1:00-5:00
                earlyMorning: 'o(￣▽￣)ｄ，早睡早起身体好，给你点个赞哦！',    //5:00-8:00
                morning: '(*╹▽╹*)，早上好，新的一天开始了。',    //8:00-11:00
                noon: 'Hi~ o(*￣▽￣*)ブ，吃过午饭了没？',    //11:00-13:00
                afternoon: 'ε=(´ο｀*)))，唉，下午又得勤劳地工作了。',   //13:00-17:00
                dusk: 'o(*￣︶￣*)o，黄昏了，你那边有晚霞吗？',    //17:00-19:00
                evening: '(#^.^#)，祝你有个愉快的晚上！',    //19:00-21:00
                night: '( - . - )，肚子饿了，要吃点夜宵吗？',   //21:00-23:00
                midnight: ' (～￣▽￣)～，夜深了，快洗洗睡吧。',    //23:00-1:00
                form: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.greeting();
        },
        methods: {
            greeting() {
                let nowTime = this.moment().format('H');
                if (nowTime >= 1 && nowTime < 5) {
                    this.welcome = this.dawn;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_dawn.png)';
                } else if (nowTime >= 5 && nowTime < 8) {
                    this.welcome = this.earlyMorning;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_early_morning.png)';
                } else if (nowTime >= 8 && nowTime < 11) {
                    this.welcome = this.morning;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_morning.png)';
                } else if (nowTime >= 11 && nowTime < 13) {
                    this.welcome = this.noon;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_noon.png)';
                } else if (nowTime >= 13 && nowTime < 17) {
                    this.welcome = this.afternoon;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_afternoon.png)';
                } else if (nowTime >= 17 && nowTime < 19) {
                    this.welcome = this.dusk;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_dusk.png)';
                } else if (nowTime >= 19 && nowTime < 21) {
                    this.welcome = this.evening;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_evening.png)';
                } else if (nowTime >= 21 && nowTime < 23) {
                    this.welcome = this.night;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_night.png)';
                } else {
                    this.welcome = this.midnight;
                    document.getElementById('main').style.backgroundImage = 'url(//static.deal.kooriookami.top/img/system/bg_midnight.png)';
                }
            },
            login(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.disabled = true;
                        this.send();
                    }
                });
            },
            send() {
                this.axios({
                    method: 'post',
                    url: '/login',
                    data: {
                        username: this.form.username,
                        password: this.form.password
                    }
                }).then(res => {
                    this.disabled = false;
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message.success('登录成功');
                        this.$router.push({
                            path: '/'
                        });
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.disabled = false;
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            }
        }
    }
</script>

<style scoped>
    @import "../assets/css/main.css";

    a {
        color: #409eff;
        text-decoration: none;
    }

    a:hover {
        color: #66b1ff;
    }

    .header-content {
        max-width: 1200px;
        height: 80px;
        margin-left: auto;
        margin-right: auto;
    }

    .header-content img {
        height: 28px;
        vertical-align: top;
        margin: 26px 10px 26px 0;
    }

    .main-top-content {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #909399;
        font-size: 13px;
        background: rgba(255, 255, 255, 0.95);
    }

    .login-text {
        line-height: 80px;
        font-size: 24px;
    }

    .home-text {
        line-height: 80px;
        float: right;
    }

    main {
        background: whitesmoke no-repeat center;
        background-size: cover;
        overflow: hidden;
    }

    .main-content {
        max-width: 960px;
        margin-left: auto;
        margin-right: auto;
    }

    .main-content .inside {
        margin: 120px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }

    .login-img {
        height: 300px;
        width: 440px;
    }

    .iconfont {
        font-size: 22px;
        margin: auto 5px;
    }

    .login-form {
        background: rgba(255, 255, 255, 0.95);
        width: 400px;
        padding: 40px;
    }

    .login-form > p {
        font-size: 20px;
        margin: 0 0 20px;
        text-align: center;
    }

    .register-msg {
        text-align: right;
        font-size: 13px;
    }

    .login-form .el-button {
        width: 100%;
    }

    @media screen and (max-width: 1400px) {
        .header-content {
            max-width: 960px;
        }
    }

    @media screen and (max-width: 1120px) {
        .header-content {
            max-width: 720px;
        }

        .main-content .inside {
            display: flex;
            justify-content: space-around;
        }

        .login-img {
            display: none;
        }
    }

    @media screen and (max-width: 840px) {
        .header-content {
            max-width: 480px;
            padding: 0 20px;
        }
    }
</style>