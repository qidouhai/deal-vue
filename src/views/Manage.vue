<template>
    <div>
        <HeadPart></HeadPart>
        <ManageMain v-if="show"></ManageMain>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import ManageMain from '@/components/manage/ManageMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Manage",
        components: {
            HeadPart,
            ManageMain,
            FootPart
        },
        data() {
            return {
                role: '',
                show: false
            }
        },
        mounted() {
            this.checkRole();
        },
        methods: {
            checkRole() {
                this.axios({
                    method: 'get',
                    url: '/user/info'
                }).then(res => {
                    if (res.data.code === 0) {
                        this.role = res.data.data.role;
                        if (this.role === 0) {
                            this.show = true;
                        } else {
                            this.$message.warning('非管理员禁止访问');
                            this.$router.push({path: '/'});
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>