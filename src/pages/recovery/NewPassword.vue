<template lang="pug">
    article.content.content_recovery
        h1 Восстановление пароля
        form(@submit.prevent="recover").form_vertical
            .control.g-mb_4_xs
                label.control__field.g-d_b
                    input(name="password" v-model="password" v-validate="'required|spass'" type="password", placeholder="" id="PASS_NEW").field_text.field_text_mtrl
                    span.field_error(v-if="errors.has('password')" v-html="errors.first('password')")
                    span.field__eye(@click="togglePassword('PASS_NEW')")
                    span.control__label Введите новый пароль
            .g-clr_gray.g-mtb.g-mtb_2.g-hide_xs Пароль должен содержать буквы, цифры и как минимум один специальный символ – знак препинания или иной знак, не являющийся цифрой или буквой (за исключением символов "<", ">").
            .control.g-row.g-row_ib.g-mb_4_xs
                .g-col.g-col_md_6.g-va_m.g-mb_3_xs
                    input(type="submit", :disbaled="buffering" value="Сменить пароль" ,@click.prevent="resetPassword").btn.btn_primary.btn_block
                .g-col.g-col_md_6.g-va_m.g-ta_c
                    router-link(to="/",class="g-clr_gray") Вход в Личный кабинет

</template>

<script>
    export default {
        data() {
            return {
                password: '',
                buffering: false
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$onBlur();
                this.$checkInputs();
            });
        },
        methods: {
            togglePassword(fieldId){
                var el = document.querySelector(`#${fieldId}`);
                var tp = el.getAttribute('type');

                if(tp=="password") el.setAttribute('type', 'text')
                else el.setAttribute('type', 'password')
            },
            resetPassword() {
                this.buffering = true;

                axios.post('/Account/ResetPassword', {
                    hash: this.$route.query.hash,
                    newPassword: this.password,
                    confirmPassword: this.password
                }).then((data) => {
                    this.buffering = false;
                    window.events.$emit('show_popup', 'password-successfully');
                })
                .catch(() => {});
            }
        }
    }
</script>

