<template>
    <div>
        <HeadPart></HeadPart>
        <BuyMain></BuyMain>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import BuyMain from '@/components/buy/BuyMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Buy",
        components: {
            HeadPart,
            BuyMain,
            FootPart
        }
    }
</script>

<style scoped>

</style>