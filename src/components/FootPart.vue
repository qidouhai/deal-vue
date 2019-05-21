<template>
    <div class="foot-container">
        <div class="foot-content">
            <p class="hyperlink" @click="openWenZheng">江苏省苏州市吴中区吴中大道苏州大学文正学院</p>
            <p class="hyperlink" @click="openMyWeb">Copyright &copy; 2018-2019 kooriookami 版权所有</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FootPart",
        methods: {
            openWenZheng() {
                window.open('http://www.sdwz.cn');
            },
            openMyWeb() {
                window.open('http://www.kooriookami.top');
            }
        }
    }
</script>

<style scoped>
    .foot-container {
        padding: 10px 10px 40px 10px;
    }

    .foot-content {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    .foot-content p {
        text-align: center;
        color: #909399;
    }

    .hyperlink:hover {
        cursor: pointer;
    }

    @media screen and (max-width: 1400px) {
        .foot-content {
            max-width: 960px;
        }
    }

    @media screen and (max-width: 1120px) {
        .foot-content {
            max-width: 720px;
        }
    }

    @media screen and (max-width: 840px) {
        .foot-content {
            max-width: 480px;
        }
    }
</style>