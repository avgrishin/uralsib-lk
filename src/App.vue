<template lang="pug">
    #app.site
        app-head()
        main.main(:class="this.$store.state.mainClass")
            .g-grid
                breadcrumbs
                router-view
            .bug-ie
        app-foot
        .g-p_4.g-p_1_xs.h6.g-mb_0.g-lh_15(v-if="showDisclaimer")
            div(v-html="disclaimerTextFooter")
        startup-modals-observer
        pop-up
        notice
        deferred-apps-observer
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';

import Head from './components/Head.vue';
import Foot from './components/Foot.vue';
import Auth from './pages/Auth.vue';
import PopUp from './components/popup.vue';
import Notice from './components/Notice.vue';
import { setUtmSource, setRegDataFromUS, setTransactionId, addPixelImg } from './assets/js/functions/global';
import { confirmPersonalData } from './guards';
import { C_LOCAL_TECHNICAL_WORKS_DONT_SHOW } from './assets/js/functions/constants';
import { togglePrivateGTMMode } from './helpers';
import StartupModalsObserver from './pages/StartupModalsObserver.vue';
import DeferredAppsObserver from './components/service/DeferredAppsObserver';
import { APPLICATIONS_GET_BUY_LIST_ACTION, APPLICATIONS_STORE_KEY } from './store/modules/applications';

