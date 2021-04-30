<template lang="pug">
    // Формирование документов
    form(v-if="!signed")
        div(:class="{'spinner':getLoaderOrders}")
        div(v-if="!getLoaderOrders")
            fieldset
                .g-row
                    .control.g-col.g-col_lg_4.g-col_md_5
                        .control__label-top
                            label(for="FPP_name") Наименование фонда
                        .control__field
                            v-select( :loading="loadingSelect"  placeholder="Выберите фонд" v-validate:fund="'required'" name="fund" :class="{invalid_force: errors.has('fund')}" v-model="fund" key="id" label="description" :options="fundList").field-select
                                span(slot="no-options")
                    .control.g-col.g-col_lg_4.g-col_md_4.g-col-FPP_NUM.g-maw_n_xs
                        .control__field
                            .control__label-top
                                label(for="FPP_NUM") Номер заявки
                            .select-plus.g-col_xs_12(v-if="ordersByFund.length != 0")
                                button(@click.prevent="newAccount" type="button" v-if="order").btn.btn_plus.tooltip-wrap
                                    span.g-icon.g-icon_plus
                                    span.tooltip.g-ws_nw Добавить новый номер счёта в реестре
                                v-select(v-model="order" key="id" label="number" :options="ordersByFund" v-if="ordersByFund.length > 1 || (ordersByFund.length != 0 && !order)" placeholder="Будет присвоен автоматически").field-select#FPP_NUM
                                    span(slot="no-options")
                                input(type="text" :value="order ? order.number : ''" placeholder="Будет присвоен автоматически" style="opacity: 1;" disabled v-else).field_text#FPP_NUM
                            div(:class="{'spinner spinner_input':getLoaderOrders}"  v-else)
                                input(type="text", name="num", id="FPP_NUM", placeholder="Будет присвоен автоматически" style="opacity: 1;" disabled).field_text
                    .control.g-col.g-col_lg_2.g-col_md_3
                        .control__label-top
                            label(for="FPP_SUM") Введите сумму
                        .tooltip-wrap(:class="{active: tollTipShow}")
                            .tooltip(v-html="`Минимальная сумма 1000 ${rubleSign}`")
                            input(type="text", v-model="amount" name="sum" v-validate="'required|mink'" @input="changeInput()" v-money="money" :class="{'show-currency' : styleHidden(amount), invalid_force: getError('sum') }").g-maw_n_xs.field_text.FPP_SUM#FPP_SUM
                            span
                    .control.control_empty
            fieldset.control(v-show="!order")
                .control__field
                    .control
                        label.checkbox(:class="{'checkbox_error': errors.has('open_account')}")
                            input(type="checkbox" v-validate="{required: !order }" v-model="open_account" name="open_account" id="FPP_OPEN_ACCOUNT" )
                            span.checkbox__text Прошу открыть мне лицевой счёт в реестре на основании сформированных документов
            .control.g-col_md_8
                button(type="submit" :class="{btn_secondary: singButtonDisabled, btn_primary: !singButtonDisabled}" @click.prevent="sign" v-html="order ? 'Купить' : 'Подписать'").btn.g-col_md_3

    // Способ покупки
    form(v-else)
        .control
            p
                span(v-if="order && order.applicationNumber") Вы подписали заявки на приобретение паев и открытие лицевого счёта в реестре.
        fieldset.control(style="max-width:600px")
            .g-row.g-mb_2.g-mb_2_xs
                h3.g-col.g-col_md_5.g-mb_0 Наименование фонда
                p.g-col.g-col_md_7(v-html="fund.description")
            .g-row.g-mb_2.g-mb_2_xs
                h3.g-col.g-col_md_5.g-mb_0 Номер заявки
                p.g-col.g-col_md_7(v-html="order ? (order.number || order.applicationNumber) : ''")
            .g-row.g-mb_2.g-mb_2_xs
                h3.g-col.g-col_md_5.g-mb_0 Сумма
                p.g-col.g-col_md_7
                    span(v-html="formatCurrency(amount)")
            div(v-if="1")
                .g-mb_2.h3 Реквизиты фонда
                .g-row.g-mb_2
                    h4.g-col.g-col_md_5.g-mb_0 Назначение платежа:
                    .g-col.g-col_md_7
                        p(v-html="`Приобретение инвестиционных паев ОПИФ рыночных финансовых инструментов «${$store.state.funds.operations.fund.description}» <br> по заявке ${order ? (order.number || order.applicationNumber) : ''}`")
                        p Плательщик #[span(v-html="$store.state.user.state.fullName")]. #[br] НДС не облагается
                .g-row
                    h4.g-col.g-col_md_5.g-mb_0 Получатель
                    p.g-col.g-col_md_7(v-text="fund.recipientBankTitle")
                .g-row
                    h4.g-col.g-col_md_5.g-mb_0 ИНН
                    p.g-col.g-col_md_7(v-text="fund.recipientInn")
                .g-row
                    h4.g-col.g-col_md_5.g-mb_0 БИК
                    p.g-col.g-col_md_7(v-text="fund.recipientBankBik")
                .g-row
                    h4.g-col.g-col_md_5.g-mb_0 Коррсчет
                    p.g-col.g-col_md_7(v-text="fund.recipientBankCorr")
                .g-row
                    h4.g-col.g-col_md_5.g-mb_0 Расчётный счёт
                    p.g-col.g-col_md_7(v-text="fund.recipientAccount")
                .control.control_empty
        fieldset.control
            p(v-if="isOrderLK") Надбавка к расчетной стоимости пая для заявок, оформленных в Личном кабинете #[strong не взимается]
            div(v-if="!isOrderLK").g-row.g-mb_2
                .control.g-col.g-col_lg_8
                    label.checkbox(:class="{'checkbox_error': errors.has('term2')}")
                        input(type="checkbox", v-model="term2" v-validate="'required'" name="term2")
                        .checkbox__text Надбавка к расчетной стоимости пая составит 0.5%#[br]При приобретении на сумму 3 млн руб. и более #[strong 0%]
            .g-row.g-mb_2
                .control.g-col.g-col_lg_8
                    label.checkbox(:class="{'checkbox_error': errors.has('term1')}")
                        input(type="checkbox", v-model="term1" v-validate="'required'" name="term1")
                        .checkbox__text Срок проведения операции составляет до 5(пяти) рабочих дней
            .g-row.g-mb_2
                .control.g-col.g-col_lg_8
                    label.checkbox(:class="{'checkbox_error': errors.has('correct_data')}")
                        input(type="checkbox",v-validate="'required'",  v-model="checkbox" name="correct_data", id="FPP_CORRECT_DATA" )
                        span.checkbox__text(v-html="disclaimerTextOperBuy")
        fieldset.control
            p Выберите удобный для Вас способ оплаты
            .g-row.g-row_flex
                p.g-col.g-col_lg_4.g-col_md_5(v-show="1")
                    label.radio.radio_card(@click.prevent="pay(1)")
                        input(type="radio" name="method" value="1")
                        span.radio__text
                            span.radio__bg.radio__bg_us(hidden)
                                svg-inline(src="/us_logo_small.svg")
                            span.radio__images(hidden)
                                span.radio__image.radio__image_card
                                    svg-inline(src="/us_logo_small.svg")
                            span.radio__text-wrap
                                span.radio__name БАНК УРАЛСИБ
                                small.radio__note Оплата картой


                p.g-col.g-col_lg_4.g-col_md_5(v-show="1")
                    label.radio.radio_card(@click.prevent="pay(1.1)")
                        input(type="radio" name="method" value="1")
                        span.radio__text
                            span.radio__bg.radio__bg_card(hidden)
                                svg-inline(src="/credit-card.svg")
                            span.radio__images(hidden)
                                span.radio__image.radio__image_card
                                    svg-inline(src="/credit-card.svg")
                            span.radio__text-wrap
                                span.radio__name Карта другого банка
                                small.radio__note Оплата картой
                .g-col.g-col_md_12
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



