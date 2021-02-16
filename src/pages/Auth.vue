<template lang="pug">
    article.content.content_reg
        template(v-if="!webview")
            h4 Уважаемые клиенты!
            p
                |Мы рады вам сообщить о доступности новой версии Личного
                |кабинета #[br] с новыми возможностями для управления личными
                |финансами.
            div(class="g-mb_1 reg-old-link" style="margin-top: -7px")

                a(href="https://www.uralsib-am.ru/investors/private/lk/", target="_blank", class="g-clr_gray g-bbc_t g-d_f g-ai_c")
                    span Все операции онлайн без визита в офис

            //- p(class="g-clr_err g-mb_1")
            //-     |В связи с плановым проведением технических работ в период с 29 по 30 августа 2020г личный кабинет клиента будет недоступен.
            //-     |Приносим вам свои извинения за временные неудобства. 
            //- p
            //-     strong Уважаемые клиенты,#[br]поздравляем вас с наступающим Новым годом и Рождеством! 
            //- p
            //-     |Информируем вас, что офис компании будет закрыт с 1 по 10 января 2021 года. 31 декабря офис будет работать до 16:00.#[br]
            //-     |Вы можете оформить любые операции с паями инвестиционных фондов, а также осуществить перевод денежных средств на счета доверительного управления и ИИС в любое удобное время. Обработка заявок и зачисление средств будут производиться, начиная с 11 января 2021 года.#[br]
            //-     |Вывод средств и торговые операции на бирже в период новогодних праздников осуществляться не будут.#[br]
            //-     |Просим учесть эту информацию и приносим извинения за возможные неудобства!

            //div(class="g-mb_3 reg-old-link")

                a(href="https://i.am-uralsib.ru/oldversion",class="g-clr_gray g-bbc_t g-d_f g-ai_c")
                    i.icon.icon_arrow_left.g-mr_1
                    span Перейти на старую версию Личного кабинета
        .g-d_f.g-jc_sb.g-d_b_xs
            //router-link(to="/register",class="btn btn_reg btn_secondary btn_p_s g-as_b g-or_1 g-mb_6 g-d_b_xs g-mlr_2_m_xs g-mb_3_xs") Регистрация

        .g-row
            //- .g-col.g-col_md_6.g-mb_2.auths__left
            //-     .g-plr_0_xs
            //-         .g-pt_1
            //-             input(@click="authType = true" type="submit", value="Зарегистрироваться в Личном кабинете" :class="{'btn_secondary' : !authType}").btn.btn_primary.btn_block.g-ws_pw_xs.g-lh_1_xs
            //- .g-col.g-col_md_6.g-mb_2_xs.auths__left
            //-     .g-plr_0_xs
            //-         .g-pt_1.g-pt_0_xs
            //-             input(@click="authType = false" type="submit", value="Войти в Личный кабинет" :class="{'btn_secondary' : authType}").btn.btn_primary.btn_block.g-lh_1_xs
            .g-col.g-col_md_12.g-ta_r
                router-link.js-click-datalayer(:to="APP_CONFIGURATION.disableESIA ? '/register/contact' : '/register'" data-action="registration" class="btn btn_primary btn_register btn_secondary") Регистрация

        .g-row.g-row_flex.g-mb_2.auths

            .g-col.g-col_md_6.auths__left
                form.auth.auth_bg_1.g-plr_2_xs.g-mb_4_xs(@submit.prevent="login" :class="{'auth_btn':  inputsNotEmpty }")
                    fieldset
                        legend.g-mb_3
                            .h3.g-mb_0 С помощью логина и пароля
                        .control
                            input.js-validate-datalayer.field_text(v-validate="'required|email'" data-action="validateField" data-label="login" data-vv-as="логин" v-model="email" name="login" type="text" id="F_AUTH_LOGIN" placeholder="Логин")
                            span.field_error(v-if="errors.has('login')" v-html="errors.first('login')")
                        .control
                            .control__field
                                input.js-validate-datalayer.field_text(data-action="validateField" data-label="password" v-validate="'required'" data-vv-as="пароль" v-model="password" name="password" type="password" id="F_AUTH_PASS" placeholder="Пароль")
                                span.field__eye(@click="togglePassword('F_AUTH_PASS')")
                                span.field_error(v-if="errors.has('password')" v-html="errors.first('password')")
                            .auth__forgot.g-ta_r.g-ta_l_xs
                                router-link(to="/recover",class="link g-clr_gray") Забыли пароль?
                        .g-pt_1
                            input(:disabled="buffering" type="submit",value="Вход в Личный кабинет").btn.btn_primary.btn_block
            .g-col.g-col_md_6.auths__right
                .auth.auth_bg_2.g-plr_2_xs(:class="{'spinner':  loaded_esia }")
                    .g-mb_3
                        h3.g-mb_0 Через сайт Госуслуг
                    .g-mt_8.g-mb_7.g-clr_gray
                        span.g-fw_4.g-d_b Потребуется:
                        br
                        | Подтвержденная учетная запись
                        br
                        | на сайте Госуслуги.ру
                    //router-link(:to="{name: 'technicalWorks'}").btn.btn_primary.btn_block Вход через Госуслуги
                    button.js-click-datalayer(@click.prevent="esia()" data-action="GOVenter" type="button").btn.btn_primary.btn_block Вход через Госуслуги
        hr.g-mt_4
        .g-row.g-row_flex
            .g-col.g-col_md_6.g-mb_2_xs
                .auth-bottom__links
                    .auth-bottom__link
                        span.icon.icon_question
                        router-link(to="/help" class="js-click-datalayer" data-action="FAQ") Помощь
                    .auth-bottom__link
                        span.icon.icon_comment
                        a.js-click-datalayer(href="#" @click.prevent="showPopup" data-action="openForm" data-label="Форма обратной связи") Форма обратной связи
            .g-col.g-col_md_6(v-if="1==2")
                .auth-bottom__stores
                    span.auth-bottom__label Скачать приложения
                    div
                        a.auth-bottom__store.js-click-datalayer(target="_blank", data-action="downloadApp", data-label="Google Play", href="https://play.google.com/store/apps/details?id=ru.am_uralsib.android")
                            img(src="dist/img/googleplay.svg")
                        a.auth-bottom__store.js-click-datalayer(target="_blank", data-action="downloadApp", data-label="App Store", href="https://itunes.apple.com/ru/app/%D1%83%D0%BA-%D1%83%D1%80%D0%B0%D0%BB%D1%81%D0%B8%D0%B1-%D0%B8%D0%BD%D0%B2%D0%B5%D1%81%D1%82%D0%B8%D1%86%D0%B8%D0%B8/id1422595494?mt=8")
                            img(src="dist/img/appstore.svg")
