<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0 Подтвердите достоверность данных, #[br] указанных в анкете
        .popup__text
            .h4.g-lh_15
                | Для подтверждения данных на Ваш телефон #[span(v-html="phone || ''")] #[br] был отправлен SMS-код:
            .g-row.g-mb_2
                .g-col.g-col_md_6
                    .control
                        .control__field.g-mb_1
                            input(type="text" v-validate="'required|sms'" data-vv-as="sms" v-model="sms_code" maxlength="5").field_text.field_text_mtrl#CODE
                            label(for="CODE").control__label Введите код
                        .g-fs_05.g-clr_gray(v-show="countDownSeconds.status")
                            AppTimer(
                                ref="appTimer",
                                @onProgressEnd="handleCountdownProgress"
                            )
                        button.g-btn-txt.g-fs_05.g-clr_gray.g-clr_pr_h.g-fw_6(type="button" @click.prevent="requestCode") Запросить код повторно
                .g-col.g-col_md_6.g-pt_2_xs
                    button(type="submit" :disabled="doneCode" :class="{'spinner_bg': loaded, 'ga-reg-esia': regesia }" value="Отправить" @click.prevent="submitCode").btn.btn_block.btn_primary.g-mb_2.g-mb_0_xs Отправить
            a.g-fw_5.g-bbc_t(href="#", @click.prevent="backToRegister()")
                span.icon.icon_arrow_left.g-va_m.g-mr_1
                span.link Вернуться назад
</template>

<script>
import { authAfterRouter, countDownMixin } from '../../mixins';

import { checkAndFireEvent } from '../../helpers';

export default {
    mixins: [authAfterRouter, countDownMixin],
    data() {
        return {
            form_id: this.$store.state.register.form_id,
            sms_code: '',
            requesting: true,
            checkCode: '',
            doneCode: true,
            loaded: false
        };
    },
    created() {
        if (this.form_id) this.requestCode();
    },
    mounted() {
        this.$onBlur();
    },
    watch: {
        'sms_code'(val) {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.doneCode = false;
                } else {
                    this.doneCode = true;
                }
            });
        }
    },
    methods: {
        fireRegisterEvent() {
            if (this.$store.state.register.regesia) {
                checkAndFireEvent({
                    action: 'registerSuccess',
                    label: 'GOV'
                });
            } else {
                checkAndFireEvent({
                    action: 'registerSuccess',
                    label: 'online'
                });
            }
        },

        submitCode() {
            if (this.loaded) return;
            this.loaded = true;
            axios.post(`/SignUp/${this.form_id}/otp/${this.sms_code}`)
                .then(({ data }) => {
                    let pixelImgWrapper = document.createElement('div');
                    pixelImgWrapper.innerHTML = pixelImg;
                    document.head.appendChild(pixelImgWrapper);
                    if (data && data.access_token) {

                        this.fireRegisterEvent();

                        setTimeout(() => {
                            this.loaded = false;

                            this.$router.push('/', () => {
                                setTimeout(() => {
                                    window.events.$emit('show_popup', 'after-register-auto-auth');
                                    window.events.$on('after-register-auto-auth-ok', (answer) => {
                                        this.$store.dispatch('user/login', data)
                                        .then(() => this.$router.push('/funds'));
                                    });
                                }, 300);
                            });
                        }, 300); // Танцы с бубном - не уходят события
                    } else {
                        this.loaded = false;
                        window.events.$emit('show_popup', 'after-register');
                    }

                })
                .catch(({ response }) => {
                        window.log(response);
                        if (response.data.message) {
                            flash([response.data.message], 'error');
                        } else {
                            flash(['Возможно Вы были зарегистрированы ранее'], 'error');
                        }

                        this.requesting = false;
                    }
                )
                .finally(() => {
                    setTimeout(() => {
                        this.loaded = false;
                    }, 300); // Танцы с бубном - не уходят события
                })
        },
        requestCode() {
            window.log('requestCode');
            axios.get(`/SignUp/${this.form_id}/otp`)
                .then(({ data }) => {
                    this.checkCode = data.code;
                    this.handleRequestSMScode(data, true);
                }).catch((response) => {
                // window.log(response);
                // window.log(response.data.message);
                // if(response.statusText=="rate_limit_exceeded") flash(['Не истекло время ожидания до следующей отправки СМС'], 'error');
                // if(response.data.message=="Suspicious") flash(['Данные Вашего паспорта не прошли проверку'], 'error');
                // else {
                //     flash(['Возможно Вы были зарегистрированы ранее'], 'error');
                // }
                if (response.data.message) {
                    flash([response.data.message], 'error');
                } else {
                    flash(['Возможно Вы были зарегистрированы ранее'], 'error');
                }
                this.requesting = false;
            });
        },
        backToRegister() {
            this.$router.push('/register/contact');
            window.events.$emit('close_popup');
        },
        formatPhone(phone) {
            if (/\+7 \(\d{3}\) \d{3} \d{2} \d{2}/.test(phone)) return phone;

            let m = phone.match(/(\d{3})(\d{3})(\d{2})(\d{2})$/);

            if (m.length != 5) return '';

            return `+7 (${m[1]}) ${m[2]} ${m[3]} ${m[4]}`;
        }
    },
    computed: {
        phone() {
            if (this.$store.state.register.step_1) {
                return this.formatPhone(this.$store.state.register.step_1.phone);
            } else if (localStorage.getItem('phone')) {
                return this.formatPhone(localStorage.getItem('phone'));
            } else {
                return '';
            }
        },

        regesia() {
            return this.$store.state.register.regesia;
        }
    }
}
</script>

