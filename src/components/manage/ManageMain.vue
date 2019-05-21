<template>
    <el-container>
        <el-aside width="140px">
            <el-menu :default-active="$route.path" router>
                <div class="title">
                    <span>系统管理</span>
                </div>
                <el-menu-item index="/manage/report">
                    <i class="el-icon-edit-outline"></i>
                    <span slot="title">举报管理</span>
                </el-menu-item>
                <el-menu-item index="/manage/password">
                    <i class="el-icon-refresh"></i>
                    <span slot="title">重置密码</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ManageMain"
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