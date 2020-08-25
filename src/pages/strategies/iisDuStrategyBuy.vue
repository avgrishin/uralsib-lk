<template lang="pug">
    article.content.strategy-buy
        h1 Перевод денежных средств
        .g-row.g-mb_4_xs
            .control.g-col.g-col_lg_4.g-col_md_5
                .control__label-top
                    label(for="strategy") Стратегия
                .control__field
                    input(type="text", placeholder="Будет присвоен автоматически", disabled, name="strategy", id="strategy", v-model="strategyName").field_text
            .control.g-col.g-col_lg_4.g-col_md_4.g-col-FPP_NUM.g-maw_n_xs
                .control__field
                    .control__label-top
                        label Договор {{strategyBuy.sType == 'IIS' ? 'ИИС' : 'ДУ'}}
                    template(v-if="storeSrategyById() && strategyContracts")
                        .select-plus.g-col_xs_12
                            button(@click.prevent="newAccount", type="button", v-if="order && strategyType.val == 'du'").btn.btn_plus.tooltip-wrap
                                span.g-icon.g-icon_plus
                                span.tooltip.g-ws_nw Добавить новый номер счёта в реестре
                            v-select(
                                @input="changeOrder()",
                                v-model="order",
                                key="id",
                                label="pifNumber",
                                :options="strategyContracts",
                                v-if="storeSrategyById() && strategyContracts.length > 1 || (strategyContracts.length != 0 && !order)",
                                placeholder="Будет присвоен автоматически"
                            ).field-select#FPP_NUM
                                span(slot="no-options")
                            input(
                                v-else,
                                type="text",
                                placeholder="",
                                name="order",
                                id="order",
                                v-model="order.pifNumber",
                                :disabled="strategyBuy.sType == 'IIS'"
                            ).field_text
                    template(v-else)
                        input(
                            type="text",
                            placeholder="Будет присвоен автоматически",
                            disabled,
                            name="order",
                            id="order",
                            v-model="order"
                        ).field_text
            .control.g-col.g-col_lg_2.g-col_md_3
                .control__label-top
                    label(for="sum") Введите сумму
                .tooltip-wrap(:class="{active: tollTipShow}")
                    .tooltip(v-html="`Минимальная сумма ${amount_min} ${rubleSign}`")
                    input(
                        type="text",
                        id="sum",
                        v-model="amount",
                        v-money="money",
                        name="sum",
                        v-validate="`required|mink:${amount_min}`",
                        @input="changeInput()",
                        :class="{'show-currency' : styleHidden(amount), invalid_force: getError('sum')}"
                    ).field_text
                    span
        fieldset.control()
            .control__field
                .control
                    p Обращаем внимание, в соответствии с условиями Договора доверительного управления ценными бумагами Клиент принимает на себя обязательство передать Активы в доверительное управление в срок не позднее 30 календарных дней с даты заключения Договора.
                .control(v-if="false")
                    label.checkbox(:class="{'checkbox_error': errors.has('open_account')}")
                        input(
                            type="checkbox",
                            v-validate="'required'",
                            v-model="open_account",
                            name="open_account",
                            id="FPP_OPEN_ACCOUNT"
                        )
                        span.checkbox__text Я подтверждаю, что согласен перевести денежные средства по {{strategyBuy.sType == 'IIS' ? 'ИИС' : 'ДУ'}} #[br.g-hide_xs] «{{strategyName}}», включая все условия, предусмотренные договором.

        fieldset.control
            p Выберите удобный для Вас способ перевода
            .g-row.g-row_flex
                p.g-col.g-col_lg_4.g-col_md_5(v-if="strategyType.val !== 'du'")
                    label.radio.radio_card(@click.prevent="pay(1)")
                        input(type="radio", name="method", value="1")
                        span.radio__text
                            span.radio__bg.radio__bg_us(hidden)
                                svg-inline(src="/us_logo_small.svg")
                            span.radio__images(hidden)
                                span.radio__image.radio__image_card
                                    svg-inline(src="/us_logo_small.svg")
                            span.radio__text-wrap
                                span.radio__name БАНК УРАЛСИБ
                                small.radio__note Оплата картой


                p.g-col.g-col_lg_4.g-col_md_5(v-if="strategyType.val !== 'du'")
                    label.radio.radio_card(@click.prevent="pay(1.1)")
                        input(type="radio" name="method" value="1")
                        span.radio__text
                            span.radio__bg.radio__bg_card(hidden)
                                svg-inline(src="/credit-card.svg")
                            span.radio__images(hidden)
                                span.radio__image.radio__image_card
                                    svg-inline(src="/credit-card.svg")
                            span.radio__text-wrap
                                span.radio__name Оплата банковской картой
                                small.radio__note Онлайн-перевод
                .g-col.g-col_md_12(v-if="strategyType.val !== 'du'")
                p.g-col.g-col_lg_4.g-col_md_5
                    label.radio.radio_card(@click.prevent="pay(2)")
                        input(type="radio" name="method" value="2")
                        span.radio__text.radio__text_kv
                            span.radio__bg.radio__bg_kv(hidden)
                                svg-inline(src="/banks/kv.svg")
                            span.radio__images(hidden)
                                span.radio__image.radio__image_kv
                                    svg-inline(src="/banks/kv.svg")
                            span.radio__text-wrap
                                span.radio__name Квитанция на оплату
                                small.radio__note Печать квитанции для оплаты в Банке
                //.g-col.g-col_md_12(v-if="strategyType.val == 'du'")
                p.g-col.g-col_lg_4.g-col_md_5
                    label.radio.radio_card(@click.prevent="pay(3)")
                        input(type="radio" name="method" value="3")
                        span.radio__text
                            span.radio__bg.radio__bg_ib(hidden)
                                svg-inline(src="/us_logo_small.svg")
                            span.radio__images(hidden)
                                span.radio__image.radio__image_ib

                            span.radio__text-wrap
                                span.radio__name Интернет-банк
                                small.radio__note Перейти в УРАЛСИБ Интернет-банк
        iis-date-banner(v-if="strategyType.val === 'iis'")

