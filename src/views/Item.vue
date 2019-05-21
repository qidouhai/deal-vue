<template>
    <div>
        <HeadPart></HeadPart>
        <ItemInfo></ItemInfo>
        <StickPart></StickPart>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import ItemInfo from '@/components/item/ItemInfo.vue'
    import StickPart from '@/components/StickPart.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Item",
        components: {
            HeadPart,
            ItemInfo,
            StickPart,
            FootPart
        }
    }
</script>

<style scoped>

</style>