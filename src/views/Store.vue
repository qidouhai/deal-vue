<template>
    <div>
        <HeadPart></HeadPart>
        <StoreMain></StoreMain>
        <el-dialog title="提示" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" width="500px">
            <span>你还没有店铺，是否创建？</span>
            <div slot="footer">
                <el-button @click="notCreate">暂不创建</el-button>
                <el-button type="primary" @click="create">创建店铺</el-button>
            </div>
        </el-dialog>
        <FootPart></FootPart>
    </div>
</template>

<script>
    import HeadPart from '@/components/HeadPart.vue'
    import StoreMain from '@/components/store/StoreMain.vue'
    import FootPart from '@/components/FootPart.vue'

    export default {
        name: "Store",
        components: {
            HeadPart,
            StoreMain,
            FootPart
        },
        data() {
            return {
                dialogVisible: false
            }
        },
        mounted() {
            this.checkStore();
        },
        methods: {
            checkStore() {
                this.axios({
                    method: 'get',
                    url: '/store/my_info'
                }).then(res => {
                    if (res.data.code === 60) {
                        this.dialogVisible = true;
                    }
                })
            },
            notCreate() {
                this.dialogVisible = false;
                this.$router.push({path: '/'});
            },
            create() {
                this.dialogVisible = false;
                this.$router.push({path: '/store/create'});
            }
        }
    }
</script>

<style scoped>

</style>