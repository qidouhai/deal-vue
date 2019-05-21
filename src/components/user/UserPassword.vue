<template>
    <div class="password-content">
        <div class="password-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>修改密码</span>
        </div>

        <div class="password-inside">
            <div class="password-form">
                <el-steps :active="active" align-center finish-status="success">
                    <el-step title="验证身份"></el-step>
                    <el-step title="设置密码"></el-step>
                    <el-step title="改密成功"></el-step>
                </el-steps>

                <el-form id="stepOne" ref="formBefore" :model="form" :rules="rules">
                    <el-form-item prop="oldPassword">
                        <el-input v-model="form.oldPassword" placeholder="请输入旧密码" show-password autocomplete="new-password" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="next('formBefore')">下一步</el-button>
                    </el-form-item>
                </el-form>

                <el-form id="stepTwo" ref="formAfter" :model="form" :rules="rules" v-loading="loading"
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

                <div id="stepThree">
                    <p>{{returnInfo}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserPassword",
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
                    oldPassword: '',
                    newPassword: '',
                    checkPassword: ''
                },
                rules: {
                    oldPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
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
                            method: 'post',
                            url: '/user/check_password',
                            params: {
                                password: this.form.oldPassword
                            }
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.active++;
                                document.getElementById('stepOne').style.display = 'none';
                                document.getElementById('stepTwo').style.display = 'block';
                            } else {
                                this.$message.warning(res.data.message);
                            }
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
                            url: '/user/update_password',
                            params: {
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