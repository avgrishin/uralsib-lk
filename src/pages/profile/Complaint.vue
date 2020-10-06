<template lang="pug">
    .popup__content.popup__content_sz_2
        .popup__title.g-mb_5
            .h2.g-mb_0 Новое письмо в УК "Уралсиб"
        form.popup__text(autocomplete="off" @submit.prevent="sendMessage" v-if="page<3")
            fieldset.form__fieldset
                div(v-if="page == 1").control
                    .control__field.g-mb_1
                        v-select(placeholder="Выберите тему сообщения" v-model="theme" name="theme" v-validate:theme="'required'" data-vv-as="тема" :options="themeItems" :selectable="option => option.id != 3" key="id").field-select#THEME
                            span(slot="no-options")
                        span.field_error(v-if="errors.has('theme')" v-html="errors.first('theme')")
                div(v-if="page == 2").control
                    .control__field.g-mb_1
                        input(type="text" :value="theme.label" placeholder="Выберите тему сообщения" style="opacity: 1;" disabled v-if="page==2").field_text.field_text_mtrl#THEME
                        label(for="THEME").control__label Тема сообщения
                .control
                    .control__field.g-mb_1
                        input.js-validate-datalayer(data-action="validateField" data-label="name" type="text" v-model="name" name="name" v-validate="" data-vv-as="имя"  v-bind:readonly="page != 1" v-bind:disabled="page != 1 || isAuth2").field_text.field_text_mtrl#NAME
                        label(for="NAME").control__label Как к Вам обращаться
                        span.field_error(v-if="errors.has('name')" v-html="errors.first('name')")
                .control
                    .control__field.g-mb_1
                        input.js-validate-datalayer(data-action="validateField" data-label="phone" type="tel" v-model="phone" name="phone" v-validate="'required|asc|mp'" data-vv-as="телефон"  v-bind:readonly="page != 1" v-bind:disabled="isAuth2").field_text.field_text_mtrl#PHONE
                        label(for="PHONE").control__label Телефон
                        span.field_error(v-if="errors.has('phone')" v-html="errors.first('phone')")
                .control
                    .control__field.g-mb_1
                        input.js-validate-datalayer(data-action="validateField" data-label="email" type="text" v-model="email" name="email" v-validate="'required|email'" data-vv-as="email"  v-bind:readonly="page != 1" v-bind:disabled="isAuth2").field_text.field_text_mtrl#EMAIL
                        label(for="EMAIL").control__label Email
                        span.field_error(v-if="errors.has('email')" v-html="errors.first('email')")
                .control
                    label.control__field.g-d_b
                        textarea.js-validate-datalayer(data-action="validateField" data-label="message" v-model="message" name="message" v-validate="'required'" data-vv-as="message"  v-bind:disabled="page != 1").field_text.field_text_mtrl#MESSAGE
                        span.control__label Сообщение
                        span.field_error(v-if="errors.has('message')" v-html="errors.first('message')")
            fieldset.form__fieldset(v-if="page==1")
                .g-row
                    .g-col.g-col_md_6
                        input(type="button" @click.prevent="sendMessage" :disabled="buttonDisabled" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" value="Отправить").btn.btn_block
                        .h4.g-lh_15
        form.popup__text(autocomplete="off" @submit.prevent="submitCode" v-if="page==2")
            | Для подтверждения данных на Ваш телефон #[span(v-html="phone || ''")] #[br] был отправлен SMS-код:
            .h4.g-lh_15
            .g-row.g-mb_2
                fieldset.form__fieldset.g-col.g-col_md_6
                    .control
                        .control__field.g-mb_1
                            input.js-validate-datalayer(data-action="validateField" data-label="smscode" type="text" v-validate="'required|sms'" data-vv-as="smscode" v-model="smscode" maxlength="5").field_text.field_text_mtrl#SMSCODE
                            label(for="SMSCODE").control__label Введите код
                        .g-fs_05.g-clr_gray(v-show="countDownSeconds.status")
                            AppTimer(
                                ref="appTimer",
                                @onProgressEnd="handleCountdownProgress"
                            )
                        button.g-btn-txt.g-fs_05.g-clr_gray.g-clr_pr_h.g-fw_6(type="button" @click.prevent="requestCode") Запросить код повторно
                .g-col.g-col_md_6.g-pt_2_xs
                    button(type="submit" :disabled="doneCode" :class="{'spinner_bg': loaded }" value="Отправить" @click.prevent="submitCode").btn.btn_block.btn_primary.g-mb_2.g-mb_0_xs Отправить
        complaint3(v-if="page==3" v-on:new-message="resetMessage")
</template>>
<script>
import '../../assets/js/vendor/phone-ru.js';
import Inputmask from 'inputmask';
//import { checkAndFireEvent } from '../../helpers';
import { countDownMixin } from '../../mixins'
import createFireValidationMixin from '../../mixins/fireValidationEvents';
import { mapState } from 'vuex';
import  Complaint3 from '../../components/complaint/Complaint3'

export default {
    mixins: [countDownMixin, createFireValidationMixin()],
    components: {
        'complaint3': Complaint3
    },
    data() {
        return {
            theme: null,
            themeItems: [{ id: 1, label: 'Получить консультацию' },{ id: 2, label: 'Запрос в техническую поддержку' }, { id: 3, label: 'Подать жалобу/обращение' }],
            name: '',
            phone: '',
            email: '',
            message: '',
            terms: true,
            buffering: false,
            smscode: '',
            page: 1,
            id: null,
            loading: false,
            loaded: false,
            unwatch: null
        };
    },

    mounted() {
        if (Object.keys(this.$store.state.user.state).length) 
            this.fillUser();
        else {
            this.unwatch = this.$store.watch(
                state => this.$store.state.user.state_loaded,
                (newValue, oldValue) => this.fillUser()
            )
        }
        //- this.nextTick();
    },
    beforeDestroy() {
        if (this.unwatch) this.unwatch();
        
        [document.getElementById('PHONE'), document.getElementById('EMAIL')].forEach(item => {
            if (item && item.inputmask) item.inputmask.remove();
        });
    },

    created() { },

    methods: {
        resetMessage() {
            this.$removeOnBlurEvents();
            this.theme = null;
            this.message = '';
            this.page = 1;
            this.smscode =  '';
            this.nextTick();
        },
        nextTick() {
            this.$nextTick(() => {
                this.$onBlur();

                Inputmask('phoneru').mask(document.getElementById('PHONE'));
                Inputmask('email').mask(document.getElementById('EMAIL'));
                setTimeout(() => this.$checkInputs(), 50);
            });
        },

        fillUser() {
            const { fullName, email, phone } = this.$store.state.user.state;

            this.name = fullName || '';
            this.email = email ? Inputmask.format(email, { alias: 'email' }) : '';
            this.phone = phone ? Inputmask.format(phone, { alias: 'phoneru' }) : '';
            this.nextTick();
        },

        sendMessage() {
            this.$validator.validateAll().then(response => {
                if (response) {this.sendRequest();}
            });
        },

        sendRequest() {
            this.buffering = true;
            axios.post('/message/add', {
                theme: this.theme.id,
                name: this.name,
                phone: this.phone,
                email: this.email,
                text: this.message
            })
            .then(({data}) => {
                this.buffering = false;
                if (data.isSuccess)
                {
                    this.id = data.id;
                    this.$removeOnBlurEvents();
                    this.page = 2;
                    this.nextTick();
                }
                else {
                    data.errorDescription ? flash([data.errorDescription], 'error') : flash(['Неизвестная ошибка'], 'error');
                }
            })
            .catch(({response: error}) => {
                this.buffering = false;
                if (error) flash([error.data.message], 'error');
            });
        },

        submitCode() {
            this.buffering = true;
            // const params = new URLSearchParams();
            // params.append('Id', this.id);
            axios.post(`/message/check/${this.smscode}`, { Id: this.id })
            .then(() => {
                this.buffering = false;
                this.$removeOnBlurEvents();
                this.page = 3;
                //this.nextTick();
            }).catch(({response: error}) => {
                this.buffering = false;
                if (error) flash([error.data.message], 'error');
            });        
        },
            
        requestCode() {
            this.buffering = true;
            axios.post(`/message/reqcode`, { Id: this.id })
                .then(({data}) => {
                    this.buffering = false;
                    this.handleRequestSMScode(data);
                }).catch((error) => {
                    this.buffering = false;
                    if (error) flash([error.exceptionMessage], 'error');
                })
        }
    },
    computed: {
        ...mapState('user', { userInfo: 'info' }),
        buttonDisabled() {
            return !Boolean(this.phone && this.message && this.theme && this.theme.id)
        },
        isAuth2() {
            return this.$store.state.user.state.authState == 2;
        }
    },

    watch: {
        buttonDisabled(disabled) {
            if (disabled) {
                return;
            }

            //const errors = this.$el.querySelectorAll('input.error');

            // if (!errors.length) {
            //     checkAndFireEvent({
            //         action: 'validateForm',
            //         label: 'Помощь консультанта'
            //     });
            // }
        }
    }
}
//                    label.control__label-top Выберите тему сообщения
</script>

