// fillUserInfo
export default {
    watch: {
        userInfo(val) {
            this.fillData(val);
        }
    },
    created() {
        if (Object.keys(this.$store.state.user.info).length) this.fillData(this.$store.state.user.info)
    },
    computed: {
        userInfo() {
            return this.$store.state.user.info;
        }
    }
};