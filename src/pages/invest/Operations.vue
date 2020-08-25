<template lang="pug">
    invest-nav
        article.content
            div(:class="{'bug-ie': loaded}")
            h1.g-hide_xs Операции с паями
            .case-table-operations(ref="totalWrap")
                table.case-table(v-show="loaded")
                    caption.case-table__title ПИФы
                    thead
                        tr
                            th.case-table__th-name Наименование фонда
                            th Количество
                            th Доходность#[br]за год*
                            th Текущая#[br]стоимость пая*
                            th: .g-ta_c Сумма
                            th: .g-ta_c.g-ml_4_m.g-ml_0_md Операция
                    tbody
                        tr.table_values(v-for="(fund, index) in funds" :key="index" :class="{'case-table__in-case': fund.in_case}")
                            td(title="Наименование фонда")
                                router-link(:class="{'g-fw_5': checkFund(fund)}" :to="`/funds/${fund.webSiteId}`" tag="span").td__name.g-clr_pr
                                    span.g-hide_xs УРАЛСИБ
                                    br
                                    span(v-html="fund.description.replace('УРАЛСИБ ', '')")
                            td(title="Количество").g-ws_nw.case-table__in-case-td-text
                                div(v-if="fund.in_case" v-html="fund.total + ' шт'")
                            td(title="Доходность за год*").g-ws_nw
                                .g-clr_pr(v-html="fund.profitability + ' %'")
                            td(title="Текущая стоимость пая*").g-ws_nw
                                .g-clr_pr(v-html="fund.priceValue")
                            td.case-table__sum.g-hide-b_md(title="Сумма")
                                .tooltip-wrap.g-col_xs_12(:class="{ 'active': tollTipShow(amount[index]) }")
                                    .tooltip(v-html="`Мин. сумма 1000 ${rubleSign}`")
                                    input(type="tel" v-model="amount[index]" :class="{'show-currency' : styleHidden(amount[index]) }" @input="changeInput(amount[index], index)" v-money="money" placeholder="Введите сумму" ref="amount").field_text.t-btns-input
                                    span
                            td(title="Операция").case-table__t-btns.g-hide-b_md
                                .g-d_f.g-jc_sb.g-col_xs_12
                                    button.btn.btn_primary.btn_block(@click="fundOperation('buy', fund)") Купить
                                    button(:disabled="!fund.allowExchange" @click="fundOperation('change', fund)").btn.btn_primary.btn_block.g-ml_1.g-mr_1.g-ml_0_xs.g-mr_0_xs  Обменять
                                    button(:disabled="!fund.allowSell" @click="fundOperation('repay', fund)").btn.btn_primary.btn_block  Погасить
                    tfoot.case-table__total#js-case-table__total(
                        v-show="showPanel"
                        ref="total"
                    )
                        tr
                            td
                            td
                            td
                            td.g-hidden-b.case-table__t-text
                                div.g-clr_wh.g-fw_5 Итого:
                            td.g-hidden-b.case-table__sum: input(disabled type="text" style="opacity:1" :class="{'field_text-buy_d': disableBuyBtn}" :value="multipleOperation.total").field_text.t-btns-input
                            td.case-table__t-btns.g-hidden-b
                                .g-d_f.g-jc_sb.g-col_xs_12
                                    button.btn.btn_rare.btn_block(:class="{'btn_primary-buy': disableBuyBtn}" :disabled="disableBuyBtn" @click="multipleOperations('buy')")
                                        | Купить
                                        span.count(v-html="multipleOperation.buy")
                                    template(v-if="0")
                                        button.btn.btn_rare.btn_block.g-ml_1.g-mr_1.g-ml_0_xs.g-mr_0_xs(:disabled="!multipleOperation.change")
                                            | Обменять
                                            span.count(v-if="multipleOperation.change" v-html="multipleOperation.change")
                                        button.btn.btn_rare.btn_block(:disabled="!multipleOperation.sell")
                                            |  Погасить
                                            span.count(v-if="multipleOperation.sell" v-html="multipleOperation.sell")
                .spinner(v-show="!loaded")
            p.g-mt_6.g-col_8
                small.text-note(v-text="disclaimerTextOperations")
