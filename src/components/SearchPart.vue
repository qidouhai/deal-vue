<template>
    <div class="search-content">
        <div class="search-part">
            <div class="search-input-part">
                <el-input v-model="productName" placeholder="搜一搜好货" @keydown.enter.native="search" clearable>
                    <el-select v-model="categoryType" slot="prepend">
                        <el-option label="全部类目" value=""></el-option>
                        <el-option v-for="category in categories" :label="category.categoryName" :value="category.categoryType"></el-option>
                    </el-select>
                </el-input>
            </div>

            <div class="search-button-part">
                <el-button type="primary" @click="search">搜索</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchPart",
        data() {
            return {
                categories: [],
                productName: '',
                categoryType: '',
            }
        },
        mounted() {
            this.getCategory();
        },
        methods: {
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
            search() {
                this.$router.push({
                    path: '/product',
                    query: {
                        productName: this.productName,
                        categoryType: this.categoryType
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>