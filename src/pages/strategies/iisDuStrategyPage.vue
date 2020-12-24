<template lang="pug">
    article.content.strategy-page.spinner-fp__wrapper
        div.spinner-fp.spinner(:class="{'spinner-show': strategyLoad}")
        section.page-section.strategy-page__section
            .g-row
                .g-col.g-col_md_6.g-mb_2_xs
                    h1.strategy-page__title
                        svg-inline(:src="getSrcStrategiesIcon(rsStrategyID, rStrategyType)")
                        span(v-html="strategyName.length > 1 ? strategyName.replace('', '') : strategyName ")
                    template(v-if="!strategyOld.iis && !strategyOld.du")
                        h2 Условия*
                        p #[strong Доходность#[sup 1], % годовых ~ {{strategyParam.expectProfitAdd}} {{strategy.expectProfit}}%{{ strategyParam.currency !== 'Рубли РФ' ? '*' : '' }}]
                        p #[strong Допустимый риск]#[sup 2] - {{strategy.risk}}
                        p #[strong Инвестиционная стратегия] - {{strategyParam.investStrategy.replace(/\.|;/g,' ')}}
                        p #[strong Инвестиционная цель] - {{strategyParam.investAim.replace(/\.|;/g,' ')}}
                        p #[strong Объекты инвестирования] - {{strategyParam.investObjects.replace(/\.|;/g,' ')}}
                        p #[strong Для кого] - {{strategyParam.targets.replace(/\.|;/g,'')}}
                        p #[strong Рекомендуемый срок инвестирования - {{strategyParam.investPeriod.replace(/\.|;/g,' ')}}]
                        p(v-if="buttonVisible")
                            span(
                                @click="strategyOperation(rsStrategyID)",
                                class="btn btn_primary g-mr_2 g-mr_0_xs g-col_md_a g-col_xs_12",
                                :class="{btn_disabled: buttonDisabledIIS.val && rStrategyType == 'iis'}"
                            ) {{ buttonText }}
                    template(v-else)
                        h2 Текущие показатели*
                        div.g-mb_4
                            .strategy-page__conditions-row.g-row
                                .g-col.g-col_xs_7 Текущая сумма активов:
                                .g-col.g-col_xs_5.strategy-page__conditions-val(:class="{'spinner': !startContract.amount}")
                                    strong(v-html="startContract.amount")
                            .strategy-page__conditions-row.g-row
                                .g-col.g-col_xs_7 Текущая общая доходность:
                                .g-col.g-col_xs_5.strategy-page__conditions-val(:class="{'spinner': !startContract.yield}")
                                    strong(v-html="startContract.yield")
                        p #[strong Рекомендуемый срок инвестирования - {{strategyParam.investPeriod}}]
                        p #[strong Инвестиционная стратегия] - {{strategyParam.investStrategy.replace(/\.|;/g,' ')}}
                        p #[strong Инвестиционная цель] - {{strategyParam.investAim.replace(/\.|;/g,' ')}}
                        p #[strong Объекты инвестирования] - {{strategyParam.investObjects.replace(/\.|;/g,' ')}}
                        p.g-mt_4(v-if="!strategyOld.du")
                            router-link(
                                @click.native="strategyOperation(rsStrategyID)",
                                :to="{name:'iisDuStrategyBuy'}",
                                class="btn btn_primary g-mr_2 g-mr_0_xs g-mb_0_xs g-col_md_a g-col_xs_12"
                            ) Пополнить
                            router-link(
                                :to="{name:'iisDuCancel'}",
                                class="btn btn_secondary g-col_md_a g-col_xs_12 g-mb_0_xs",
                                @click.prevent="showPopup"
                            ) Расторгнуть договор

                .g-col.g-col_md_6.g-mt_3_xs
                    div.g-mb_4.strategy-page__head(v-if="strategyOld.iis || strategyOld.du")
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_xs_7 Дата открытия счёта:
                            .g-col.g-col_xs_5.strategy-page__conditions-val(:class="{'spinner': indicators[0] === false}") {{formatDate(indicators[0])}}
                        .strategy-page__conditions-row.g-row.g-mb_0
                            .g-col.g-col_xs_7 Сумма первоначального взноса:
                            .g-col.g-col_xs_5.strategy-page__conditions-val(:class="{'spinner': indicators[1] === false}", v-html="formatCurrency(indicators[1], true)")
                    .strategy-page__structure
                        h2.strategy-page__structure-title(v-if="rStrategyType == 'du'") Структура совокупного портфеля#[br] стратегии на дату {{ date }} г.
                        h2.strategy-page__structure-title(v-else)  Структура модельного/совокупного #[br] портфеля на дату {{ date }} г.
                        .g-tabs
                            ul.strategy-page__tabs
                                li.strategy-page__tab(:class="{active: selected_tab == 1}", @click.prevent="changeSelectedTab(1)") По инструментам
                                li.strategy-page__tab(:class="{active: selected_tab == 2}", @click.prevent="changeSelectedTab(2)") По отраслям
                            .strategy-page__structure-box(:class="{spinner:!loaded.fund_structure}")
                                div.chart-structure-case(ref="pie_chart" v-show="loaded.fund_structure")
            .g-row(v-if="strategyOld.du || strategyOld.iis")
                .g-col.g-col_lg_6
                    p.g-mt_4.du-btns
                        span(
                            @click="strategyOperation(rsStrategyID)",
                            class="btn btn_primary g-mr_2 g-mr_0_xs g-mb_2_xs g-col_md_a g-col_xs_12"
                        ) Пополнить
                        router-link(
                            v-if="rStrategyType === 'du'"
                            :to="{name:'duWithdrawal'}",
                            class="btn btn_primary g-mr_2 g-mr_0_xs g-mb_2_xs g-col_md_a g-col_xs_12"
                        ) Частичный вывод
                        router-link(
                            :to="{name:'iisDuCancel'}",
                            class="btn btn_secondary g-col_md_a g-col_xs_12"
                        ) Расторгнуть договор
        section.page-section.strategy-page__section
            .g-row
                .g-col.g-col_lg_6
                    h2 Условия
                    .strategy-page__conditions
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Минимальная сумма инвестиций#[sup(v-if="rsStrategyID=='s45'") 3]:
                            .g-col.g-col_md_5.strategy-page__conditions-val
                                strong {{formatCurrency(strategyParam.minSumm, true, strategyParam.currency)}}
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Максимальная сумма инвестиций, ежегодно:
                            .g-col.g-col_md_5.strategy-page__conditions-val
                                strong {{strategyParam.maxSumm == null ? 'Без ограничений' :formatCurrency(strategyParam.maxSumm, true, strategyParam.currency)}}
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Валюта:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{strategyParam.currency}}]
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Рекомендуемый срок размещения:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{strategyParam.placePeriod}}]
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Дополнительные взносы:
                            .g-col.g-col_md_5.strategy-page__conditions-val(v-html="'<strong>от ' + formatCurrency(strategyParam.addSumm, true, strategyParam.currency) + '</strong>'")
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Частичное снятие:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{strategyParam.partialWithdrawal}}]
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7(v-if="rStrategyType == 'du'") Вознаграждение, взимаемое при передаче активов в управление:
                            .g-col.g-col_md_7(v-else) Вознаграждение за ведение счета, % от взноса:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{strategyParam.maintainCommission}}%]
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7(v-if="rStrategyType == 'du'") Вознаграждение за управление счетом, % годовых от суммы активов:
                            .g-col.g-col_md_7(v-else) Вознаграждение за управление счетом, % годовых от суммы активов:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{strategyParam.manageCommission}}%]
                        .strategy-page__conditions-row.g-row(v-if="rStrategyType == 'du' && strategyParam.successPercent !== undefined && strategyParam.successPercent !== null")
                            .g-col.g-col_md_7 Вознаграждение за успех, % от прироста портфеля:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{strategyParam.successPercent}}]
                        .strategy-page__conditions-row.g-row
                            .g-col.g-col_md_7 Комиссия при досрочном расторжении#[sup(v-if="rsStrategyID=='s45'") 4]:
                            .g-col.g-col_md_5.strategy-page__conditions-val #[strong {{ strategyParam.terminationCommission ? `${strategyParam.terminationCommission}%` : strategyParam.termCmsText ? strategyParam.termCmsText : 'Не предусмотрено' }}]
                        .strategy-page__conditions-row.g-row(v-if="rStrategyType == 'du'")
                        .strategy-page__conditions-row
                            span С подробной информацией об условиях инвестирования Вы можете ознакомиться #[a(target="_blank", :href="strategyLinkMore") на сайте]
                        //- hr.strategy-page__conditions-hr

                .g-col.g-col_lg_6
                    .strategy-page__manager.g-mb_4
                        .g-f_l.g-mr_2.strategy-manager__img
                            img(:src="strategyParam.managerPicture" :alt="strategy.strategyManager" class="")
                        p(v-html="strategy.strategyManager")
                        p {{ managerPost }}
                        p(v-html="strategy.strategyDesc")

        p(v-if="!strategyOld.iis && !strategyOld.du")
            span(v-if="false", @click="strategyOperation(rsStrategyID)", class="btn btn_primary g-mr_2 g-mr_0_xs g-mb_2 g-col_md_a g-col_xs_12") Оформить договор
            button(class="btn btn_secondary g-col_md_a g-col_xs_12" @click.prevent="showPopup") Помощь консультанта
        .g-col_md_10.g-mt_4(v-if="!strategyOld.iis && !strategyOld.du")
            p: small.text-note #[sup 1] Доходность – прогнозируемая доходность, которая не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента. Рассчитывается исходя из текущего совокупного состава портфеля и может быть скорректирована управляющим.
            p: small.text-note #[sup 2] Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.
            p(v-if="rsStrategyID=='s45'"): small.text-note #[sup 3] Минимальная сумма инвестиций доступна только при оформлении в Личном кабинете.
            p(v-if="rsStrategyID=='s45'"): small.text-note #[sup 4] При выводе активов до истечения первого года действия Договора комиссия рассчитывается от совокупной рыночной стоимости портфеля на дату расторжения, уменьшенной на сумму начисленного Вознаграждения за управление.
            
            p: small.text-note(v-if="rStrategyType === 'iis' && strategyParam.currency !== 'Рубли РФ'") *Прогнозируемая доходность указана в долларах.
            p: small.text-note(v-if="rStrategyType === 'du' && strategyParam.currency !== 'Рубли РФ'") *Прогнозируемая доходность указана в валюте стратегии.
        .g-col_md_10
            p
                ui-disclaimer.text-note(tag="small")

