<template>
    <div class="info-content">
        <div class="info-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>店铺信息</span>
        </div>

        <div class="info-inside" v-loading="loading" element-loading-text="数据查询中">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-form-item label="店铺 id：">
                    <span>{{form.storeId}}</span>
                    <span class="tip">（店铺 id 和用户 uid 一致）</span>
                </el-form-item>
                <el-form-item label="店铺名称：" prop="storeName">
                    <el-input v-model="form.storeName" placeholder="请输入店铺名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="店主姓名：" prop="sellerRealname">
                    <el-input v-model="form.sellerRealname" placeholder="请输入真实姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="sellerPhone">
                    <el-input type="tel" v-model="form.sellerPhone" placeholder="请输入联系电话" maxlength="11" clearable></el-input>
                </el-form-item>
                <el-form-item label="店铺地址：" prop="storeAddress">
                    <el-input v-model="form.storeAddress" placeholder="请输入店铺地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="店铺简介：" prop="storeIntroduction">
                    <el-input type="textarea" rows="3" v-model="form.storeIntroduction" placeholder="请输入店铺简介" clearable></el-input>
                </el-form-item>
                <el-form-item label="店铺评分：">
                    <el-rate v-if="rateScore!==0" disabled show-score :colors="['#99A9BF', '#F7BA2A', '#FF9900']" text-color="#ff9900" :value="rateScore"
                             :score-template="rateScore.toFixed(1)"></el-rate>
                    <span v-if="rateScore===0">暂无</span>
                </el-form-item>
                <el-form-item label="创建时间：">
                    <span>{{form.createTime}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="send('form')">修改信息</el-button>
                    <el-button @click="watchStore">进入店铺</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StoreInfo",
        data() {
            return {
                loading: false,
                form: {
                    storeId: '',
                    sellerUid: '',
                    storeName: '',
                    sellerRealname: '',
                    sellerPhone: '',
                    storeAddress: '',
                    storeIntroduction: '',
                    createTime: ''
                },
                rate: {
                    oneStar: '',
                    twoStar: '',
                    threeStar: '',
                    fourStar: '',
                    fiveStar: ''
                },
                rules: {
                    storeName: [
                        {required: true, message: '请输入店铺名称', trigger: 'blur'},
                        {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
                    ],
                    sellerRealname: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'},
                        {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
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
            this.getStoreInfo();
            this.getRate();
        },
        methods: {
            getStoreInfo() {
                //查自己的店铺信息
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/store/my_info'
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.form.storeId = res.data.data.storeId;
                        this.form.sellerUid = res.data.data.sellerUid;
                        this.form.storeName = res.data.data.storeName;
                        this.form.sellerRealname = res.data.data.sellerRealname;
                        this.form.sellerPhone = res.data.data.sellerPhone;
                        this.form.storeAddress = res.data.data.storeAddress;
                        this.form.storeIntroduction = res.data.data.storeIntroduction;
                        this.form.createTime = this.moment.unix(res.data.data.createTime).format('YYYY 年 MM 月 DD 日');
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getRate() {
                this.axios({
                    method: 'get',
                    url: '/store/rate'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.rate.oneStar = res.data.data.oneStar;
                        this.rate.twoStar = res.data.data.twoStar;
                        this.rate.threeStar = res.data.data.threeStar;
                        this.rate.fourStar = res.data.data.fourStar;
                        this.rate.fiveStar = res.data.data.fiveStar;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                });
            },
            send(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'post',
                            url: '/store/update',
                            data: {
                                storeName: this.form.storeName,
                                sellerRealname: this.form.sellerRealname,
                                sellerPhone: this.form.sellerPhone,
                                storeAddress: this.form.storeAddress,
                                storeIntroduction: this.form.storeIntroduction
                            }
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.getStoreInfo();
                                this.$message.success('修改成功');
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        });
                    }
                });
            },
            watchStore() {
                let shop = this.$router.resolve({
                    path: '/shop',
                    query: {
                        storeId: this.form.storeId
                    }
                });
                open(shop.href, '');
            }
        },
        computed: {
            rateScore() {
                if (this.rate.oneStar + this.rate.twoStar + this.rate.threeStar + this.rate.fourStar + this.rate.fiveStar > 0) {
                    return (this.rate.oneStar * 1 + this.rate.twoStar * 2 + this.rate.threeStar * 3 + this.rate.fourStar * 4 + this.rate.fiveStar * 5) /
                        (this.rate.oneStar + this.rate.twoStar + this.rate.threeStar + this.rate.fourStar + this.rate.fiveStar);
                } else {
                    return 0;
                }
            }
        }
    }
</script>

<style scoped>
    .info-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .info-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .tip {
        color: #C0C4CC;
    }

    .el-form-item .el-rate {
        display: inline-block;
        vertical-align: top;
        margin: 10px 0;
    }
</style>