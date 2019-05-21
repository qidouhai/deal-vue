<template>
    <div class="record-content">
        <div class="record-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>登录记录</span>
        </div>

        <div class="record-inside" v-loading="loading" element-loading-text="数据查询中">
            <div style="text-align: right">
                <span class="head-tip">（最多保存 10 条记录）</span>
            </div>

            <el-table :data="records">
                <el-table-column prop="recordPlace" label="登录地点"></el-table-column>
                <el-table-column prop="recordIp" label="登录 ip"></el-table-column>
                <el-table-column prop="createTime" label="登录时间" :formatter="timeFormat"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserRecord",
        data() {
            return {
                loading: false,
                records: []
            }
        },
        mounted() {
            this.getLoginRecord();
        },
        methods: {
            getLoginRecord() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/login_record/list'
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.records = res.data.data;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
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
    .record-head {
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

    .record-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }
</style>