export default {
    name: 'app',

    components: {
        DeferredAppsObserver,
        'app-head': Head,
        'app-foot': Foot,
        'app-auth': Auth,
        'pop-up': PopUp,
        'notice': Notice,
        StartupModalsObserver,
    },

    watch: {
        authState(val) {
            if (val) {
                this.getTextDisclaimer();
                this.makeSession();
                this.showFormPopup();
                this.nrkForEsiaLogin();
                // setTimeout(() => {
                //     if (!localStorage.getItem(C_LOCAL_TECHNICAL_WORKS_DONT_SHOW)) { // TODO попап о тех. работах
                //         window.events.$emit('show_popup', 'popup-technical-works');
                //     }
                // }, 3000);
            } else {
                this.endSession();
                this.$store.commit('buffering', false);
            }
        },
        funds(val) {
            if (val.length) this.getDisclaimer();
        },
        '$route'(to, from) {
            // let timeLeave = moment().toArray()
            // localStorage.setItem('setTimeLeave', timeLeave)
            if (to.query.u) this.$store.commit('user/imitate', to.query.u);
        },
    },

    data() {
        return {
            disclaimerTextFooter: '',
            today: moment().subtract(2, 'days').format('DD.MM.YYYY'),
            disclaimerData: {
                three_months: [],
                six_months: [],
                one_year: [],
                three_years: [],
            },
            disclaimer: '',
            session: null,
            session_reminder: null,
            sessionTime: 60,
            registerCheckPopupState: false,
        };
    },

    created() {
        let sessionHrefParam = parseFloat(window.location.href.split('session=')[1]);
        if (sessionHrefParam) {
            if (sessionHrefParam < 1.1) {
                sessionHrefParam = 1.1;
            }
            this.sessionTime = sessionHrefParam;
        }

        if (this.authState) {
            this.getTextDisclaimer();
        }
        this.closeTabLogout();
        this.getDevice();
        this.checkUrlForConstructor();
        if (this.authState) this.makeSession();
        if (this.funds.length) this.getDisclaimer();

        window.addEventListener('unhandledrejection', this.promiseErrorHandler);

        if (this.$route.query.registrarValidation) {
            this.$router.push({ path: '/register/nrk', query: { registrarValidation: this.$route.query.registrarValidation } });
        }

        document.addEventListener('contextmenu', function(e) {
            let timeLeave = moment().toArray();
            localStorage.setItem('setTimeLeave', timeLeave);
        }, false);
        document.addEventListener('click', function(event) {
            if (event.ctrlKey) {
                let timeLeave = moment().toArray();
                localStorage.setItem('setTimeLeave', timeLeave);
            }
        }, false);

        setTimeout(() => {
            // if (!localStorage.getItem(C_LOCAL_TECHNICAL_WORKS_DONT_SHOW)) { // TODO попап о тех. работах
            //     window.events.$emit('show_popup', 'popup-technical-works');
            // }
        }, 2000);

        this.$watch(() => this.authState, (state, oldState) => {
            if (state) {
                togglePrivateGTMMode(true);
                this[APPLICATIONS_GET_BUY_LIST_ACTION]();

                return;
            }

            togglePrivateGTMMode(false);
        }, { immediate: true });
    },

    beforeCreate() {
        setUtmSource();
        setRegDataFromUS();
        setTransactionId();
    },

    mounted() {
        if (this.authState) {
            this.showFormPopup();
        }
        if (this.$route.query.u) this.$store.commit('user/imitate', to.query.u);
    },

    beforeDestroy() {
        window.removeEventListener('unhandledrejection', this.promiseErrorHandler);
    },

    methods: {
        ...mapActions(APPLICATIONS_STORE_KEY, [APPLICATIONS_GET_BUY_LIST_ACTION]),

        getTextDisclaimer() {
            axios.get('/reference/disclaimer').then(({ data }) => {

                this.disclaimerTextFooter = data;

            });
        },
        closeTabLogout() {
            let getTimeLeave = localStorage.getItem('setTimeLeave');
            window.log(getTimeLeave);
            getTimeLeave = JSON.parse('[' + getTimeLeave + ']');

            let currentTime = moment().toArray();

            currentTime = moment(currentTime);
            getTimeLeave = moment(getTimeLeave);

            let diff = currentTime.diff(getTimeLeave, 'seconds');
            let leavingTimeSec = localStorage.getItem('leavingTimeSec');

            if (leavingTimeSec == null) {
                leavingTimeSec = 5 * 60;
            } else {
                leavingTimeSec = leavingTimeSec;
                localStorage.removeItem('leavingTimeSec');
            }

            window.log('Вас не было на сайте ' + diff + 'с');

            if (diff > leavingTimeSec && diff !== NaN && this.$route.path !== '/recover/password') {
                this.$store.dispatch('user/logout');
                this.$router.push('/');
            }

            window.onunload = function(e) {
                var dialogText = ' ';
                e.returnValue = dialogText;
                let timeLeave = moment().toArray();
                localStorage.setItem('setTimeLeave', timeLeave);
                return dialogText;
            };
        },
        IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },
        checkUrlForConstructor() {
            if (this.$route.query.makefolio && this.IsJsonString(this.$route.query.makefolio)) {
                localStorage.setItem('amountQuery', this.$route.query.makefolio);
                this.$router.push('/operations');
            }
        },
        showFormPopup() {
            let arrNamePopups = ['check-register-state', 'confirm-personal-data'];

            let showConfirmPersonalPopup = () => {
                window.events.$emit('show_popup', 'confirm-personal-data');
                return;
                /*
                    !TODO Костыль
                */
                if (this.$store.state.form.completed.passport.registrarValidationState[0] !== 1) {
                    window.events.$emit_p('check_popup', arrNamePopups).then(res => {
                        if (!res) {
                            window.events.$emit('show_popup', 'confirm-personal-data');
                        }
                    });
                } else {
                    window.events.$emit('show_popup', 'confirm-personal-data');
                }
                window.events.$emit_p('check_popup', arrNamePopups).then(res => {
                    if (!res) {
                        window.events.$emit('show_popup', 'confirm-personal-data');
                    }
                });
                //window.events.$emit('show_popup', 'confirm-personal-data');
            };
            setTimeout(() => {
                if (!this.$route.path.includes('user')) {
                    if (!this.$store.state.user.state_loaded) {
                        this.$store.watch((state) => state.user.state_loaded, () => {
                            if (this.$store.state.user.state.authState == 1) {
                                showConfirmPersonalPopup();
                                //window.events.$emit('show_popup',['confirm-personal-data', {closePopupYes:this.$store.state.countOneConfirmPersonalDataClosePopup }] );
                            }
                        });
                    } else if (this.$store.state.user.state.authState == 1) {
                        showConfirmPersonalPopup();
                    }
                }
            }, 3000);

        },
        nrkForEsiaLogin() {
            return;
            /*
                !TODO Костыль
            */
            this.$store.watch((state) => state.user.state.hasEsia, (newValue, oldValue) => {
                let hasEsia = this.$store.state.user.state.hasEsia;

                if (hasEsia) {
                    this.$store.watch((state) => state.form.completed.passport.registrarValidationState[0], (newValue, oldValue) => {
                        if (newValue !== oldValue) {
                            let nrkState = this.$store.state.form.completed.passport.registrarValidationState[0];
                            if (nrkState == 0 || nrkState == 4) {
                                let esiaLogin = localStorage.getItem('loginEsia');
                                if (esiaLogin) {
                                    this.$router.push({ path: '/register/nrk', query: { loginEsia: true } });
                                    localStorage.removeItem('loginEsia');
                                }
                            }
                        }
                    });
                }
            });
        },
        promiseErrorHandler(event) {
            console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ')');
        },
        makeSession() {
            this.startSession();
            ['mousemove', 'mouseup', 'touchmove', 'mousewheel'].forEach(event => document.addEventListener(event, this.resetSession));
        },
        startSession() {
            // window.log('START SESSION')
            this.session = setTimeout(() => {
                this.$store.dispatch('user/logout');
                this.$router.push({
                    path: '/',
                    query: { session: 'expired' },
                });
            }, this.sessionTime * 60 * 1000);

            this.session_reminder = setTimeout(() => {
                if (this.$store.state.user.state.authState) {
                    window.events.$emit('show_popup', 'session-reminder');
                    // window.log('POPUP SESSION')
                }
            }, (this.sessionTime - 1) * 60 * 1000);
        },
        resetSession() {
            // window.log('RESET SESSION')
            this.$nextTick(() => {
                clearTimeout(this.session);
                clearTimeout(this.session_reminder);
                this.startSession();
            });
        },
        endSession() {
            // window.log('END SESSION')
            ['mousemove', 'mouseup', 'touchmove', 'mousewheel'].forEach(event => document.removeEventListener(event, this.resetSession));
            this.$nextTick(() => {
                clearTimeout(this.session);
                clearTimeout(this.session_reminder);
            });
        },
        getDevice() {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.getElementsByTagName('html')[0].classList.add('touch-device');
            } else {
                document.getElementsByTagName('html')[0].classList.add('desktop');
            }
        },
        getDisclaimer() {
            if (this.disclaimer) return;

            this.getData(3, 'month').then(({ data }) => {
                this.setDisclaimer('three_months', data);
                return this.getData(6, 'month');
            }).then(({ data }) => {
                this.setDisclaimer('six_months', data);
                return this.getData(1, 'year');
            }).then(({ data }) => {
                this.setDisclaimer('one_year', data);
                return this.getData(3, 'year');
            }).then(({ data }) => {
                this.setDisclaimer('three_years', data);
                this.makeDisclaimer();
            });
        },
        getData(amount, time) {
            return axios.get('/ajax-lk/getProfitChart.php', {
                baseURL: 'https://www.uralsib-am.ru/',
                params: {
                    fund_id: this.funds,
                    from: moment().subtract(amount, time).format('DD.MM.YYYY'),
                    to: this.today,
                    light: 'Y',
                },
            });
        },
        setDisclaimer(field, data) {
            data.data.forEach(item => this.disclaimerData[field].push({
                name: item.name,
                value: item.profit_perc.toLocaleString('ru-RU') + '%',
            }));
        },
        getFundPercentage(name, period) {
            let fund = this.disclaimerData[period].find(item => item.name == name);

            if (!fund) return '';

            return fund.value;
        },
        makeDisclaimer() {
            let disclaimer = {
                'УРАЛСИБ Глобальные акции': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Глобальные акции» (Правила зарегистрированы ФСФР России, № 2610 от 28.05.2013 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Акционерные рынки развивающихся стран': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Акционерные рынки развивающихся стран» (Правила зарегистрированы ФСФР России, № 2609 от 28.05.2013 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Глобальные облигации': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Глобальные облигации» (Правила зарегистрированы ФСФР России, № 2608 от 28.05.2013 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Долговые рынки развивающихся стран': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Долговые рынки развивающихся стран» (Правила зарегистрированы ФСФР России, № 2607 от 28.05.2013). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Зарубежная недвижимость': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Зарубежная недвижимость» (Правила зарегистрированы ФСФР России, № 2612 от 28.05.2013). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Глобальные сырьевые рынки': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Глобальные сырьевые рынки» (Правила зарегистрированы ФСФР России, № 2611 от 28.05.2013). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Драгоценные металлы': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Драгоценные металлы» (Правила зарегистрированы ФСФР России, № 2342 от 19.04.2012). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Еврооблигации': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Еврооблигации» (Правила зарегистрированы ФСФР России, № 2314 от 21.02.2012 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Первый': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Первый» (Правила зарегистрированы ФКЦБ России, № 0029-18610555 от 14.09.1998 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Профессиональный': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Профессиональный» (Правила зарегистрированы ФКЦБ России, № 0053-56612554 от 27.04.2001 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Консервативный': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Консервативный» (Правила зарегистрированы ФКЦБ России, № 0056-56658088 от 06.06.2001 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Природные ресурсы': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Природные ресурсы» (Правила зарегистрированы ФСФР России, № 1143-94140753 от 27.12.2007 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Энергетическая перспектива': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Энергетическая перспектива» (Правила зарегистрированы ФСФР России, № 1145-94140670 от 27.12.2007 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Глобальные инновации': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Глобальные инновации» (Правила зарегистрированы ФСФР России, № 1142-94140995 от 27.12.2007 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER',
                'УРАЛСИБ Акции роста': 'ОПИФ рыночных финансовых инструментов «УРАЛСИБ Акции роста» (Правила зарегистрированы ФКЦБ России, № 0030-18610638 от 14.09.1998 г.). Доходность отображается по состоянию на TODAY_PLACEHOLDER, доходность за 3 месяца THREE_MONTHS_PLACEHOLDER, за 6 месяцев SIX_MONTHS_PLACEHOLDER, за 1 год ONE_YEAR_PLACEHOLDER, за 3 года THREE_YEARS_PLACEHOLER.',
            };

            for (let fund in disclaimer) {
                disclaimer[fund] = disclaimer[fund].replace('TODAY_PLACEHOLDER', this.today).replace('THREE_MONTHS_PLACEHOLDER', this.getFundPercentage(fund, 'three_months')).replace('SIX_MONTHS_PLACEHOLDER', this.getFundPercentage(fund, 'six_months')).replace('ONE_YEAR_PLACEHOLDER', this.getFundPercentage(fund, 'one_year')).replace('THREE_YEARS_PLACEHOLER', this.getFundPercentage(fund, 'three_years'));
            }
            this.disclaimer = Object.values(disclaimer).join('. ');
        },
    },
    computed: {
        userInfo() {
            return this.$store.state.user.info;
        },
        showDisclaimer() {
            return (
                this.$store.state.user.authenticated &&
                (!this.$route.matched.length || this.$route.matched[0].path !== '*' && this.$route.matched[0].path !== '/du')
            );
        },
        authState() {
            return this.$store.state.user.authenticated;
        },
        funds() {
            return this.$store.state.funds.items.map(item => item.id);
        },
    },
};
</script>

<style lang="scss">
    @import "./assets/styles/app";
</style>