</template>
<script>
    import moment from 'moment';
    import {Money, VMoney} from 'v-money'
    import { buy} from '../../../../mixins';


    export default {
        mixins: [buy],
        directives: { money: VMoney },
        data() {
            return {

                selected_fund: {},
                money: {
                    decimal: ',',
                    thousands: ' ',
                    prefix: '',
                    suffix: '\u20BD',
                    precision: 0,
                    masked: false
                },
                amountT: '',
                order: { 
                    applicationNumber: '' 
                }
            }
        },
        created() {
            if (this.$store.state.funds.operations.funds) this.setFund();
            localStorage.removeItem('fundData');

        },
        computed: {
            loadingSelect(){
                if(this.fundList.length) return false;
                return true;
            },
            tollTipShow() {
                let value = this.amount
                value = value.replace(/\D/g, "")
                return (value > 0 && value < 1000)
            },
            isOrderLK() {
                return this.order && this.order.number.indexOf('-КК') !== -1;
            }
        },
        methods: {

            changeInput() {
                let value = this.amount
                value = value.replace(/\D/g, "")
                let valueP = '0'

                if(value.length == 16) {
                   this.amountT = this.amount
                } else if (value.length >= 17) {
                    this.amount = this.amountT
                }
            },
            styleHidden(value) {
                if(value) {
                    value = value.replace(/\D/g, "")
                    return value == 0
                }
            },
            setFund() {
                let operations = this.$store.state.funds.operations;


                this.selected_fund = operations.funds[0];

                let fund = this.$store.state.funds.items.find(item => item.id == this.selected_fund.id);

                if (fund) this.fund = fund;


                if (this.selected_fund.amount) this.amount = this.selected_fund.amount.toLocaleString('ru-RU', {minimumFractionDigits: 0, maximumFractionDigits: 0});

            },
            onCodeConfirmed() {
                window.events.$emit('close_popup');
                this.$emit('setTitle', 'Купить паи');
                this.signed = true;

                if (!this.$store.state.funds.operations.fund.application) {
                    axios.get('/apps/allapps').then(({data}) => {
                        let application = data.find(item => item.applicationId == this.$store.state.funds.operations.fund.applicationID);
                        this.order = {
                            applicationNumber: application.number
                        }

                        this.$store.commit('funds/updateOperation', {
                            path: 'fund.application',
                            data: application
                        });
                    })
                }
            }
        }
    }
</script>
<style type="scss">

</style>