</template>
<script>
    import moment from 'moment';
    import {Money, VMoney} from 'v-money'
    import InvestNav from './InvestNav';
    import { confirmPersonalData } from '../../guards';

    export default {
        components: { InvestNav, Money},
        directives: { money: VMoney },
        beforeRouteEnter: confirmPersonalData,
        data() {
            return {
                disclaimerTextOperations: '',
                funds: [],
                amount: {},
                amountT: {},
                selected_funds: [],
                loaded: false,
                amountQuery:false,
                disableBuyBtn: true,
                money: {
                    decimal: ',',
                    thousands: ' ',
                    prefix: '',
                    suffix: '\u20BD',
                    precision: 0,
                    masked: false
                }
            }
        },
        watch: {
            checkUrlForConstructor(val){
                if(this.amountQuery) {
                    val.forEach((item,index)=>{
                        if(this.amountQuery.hasOwnProperty(item.webSiteId)) {
                            this.$set(this.amount, index, this.amountQuery[item.webSiteId].toString())
                        }

                    })
                    this.amountQuery=false;
                }

            },
            allFunds(val) {
                this.formatFunds(val);
            },
            funds() {
                this.loaded = true;
                setTimeout(() => this.applyNumericMask(), 50);
            },
            amount: {
                handler(val) {
                    this.selected_funds = [];
                    let disableBtn = true
                    let disableArr = []
                    let indx
                    let valIndx

                    Object.keys(val).forEach(i => {
                        if (val[i]) {
                            if(val[i].replace(/\D/g, "") > 0) {
                                this.selected_funds.push(this.funds[i]);
                                disableArr.push(val[i])
                            }

                        }
                        else {
                            delete val[i];
                        }

                        indx = i
                        valIndx = val
                    });

                    disableBtn = disableArr.map(function(item){
                        return item.length >= 5
                    });
                    disableBtn = _.includes(disableBtn, false)
                    this.disableBuyBtn = disableBtn
                },
                deep: true

            },
            showPanel(val) {
                if (val) this.onScroll();
            }
        },
        created() {
            this.getTextDisclaimer();
            this.$store.commit('updateCrumbs', [
                { link: '/funds', text: 'Паевые инвестиционные фонды' }
            ]);

            if (this.allFunds.length) this.formatFunds(this.allFunds);

            this.$store.commit('funds/clearOperations');

            if(localStorage.getItem('amountQuery')) {
                this.amountQuery =  JSON.parse(localStorage.getItem('amountQuery'))
                localStorage.removeItem('amountQuery')

            }

        },
        mounted() {
            document.querySelector('#app').onscroll = () => this.onScroll();
            this.applyNumericMask();
        },
        methods: {
            getTextDisclaimer() {
                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'Operations',
                    }
                }).then(({data}) => {

                    this.disclaimerTextOperations = data.outText;

                });
            },
            changeInput(value, i) {
                let valueL = value.replace(/\D/g, "")
                let valueP = '0'

                if(valueL.length == 16) {
                   this.amountT[i] = this.amount[i]
                } else if (valueL.length >= 17) {
                    this.amount[i] = this.amountT[i]
                }
            },
            tollTipShow(value) {
                if(value) {
                    let valueR = value.replace(/\D/g, "")
                    return (valueR > 0 && valueR < 1000)
                }
            },
            styleHidden(value) {
                if(value) {
                    value = value.replace(/\D/g, "")
                    return value == 0
                }
            },
            formatFunds(val) {
                axios.get('/reports/AssetsEstimate').then(({data}) => {
                    let funds = _.cloneDeep(val);
                    funds = funds.map((item,index) => {
                        item.total = 0;

                        if (item.in_case) data.filter(info_item => info_item.prtf == item.description).forEach(info_item => item.total += info_item.outqnt);

                        item.total = item.total.toLocaleString('ru-RU', {maximumFractionDigits: 10});
                        item.priceValue = this.formatCurrency(item.priceValue);
                        item.profitability = item.profitability.toLocaleString('ru-RU', {maximumFractionDigits: 2});


                        return item;
                    });
                    this.funds = funds;

                });
            },
            checkFund(fund) {
                return this.selected_funds.indexOf(fund) > -1;
            },
            fundOperation(type, fund) {
                let data = { funds: [] };
                let new_fund = JSON.parse(JSON.stringify(fund));

                if (this.amount[this.funds.indexOf(fund)]) new_fund.amount = this.amount[this.funds.indexOf(fund)].toNumber();

                new_fund.description = new_fund.description.replace('<br />', ' ');
                data.funds.push(new_fund);

                this.$store.commit('funds/setOperation', data);

                if (type == 'buy')  {
                    if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_OPERATIONS_TABLE_ROW');}//яндекс цель купить
                    this.$router.push('/operations/buy');
                }
                else if (type == 'change') this.$router.push({path: '/operations/change', query: { fund: fund.webSiteId }});
                else if (type == 'repay') this.$router.push({path: '/operations/repay', query: { fund: fund.webSiteId }});
            },
            multipleOperations(type) {
                let data = { funds: [] };

                this.selected_funds.forEach(item => {
                    item.description = item.description.replace('&nbsp;<br />', ' ');
                    item.paid = false;

                    data.funds.push(item);
                });


                for (let i in this.amount) {
                    let fund = data.funds.find(item => item.id == this.funds[i].id);

                    if(fund) {
                        fund.amount = this.amount[i].toNumber();
                    }
                }

                data.funds = data.funds.filter(item => item.amount);
                this.$store.commit('funds/setOperation', data);

                if (type == 'buy') {
                    localStorage.removeItem('indexSlidePrintArr')
                    if(typeof yaCounter50062190 !== "undefined") yaCounter50062190.reachGoal('BTN_BUY_OPERATIONS_TOTAL');
                    this.$router.push('/operations/buy');
                }
            },
            onScroll() {
                if (!this.$refs.total) return;

                let footer = this.$refs.total.getElementsByTagName('td');
                let header = document.querySelectorAll('thead th');

                let offset_last = false;
                let elements = document.querySelectorAll('.table_values');
                if (elements.length) {
                    let last_element = elements[elements.length - 1];
                    offset_last = last_element.getBoundingClientRect().top - window.innerHeight + last_element.offsetHeight;
                }

                if (offset_last !== false && (offset_last + this.$refs.total.offsetHeight) > 0) {
                    this.$refs.total.classList.add("case-table__total_fix");
                    this.$refs.totalWrap.classList.add("case-table-operations_fix");
                    for (let i = 0; i < header.length; i++) footer[i].style.width = header[i].offsetWidth + 'px'
                } else if (offset_last !== false && (offset_last + this.$refs.total.offsetHeight) <= 0) {
                    this.$refs.total.classList.remove("case-table__total_fix");
                    this.$refs.totalWrap.classList.remove("case-table-operations_fix");
                    for (let i = 0; i < footer.length; i++) footer[i].removeAttribute('style');
                }
            }
        },
        computed: {
            checkUrlForConstructor(){
              return this.funds

            },
            allFunds() {
                return _.cloneDeep(this.$store.state.funds.items).sort((a, b) => {
                    if (a.in_case < b.in_case) return 1;
                    if (a.in_case > b.in_case) return -1;

                    if (a.profitability < b.profitability) return 1;
                    if (a.profitability > b.profitability) return -1;

                    return 0;

                });
            },
            multipleOperation() {
                let data = {
                    total: 0,
                    buy: 0,
                    change: 0,
                    sell: 0
                };
                Object.values(this.amount).forEach(item => data.total += item.toNumber());
                this.selected_funds.forEach(item => {
                    data.buy++;

                    if (item.in_case) {
                        data.change++;
                        data.sell++;
                    }
                });

                data.total = this.formatCurrency(data.total);

                return data;
            },
            showPanel() {
                return this.multipleOperation.buy > 1 || this.multipleOperation.change > 1 || this.multipleOperation.sell > 1;
            },
            disclaimerDate() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        }
    }
</script>
<style lang="scss">

.case-table-operations_fix .case-table:after {content:'';height:120px;}


</style>
