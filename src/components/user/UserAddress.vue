<template>
    <div class="address-content">
        <div class="address-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>收货地址</span>
        </div>

        <div class="address-inside" v-loading="loading" element-loading-text="数据查询中">
            <div class="watch" id="watch">
                <div style="text-align: right">
                    <span class="head-tip">（最多添加 {{limit}} 条地址）</span>
                    <el-button type="text" @click="addAddress('form')">添加地址</el-button>
                </div>

                <div class="inside">
                    <div class="address" :id="address.addressId" v-for="address in sortAddresses">
                        <el-form label-width="80px">
                            <el-form-item label="收货人">
                                <span>{{address.buyerName}}</span>
                            </el-form-item>
                            <el-form-item label="电话号码">
                                <span>{{address.buyerPhone}}</span>
                            </el-form-item>
                            <el-form-item label="收货地址">
                                <span>{{address.buyerAddress}}</span>
                            </el-form-item>
                        </el-form>

                        <div class="address-foot">
                            <div>
                                <el-tag v-if="address.defaultAddress===1">默认地址</el-tag>
                            </div>

                            <div>
                                <el-button type="text" @click="update(address)" :disabled="disabled">修改</el-button>
                                <el-button type="text" @click="remove(address)" :disabled="disabled">删除</el-button>
                                <el-button type="text" v-if="address.defaultAddress===0" @click="setDefaultAddress(address)" :disabled="disabled">设为默认</el-button>
                            </div>
                        </div>
                    </div>

                    <div class="address-empty" v-for="product in emptyNum"></div>
                    <!--为空的时候显示-->
                    <div v-if="showEmpty">
                        <span class="empty">空空如也...</span>
                    </div>
                </div>
            </div>

            <div class="operate" id="operate">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item label="收货人：" prop="buyerName">
                        <el-input v-model="form.buyerName" placeholder="请填写收货人" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码：" prop="buyerPhone">
                        <el-input type="tel" v-model="form.buyerPhone" placeholder="请填写电话号码" maxlength="11" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址：" prop="buyerAddress">
                        <el-input v-model="form.buyerAddress" placeholder="请填写收货地址" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="设为默认：" prop="defaultAddress">
                        <el-radio-group v-model="form.defaultAddress">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveAddress('form')">保存地址</el-button>
                        <el-button @click="cancelSave('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserAddress",
        data() {
            return {
                loading: false,
                disabled: false,
                addresses: [],
                limit: 12,   //收货地址最多数目
                size: 12,
                emptyNum: '',   //为空的个数
                showEmpty: false,
                form: {
                    addressId: '',
                    buyerName: '',
                    buyerPhone: '',
                    buyerAddress: '',
                    defaultAddress: ''
                },
                rules: {
                    buyerName: [
                        {required: true, message: '请输入收货人', trigger: 'blur'},
                        {min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur'}
                    ],
                    buyerPhone: [
                        {required: true, message: '请输入电话号码', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入 11 位手机号', trigger: 'blur'},
                        {pattern: /^1[3456789][0-9]{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur'}
                    ],
                    buyerAddress: [
                        {required: true, message: '请输入收货地址', trigger: 'blur'},
                        {max: 128, message: '长度小于 128 个字符', trigger: 'blur'}
                    ],
                    defaultAddress: [
                        {required: true, message: '请选择是否设为默认地址', trigger: 'change'}
                    ],
                }
            }
        },
        mounted() {
            this.getUserAddress();
        },
        updated() {
            this.getDefaultAddress();
        },
        methods: {
            getUserAddress() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/user/address/info'
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.addresses = res.data.data;
                        this.emptyNum = this.addresses.length > 0 ? this.size - this.addresses.length : 0;
                        this.showEmpty = this.addresses.length === 0;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getDefaultAddress() {
                //默认的地址
                for (let i = 0; i < this.addresses.length; i++) {
                    if (this.addresses[i].defaultAddress === 1) {
                        document.getElementById(this.addresses[i].addressId).style.border = '1px solid #409EFF';
                    } else {
                        document.getElementById(this.addresses[i].addressId).removeAttribute('style');
                    }
                }
            },
            addAddress(form) {
                if (this.addresses.length >= this.limit) {
                    this.$message.warning('收货地址不能超过 ' + this.limit + ' 条');
                } else {
                    this.form.addressId = '';
                    this.$refs[form].resetFields();
                    document.getElementById('watch').style.display = 'none';
                    document.getElementById('operate').style.display = 'block';
                }
            },
            update(address) {
                this.form.addressId = address.addressId;
                this.form.buyerName = address.buyerName;
                this.form.buyerPhone = address.buyerPhone;
                this.form.buyerAddress = address.buyerAddress;
                this.form.defaultAddress = address.defaultAddress;
                document.getElementById('watch').style.display = 'none';
                document.getElementById('operate').style.display = 'block';
            },
            remove(address) {
                this.disabled = true;
                this.$confirm('是否确认删除该地址？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'delete',
                        url: '/user/address/delete',
                        params: {
                            addressId: address.addressId
                        }
                    }).then(res => {
                        this.disabled = false;
                        if (res.data.code === 0) {
                            this.$message.success('收货地址删除成功');
                            this.getUserAddress();
                            this.getDefaultAddress();
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.$message.error('服务器连接失败');
                        this.disabled = false;
                    });
                }).catch(err => {
                    this.disabled = false;
                })
            },
            setDefaultAddress(address) {
                this.disabled = true;
                this.axios({
                    method: 'post',
                    url: '/user/address/set_default',
                    params: {
                        addressId: address.addressId
                    }
                }).then(res => {
                    this.disabled = false;
                    if (res.data.code === 0) {
                        this.$message.success('设为默认地址成功');
                        this.getUserAddress();
                        this.getDefaultAddress();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error('服务器连接失败');
                    this.disabled = false;
                });
            },
            saveAddress(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'post',
                            url: '/user/address/save',
                            data: {
                                addressId: this.form.addressId,
                                buyerName: this.form.buyerName,
                                buyerPhone: this.form.buyerPhone,
                                buyerAddress: this.form.buyerAddress,
                                defaultAddress: this.form.defaultAddress
                            }
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.$message.success('收货地址保存成功');
                                this.getUserAddress();
                                this.getDefaultAddress();
                                document.getElementById('watch').style.display = 'block';
                                document.getElementById('operate').style.display = 'none';
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        }).catch(err => {
                            this.$message.error('服务器连接失败');
                        });
                    }
                })
            },
            cancelSave(form) {
                this.form.addressId = '';
                this.$refs[form].resetFields();
                document.getElementById('watch').style.display = 'block';
                document.getElementById('operate').style.display = 'none';
            }
        },
        computed: {
            sortAddresses() {
                return this.addresses.sort((a, b) => a.defaultAddress - b.defaultAddress).reverse();
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/main.css";

    .address-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .head-tip {
        float: left;
        height: 40px;
        line-height: 40px;
        color: #C0C4CC;
    }

    .address-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .inside {
        margin-right: -20px;
        margin-bottom: -20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .address {
        width: 320px;
        margin-right: 20px;
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        margin-bottom: 20px;
    }

    .address:hover {
        border: 1px solid #409EFF;
    }

    .address .el-form .el-form-item {
        margin: 0;
        line-height: 20px;
    }

    /*不足的时候补空的*/
    .address-empty {
        width: 320px;
        margin-right: 20px;
        flex-grow: 1;
    }

    .empty {
        font-size: 20px;
        color: #909399;
    }

    .address-foot {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        height: 40px;
    }

    #operate {
        display: none;
    }
</style>