</template>

<script>
import { mapState } from 'vuex';
import { VMoney } from 'v-money';
import { confirmPersonalData } from '../../guards';
import { buyDu, iisDU } from '../../mixins';
import IisDateBanner from './iisDateBanner.vue';

export default {
    mixins: [buyDu, iisDU],

    directives: { money: VMoney },

    components: { IisDateBanner },

    beforeRouteEnter: confirmPersonalData,

    data() {
        return {
            strategyType: {
                val: this.$route.params.selectedStrategy == 'iis' ? 'iis' : 'du',
                text: this.$route.params.selectedStrategy == 'iis' ? 'ИИС' : 'ДУ',
            },
            money: {
                decimal: ',',
                thousands: ' ',
                prefix: '',
                suffix: '\u20BD',
                precision: 0,
                masked: false,
            },
            amountT: '',
            amount: '',
            amount_min: '',
            strategyName: '',
        };
    },

    async created() {
        this.buffering = true;

        if (this.strategyBuy) {
            this.strategyName = this.strategyBuy.strategyName;
            this.setFund();

            localStorage.removeItem('fundData');

            this.sign();

            this.$store.commit('updateCrumbs', [
                {
                    link: `/strategies/${this.strategyType.val}`,
                    text: 'ИИС и Доверительное управление',
                },
                {
                    link: `/strategies/${this.strategyType.val}`,
                    text: `Стратегии ${this.strategyType.text}`,
                },
                {
                    link: `/strategies/${this.strategyType.val}/${this.strategyBuy.webSiteID}`,
                    text: this.strategyBuy.strategyName.replace('ИИС ', 'Стратегия '),
                },
                {
                    link: '',
                    text: `Перевод денежных средств`,
                },
            ]);
        } else {
            this.$router.push('/strategies/iis');
        }

        if (this.storeSrategyById()) {
            if (this.strategyBuy.sfp) {
                let storeOpFund = this.$store.state.funds.operations.fund;
                let amountMin = this.strategyBuy.firstContract ? this.strategyBuy.sfp.minSumm.toString() : this.strategyBuy.sfp.addSumm.toString();
                storeOpFund && storeOpFund.amount ? this.amount = storeOpFund.amount : this.amount = this.amount_min;
                this.order = this.strategyContracts[0];
                await this.onCheckMinAmount();
                axios.get(`/amcontracts/docs?cid=${this.strategyContracts[0] && this.strategyContracts[0].id}`).then(({ data }) => {});
            }

        } else {
            this.order = '';
        }

        this.$root.$on('iisDuSendContract', ({ data, method }) => {
            this.order = this.strategyContracts[this.strategyContracts.length - 1];
            if (!this.order) return;
            this.changeOrder().then(() => {
                this.$store.commit('buffering', false);
                this.pay(method);
            });
        });
    },

    beforeRouteLeave(to, from, next) {
        if (to.path == '/strategies/operations/buy/approve') return next();

        if (!this.$store.state.popupConfirmOff) {
            this.$store.dispatch('confirm').then(answer => {
                if (answer) {
                    return next();
                } else {
                    window.events.$emit('close_popup');
                }
            });
        } else {
            next();
        }
    },

    methods: {
        async changeOrder() {
            await this.onCheckMinAmount();
            this.$store.commit('funds/updateOperation', {
                path: 'fund.number',
                data: this.order.pifNumber,
            });
            return this.setFund();
        },

        getError(field) {
            return this.errors.items.find(item => item.field == field);
        },

        changeInput() {
            let value = this.amount;
            value = value.replace(/\D/g, '');
            let valueP = '0';

            if (value.length == 16) {
                this.amountT = this.amount;
            } else if (value.length >= 17) {
                this.amount = this.amountT;
            }
        },

        styleHidden(value) {
            if (value) {
                value = value.replace(/\D/g, '');
                return value == 0;
            }
        },

        setFund() {
            let operations = this.$store.state.funds.operations;
            this.selected_fund = operations.fund;
            let fund = this.strategyBuy;
            return new Promise(resolve => {
                if (fund) {
                    this.buffering = true;
                    axios.get(`/AmAssets`).then(({ data: applications }) => {
                        applications = applications.filter(app => app.contractID == this.order.id);
                        this.application = applications[applications.length - 1];
                        resolve(this.application);
                    });
                }
                if (this.selected_fund.amount) {
                    this.amount = this.selected_fund.amount.toLocaleString('ru-RU', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    });
                }
                this.buffering = false;
            });
        },

        onCodeConfirmed() {
            window.events.$emit('close_popup');

            if (!this.$store.state.funds.operations.fund.application) {
                axios.get('/apps/allapps').then(({ data }) => {
                    // let application = data.find(item => item.applicationId == this.$store.state.funds.operations.fund.applicationID);
                    // this.order = {
                    //     applicationNumber: application.number
                    // }

                    // this.$store.commit('funds/updateOperation', {
                    //     path: 'fund.application',
                    //     data: application
                    // });
                });
            }
        },

        async onCheckMinAmount() {
            const setMinSum = () => {
                this.amount_min = this.strategyBuy.sfp.minSumm.toString();
                this.amount = this.amount_min;
            };

            const setAddSum = () => {
                this.amount_min = this.strategyBuy.sfp.addSumm.toString();
                this.amount = this.amount_min;
            };

            try {
                const allPays = await axios.get('payments/allpayed').then(({ data }) => data);
                if (!allPays || !allPays.length) {
                    return setMinSum();
                }

                if (!this.order && typeof this.order !== 'object') {
                    return setMinSum();
                }

                const findLastStrategyPayByOrderNumber = allPays.find(item => {
                    // Задавал вопрос насколько корректно по подстроке искать. Бекендеры сказали что корректно
                    return item.orderReason && item.orderReason.includes(this.order.number) && item.status === 3;
                });

                if (findLastStrategyPayByOrderNumber) {
                    return setAddSum();
                }

                setMinSum();
            } catch (e) {
                flash([e.message], 'error');
                setMinSum();
            }
        },
    },

    computed: {
        strategyContracts() {
            const contracts = this.storeSrategyById().contract ? this.storeSrategyById().contract.filter(contract => contract.canBuyFromLKK == 1) : [];
            return _.sortBy(contracts, ['pifID']);
        },

        strategyBuy() {
            return this.$store.state.funds.operations.fund ? this.$store.state.funds.operations.fund.params : '';
        },

        tollTipShow() {
            let value = this.amount ? this.amount : '0';
            value = value.replace(/\D/g, '');
            return (value > 0 && value < this.amount_min);
        },
    },

};
</script>

<style lang="scss" scoped>
    .strategy-buy {
        .g-col-FPP_NUM {
            .control__field {
                max-width: 100%;
            }
        }
    }
</style>


