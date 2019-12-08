<template>
    <div>
        <div class="product-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>商品管理</span>
        </div>

        <div class="product-inside" v-loading="loading" element-loading-text="数据查询中">
            <div class="watch" id="watch">
                <div style="text-align: right">
                    <el-button type="text" @click="addProduct('form')">添加商品</el-button>
                    <el-button type="text" @click="getAgainProductList">全部商品</el-button>
                    <el-button type="text" @click="getUpProductList">已上架</el-button>
                    <el-button type="text" @click="getDownProductList">未上架</el-button>
                </div>

                <div class="inside">
                    <div class="product" v-for="product in products">
                        <div class="product-img">
                            <a @click="watchItem(product)">
                                <img v-if="product.productIcon" :src="productImg(product.productIcon)" :alt="product.productName">
                                <img v-if="!product.productIcon" src="../../assets/img/default_product.png" :alt="product.productName">
                            </a>
                        </div>
                        <p class="price"><i class="fa fa-jpy" aria-hidden="true"></i>{{product.productPrice | twoDecimal}} </p>
                        <p class="name"><a @click="watchItem(product)">{{product.productName}}</a></p>
                        <div class="tag-operate">
                            <p>
                                <el-tag size="mini" v-if="product.productSecondhand===0">二手</el-tag>
                                <el-tag size="mini" type="success" v-if="product.productSecondhand===1">全新</el-tag>
                            </p>
                            <p>
                                <el-button type="text" v-if="product.productStatus===1" @click="onSale(product.productId)" :disabled="disabled">上架</el-button>
                                <el-button type="text" v-if="product.productStatus===0" @click="offSale(product.productId)" :disabled="disabled">下架</el-button>
                                <el-button type="text" @click="update(product)" :disabled="disabled">修改</el-button>
                                <el-button type="text" @click="remove(product)" :disabled="disabled">删除</el-button>
                            </p>
                        </div>
                    </div>
                    <div class="product-empty" v-for="product in emptyNum"></div>
                    <!--为空的时候显示-->
                    <div v-if="showEmpty">
                        <span class="empty">空空如也...</span>
                    </div>
                </div>

                <el-pagination class="page" layout="total, prev, pager, next, jumper" :total="totalElements" :page-size="size" :current-page="page"
                               @current-change="handleCurrentChange"></el-pagination>
            </div>

            <div class="operate" id="operate">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <div v-if="form.productId">
                        <el-form-item label="商品 id：">
                            {{form.productId}}
                        </el-form-item>
                    </div>
                    <el-form-item label="商品名称：" prop="productName">
                        <el-input v-model="form.productName" placeholder="请填写商品名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片：">
                        <el-upload class="product-icon-uploader" action="/icon" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="product-icon">
                            <img v-if="!imageUrl" src="../../assets/img/default_product.png" class="product-icon">
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="商品类目：" prop="categoryType">
                        <el-select v-model="form.categoryType" filterable placeholder="请选择商品类目">
                            <el-option v-for="category in categories" :label="category.categoryName" :value="category.categoryType"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品单价：" prop="productPrice">
                        <el-input type="number" v-model="form.productPrice" placeholder="请填写商品单价" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品库存：" prop="productStock">
                        <el-input type="number" v-model="form.productStock" placeholder="请填写商品库存" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品新旧：" prop="productSecondhand">
                        <el-radio-group v-model="form.productSecondhand">
                            <el-radio :label="0">二手</el-radio>
                            <el-radio :label="1">全新</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="商品状态：" prop="productStatus">
                        <el-radio-group v-model="form.productStatus">
                            <el-radio :label="0">上架</el-radio>
                            <el-radio :label="1">下架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="商品描述：" prop="productDescription">
                        <div id="editor"></div>
                    </el-form-item>
                    <div v-if="form.updateTime">
                        <el-form-item label="更新时间：">
                            {{form.updateTime}}
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="saveProduct('form')">保存商品</el-button>
                        <el-button @click="cancelSave('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {emotions} from '../../assets/js/editor-custom';

    export default {
        name: "StoreProduct",
        data() {
            return {
                loading: false,
                totalElements: 0,
                page: 1,
                size: 12,
                //list
                products: [],
                //单个
                form: {
                    productId: '',
                    productName: '',
                    productSecondhand: '',
                    productPrice: '',
                    productStock: '',
                    productDescription: '',
                    productIcon: '',
                    productStatus: '',
                    categoryType: '',
                    updateTime: '',    //最后一次更新时间
                },
                emptyNum: '',   //为空的个数
                showEmpty: false,
                chooseProductStatus: '',
                disabled: false,
                productName: '',
                categories: [],
                multipartFile: '',
                imageUrl: '',
                editor: '',
                rules: {
                    productName: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 2, max: 48, message: '长度在 2 到 48 个字符', trigger: 'blur'}
                    ],
                    productSecondhand: [
                        {required: true, message: '请选择商品新旧', trigger: 'change'}
                    ],
                    productPrice: [
                        {required: true, message: '请输入商品单价', trigger: 'blur'},
                        {pattern: /^[0-9.]{0,}$/, message: '请输入正确单价', trigger: 'blur'}
                    ],
                    productStock: [
                        {required: true, message: '请输入商品库存', trigger: 'blur'},
                        {pattern: /^[0-9]{0,}$/, message: '请输入正确库存', trigger: 'blur'}
                    ],
                    productDescription: [
                        {message: '请输入商品描述', trigger: 'blur'},
                        {max: 60000, message: '长度在小于 60000 个字符', trigger: 'change'}
                    ],
                    productStatus: [
                        {required: true, message: '请选择商品新旧', trigger: 'change'}
                    ],
                    categoryType: [
                        {required: true, message: '请选择商品类目', trigger: 'change'}
                    ],
                }
            }
        },
        mounted() {
            this.getCategory();
            this.getProductList();
            this.createEditor();
        },
        methods: {
            getProductList() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/seller/product/list',
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.chooseProductStatus = '';
                    if (res.data.code === 0) {
                        this.products = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                        this.emptyNum = this.products.length > 0 ? this.size - this.products.length : 0;
                        this.showEmpty = this.products.length === 0;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
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
            createEditor() {
                this.editor = new this.E('#editor');
                this.editor.customConfig.emotions = emotions;
                this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;
                this.editor.customConfig.uploadImgMaxLength = 20;
                this.editor.customConfig.uploadImgServer = '/upload_icons';
                this.editor.customConfig.uploadFileName = 'multipartFileList';
                this.editor.customConfig.customAlert = (info) => {
                    this.$message.warning(info);
                };
                this.editor.customConfig.onchange = (html) => {
                    this.form.productDescription = html;
                };
                this.editor.create();
            },
            onSale(productId) {
                this.disabled = true;
                this.axios({
                    method: 'post',
                    url: '/seller/product/on_sale',
                    params: {
                        productId: productId
                    }
                }).then(res => {
                    this.disabled = false;
                    if (res.data.code === 0) {
                        this.$message.success('商品上架成功');
                        if (this.chooseProductStatus === '') {
                            this.getProductList();
                        } else {
                            this.getByProductStatus(this.chooseProductStatus);
                        }
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.disabled = false;
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            offSale(productId) {
                this.disabled = true;
                this.axios({
                    method: 'post',
                    url: '/seller/product/off_sale',
                    params: {
                        productId: productId
                    }
                }).then(res => {
                    this.disabled = false;
                    if (res.data.code === 0) {
                        this.$message.success('商品下架成功');
                        if (this.chooseProductStatus === '') {
                            this.getProductList();
                        } else {
                            this.getByProductStatus(this.chooseProductStatus);
                        }
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.disabled = false;
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getByProductStatus(productStatus) {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/seller/product/list_by_status',
                    params: {
                        productStatus: productStatus,
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.chooseProductStatus = productStatus;
                    if (res.data.code === 0) {
                        this.products = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                        this.emptyNum = this.size - res.data.data.numberOfElements;
                        this.showEmpty = this.products.length === 0;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getAgainProductList() {
                this.page = 1;
                this.getProductList();
            },
            getUpProductList() {
                this.page = 1;
                this.getByProductStatus(0);
            },
            getDownProductList() {
                this.page = 1;
                this.getByProductStatus(1);
            },
            productImg(src) {
                return '//static.kooriookami.top/deal/image/product/' + src;
            },
            handleCurrentChange(page) {
                this.page = page;
                if (this.chooseProductStatus === '') {
                    this.getProductList();
                } else {
                    this.getByProductStatus(this.chooseProductStatus);
                }
            },
            saveProduct(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let product = new FormData();
                        product.append('productId', this.form.productId);
                        product.append('productName', this.form.productName);
                        product.append('productSecondhand', this.form.productSecondhand);
                        product.append('productPrice', this.form.productPrice);
                        product.append('productStock', this.form.productStock);
                        product.append('productDescription', this.form.productDescription);
                        product.append('productStatus', this.form.productStatus);
                        product.append('categoryType', this.form.categoryType);
                        product.append('multipartFile', this.multipartFile);

                        this.axios({
                            method: 'post',
                            url: '/seller/product/save',
                            data: product
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.$message.success('商品保存成功');
                                this.multipartFile = '';
                                if (this.chooseProductStatus === '') {
                                    this.getProductList();
                                } else {
                                    this.getByProductStatus(this.chooseProductStatus);
                                }
                                document.getElementById('watch').style.display = 'block';
                                document.getElementById('operate').style.display = 'none';
                            } else {
                                this.$message.warning(res.data.message);
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.$message.error('服务器连接失败');
                        });
                    }
                })
            },
            update(product) {
                this.form.productId = product.productId;
                this.form.productName = product.productName;
                this.form.productSecondhand = product.productSecondhand;
                this.form.productPrice = product.productPrice;
                this.form.productStock = product.productStock;
                this.form.productDescription = product.productDescription;
                this.editor.txt.html(product.productDescription);
                this.form.productStatus = product.productStatus;
                this.form.categoryType = product.categoryType;
                this.form.updateTime = this.moment.unix(product.updateTime).format('YYYY 年 MM 月 DD 日');
                if (product.productIcon === null || product.productIcon === 'null') {
                    this.imageUrl = '';
                } else {
                    this.imageUrl = '//static.kooriookami.top/deal/image/product/' + product.productIcon;
                }
                document.getElementById('watch').style.display = 'none';
                document.getElementById('operate').style.display = 'block';
            },
            remove(product) {
                this.disabled = true;
                this.$confirm('是否确认删除该商品？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'delete',
                        url: '/seller/product/delete',
                        params: {
                            productId: product.productId
                        }
                    }).then(res => {
                        this.disabled = false;
                        if (res.data.code === 0) {
                            this.$message.success('商品删除成功');
                            if (this.chooseProductStatus === '') {
                                this.getProductList();
                            } else {
                                this.getByProductStatus(this.chooseProductStatus);
                            }
                        } else {
                            this.$message.warning(res.data.message);
                        }
                    }).catch(err => {
                        this.disabled = false;
                        this.loading = false;
                        this.$message.error('服务器连接失败');
                    });
                }).catch(err => {
                    this.disabled = false;
                });
            },
            addProduct(form) {
                this.form.productId = '';
                this.form.updateTime = '';
                this.imageUrl = '';
                this.editor.txt.clear();
                this.$refs[form].resetFields();
                document.getElementById('watch').style.display = 'none';
                document.getElementById('operate').style.display = 'block';
            },
            cancelSave(form) {
                this.form.productId = '';
                this.form.updateTime = '';
                this.imageUrl = '';
                this.editor.txt.clear();
                this.$refs[form].resetFields();
                document.getElementById('watch').style.display = 'block';
                document.getElementById('operate').style.display = 'none';
            },
            watchItem(product) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: product.productId
                    }
                });
                open(item.href, '');
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
            }
        },
        filters: {
            twoDecimal(value) {
                if (value || value === 0) {
                    return value.toFixed(2);
                }
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/css/html.css";

    a {
        text-decoration: none;
    }

    a:hover {
        color: #409eff;
        cursor: pointer;
    }

    .product-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .product-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .inside {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .product {
        padding: 10px;
        width: 240px;
        border: 1px solid transparent;
        border-radius: 4px;
    }

    /*不足的时候补空的*/
    .product-empty {
        width: 240px;
    }

    .product:hover {
        border: 1px #409eff solid;
    }

    .product p {
        margin: 10px 0;
        overflow: hidden;
        line-height: 20px;
        color: #606266;
    }

    p .el-button {
        padding: 0;
    }

    .tag-operate {
        display: flex;
        justify-content: space-between;
    }

    .product-img {
        width: 220px;
        height: 220px;
    }

    .product-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product .price {
        color: orangered;
        font-size: 20px;
    }

    .empty {
        font-size: 20px;
        color: #909399;
    }

    .fa-jpy {
        font-size: 16px;
    }

    .product .name {
        height: 40px;
    }

    .page {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    #operate {
        display: none;
    }
</style>
