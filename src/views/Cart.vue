<template>
    <div>
        <HeadPart></HeadPart>
        <CartInfo></CartInfo>
        <StickPart class="stick-part"></StickPart>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import CartInfo from '@/components/cart/CartInfo.vue'
    import StickPart from '@/components/StickPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Cart",
        components: {
            HeadPart,
            CartInfo,
            StickPart,
            FootPart
        }
    }
</script>

<style scoped>
    @media screen and (max-width: 840px) {
        .stick-part >>> .arrow {
            bottom: 60px;
        }
    }
</style>