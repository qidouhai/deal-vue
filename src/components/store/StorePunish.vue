<template>
    <div class="punish-content">
        <div class="punish-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>店铺处罚</span>
        </div>

        <div class="punish-inside" v-loading="loading" element-loading-text="数据查询中">
            <div style="text-align: right">
                <span class="head-tip">（点击商品 id 即可查看）</span>
            </div>

            <el-table :data="punishes">
                <el-table-column label="商品 id" width="200px">
                    <template slot-scope="scope">
                        <a @click="watchItem(scope.row.productId)">{{scope.row.productId}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品原名" min-width="150px"></el-table-column>
                <el-table-column prop="reportResult" label="处罚因果" width="210px"></el-table-column>
                <el-table-column prop="updateTime" label="处罚日期" width="160px" :formatter="timeFormat"></el-table-column>
            </el-table>

            <el-pagination class="page" layout="total, prev, pager, next, jumper" :total="totalElements"
                           :page-size="size" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StorePunish",
        data() {
            return {
                loading: false,
                totalElements: 0,
                page: 1,
                size: 10,
                punishes: [],
            }
        },
        mounted() {
            this.getAllPunish();
        },
        methods: {
            getAllPunish() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/store/punish/list',
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.punishes = res.data.data.content;
                        this.totalElements = res.data.data.totalElements;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            watchItem(productId) {
                let item = this.$router.resolve({
                    path: '/item',
                    query: {
                        productId: productId
                    }
                });
                open(item.href, '');
            },
            handleCurrentChange(page) {
                this.page = page;
                this.getAllPunish();
            },
            timeFormat(row, column, cellValue) {
                if (cellValue) {
                    return this.moment.unix(cellValue).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }

    a:hover {
        color: #409eff;
        cursor: pointer;
    }

    .punish-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .punish-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .head-tip {
        float: left;
        height: 40px;
        line-height: 40px;
        color: #C0C4CC;
    }

    .page {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>