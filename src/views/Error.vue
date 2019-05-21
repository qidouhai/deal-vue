<template>
    <div>
        <HeadPart></HeadPart>
        <div class="error-container">
            <div class="error-content">
                <img src="../assets/img/very_sorry.png" alt="sorry">
                <el-button type="primary" class="return-button" @click="$router.push({path: '/'})">返回首页</el-button>
            </div>
        </div>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Error",
        components: {
            HeadPart,
            FootPart
        }
    }
</script>

<style scoped>
    .error-container {
        padding: 0 10px;
    }

    .error-content {
        max-width: 1200px;
        margin: 80px auto 0;
        overflow: hidden;
    }

    img {
        display: block;
        margin: auto;
        width: 100%;
        max-width: 600px;
    }

    .return-button {
        display: block;
        margin: 20px auto auto;
    }

    @media screen and (max-width: 1400px) {
        .error-content {
            max-width: 960px;
        }
    }

    @media screen and (max-width: 1120px) {
        .error-content {
            max-width: 720px;
        }
    }

    @media screen and (max-width: 840px) {
        .error-content {
            max-width: 480px;
        }

        .return-button {
            width: 100%;
        }
    }
</style>