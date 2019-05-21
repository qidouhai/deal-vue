<template>
    <div>
        <HeadPart></HeadPart>

        <header>
            <div class="content">
                <div class="head-inside">
                    <div class="head-info">
                        <img src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
                        <span style="font-size: 24px">创建店铺</span>
                    </div>
                </div>
            </div>
        </header>

        <main>
            <div class="content">
                <div class="inside" v-loading="loading" element-loading-text="数据匹配中">
                    <el-steps :active="active" align-center finish-status="success">
                        <el-step title="填写店铺信息"></el-step>
                        <el-step title="开店成功"></el-step>
                    </el-steps>

                    <el-form ref="form" :model="form" :rules="rules" id="stepOne">
                        <el-form-item prop="storeName">
                            <el-input v-model="form.storeName" placeholder="请输入店铺名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="sellerRealname">
                            <el-input v-model="form.sellerRealname" placeholder="请输入真实姓名" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="sellerPhone">
                            <el-input type="tel" v-model="form.sellerPhone" placeholder="请输入联系电话" maxlength="11" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="storeAddress">
                            <el-input v-model="form.storeAddress" placeholder="请输入店铺地址" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="storeIntroduction">
                            <el-input type="textarea" :autosize="{minRows: 3, maxRows: 5}"
                                      v-model="form.storeIntroduction" placeholder="请输入店铺简介" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="storeIntroduction">
                            <el-button type="primary" @click="send('form')">创建店铺</el-button>
                        </el-form-item>
                    </el-form>

                    <div id="stepTwo">
                        <p>{{returnInfo}}</p>
                    </div>
                </div>

                <el-dialog title="提示" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" :width="dialogWidth">
                    <span>你已有店铺，请勿重复创建。</span>
                    <div slot="footer">
                        <el-button type="primary" @click="returnStore">返回店铺</el-button>
                    </div>
                </el-dialog>
            </div>
        </main>

        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "CreateStore",
        components: {
            HeadPart,
            FootPart
        },
        data() {
            return {
                active: 0,
                dialogVisible: false,
                loading: false,
                returnInfo: '等待服务器连接...',
                form: {
                    storeName: '',
                    sellerRealname: '',
                    sellerPhone: '',
                    storeAddress: '',
                    storeIntroduction: '',
                },
                rules: {
                    storeName: [
                        {required: true, message: '请输入店铺名称', trigger: 'blur'},
                        {min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur'}
                    ],
                    sellerRealname: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'},
                        {min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur'}
                    ],
                    sellerPhone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入 11 位手机号', trigger: 'blur'},
                        {pattern: /^1[3456789][0-9]{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur'}
                    ],
                    storeAddress: [
                        {required: true, message: '请输入店铺地址', trigger: 'blur'},
                        {max: 128, message: '长度小于 128 个字符', trigger: 'blur'}
                    ],
                    storeIntroduction: [
                        {max: 256, message: '长度小于 256 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted() {
            this.checkStore();
        },
        methods: {
            checkStore() {
                this.axios({
                    method: 'get',
                    url: '/store/my_info'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.dialogVisible = true;
                    }
                })
            },
            returnStore() {
                this.dialogVisible = false;
                this.$router.push('/store');
            },
            send(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.axios({
                            method: 'post',
                            url: '/store/create',
                            data: {
                                storeName: this.form.storeName,
                                sellerRealname: this.form.sellerRealname,
                                sellerPhone: this.form.sellerPhone,
                                storeAddress: this.form.storeAddress,
                                storeIntroduction: this.form.storeIntroduction,
                            }
                        }).then(res => {
                            this.active++;
                            this.loading = false;
                            if (res.data.code === 0) {
                                this.active++;
                                document.getElementById('stepOne').style.display = 'none';
                                document.getElementById('stepTwo').style.display = 'block';
                                this.returnInfo = '创建成功，3 秒后跳转我的店铺';
                                this.$message.success("店铺创建成功");
                                setTimeout(() => {
                                    this.$router.push('/store');
                                }, 3000);
                            } else {
                                this.returnInfo = '店铺创建失败';
                                this.$message.warning(res.data.message);
                            }
                        }).catch(err => {
                            this.$message.error('服务器连接失败');
                            this.returnInfo = '店铺创建失败';
                        });
                    }
                });
            }
        },
        computed: {
            dialogWidth: function () {
                if (document.documentElement.clientWidth > 840) {
                    return '480px';
                } else {
                    return '400px';
                }
            }
        }
    }
</script>

<style scoped>
    .content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
    }

    header {
        height: 83px;
        line-height: 80px;
        padding: 0 10px;
        border-bottom: #409eff 3px solid;
    }

    .head-inside {
        display: flex;
        justify-content: space-between;
    }

    .head-info img {
        height: 28px;
        vertical-align: top;
        margin: 26px 10px 26px 0;
    }

    .inside {
        margin-top: 80px;
        margin-left: auto;
        margin-right: auto;
        padding: 40px;
        max-width: 480px;
    }

    .el-form {
        margin-top: 20px;
    }

    .el-form .el-button {
        width: 100%;
    }

    #stepTwo {
        display: none;
    }

    #stepTwo p {
        text-align: center;
        font-size: 20px;
        padding-top: 20px;
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
    }
</style>