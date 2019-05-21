<template>
    <div>
        <el-container>
            <el-aside width="140px">
                <el-menu :default-active="$route.path" router>
                    <div class="title">
                        <span>个人中心</span>
                    </div>
                    <el-menu-item index="/user/info">
                        <i class="el-icon-user"></i>
                        <span slot="title">我的信息</span>
                    </el-menu-item>
                    <el-menu-item index="/user/password">
                        <i class="el-icon-key"></i>
                        <span slot="title">修改密码</span>
                    </el-menu-item>
                    <el-menu-item index="/user/record">
                        <i class="el-icon-location-outline"></i>
                        <span slot="title">登录记录</span>
                    </el-menu-item>
                    <el-menu-item index="/user/address">
                        <i class="el-icon-position"></i>
                        <span slot="title">收货地址</span>
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
        name: "UserMain"
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