<template lang="pug">
    casenav
        article.content
            h1 Оплата банковскими картами
            form(v-if="!applicationsListLoading && !isLoading")
                .payment-data
                    .g-mb_4
                        .g-row.g-mb_4
                            h3.g-col.g-col_lg_3.g-col_md_4 Назначение платежа:
                            .g-col.g-col_lg_5.g-col_md_8.payment-data__value
                                p(v-html="`Приобретение инвестиционных паев ОПИФ рыночных финансовых инструментов «${fundDescription}» <br class='g-hide_md' /> по заявке ${operationText}`")
                                p Плательщик #[span(v-html="$store.state.user.state.fullName")]. #[br] НДС не облагается
                        .g-row.g-mb_4
                            h3.g-col.g-col_lg_3.g-col_md_4.g-col_xs_6.g-mb_0 Сумма:
                            .g-col.g-col_md_5.g-col_xs_6.payment-data__value.g-ta_r_xs(v-html="formattedCurrency")
                    .control.g-row
                        label.checkbox.g-col.g-col_lg_9(:class="{'checkbox_error': errors.has('terms')}")
                            input(type="checkbox" v-validate="'required'" data-vv-as="условия" name="terms", v-model="terms" id="FPD_TERMS")
                            span.checkbox__text(v-html="disclaimerTextBuyApprove")
                    .control

                    .control
                        input(type="submit", @click.prevent="finish" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" value="Оплатить" :disabled="buffering || !operationText").btn.g-col_lg_2.g-col_md_3.g-col_xs_12
            div.spinner(v-else)

</template>

<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import Inputmask from 'inputmask';

import { authAfterRouter } from '../../../mixins';
import CardInfo from 'card-info';
import { confirmPersonalData } from '../../../guards';
import CaseNav from '../../case/CaseNav.vue';
import { APPLICATIONS_LIST_KEY, APPLICATIONS_BUY_LIST_KEY, APPLICATIONS_LIST_LOADING_KEY, APPLICATIONS_STORE_KEY, APPLICATIONS_GET_BUY_LIST_ACTION } from '../../../store/modules/applications';

export default {

    mixins: [authAfterRouter],

    components: {
        'casenav': CaseNav,
    },

    data() {
        return {
            disclaimerTextBuyApprove: '',
            cards: [],
            selected_card: {},
            terms: false,
            success: false,
            payment: {},
            request_id: 0,
            loaded_activepaymentsNoCard: false,
            isLoading: true,

            showComputedError: false,
        };
    },

    methods: {
        ...mapActions(APPLICATIONS_STORE_KEY, [APPLICATIONS_GET_BUY_LIST_ACTION]),

        async createdHookHandler() {
            this.isLoading = true;
            try {
                await this.getTextDisclaimer();
                await this[APPLICATIONS_GET_BUY_LIST_ACTION]();

                let fund = _.get(this.$store.state.funds, 'operations.fund', {});
                if (this.$route.query.success) {
                    this.success = this.$route.query.success;
                    this.payment = fund.order;
                    this.checkPayment();
                } else {
                    await this.addPaymentRequest();
                    await this[APPLICATIONS_GET_BUY_LIST_ACTION]();
                }

                if (!fund.application) {
                    await this.getApplicationDetail();
                }

                // this.getCards();

                this.$store.commit('updateCrumbs', [
                    { link: '/', text: 'Портфель'},
                    { link: '/operations', text: 'Купить паи' },
                ]);

                window.events.$on('card_added', this.getCards);
            } catch (e) {
                window.flash([e.message], 'error');
            } finally {
                this.isLoading = false;
            }
        },

        getTextDisclaimer() {
            return axios.get('/reference/getsitetext', {
                params: {
                    place: 'BuyApprove',
                },
            }).then(({ data }) => {
                this.disclaimerTextBuyApprove = data.outText;
                return data;
            });
        },

        finish() {
            localStorage.setItem('leavingTimeSec', (60 * 21));
            this.$validator.validateAll().then(result => {
                if (result) {
                    let i = 1, max = 3;

                    let request = () => {
                        if (i <= max) {
                            this.buffering = true;
                            this.$store.commit('flashErrorOn', false);
                        } else {
                            this.$store.commit('flashErrorOn', true);
                            this.buffering = false;
                        }

                        if (typeof yaCounter50062190 !== 'undefined') {yaCounter50062190.reachGoal('BTN_PAY');}

                        axios.post(`/payments/${this.paymentId}/sendpay`).then(({ data }) => {
                            window.location = data;
                        }).catch((error) => {
                            if (error) {
                                if (i <= max) {
                                    setTimeout(() => {
                                        i++;
                                        flash([error.response.data && error.response.data.message ? error.response.data.message : 'Неизвестная ошибка'], 'error');
                                        request();
                                    }, 2000);
                                }
                            }
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                            }
                        });
                    };
                    request();
                }
            });
        },

        addNewCard() {
            window.events.$emit('show_popup', 'add-new-card');
        },

        getCards(cardNumber = '') {
            axios.get('/payments/cards').then(({ data }) => {
                this.cards = data.map(item => {
                    const info = new CardInfo(item.cardNumber);
                    item.bankLogo = info.bankLogo ? info.bankLogo.replace('png', 'svg') : null;
                    item.bankName = info.bankName;

                    return item;
                }).filter((item) => {
                    let card_type = this.$route.query.card;

                    if (card_type == 'other') return item.cardType == 2;
                    else return item.cardType == 1;
                });

                if (cardNumber) {
                    let card = data.find(item => item.cardNumber == cardNumber.replace(/ /g, ''));

                    if (card) {
                        this.selected_card = card;
                        this.cards = this.array_move(data, data.length - 1, 0);
                    }
                }
            }).catch();
        },

        selectCard(card) {
            this.selected_card = card;
        },

        addPaymentRequest() {
            return axios.post('/payments/addpayrequest').then(({ data }) => {
                this.request_id = data;
                return axios.get('/payments/activepaymentsNoCard');
            }).then(({ data }) => {
                this.payment = data.find(item => item.requestID == this.request_id);

                return this.recalculatePaymentNoCard();
            });
        },

        recalculatePaymentNoCard() {
            if (!this.payment.id) return Promise.resolve();

            let fund = _.get(this.$store.state.funds, 'operations.fund', {});;
            let cardType = localStorage.getItem('cardType') || 'uralsib';
            return axios.get('/payments/recalcCardType', {
                params: {
                    id: this.payment.id,
                    typeC: (this.$route.query.card == 'other' || cardType == 'other') ? 2 : 1,
                    accountnum: this.operationText,
                },
            }).then(({ data }) => axios.get('/payments/activepaymentsNoCard')).then(({ data }) => {
                let payment = data.find(item => item.requestID == this.request_id);
                this.payment = payment;

                this.$store.commit('funds/updateOperation', {
                    path: 'fund.order',
                    data: payment,
                });

                localStorage.setItem('fundData', JSON.stringify(this.$store.state.funds.operations));
                return payment;
            }).catch(({ response: error }) => {
                flash([error.data && error.data.message ? error.data.message : 'Неизвестная ошибка'], 'error');
            });
        },

        deleteCard(card, index) {
            this.$store.dispatch('confirm', {
                heading: 'Вы действительно хотите удалить карту?',
                text: '',
            }).then(answer => {
                window.events.$emit('close_popup');

                if (answer) return axios.post(`/payments/${card.id}/delcard`);
            }).then(({ data }) => {
                if (this.selected_card == card) this.selected_card = {};
                this.cards.splice(index, 1);
            });
        },

        getApplicationDetail() {
            return axios.get('/apps/allapps').then(({ data }) => {
                let application = data.find(item => item.applicationId == this.operationDetails.fund.applicationID);

                this.$store.commit('funds/updateOperation', {
                    path: 'fund.application',
                    data: {
                        number: application.number,
                        created: moment().toISOString(),
                    },
                });
                return application;
            });
        },

        checkPayment() {
            let i = 1, max = 5;
            this.loaded_activepaymentsNoCard = true;
            let request = () => {
                axios.get('/payments/activepaymentsNoCard').then(({ data }) => {

                    //data = [{status:4}];
                    if (!_.isArray(data) || ((_.isArray(data) && !data.length) || _.isEmpty(data[0]))) {
                        this.authAfterRouter();
                        return;
                    }

                    let operation = data[0];

                    if (operation.status == 2) {

                        if (i <= max) {
                            flash(['Ожидание статуса платежа попытка ' + i + ' из ' + max]);
                            setTimeout(() => {
                                i++;
                                request();
                            }, 3000);
                        } else {
                            this.loaded_activepaymentsNoCard = false;
                            if (this.success) window.events.$emit('show_popup', ['not-confirmed', { title: 'Оплата прошла успешно, но из-за технических сложностей квитанция будет сформирована позже.' }]);
                            else {window.events.$emit('show_popup', ['not-confirmed', { title: 'Платеж не был проведен. Попробуйте провести операцию позже.' }]);}
                            window.events.$on('popup_closed', this.toAuthAfterRouter);
                            return;

                        }

                    } else if (operation.status == 3) {

                        this.loaded_activepaymentsNoCard = true;

                        if (operation.merchantNumber.toNumber() % 2 == 1) { // Карта урал сиба
                            if (typeof yaCounter50062190 !== 'undefined') {yaCounter50062190.reachGoal('POPUP_CARD_1');}
                            ;
                        } else {if (typeof yaCounter50062190 !== 'undefined') {yaCounter50062190.reachGoal('POPUP_CARD_2');}}

                        window.events.$emit('show_popup', [
                            'request-accepted', {
                                operation: 'buy',
                                data: operation,
                                closable: false,
                            }]);
                    } else if (operation.status == 4) {
                        window.events.$emit('show_popup', ['not-confirmed', { title: 'Оплата завершилась с ошибкой' }]);
                        window.events.$on('popup_closed', this.toOperations);
                    }
                }).catch((error) => {

                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx

                    }
                });
            };

            request();

        },
        toAuthAfterRouter() {
            this.authAfterRouter();
            //this.$router.push('/funds/');
        },
        toOperations() {
            this.$router.push('/operations/buy');
        },
    },

    computed: {
        ...mapState(APPLICATIONS_STORE_KEY, {
            [APPLICATIONS_BUY_LIST_KEY]: APPLICATIONS_BUY_LIST_KEY,
            applicationsListLoading: APPLICATIONS_LIST_LOADING_KEY
        }),

        paymentId() {
            return _.get(this.payment, 'id');
        },

        loaded() {
            return this.loaded_activepaymentsNoCard;
        },

        today() {
            return moment().subtract(2, 'days').format('DD.MM.YYYY');
        },

        commission() {
            return this.formatCurrency(this.payment ? this.payment.commission || 0 : 0);
        },

        finalSum() {
            return this.formatCurrency(this.payment.totalSumm ? this.payment.totalSumm || 0 : 0);
        },

        currentApplication() {
            try {
                if (!this.operationDetails.fund) {
                    return null;
                }
                const errorMessage = 'Не найдена текущая заявка';
                const { applicationID } = this.operationDetails.fund; //APPLICATIONS_BUY_LIST_KEY
                const currentApplication = this[APPLICATIONS_BUY_LIST_KEY].find((application) => application.applicationId === applicationID);

                if (!applicationID || !currentApplication) {
                    throw new Error(errorMessage);
                }

                return currentApplication;
            } catch (e) {
                if (!this.showComputedError) {
                    return;
                }

                this.showComputedError = false;
                window.flash([e.message], 'error');
                return null;
            }
        },

        operationDetails() {
            let data = {}

            if (_.get(this.$store.state.funds, 'operations.fund', null)) data.fund = this.$store.state.funds.operations.fund;

            return data;
        },

        isSelectedCard() {
            return Object.values(this.selected_card).length;
        },

        operationText() {
            if (!this.operationDetails.fund.application) return '';

            let date;
            let number = this.operationDetails.fund.application.number;

            if (this.operationDetails.fund.application.created) {
                //date = moment(this.operationDetails.fund.application.created, [moment.ISO_8601, 'DD.MM.YYYY']).format('DD.MM.YYYY');
                date = moment.parseZone(this.operationDetails.fund.application.created).format('DD.MM.YYYY');

            } else if (this.operationDetails.fund.application.sentDate) {
                // date = moment(this.operationDetails.fund.application.sentDate, [moment.ISO_8601, 'DD.MM.YYYY']).format('DD.MM.YYYY');
                date = moment.parseZone(this.operationDetails.fund.application.sentDate).format('DD.MM.YYYY');
            } else {
                date = moment().format('DD.MM.YYYY');
            }

            return `${number} от ${date}`;
            // try {
            //     if (!this.currentApplication) {
            //         return null;
            //     }

            //     const { number, created } = this.currentApplication;
            //     const date = moment(created, [moment.ISO_8601, 'DD.MM.YYYY']).format('DD.MM.YYYY');

            //     if (!number || !created || !date) {
            //         throw new Error('Невозможно сформировать данные о заявке');
            //     }

            //     return `${number} от ${date}`;
            // } catch (e) {
            //     if (!this.showComputedError) {
            //         return;
            //     }

            //     this.showComputedError = false;
            //     window.flash([e.message], 'error');
            //     return null;
            // }
        },

        buttonDisabled() {
            if (!this.operationText) {
                return true;
            }

            return !Boolean(this.terms);
        },

        fundDescription() {
            try {
                return this.$store.state.funds.operations.fund.description;
            } catch (e) {
                if (!this.showComputedError) {
                    return;
                }

                this.showComputedError = false;
                window.flash(['Не удалось получить описание фонда для отображения'], 'error');
                console.error(e.message);
                return '';
            }
        },

        formattedCurrency() {
            try {
                return this.formatCurrency(this.payment ? this.payment.summ || 0 : this.operationDetails.fund.amount)
            } catch (e) {
                if (!this.showComputedError) {
                    return;
                }

                this.showComputedError = false;
                window.flash(['Не удалось рассчитать сумму платежа для отображения'], 'error');
                return '';
            }
        }
    },

    watch: {
        selected_card(val) {
            if (val) this.recalulatePayment();
        },
        loaded(val) {
            if (val) {
                this.$store.commit('mainClass', 'spinner');
                return;
            }

            this.$store.commit('mainClass', '');
        },
    },

    async mounted() {
        this.createdHookHandler();
    },

    beforeDestroy() {
        window.events.$off('card_added', this.getCards);
        window.events.$off('close_popup', this.toOperations);
    },

    beforeRouteLeave(to, from, next) {
        if (this.$route.query.success) return next();
        this.$store.dispatch('confirm').then(answer => {
            if (answer) {
                next();
                this.$store.commit('funds/clearOperations');
                axios.post('/payments/undorequest');
            } else {
                window.events.$emit('close_popup');
            }
        });
    },

    beforeRouteEnter: confirmPersonalData,
};
</script>

