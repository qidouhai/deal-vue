<template>
    <div>
        <HeadPart></HeadPart>
        <UserMain></UserMain>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import UserMain from '@/components/user/UserMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "User",
        components: {
            HeadPart,
            UserMain,
            FootPart
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style scoped>

</style>