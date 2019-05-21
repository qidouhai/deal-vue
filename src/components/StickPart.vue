<template>
    <div>
        <div class="arrow" v-show="arrowShow" @click="arrow">
            <i class="fa fa-arrow-circle-up arrow"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StickPart",
        data() {
            return {
                arrowShow: false,
            }
        },
        mounted() {
            window.addEventListener("scroll", () => {
                this.arrowShow = (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop) !== 0;
            });
        },
        methods: {
            arrow() {
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                let timer = setInterval(() => {
                    scrollTop -= 150;
                    scrollTo(0, scrollTop);
                    if (scrollTop <= 0) {
                        clearInterval(timer);
                    }
                }, 10);
            }
        }
    }
</script>

<style scoped>
    .arrow {
        z-index: 15000;
        color: rgba(64, 158, 255, 0.25);
        font-size: 60px;
        position: fixed;
        cursor: pointer;
        bottom: 10px;
        right: 10px;
    }
</style>