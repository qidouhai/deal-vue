<template>
    <div class="info-content">
        <div class="info-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>我的信息</span>
        </div>
        <div class="info-inside" v-loading="loading" element-loading-text="数据查询中">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="uid：">
                    <span>{{form.uid}}</span>
                    <span v-if="form.role===0" style="color: #C0C4CC">（管理员）</span>
                </el-form-item>
                <el-form-item label="用户名：">
                    <span>{{form.username}}</span>
                </el-form-item>
                <el-form-item label="头像：">
                    <el-upload class="avatar-uploader" action="/icon" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <img v-if="!imageUrl" src="../../assets/img/anonymous.png" class="avatar">
                    </el-upload>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入昵称" clearable></el-input>
                </el-form-item>
                <el-form-item label="性别：">
                    <el-radio-group v-model="form.gender">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                        <el-radio label="secret">保密</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="真实姓名：" prop="realname">
                    <el-input v-model="form.realname" placeholder="请输入真实姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="出生日期：" prop="birthdate">
                    <el-date-picker v-model="form.birthdate" type="date" placeholder="请选择出生日期"
                                    style="width: 100%" clearable value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="电话号码：" prop="phone">
                    <el-input type="tel" v-model="form.phone" placeholder="请输入电话号码" maxlength="11" clearable></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：" prop="email">
                    <el-input v-model="form.email" placeholder="请输入电子邮箱" clearable></el-input>
                </el-form-item>
                <el-form-item label="个人简介：" prop="introduction">
                    <el-input type="textarea" rows="3" v-model="form.introduction" placeholder="请输入个人简介" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="send('form')">修改信息</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserInfo",
        data() {
            return {
                form: {
                    uid: '',
                    username: '',
                    nickname: '',
                    headIcon: '',
                    realname: '',
                    gender: '',
                    birthdate: '',
                    phone: '',
                    email: '',
                    introduction: '',
                    role: ''
                },
                loading: false,
                imageUrl: '',
                multipartFile: '',
                rules: {
                    nickname: [
                        {required: true, message: '请输入昵称', trigger: 'blur'},
                        {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
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
        mounted() {
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/user/info'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.form.uid = res.data.data.uid;
                        this.form.username = res.data.data.username;
                        this.form.nickname = res.data.data.nickname;
                        if (!res.data.data.headIcon) {
                            this.imageUrl = '';
                        } else {
                            this.imageUrl = '//static.kooriookami.top/deal/image/head/' + res.data.data.headIcon;
                        }
                        this.form.realname = res.data.data.realname;
                        this.form.gender = res.data.data.gender;
                        if (!res.data.data.birthdate) {
                            this.form.birthdate = '';
                        } else {
                            this.form.birthdate = this.moment.unix(res.data.data.birthdate).format('YYYY-MM-DD');
                        }
                        this.form.phone = res.data.data.phone;
                        this.form.email = res.data.data.email;
                        this.form.introduction = res.data.data.introduction;
                        this.form.role = res.data.data.role;
                        this.loading = false;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
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
                    this.$message.warning('图片大小不能超过 2 MB');
                }
                return (isJPG || isPNG || isBMP || isGIF) && isLt2M;
            },
            send(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.form.birthdate) {
                            this.form.birthdate = '';
                        }

                        let data = new FormData();
                        data.append('nickname', this.form.nickname);
                        data.append('realname', this.form.realname);
                        data.append('gender', this.form.gender);
                        data.append('birthdate', this.form.birthdate);
                        data.append('phone', this.form.phone);
                        data.append('email', this.form.email);
                        data.append('introduction', this.form.introduction);
                        data.append('multipartFile', this.multipartFile);

                        this.axios({
                            method: 'post',
                            url: '/user/update',
                            data: data
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.$message.success('修改成功');
                                this.multipartFile = '';
                                this.$refs[form].clearValidate();
                                this.getUserInfo();
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        }).catch(err => {
                            this.$message.error('服务器连接失败');
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/main.css";

    .info-inside {
        padding: 20px;
    }

    .info-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }
</style>
