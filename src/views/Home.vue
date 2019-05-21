<template>
    <div>
        <HeadPart></HeadPart>
        <HomeMain></HomeMain>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import HomeMain from '@/components/home/HomeMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: 'home',
        components: {
            HeadPart,
            HomeMain,
            FootPart
        }
    }
</script>

<style scoped>

</style>