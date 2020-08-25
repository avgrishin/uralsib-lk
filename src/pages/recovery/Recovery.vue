<template lang="pug">
    article.content.content_recovery
        h1 Восстановление пароля
        form(@submit.prevent="recover").form_vertical
            .control.g-row.g-row_table.g-row_b_xs
                .g-col.control
                    label.control__field.g-d_b
                        input(v-validate="'required|email'" v-model="email" :class="{'is-danger': errors.has('login') }" name="email", type="email").field_text.field_text_mtrl
                        span.control__label(v-text="placeholder")
                        span.field_error(v-if="errors.has('email')" v-html="errors.first('email')")
                .g-col.control.g-col_md_5
                    input(:disabled="buffering" type="submit", value="Далее").btn.btn_primary.btn_block
            .control.g-ta_c_xs
                router-link(to="/",class="g-clr_gray") Вход в Личный кабинет
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                buffering: false,
                placeholder: 'Для восстановления пароля введите Ваш email'
            }
        },
        created() {
            window.events.$on('popup_closed', this.onClose);
        },
        mounted() {
            window.addEventListener('resize', this.onWindowResize);
            this.onWindowResize({target: window});
            this.$nextTick(() => {
                this.$onBlur();
                this.$checkInputs();
            });
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onWindowResize);
            window.events.$off('popup_closed', this.onClose);
        },
        methods: {
            onClose(data) {
                if (data.payload && data.payload.recovery) this.$router.push('/');
            },
            recover() {
                this.buffering = true;

                this.$validator.validateAll().then((result) => {
                    if (result) this.sendRecoevryRequest();
                    else this.buffering = false;
                });
            },
            sendRecoevryRequest() {
                axios.post('/Account/ResetPasswordRequest', {
                    login: this.email
                }).then(() => {
                    window.events.$emit('show_popup', ['not-confirmed', {
                        title: 'Ссылка для смены пароля отправлена <br> на вашу почту.',
                        recovery: true
                    }])
                }).catch(() => this.buffering = false);
            },
            onWindowResize(event) {
                if (event.target.innerWidth > 768) this.placeholder = 'Для восстановления пароля введите Ваш email';
                else this.placeholder = 'Ваш email';
            }
        }
    }
</script>

