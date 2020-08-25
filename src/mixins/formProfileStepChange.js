export default {
    computed: {
        formStepStatus() {
            return this.$store.state.formStep.status
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$store.commit('setFormStepPath', to.fullPath);
        if (this.$store.state.user.state.authState == 2) {
            if (this.formStepStatus) {
                next();
                this.$store.commit('setFormStepStatus', false);
                this.$store.commit('setFormStepPath', '');
            } else {
                !this.$store.state.user.state.allowEditClientProfile ? next() : this.next();
			}
        } else {
            next();
        }

    }
};