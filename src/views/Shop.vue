<template>
    <div>
        <HeadPart></HeadPart>
        <ShopMain></ShopMain>
        <StickPart></StickPart>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import ShopMain from '@/components/shop/ShopMain.vue'
    import StickPart from '@/components/StickPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Shop",
        components: {
            HeadPart,
            ShopMain,
            StickPart,
            FootPart
        },
    }
</script>

<style scoped>

</style>