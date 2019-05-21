<template>
    <div class="container">
        <header>
            <div class="header-content">
                <img src="../assets/img/logo.svg" alt="logo" ondragstart="return false">
                <span class="login-text">欢迎注册</span>
                <div class="home-text">
                    <span>已有账号？</span>
                    <router-link to="/login">点此登录</router-link>
                </div>
            </div>
        </header>

        <main>
            <div class="main-content">
                <div class="inside">
                    <div class="register-form" v-loading="loading" element-loading-text="数据匹配中">
                        <el-steps :active="active" align-center finish-status="success">
                            <el-step title="填写基本信息"></el-step>
                            <el-step title="完善资料"></el-step>
                            <el-step title="注册成功"></el-step>
                        </el-steps>
                        <div id="stepOne">
                            <el-form ref="formBefore" :model="form" :rules="rules">
                                <el-form-item prop="username">
                                    <el-input v-model="form.username" placeholder="请输入用户名" clearable></el-input>
                                </el-form-item>
                                <el-form-item prop="nickname">
                                    <el-input v-model="form.nickname" placeholder="请输入昵称" clearable></el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input type="password" v-model="form.password" placeholder="请输入密码"
                                              show-password autocomplete="new-password" clearable></el-input>
                                </el-form-item>
                                <el-form-item prop="checkPassword">
                                    <el-input type="password" v-model="form.checkPassword" placeholder="请确认密码"
                                              show-password autocomplete="new-password" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="next('formBefore')">下一步</el-button>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div id="stepTwo">
                            <el-form ref="formAfter" :model="form" :rules="rules">
                                <el-form-item>
                                    <el-upload class="avatar-uploader" action="/icon" :show-file-list="false"
                                               :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item>
                                    <el-radio-group v-model="form.gender">
                                        <el-radio label="male">男</el-radio>
                                        <el-radio label="female">女</el-radio>
                                        <el-radio label="secret">保密</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item prop="realname">
                                    <el-input v-model="form.realname" placeholder="请输入真实姓名" clearable></el-input>
                                </el-form-item>
                                <el-form-item prop="birthdate">
                                    <el-date-picker v-model="form.birthdate" type="date" placeholder="请选择出生日期"
                                                    style="width: 100%" clearable value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                                <el-form-item prop="phone">
                                    <el-input type="tel" v-model="form.phone" placeholder="请输入电话号码"
                                              maxlength="11" clearable></el-input>
                                </el-form-item>
                                <el-form-item prop="email">
                                    <el-input v-model="form.email" placeholder="请输入电子邮箱" clearable></el-input>
                                </el-form-item>
                                <el-form-item prop="introduction">
                                    <el-input v-model="form.introduction" placeholder="请输入个人简介" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="register('formAfter')">提交注册</el-button>
                                </el-form-item>
                            </el-form>
                            <span>此页信息可跳过</span>
                        </div>

                        <div id="stepThree">
                            <p>{{returnInfo}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <FootPart></FootPart>

        <VueCanvasNest class="vue-canvas-nest" :config="canvasNest"></VueCanvasNest>
    </div>
</template>

<script>
    import FootPart from '@/components/FootPart.vue'
    import Cookies from 'js-cookie'
    import {Message} from 'element-ui'
    import VueCanvasNest from 'vue-canvas-nest'

    export default {
        name: "Register",
        components: {
            FootPart,
            VueCanvasNest
        },
        beforeRouteEnter(to, from, next) {
            if (Cookies.get('token')) {
                next({
                    path: '/'
                });
                Message.warning('请先退出登录');
            } else {
                next();
            }
        },
        data() {
            let validateCheckPassword = (rule, value, callback) => {
                if (value !== this.form.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            };

            return {
                active: 0,
                canvasNest: {
                    color: '64,158,255',
                    opacity: 1,
                },
                form: {
                    username: '',
                    nickname: '',
                    password: '',
                    checkPassword: '',
                    headIcon: '',
                    realname: '',
                    gender: '',
                    birthdate: '',
                    phone: '',
                    email: '',
                    introduction: '',
                },
                imageUrl: '',
                multipartFile: '',
                loading: false,
                returnInfo: '等待服务器连接...',
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {pattern: /^[a-zA-Z0-9_]{0,}$/, message: '用户名只能由字母、数字、下划线构成'},
                        {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'},
                    ],
                    nickname: [
                        {required: true, message: '请输入昵称', trigger: 'blur'},
                        {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {pattern: /^[a-zA-Z0-9_!@#$%^&*()=+-/]{0,}$/, message: '密码只能由字母、数字、下划线、特殊字符构成'},
                        {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'},
                    ],
                    checkPassword: [
                        {required: true, message: '请确认密码', trigger: 'blur'},
                        {validator: validateCheckPassword, trigger: 'blur'}
                    ],
                    realname: [
                        {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
                    ],
                    birthdate: [
                        {message: '请选择出生日期', trigger: 'blur'}
                    ],
                    phone: [
                        {min: 11, max: 11, message: '请输入 11 位手机号', trigger: 'blur'},
                        {pattern: /^1[3456789][0-9]{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur'}
                    ],
                    email: [
                        {min: 6, max: 64, message: '长度在 6 到 64 个字符', trigger: 'blur'}
                    ],
                    introduction: [
                        {max: 64, message: '长度小于 64 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            next(formBefore) {
                this.$refs[formBefore].validate((valid) => {
                    if (valid) {
                        //检测用户名是否存在
                        this.loading = true;
                        this.axios({
                            method: 'get',
                            url: '/register/check',
                            params: {
                                username: this.form.username,
                                nickname: this.form.nickname
                            }
                        }).then(res => {
                            this.loading = false;
                            if (res.data.code === 0) {
                                this.active++;
                                document.getElementById('stepOne').style.display = 'none';
                                document.getElementById('stepTwo').style.display = 'block';
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.$message.error('服务器连接失败');
                        });
                    }
                });
            },
            register(formAfter) {
                this.$refs[formAfter].validate((valid) => {
                    if (valid) {
                        this.active++;
                        document.getElementById('stepOne').style.display = 'none';
                        document.getElementById('stepTwo').style.display = 'none';
                        document.getElementById('stepThree').style.display = 'block';
                        this.send();
                    }
                });
            },
            send() {
                if (!this.form.birthdate) {
                    this.form.birthdate = '';
                }

                let data = new FormData();
                data.append('username', this.form.username);
                data.append('nickname', this.form.nickname);
                data.append('password', this.form.password);
                data.append('realname', this.form.realname);
                data.append('gender', this.form.gender);
                data.append('birthdate', this.form.birthdate);
                data.append('phone', this.form.phone);
                data.append('email', this.form.email);
                data.append('introduction', this.form.introduction);
                data.append('multipartFile', this.multipartFile);

                this.axios({
                    method: 'post',
                    url: '/register',
                    data: data
                }).then(res => {
                    if (res.data.code === 0) {
                        this.active++;
                        this.$message.success('注册成功');
                        this.returnInfo = '注册成功，3 秒后跳转首页';
                        // 注册成功直接登录
                        this.axios({
                            method: 'post',
                            url: '/login',
                            data: {
                                username: this.form.username,
                                password: this.form.password
                            }
                        });
                        setTimeout(() => {
                            this.$router.push({
                                path: '/'
                            })
                        }, 3000);
                    } else {
                        this.$message.warning(res.data.message);
                        this.returnInfo = '很抱歉，注册失败';
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                    this.returnInfo = '很抱歉，注册失败';
                })
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.multipartFile = file.raw;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isGIF = file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!(isJPG || isPNG || isBMP || isGIF)) {
                    this.$message.warning('图片格式不正确');
                }
                if (!isLt2M) {
                    this.$message.warning('图片大小不能超过 2MB');
                }
                return (isJPG || isPNG || isBMP || isGIF) && isLt2M;
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

    .vue-canvas-nest {
        min-width: 420px;
    }

    header {
        border-bottom: #409eff 3px solid;
        background: rgba(255, 255, 255, 0.95);
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

    .login-text {
        line-height: 80px;
        font-size: 24px;
    }

    .home-text {
        line-height: 80px;
        float: right;
    }

    main {
        overflow: hidden;
    }

    .main-content {
        max-width: 960px;
        margin-left: auto;
        margin-right: auto;
    }

    .main-content .inside {
        margin-top: 120px;
        display: flex;
        justify-content: space-around;
    }

    .register-form {
        width: 480px;
        padding: 40px;
        background: rgba(255, 255, 255, 0.95);
    }

    .register-form span {
        color: #C0C4CC;
        float: right;
    }

    .el-form {
        margin-top: 20px;
    }

    .register-form .el-button {
        width: 100%;
    }

    #stepTwo {
        display: none;
    }

    #stepThree {
        display: none;
    }

    #stepThree p {
        text-align: center;
        font-size: 20px;
        padding-top: 20px;
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
    }

    @media screen and (max-width: 840px) {
        .vue-canvas-nest {
            opacity: 0 !important;
        }

        .header-content {
            max-width: 480px;
            padding: 0 20px;
        }

        .container {
            background: none;
        }

        .main-content .inside {
            margin-top: 80px;
        }
    }
</style>