<template>
    <div>
        <el-container>
            <el-aside width="140px">
                <el-menu :default-active="$route.path" router>
                    <div class="title">
                        <span>我的店铺</span>
                    </div>
                    <el-menu-item index="/store/info">
                        <i class="el-icon-document"></i>
                        <span slot="title">店铺信息</span>
                    </el-menu-item>
                    <el-menu-item index="/store/order">
                        <i class="el-icon-bell"></i>
                        <span slot="title">订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="/store/product">
                        <i class="el-icon-goods"></i>
                        <span slot="title">商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="/store/punish">
                        <i class="el-icon-warning-outline"></i>
                        <span slot="title">店铺处罚</span>
                    </el-menu-item>
                    <el-menu-item index="/store/statistic">
                        <i class="el-icon-setting"></i>
                        <span slot="title">数据统计</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "StoreMain"
    }
</script>

<style scoped>
    .el-container {
        margin: 20px auto auto;
        max-width: 1200px;
        border-radius: 4px;
        border: 1px #e6e6e6 solid;
        display: flex;
        overflow: hidden;
    }

    .el-main {
        padding: 0;
    }

    .el-menu {
        height: 100%;
    }

    .title {
        font-size: 16px;
        color: #909399;
        text-align: center;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
        background: whitesmoke;
    }

    @media screen and (max-width: 1400px) {
        .el-container {
            max-width: 960px;
        }
    }

    @media screen and (max-width: 1120px) {
        .el-container {
            width: 720px;
        }
    }
</style>