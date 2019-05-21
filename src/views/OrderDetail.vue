<template>
    <div>
        <HeadPart></HeadPart>
        <OrderDetailMain></OrderDetailMain>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import OrderDetailMain from '@/components/order/OrderDetailMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "OrderDetail",
        components: {
            HeadPart,
            OrderDetailMain,
            FootPart
        }
    }
</script>

<style scoped>

</style>