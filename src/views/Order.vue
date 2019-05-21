<template>
    <div>
        <HeadPart></HeadPart>
        <OrderMain></OrderMain>
        <StickPart></StickPart>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import OrderMain from '@/components/order/OrderMain.vue'
    import StickPart from '@/components/StickPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Order",
        components: {
            HeadPart,
            OrderMain,
            StickPart,
            FootPart
        }
    }
</script>

<style scoped>

</style>