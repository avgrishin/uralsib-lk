<template lang="pug">
    article.content.content_recovery
        h1 Изменение пароля
        form(@submit.prevent="changePassword" autocomplete="off").form_vertical
            .control
                label.control__field.g-d_b
                    input(name="oldPassword" data-vv-as="Старый пароль" v-validate="'required'" v-model="oldPassword" type="password" id="PASS_OLD").field_text.field_text_mtrl
                    span.field__eye(@click="togglePassword('PASS_OLD')")
                    span.control__label Введите старый пароль
                    span.field_error(v-if="errors.has('oldPassword')" v-html="errors.first('oldPassword')")
            .control
                label.control__field.g-d_b
                    input(name="newPassword" data-vv-as="новый пароль" v-validate="'required|spass'" rel="newPassword"   v-model="newPassword" type="password", id="PASS_NEW").field_text.field_text_mtrl
                    span.field__eye(@click="togglePassword('PASS_NEW')")
                    span.control__label Введите новый пароль
                    span.field_error(v-if="errors.has('newPassword')" v-html="errors.first('newPassword')")
            .control
                label.control__field.g-d_b
                    input(name="confirmPassword" data-vv-as="повторите новый пароль" v-validate="{required: true, is: newPassword}"  v-model="confirmPassword" type="password", id="PASS_CONFIRM").field_text.field_text_mtrl
                    span.field__eye(@click="togglePassword('PASS_CONFIRM')")
                    span.control__label Повторите новый пароль
                    span.field_error(v-if="errors.has('confirmPassword')" v-html="errors.first('confirmPassword')")
            .g-clr_gray.g-mtb.g-mb_5 Пароль должен содержать буквы, цифры и как минимум один специальный символ – знак препинания или иной знак, не являющийся цифрой или буквой (за исключением символов "<", ">").
            .control.g-row.g-row_ib.g-mb_4_xs
                .g-col.g-col_md_6.g-va_m.g-mb_3_xs
                    input(type="submit", :disbaled="buffering" value="Сменить пароль").btn.btn_primary.btn_block

</template>

<script>
    export default {
        data() {
            return {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
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
            changePassword() {
                this.buffering = true;

                this.$validator.validateAll().then(response => {
                    if (response) this.sendRequest();
                    else this.buffering = false;
                });
            },
            sendRequest() {
                axios.post('/Account/ChangePassword', {
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword,
                    confirmPassword: this.confirmPassword
                }).then((data) => {
                    this.buffering = false;
                    window.events.$emit('show_popup', 'password-scc');
                }).catch((error) => {
                    let messages;

                    if (error.response.data.modelState) {
                        messages = Object.values(error.response.data.modelState).reduce((acc, val) => acc.concat(val), []);
                    } else {
                        messages = ['Не верный пароль'];
                    }

                    flash(messages, 'error');

                    this.buffering = false;
                });
            }
        }
    }
</script>