</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

import { caseStructure, iisDU } from '../../mixins';
import { DU_DISABLED_BUY } from '../../constatnts';
import UiDisclaimer from '../../components/ui/UiDisclaimer';

export default {
    components: { UiDisclaimer },
    mixins: [caseStructure, iisDU],
    data() {
        return {
            strategyLoad: true,
            strategy: {
                expectProfit: '',
                expectProfitDisc: '',
                expectProfitText: '',
                managerPicture: '',
                paramsField: '',
                promoField: '',
                risk: '',
                riskDisc: '',
                strategyDesc: '',
                strategyHref: '',
                strategyManager: '',
                strategyShortDesc: ''
            },
            strategyParam: {
                addSumm: '',
                currency: '',
                expectProfit: '',
                expectProfitDisc: '',
                investAim: '',
                investObjects: '',
                investPeriod: '',
                investStrategy: '',
                maintainCommission: '',
                manageCommission: '',
                managerPicture: '',
                maxSumm: '',
                minSumm: '',
                partialWithdrawal: '',
                placePeriod: '',
                risk: '',
                riskDisc: '',
                strategyDesc: '',
                strategyHref: '',
                strategyManager: '',
                targets: ''
            },
            strategyName: '',
            strategyOld: {
                iis: '',
                du: ''
            },
            selected_tab: 1,
            selected_fund_pie_chart: [],
            selected_fund_pie_chart_BUFFER: [],
            pie_chart_height: 280,
            loaded: {
                fund_chart: false,
                fund_structure: false
            },
            startContract: {
                amount: '',
                yield: ''
            },
            indicators: [false, false],
            // date: null,
        };
    },
    created() {
        this.getIisDuPieData();
        this.checkStrategyContractInCase();
        this.buffering = true;
        //this.date = moment().format('DD.MM.YYYY')
    },
    methods: {
        getIisDuPieData() {
            let startdate = moment().subtract(2, 'days').format('YYYY-MM-DD');
            let params = (type) => {
                return {
                    params: {
                        dat: startdate,
                        sid: this.rsStrategyID,
                        ctype: type
                    }
                };
            };
            axios.all([
                axios.get('/am/getDUPortfolioStructure', params(2)),
                axios.get('/am/getDUPortfolioStructure', params(1))
            ]).then(
                axios.spread(({ data: chart_1 }, { data: chart_2 }) => {
                    this.selected_fund_pie_chart_BUFFER[0] = chart_1.map(elm => ({
                        NAME: elm.sName.toLowerCase().charAt(0).toUpperCase() + elm.sName.toLowerCase().slice(1),
                        VAL: elm.prct
                    }));
                    this.selected_fund_pie_chart_BUFFER[1] = chart_2.map(elm => ({
                        NAME: elm.sName.toLowerCase().charAt(0).toUpperCase() + elm.sName.toLowerCase().slice(1),
                        VAL: elm.prct
                    }));
                    this.selected_fund_pie_chart = this.selected_fund_pie_chart_BUFFER[0];
                    this.initPieChart();
                    this.buffering = false;
                })
            );
        },
        changeSelectedTab(tab) {
            this.selected_tab = tab;
            this.selected_fund_pie_chart = this.selected_fund_pie_chart_BUFFER[tab - 1];
            this.initPieChart();
        },
        showPopup(type) {
            window.events.$emit('show_popup', ['contact', { type: type }]);
        },
        getStrategy() {
            if (this.strategyOld.iis || this.strategyOld.du) {
                axios.all([
                    axios.get('/amcontracts/getDUAllContracts'),
                    axios.get('/reports/AssetsStruct')
                ]).then(axios.spread(({ data: contracts }, { data: estimateDU }) => {
                    const contractsByStrategy = [...contracts].filter(item => item.stratID === this.storeSrategyById().id);
                    this.indicators[0] = contractsByStrategy.length ? contractsByStrategy[0].beginDate : '';
                    this.indicators[1] = contractsByStrategy.length ? contractsByStrategy[0].firstSum : 0;

                    estimateDU.map(item => {
                        if (item.smallIcon && item.smallIcon.includes('.')) {
                            item.smallIcon = item.smallIcon.toLowerCase().match(/[a-z-\.]*$/)[0].replace('-s.jpg', '');
                        }
                        return item;
                    });

                    let str = estimateDU.filter(item => {
                        return item.smallIcon && item.smallIcon.toLocaleLowerCase() == this.rsStrategyID.toLowerCase();
                    });

                    if (!str || str && str.length === 0) {
                        this.startContract.amount = this.formatCurrency(0);
                        this.startContract.yield = '0%';
                        return;
                    }
                    ;

                    let amountData = str.map(({ outamnt }) => outamnt).filter(item => item);
                    let yieldData = str.map(({ profiT_2 }) => profiT_2).filter(item => item);
                    this.startContract.amount = amountData && amountData.length ? this.formatCurrency(amountData.reduce((a, b) => a + b, 0)) : this.formatCurrency(0);
                    this.startContract.yield = yieldData && yieldData.length ? yieldData.reduce((a, b) => a + b, 0).toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + '%' : 0 + '%';
                }));
            }
            axios.all([
                axios(`/invest/getbyid?id=${this.rsStrategyID}`),
                axios(`/invest/getbyidparams?id=${this.rsStrategyID}`)
            ]).then(axios.spread((getbyid, getbyidparams) => {
                this.strategyName = getbyid.data.strategyName.replace('«', '').replace('»', '');
                this.strategy = getbyid.data.sff;
                this.strategyParam = getbyidparams.data.sfp;
                this.strategyLoad = false;
                this.$store.commit('updateCrumbs', [
                    {
                        link: this.$route.params.selectedStrategy == 'iis' ? '/strategies/iis' : '/strategies/du',
                        text: 'ИИС и Доверительное управление'
                    },
                    {
                        link: this.$route.params.selectedStrategy == 'iis' ? '/strategies/iis' : '/strategies/du',
                        text: this.$route.params.selectedStrategy == 'iis' ? 'Стратегии ИИС' : 'Стратегии ДУ'
                    },
                    {
                        link: '',
                        text: this.strategyName.replace('ИИС ', 'Стратегия ')
                    }
                ]);
            }));
        },

        checkStrategyContractInCase() {
            if (!this.$store.state.iisDU.list.webSiteID) {
                this.$store.dispatch('iisDU/iisDuGetList').then((response) => {
                    this.strategyOld.iis = this.storeSrategyById().contract[0];
                    this.strategyOld.du = this.storeSrategyById().contract[0];
                    this.getStrategy();
                });
            } else {
                this.strategyOld.iis = this.storeSrategyById().contract[0];
                this.strategyOld.du = this.storeSrategyById().contract[0];
                this.getStrategy();
            }
        }
    },
    computed: {
        ...mapState('iisDU', {
            iisDUList: 'list'
        }),

        managerPost() {
            if (this.strategy.strategyManager.includes('Борис Краснов')) {
                return 'Старший портфельный менеджер по работе с долговыми инструментами';
            }
            if (this.strategy.strategyManager.includes('Руслан Николенко')) {
                return 'Портфельный менеджер по работе с долговыми инструментами';
            }

            return 'Начальник Управления по работе с акциями и производными инструментами';
        },
        
        date() {
            try {
                return this.$store.state.user.state.portfolioDate;
            } catch (e) {
                return moment().format('DD.MM.YYYY');
            }
        },

        fund() {
            return this.iisDUList.find(product => product.webSiteID === this.rsStrategyID);
        },

        buttonVisible() {
            return this.fund && this.fund.status == 1;
        },

        buttonText() {
            return this.duDisabledBuy ? "Получить консультацию" : "Оформить договор";
        },

        duDisabledBuy() {
            return this.fund && Boolean(DU_DISABLED_BUY.find(duId => duId === this.fund.id));
        },

        strategyLinkMore() {
            let link = this.strategyParam.strategyHref;
            link = 'https://www.uralsib-am.ru/about/disclosure/cb-info/';
            if (this.rStrategyType == 'du') {
                link = 'https://www.uralsib-am.ru/investors/private/du/';
            }

            return link;
        }
    }
};
</script>

<style lang="scss" scoped>
    .strategy {
        &-page {
            &__section {
                margin-top: 4em;

                &:first-of-type {
                    margin-top: 1em;
                }
            }

            &__conditions {
                &-row {
                    .spinner {
                        position: relative;

                        &:before {
                            left: auto;
                            right: 20px;
                            width: 25px;
                            height: 25px;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                        }

                        &:after {
                            content: '';
                            display: block;
                            position: absolute;
                            left: 0;
                            top: -5px;
                            bottom: -5px;
                            right: 0;
                            background-color: #fff;
                        }
                    }
                }
            }
        }

        &-manager__img {
            display: flex;
            align-items: center;
            max-width: 140px;

            img {
                max-width: 140px;
                border-radius: 10px;
                overflow: hidden;
            }
        }
    }
</style>
