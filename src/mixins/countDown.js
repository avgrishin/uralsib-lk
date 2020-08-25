export default {
    data() {
        return {
            countDownSeconds: {
                val: 0,
                status: false
            }
        }
    },
    methods: {
        handleCountdownProgress() {
            this.requesting = false;
            if (this.countDownSeconds.status) {
                this.countDownSeconds.status = false;
            }
        },

        handleDeferredApps() {
            window.events.$emit('close_popup');

            setTimeout(() => {
                window.events.$emit('show_popup', 'sell-alert-final');
            }, 2000);
        },

        handleRequestSMScode(data, sms) {
            if (data.isDeferred) {
                return this.handleDeferredApps();
            }

            if (data.isSuccess) {
                this.loading = false;
                this.countDownSeconds.status = true;
                data.cooldownSeconds >= 0 ? this.countDownSeconds.val = data.cooldownSeconds : this.countDownSeconds.val = 120;
                this.$nextTick(() => {
                    if (this.$refs.appTimer) this.$refs.appTimer.setTime(this.countDownSeconds.val);
                    if (data.code) alert('code - ' + data.code)
                });
                this.requesting = false;
                if (!sms) this.getForm();
            } else {
                this.loading = false;

                if (!this.countDownSeconds.status) {
                    data.cooldownSeconds >= 0 ? this.countDownSeconds.val = data.cooldownSeconds : this.countDownSeconds.val = 60 * 5;
                    this.$nextTick(() => {
                        if (this.$refs.appTimer) this.$refs.appTimer.setTime(this.countDownSeconds.val);
                    });
                }

                this.countDownSeconds.status = true;
                data.errorDescription ? flash([data.errorDescription], 'error') : flash(['Неизвестная ошибка'], 'error');
            }
        }
    },
};
