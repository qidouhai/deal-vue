<template>
    <div>
        <div class="statistic-head">
            <img class="logo-icon" src="../../assets/img/logo.svg" alt="logo" ondragstart="return false">
            <span>数据统计</span>
        </div>

        <div class="statistic-inside" v-loading="loading" element-loading-text="数据查询中">
            <div class="charts">
                <div class="chart" style="height: auto">
                    <div style="text-align: center;margin-top: 2px" v-if="orderDataShow">
                        <span style="font-size: 18px;font-weight: bold">全部订单数据总览</span>
                    </div>
                    <el-form label-width="100px" style="margin-top: 20px" v-if="orderDataShow">
                        <el-form-item label="累计收益：">
                            <i class="fa fa-jpy" aria-hidden="true"></i>
                            <span>{{orderData.totalAmount | twoDecimal}}</span>
                        </el-form-item>
                        <el-form-item label="完结单数：">
                            <span>{{orderData.dealQuantity}}</span>
                        </el-form-item>
                        <el-form-item label="取消单数：">
                            <span>{{orderData.cancelQuantity}}</span>
                        </el-form-item>
                        <el-form-item label="单均收益：">
                            <i class="fa fa-jpy" aria-hidden="true"></i>
                            <span>{{orderData.perAmount | twoDecimal}}</span>
                        </el-form-item>
                        <el-form-item label="完结比率：">
                            <span>{{orderData.dealRate | twoPercent}}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="chart" id="orderRateAll"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StoreStatistic",
        data() {
            return {
                loading: false,
                orderDataShow: false,
                orderData: {
                    totalAmount: '',
                    dealQuantity: '',
                    cancelQuantity: '',
                    perAmount: '',
                    dealRate: ''
                },
                rate: {
                    oneStar: '',
                    twoStar: '',
                    threeStar: '',
                    fourStar: '',
                    fiveStar: ''
                },
            }
        },
        mounted() {
            this.getOrderData();
            this.getRate();
        },
        methods: {
            getRate() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/store/rate'
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.rate.oneStar = res.data.data.oneStar;
                        this.rate.twoStar = res.data.data.twoStar;
                        this.rate.threeStar = res.data.data.threeStar;
                        this.rate.fourStar = res.data.data.fourStar;
                        this.rate.fiveStar = res.data.data.fiveStar;
                        this.orderRateAllChart();
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            getOrderData() {
                this.loading = true;
                this.axios({
                    method: 'get',
                    url: '/store/order_data'
                }).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.orderData.totalAmount = res.data.data.totalAmount;
                        this.orderData.dealQuantity = res.data.data.dealQuantity;
                        this.orderData.cancelQuantity = res.data.data.cancelQuantity;
                        this.orderData.perAmount = res.data.data.perAmount;
                        this.orderData.dealRate = res.data.data.dealRate;
                        this.orderDataShow = true;
                    } else {
                        this.$message.warning(res.data.message);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error('服务器连接失败');
                });
            },
            orderRateAllChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.echarts.init(document.getElementById('orderRateAll'));
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '全部订单星级评分',
                        x: 'center'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['一星', '二星', '三星', '四星', '五星']
                    },
                    yAxis: {},
                    series: [{
                        name: '评分',
                        type: 'bar',
                        data: [this.rate.oneStar, this.rate.twoStar, this.rate.threeStar, this.rate.fourStar, this.rate.fiveStar]
                    }],
                    itemStyle: {
                        color: '#409eff'
                    }
                });
                window.addEventListener("resize", () => {
                    myChart.resize();
                });
            }
        },
        filters: {
            twoDecimal(value) {
                if (value || value === 0) {
                    return value.toFixed(2);
                }
            },
            twoPercent(value) {
                if (value || value === 0) {
                    return (value * 100).toFixed(2) + '%';
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

    .statistic-head {
        padding: 0 20px;
        color: #409EFF;
        line-height: 56px;
        height: 56px;
        border-bottom: 1px #e6e6e6 solid;
    }

    .statistic-inside {
        padding: 20px;
    }

    .logo-icon {
        height: 16px;
        vertical-align: top;
        margin-top: 20px;
        margin-right: 10px;
    }

    .charts {
        display: flex;
        flex-wrap: wrap;
    }

    .charts .chart {
        height: 300px;
        width: 50%;
    }

    .el-form-item {
        margin: 0;
    }

    .fa-jpy {
        font-size: 12px;
    }


    @media screen and (max-width: 1400px) {

    }

    @media screen and (max-width: 1120px) {
        .charts .chart {
            width: 100%;
        }
    }

    @media screen and (max-width: 840px) {

    }
</style>