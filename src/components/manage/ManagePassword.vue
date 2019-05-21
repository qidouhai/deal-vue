<template>
    <div class="password-content">
        <div class="password-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>重置密码</span>
        </div>

        <div class="password-inside">
            <div class="password-form">
                <el-steps :active="active" align-center finish-status="success">
                    <el-step title="查找用户"></el-step>
                    <el-step title="重置密码"></el-step>
                    <el-step title="重置成功"></el-step>
                </el-steps>

                <el-form id="stepOne" ref="formBefore" :model="form" :rules="rules">
                    <el-form-item prop="uid">
                        <el-input v-model="form.uid" placeholder="请输入用户 uid" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="next('formBefore')">下一步</el-button>
                    </el-form-item>
                </el-form>

                <div id="stepTwo">
                    <el-form label-width="80px">
                        <el-form-item label="uid：">
                            <span>{{form.uid}}</span>
                            <span v-if="form.role===0" style="color: #C0C4CC">（管理员）</span>
                        </el-form-item>
                        <el-form-item label="用户名：">
                            <span>{{form.username}}</span>
                        </el-form-item>
                        <el-form-item label="昵称：">
                            <span>{{form.nickname}}</span>
                        </el-form-item>
                    </el-form>

                    <el-form ref="formAfter" :model="form" :rules="rules" v-loading="loading"
                             element-loading-text="数据写入中">
                        <el-form-item prop="newPassword">
                            <el-input v-model="form.newPassword" placeholder="请输入新密码" show-password autocomplete="new-password" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="checkPassword">
                            <el-input v-model="form.checkPassword" placeholder="请确认新密码" show-password autocomplete="new-password" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="send('formAfter')">修改密码</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div id="stepThree">
                    <p>{{returnInfo}}</p>
                    <el-form>
                        <el-form-item>
                            <el-button @click="back">返回</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ManagePassword",
        data() {
            let validateCheckPassword = (rule, value, callback) => {
                if (value !== this.form.newPassword) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                active: 0,
                loading: false,
                returnInfo: '等待服务器连接...',
                form: {
                    uid: '',
                    username: '',
                    nickname: '',
                    role: '',
                    newPassword: '',
                    checkPassword: ''
                },
                rules: {
                    uid: [
                        {required: true, message: '请输入用户 uid', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {pattern: /^[a-zA-Z0-9_!@#$%^&*()=+-/]{0,}$/, message: '密码只能由字母、数字、下划线、特殊字符构成'},
                        {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'},
                    ],
                    checkPassword: [
                        {required: true, message: '请确认密码', trigger: 'blur'},
                        {validator: validateCheckPassword, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            next(formBefore) {
                this.$refs[formBefore].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'get',
                            url: '/user/user_info',
                            params: {
                                uid: this.form.uid
                            }
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.form.uid = res.data.data.uid;
                                this.form.username = res.data.data.username;
                                this.form.nickname = res.data.data.nickname;
                                this.form.role = res.data.data.role;
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
            send(formAfter) {
                this.$refs[formAfter].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.axios({
                            method: 'post',
                            url: '/user/reset_password',
                            params: {
                                uid: this.form.uid,
                                password: this.form.newPassword
                            }
                        }).then(res => {
                            this.loading = false;
                            if (res.data.code === 0) {
                                this.active += 2;
                                this.returnInfo = '密码修改成功';
                                document.getElementById('stepTwo').style.display = 'none';
                                document.getElementById('stepThree').style.display = 'block';
                            } else {
                                this.returnInfo = '密码修改失败';
                                this.$message.warning(res.data.message);
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.$message.error('服务器连接失败');
                            this.returnInfo = '密码修改失败';
                        });
                    }
                })
            },
            back() {
                this.active = 0;
                this.form.uid = '';
                this.form.username = '';
                this.form.nickname = '';
                this.form.role = '';
                this.form.newPassword = '';
                this.form.checkPassword = '';
                this.returnInfo = '';
                this.$refs.formBefore.resetFields();
                this.$refs.formAfter.resetFields();
                document.getElementById('stepOne').style.display = 'block';
                document.getElementById('stepTwo').style.display = 'none';
                document.getElementById('stepThree').style.display = 'none';
            }
        }
    }
</script>

<style scoped>
    .password-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .password-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .password-form {
        max-width: 500px;
        margin: 0 auto;
    }

    .el-form {
        margin: 20px auto 0 auto;
        width: 350px;
    }

    .el-form .el-button {
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
</style>