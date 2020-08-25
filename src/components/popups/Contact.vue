<template lang="pug">
    form.popup__content.popup__content_sz_1(autocomplete="off" @submit.prevent="sendMessage")
        .popup__title.g-mb_5
            .h2.g-mb_0(v-if="payload && payload.type === 'deposit'")
                | Для пополнения/снятия средств, свяжитесь, пожалуйста, с вашим менеджером
            .h2.g-mb_0(v-else-if="payload && payload.type === 'partialWithdrawal'")
                | Для частичного вывода средств, свяжитесь, пожалуйста, с вашим менеджером
            .h2.g-mb_0(v-else-if="payload && payload.type === 'terminate'")
                | Для расторжения договора, свяжитесь, пожалуйста, с вашим менеджером
            .h2.g-mb_0(v-else-if="payload && payload.type === 'oldStrategy'")
                | Договор устарел, свяжитесь, пожалуйста, с вашим менеджером
            .h2.g-mb_0(v-else-if="payload && payload.type === 'duSpecial'")
                | Для оформления стратегии #[strong(v-if="payload.duName") «{{ payload.duName }}»] свяжитесь, пожалуйста, с вашим менеджером
            .h2.g-mb_0(v-else)
                | Форма обратной связи

        .popup__text
            fieldset.form__fieldset
                .control
                    .control__field.g-mb_1
                        input.js-validate-datalayer(data-action="validateField" data-label="name" type="text" v-model="name" name="name" v-validate="" data-vv-as="имя").field_text.field_text_mtrl#NAME
                        label(for="NAME").control__label Как к Вам обращаться
                        span.field_error(v-if="errors.has('name')" v-html="errors.first('name')")
                .control
                    .control__field.g-mb_1
                        input.js-validate-datalayer(data-action="validateField" data-label="phone" type="tel" v-model="phone" name="phone" v-validate="'required|asc|mp'" data-vv-as="телефон").field_text.field_text_mtrl#PHONE
                        label(for="PHONE").control__label Телефон
                        span.field_error(v-if="errors.has('phone')" v-html="errors.first('phone')")
                .control
                    .control__field.g-mb_1
                        input.js-validate-datalayer(data-action="validateField" data-label="email" type="text" v-model="email" name="email" v-validate="'required|email'" data-vv-as="email").field_text.field_text_mtrl#EMAIL
                        label(for="EMAIL").control__label Email
                        span.field_error(v-if="errors.has('email')" v-html="errors.first('email')")
                .control
                    label.control__field.g-d_b
                        textarea.js-validate-datalayer(data-action="validateField" data-label="message" v-model="message" name="message" v-validate="'required'" data-vv-as="message").field_text.field_text_mtrl#MESSAGE
                        span.control__label Сообщение
                        span.field_error(v-if="errors.has('message')" v-html="errors.first('message')")
                //- .control
                        .control__field
                            label.checkbox(:class="{'checkbox_error': errors.has('terms')}")
                                input(type="checkbox" v-model="terms" name="terms" v-validate="'required'")#TERMS
                                .checkbox__text Я подтверждаю свое согласие на обработку персональных данных АО «УК УРАЛСИБ»
            fieldset.form__fieldset
                .g-row
                    .g-col.g-col_md_6
                        input(type="button" @click.prevent="sendMessage" :disabled="buffering" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" value="Отправить").btn.btn_block
</template>
<script>
import '../../assets/js/vendor/phone-ru.js';
import Inputmask from 'inputmask';
import { addPixelImg } from '../../assets/js/functions/global';

import { checkAndFireEvent } from '../../helpers';
import createFireValidationMixin from '../../mixins/fireValidationEvents';

export default {
    props: ['strategies', 'apiMethod', 'payload'],

    mixins: [createFireValidationMixin()],

    data() {
        return {
            name: '',
            phone: '',
            email: '',
            message: '',
            terms: true,
            buffering: false,
        };
    },
    watch: {
        userInfo(val) {
            window.log(val);
            this.fillUser(val);
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.$onBlur();

            Inputmask('phoneru').mask(document.getElementById('PHONE'));
            Inputmask('email').mask(document.getElementById('EMAIL'));
        });
    },
    beforeDestroy() {
        [
            document.getElementById('PHONE'),
            document.getElementById('EMAIL')
        ].forEach(item => {
            if (item && item.inputmask) item.inputmask.remove();
        });
    },
    created() {

        if (Object.keys(this.$store.state.user.state).length) this.fillUser(this.$store.state.user.state);
    },
    methods: {
        sendMessage() {
            if (window.location.hash.indexOf('/register') !== -1) {
                checkAndFireEvent({
                    action: 'sendForm',
                    label: 'Помощь консультанта',
                })
            }

            this.$validator.validateAll().then(response => {
                if (response) {this.sendRequest();}

            });
        },
        fillUser(user) {

            if (user == undefined || !Object.keys(user).length) return;
            user = this.$store.state.user.state;
            const name = user.fullName;
            const email = user.email;
            const phone = user.phone;

            this.name = name || '';
            this.email = email ? Inputmask.format(email, { alias: 'email' }) : '';
            this.phone = phone ? Inputmask.format(phone, { alias: 'phoneru' }) : '';

            setTimeout(() => this.$checkInputs(), 50);
        },
        sendRequest() {
            let url = this.strategies ? '/duWork/sendGetOrClose' : '/support/send';
            this.buffering = true;
            if (this.apiMethod) url = this.apiMethod;
            axios.post(url, {
                name: this.name,
                phone: this.phone,
                email: this.email,
                body: this.message,
                isAuthorized: Boolean(this.userInfo.clientId),
            })
                .then(() => {
                    if (this.payload.pixel) addPixelImg();

                    checkAndFireEvent({
                        action: 'formSuccess',
                        label: 'Помощь консультанта',
                    })

                    /*this.message='';*/
                    this.$store.commit('buffering', false);
                    window.events.$emit('show_popup', 'after-help');
                })
                .catch(() => {
                    window.log('after-help');
                    this.buffering = false;
                });
        }
    },
    computed: {
        buttonDisabled() {
            return !Boolean(
                //this.name &&
                this.phone &&
                //this.email &&
                this.message
                //this.terms
            );
        },
        userInfo() {
            return this.$store.state.user.state;
        }
    },

    watch: {
        buttonDisabled(disabled) {
            if (disabled) {
                return;
            }

            const errors = this.$el.querySelectorAll('input.error');

            if (!errors.length) {
                checkAndFireEvent({
                    action: 'validateForm',
                    label: 'Помощь консультанта'
                });
            }
        }
    }
};
</script>