</template>



<script>
import {
    authAfterRouter
} from '../mixins';
import moment from 'moment';
import createFireValidationMixin from '../mixins/fireValidationEvents';
import { checkAndFireEvent } from '../helpers';
import { APP_CONFIGURATION } from '../app-utils';

export default {

    mixins: [authAfterRouter, createFireValidationMixin()],

    data() {
        return {
            APP_CONFIGURATION,
            email: '',
            password: '',
            buffering: false,
            authType: true,
            webview: false,
            disableLoginForm: false,
            validateFormPushed: false,
        }
    },
    created() {
        this.$store.commit('toggleCrumbs', false);

        if (this.$route.query.access_token) this.loginESIA();


        if (window.location.href.indexOf("?webview") > -1) {
            this.webview = true
        } else {
            this.webview = false
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$route.query.error) window.events.$emit('show_popup', 'not-confirmed');
            else if (this.$route.query.session) window.events.$emit('show_popup', ['not-confirmed', {
                title: 'В целях безопасности ваша сессия <br />была прекращена.'
            }]);
        });
    },
    computed: {
        inputsNotEmpty() {
            return this.password || this.email
        },

        errorsItems() {
            return this.errors.items;
        },

        authData() {
            return {
                email: this.email,
                password: this.password,
            };
        }
    },
    methods: {
        showPopup() {
            window.events.$emit('show_popup', 'contact');
        },
        checkNRKandESIA() {
            return;
            /*
                !TODO Костыль
            */
            let nrkState = this.$store.state.form.completed.passport.registrarValidationState[0]
            let hasEsia = this.$store.state.user.state.hasEsia
            window.log('nrkState - ', nrkState)
            window.log('hasEsia - ', hasEsia)

            if (nrkState == 0 || nrkState == 4) {
                if (hasEsia !== undefined) {
                    window.events.$emit('show_popup', 'check-register-state');
                }
            }
        },
        login() {
            if (!this.disableLoginForm) {
                this.$validator.validateAll()
                    .then(success => {
                        if (success) {
                            if (typeof ga !== "undefined") this.$ga.event('event', 'lk', 'click_button', 'vojti_v_lichnyj_kabinet'); //google цели
                            if (typeof yaCounter50062190 !== "undefined") {
                                yaCounter50062190.reachGoal('vojti_v_lichnyj_kabinet')
                            };


                            this.buffering = true;
                            this.sendLoginRequest();


                            this.$store.watch((state) => state.form.completed.passport.registrarValidationState[0], (newValue, oldValue) => {
                                if (newValue !== oldValue) {
                                    if (this.$store.state.user.state.hasEsia !== undefined) {
                                        this.checkNRKandESIA()
                                    } else {
                                        this.$store.watch((state) => state.user.state.hasEsia, (newValue, oldValue) => {
                                            this.checkNRKandESIA()
                                        });
                                    }
                                }
                            });
                        }
                    })
            } else {
                flash(['Пароль был введен некорректно несколько раз. <br> Попытайтесь снова через 15 минут'], 'error');
            }
        },
        sendLoginRequest() {
            let obj = {
                userName: this.email,
                password: this.password,
                grant_type: 'password'
            };

            let dataPOST = [];
            for (let field in obj) dataPOST.push(encodeURIComponent(field) + '=' + encodeURIComponent(obj[field]));

            dataPOST = dataPOST.join('&');

            checkAndFireEvent({
                action: 'sendForm',
                label: 'Вход в личный кабинет'
            });

            axios({
                method: 'POST',
                url: '/auth/Token',
                data: dataPOST,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then(({
                data
            }) => {
                checkAndFireEvent({
                    action: 'formSuccess',
                    label: 'Вход в личный кабинет'
                });

                this.$store.dispatch('user/login', data).then(() => {
                    this.buffering = false;
                    this.$store.commit('buffering', false);
                });

            }).then(() => {
                this.authAfterRouter();
                if (typeof ga !== "undefined") this.$ga.event('event', 'lk', 'success', 'form_send'); //google цели
                if (typeof yaCounter50062190 !== "undefined") {
                    yaCounter50062190.reachGoal('form_send')
                };
                // localStorage.removeItem('loginAttempt');
            })
            .catch((data) => {
                if (data.response.data.error == "outdated_password") {
                    window.events.$emit('show_popup', 'outdated-password');
                    this.buffering = false;
                    return
                }
                else if (data.response.data.error == "user_is_lockedout") {
                    window.events.$emit('show_popup', 'user_is_lockedout');
                    this.buffering = false;
                    return
                }
                else if (data.response.data.error == "password_expired") {
                    window.events.$emit('show_popup', 'password_expired');
                    this.buffering = false;
                    return
                }
                flash(['Логин или пароль неверные'], 'error');
                this.buffering = false;
            });

        },
        togglePassword(fieldId) {
            var el = document.querySelector(`#${fieldId}`);
            var tp = el.getAttribute('type');

            if (tp == "password") el.setAttribute('type', 'text')
            else el.setAttribute('type', 'password')
        },
        loginESIA() {
            let data = {
                access_token: this.$route.query.access_token,
                token_type: this.$route.query.token_type,
                expires_in: this.$route.query.expires_in
            };

            this.$store.dispatch('user/login', data)
                .then((response) => {
                    localStorage.setItem('loginEsia', true)
                    this.$store.dispatch('user/getProfile');
                    if (this.$route.query.return) this.$router.push(this.$route.query.return);
                    else this.authAfterRouter();
                }).catch((error) => window.log(error));
        }
    },

    watch: {
        authData() {
            this.$nextTick(() => {
                const errors = this.$el.querySelectorAll('input.error');

                if (!errors.length && !this.validateFormPushed) {
                    this.validateFormPushed = true;

                    checkAndFireEvent({
                        action: 'validateForm',
                        label: 'Помощь консультанта'
                    });
                }
            })
        }
    },
}
</script>

<style lang="scss">
    .reg-old-link {
        i {
            margin-bottom:3px;
        }
    }

    .reg-old-link:hover {
        opacity:.8
    }
</style>
