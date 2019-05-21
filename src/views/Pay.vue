<template>
    <div>
        <HeadPart></HeadPart>
        <PayMain></PayMain>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import PayMain from '@/components/pay/PayMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Pay",
        components: {
            HeadPart,
            PayMain,
            FootPart
        }
    }
</script>

<style scoped>

</style>