<template>
    <div>
        <HeadPart></HeadPart>
        <ProductList></ProductList>
        <StickPart></StickPart>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import ProductList from '@/components/product/ProductList.vue'
    import StickPart from '@/components/StickPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Product",
        components: {
            HeadPart,
            ProductList,
            StickPart,
            FootPart
        }
    }
</script>

<style scoped>

</style>