<template lang="pug">

    article.content
        pre(:style="{ display: 'none' }") {{ preparedDu }}
        .g-tabs.strategies-tabs(:class="{spinner: loading}")
            .g-tabs__header.g-mb_4.g-mb_1_xs
                a.g-tabs__btn.g-mb_2.g-mb_2_xs(:class="{active: selectedStrategy == 'iis'}" @click="clickTab('iis')") Индивидуальные #[br] инвестиционные счета (ИИС)
                a.g-tabs__btn.g-mb_2.g-mb_2_xs(:class="{active: selectedStrategy == 'du'}" @click="clickTab('du')") Стандартные стратегии #[br] доверительного управления (ДУ)
                a.g-tabs__btn.g-mb_2.g-mb_2_xs(:class="{active: selectedStrategy == 'personal'}" @click="clickTab('personal')")  Индивидуальные стратегии #[br] доверительного управления
            .g-tabs__contents.strategies-main
                .g-tabs__content(v-if="selectedStrategy == 'iis'")
                    .g-mb_4
                        p.g-mb_1 #[strong Индивидуальный инвестиционный счет] - это особый тип счета, представляющий возможность не только сохранить и приумножить деньги, но и получить дополнительный доход от государства в виде инвестиционного налогового вычета.
                        p.g-mb_0
                            span С подробной информацией по ИИС Вы можете ознакомиться #[a(target="_blank" href='https://www.uralsib-am.ru/iis') на сайте].
                        //- router-link(:to="{name:'duIis'}") Подробное описание
                    strategy-list(:funds="iisList" :showBG="true")
                .g-tabs__content(v-if="selectedStrategy == 'personal'")
                    personalStr
                form.g-tabs__content(v-if="selectedStrategy == 'du'")
                    p.g-mb_4 #[strong Разумный баланс для вложений] - Вы определяете инвестиционные цели, #[br] мы подбираем подходящие инвестиционные инструменты на основе Ваших желаний и возможностей.
                    .g-row.g-mb_0.g-row_flex.g-as_fe_md
                        .control.g-col.g-col_lg_4.g-col_md_6
                            .g-col_xs_12
                                .control__label-top.g-pl_0 Сумма инвестиций, ₽
                                .control__field
                                    v-range(ref="slider", @callback="filterDu" v-model="amount" v-bind="options" class="v-range" :min="1" :max="4")
                                        div(class="v-range__tooltip" slot="label" slot-scope="{ label, active,last,first }")
                                            span(:class="['v-range__label', { active,last,first} ]" v-text="amountRangeLabel({ label, active, last, first })")
                        .control.g-col.g-col_lg_4.g-col_md_6
                            .g-col_xs_12
                                .control__label-top.g-pl_0 Срок инвестирования
                                .control__field
                                    v-range(ref="slider" @callback="filterDu" v-model="limit" v-bind="options" class="v-range" :min="2" :max="6")
                                        div(class="v-range__tooltip" slot="label" slot-scope="{ label, active,last,first }")
                                            span(:class="['v-range__label', { active,last,first} ]" v-text="rangeLabel({first, last, active, label})")
                        .control.g-col.g-col_lg_4.g-as_fe.g-col_md_5.g-mb_2_md
                            .radio-list_du.radio-list_inline.g-col_lg_12.g-mlr_auto.g-col_xs_12.g-mlr_0_md.g-jc_fs_md
                                each v,k in ['Рубли РФ','Доллары США', 'ЕВРО']
                                    .radio.g-mb_1.g-mr_2_md
                                        input(type="radio", @change="filterDu", v-model="currency" value=v name="currency", id="currency" + k)
                                        label(for="currency" + k)=v
                        .g-col.g-col_xs_12
                        .control.g-col.g-col_lg_7(v-if="false")
                            .radio-list_du.radio-list_inline.g-col_xs_12.g-jc_fs_md.g-flw_md
                                each v,k in ['Защита капитала','Частичное снятие','Периодические выплаты']
                                    .radio.g-mr_2_md
                                        input(type="radio", @change="filterDu" v-model="typeStrategy" value=k name="typeStrategy", id="typeStrategy" + k)
                                        label(for="typeStrategy" + k)=v

                    StrategyList(:funds="preparedDu", :iisList="iisList.length" :showBG="true", :type="'du'")
        .g-col_md_10
            p: small.text-note #[sup 1]Доходность – прогнозируемая доходность, которая не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента. Рассчитывается исходя из текущего совокупного состава портфеля и может быть скорректирована управляющим.
            p(v-if="selectedStrategy === 'du' || selectedStrategy === 'iis'"): small.text-note #[sup 2]Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.
            p(v-if="selectedStrategy === 'iis'"): small.text-note *Прогнозируемая доходность указана в рублях РФ.
            p(v-if="selectedStrategy === 'du'"): small.text-note *Прогнозируемая доходность указана в валюте стратегии.
            p: small.text-note С  перечнем обязательной информации о профессиональном участнике рынка ценных бумаг  можно ознакомиться на #[a(href="https://www.uralsib-am.ru/about/disclosure/cb-info/" target="_blank") сайте]
</template>

<script>
import StrategyList from './DuStrategyList.vue';
import Du from './Du';

export default {
    components: {
        StrategyList,
        'personalStr': Du
    },
    watch: {
        '$route'(to, from) {
            if (to.params.selectedStrategy !== 'iis' && to.params.selectedStrategy !== 'du' && this.$route.params.selectedStrategy !== 'personal') {
                this.$router.push({ path: `/strategies/iis` });
            }
        },
        'iisList'(val) {
            this.loading = true;
            if (this.$route.params.selectedStrategy == 'personal') {
                setTimeout(() => {
                    this.loading = false;
                }, 150);
            }
            if (!val) return;
            this.duFullList = [];
            val.filter((item, index) => {
                axios.get(`/invest/getbyidparams?id=${item.id}`).then(({ data }) => {
                    if (!data) return;
                    this.duFullList.push(data);
                    this.filterDu();
                    if (index == val.length - 1) {
                        setTimeout(() => {
                            this.loading = false;
                        }, 300);
                    }
                });
            });
        }
    },
    data() {
        return {
            typeStrategy: '',
            selectedStrategy: this.$route.params.selectedStrategy,
            currency: 0,
            amount: 4,
            limit: 6,
            loading: true,
            duFullList: [],
            duFullListFiltered: [],
            options: {
                min: 1,
                max: 3,
                height: 1,
                dotSize: 11,
                interval: 1,
                piecewise: true,
                piecewiseLabel: true,
                tooltip: false,
                startAnimation: true,
                /*    bgStyle: {
                        "backgroundColor": "#002250",
                        "boxShadow": "inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)"
                    },*/

                processStyle: {
                    'backgroundColor': '#002250'
                },
                piecewiseStyle: {
                    'backgroundColor': 'white',
                    'visibility': 'visible',
                    'width': '7px',
                    'height': '7px',
                    'border': '1px solid #002250'
                },
                piecewiseActiveStyle: {
                    'backgroundColor': 'white'
                },
                labelActiveStyle: {
                    'color': '#3498db'
                }
            }
        };
    },
    methods: {
        amountRangeLabel({ first, last, active, label }) {
            if (label === 4) {
                return 'Любой';
            }

            return `${last?'>':''} ${first ? '' : ''} ${label} млн`;
        },

        rangeLabel({first, last, active, label}) {
            let text = `${label} год${label > 1 ? 'a' : ''}`;
            if (label === 5) return `5 лет`
            if (label === 6) return `Любой`
            return text;
        },

        clickTab(strategy) {
            this.selectedStrategy = strategy;
            this.$router.push({ name: 'strategies', params: { selectedStrategy: strategy } });
        },

        filterDu() {
            this.duFullListFiltered = [];
            let filtered = this.duFullList.filter(item => {
                return (
                    // (item.sfp.minSumm <= this.amount * 1000000) &&
                    (this.limit === 6 ? item.sfp.investPeriod.match(/\d/g).join('') == this.limit : true) &&
                    (this.currency ? item.sfp.currency === this.currency : true)
                );
            });

            this.duFullListFiltered = _.sortBy(filtered, 'strategyName');
        }
    },
    computed: {
        allFunds() {
            if (!this.$store.state.funds.items_strategies) return [];

            return this.$store.state.funds.items_strategies.slice(0, 6);
        },

        iisList() {
            let iisDuCloned = Object.assign([], this.$store.state.iisDU.list);
            if (!iisDuCloned) return [];
            iisDuCloned = iisDuCloned.filter(item => item.sType == this.selectedStrategy.toUpperCase() && item.status == 1);
            return iisDuCloned;
        },

        preparedDu() {
            const duListRaw = this.duFullList.filter(item => {
                return (
                    (this.amount !== 4 ? item.sfp.minSumm <= this.amount * 1000000 : true) &&
                    (this.limit !== 6 ? item.sfp.investPeriod.match(/\d/g).join('') == this.limit : true) &&
                    (this.currency ? item.sfp.currency === this.currency : true)
                );
            });
            return _.sortBy(duListRaw, 'strategyName');
        },
    },

    created() {
        if (this.$route.params.selectedStrategy == 'personal') {
            setTimeout(() => {
                this.loading = false;
            }, 150);
        }
        if (this.$route.params.selectedStrategy !== 'iis' &&
            this.$route.params.selectedStrategy !== 'du' &&
            this.$route.params.selectedStrategy !== 'personal'
        ) {
            this.$router.push({ path: `/strategies/iis` });
        }
        this.$store.dispatch('iisDU/iisDuGetList');
    }
};
</script>

<style lang="scss">
    @import "../../assets/styles/vars";

    .v-range__label {
        cursor: pointer;
    }

    .strategies-tabs {
        &.spinner {
            &:before {
                z-index: 16;
            }

            &:after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: rgba(#fff, .9);
                z-index: 15;
            }
        }

        .g-tabs {
            &__btn {
                margin-right: 20px;

                &:last-child {
                    margin-right: 0;
                }

                @include media($width_xs) {
                    margin-right: 0;
                }
            }

            &__header {
                display: flex;
                justify-content: space-between;

                @include media($width_md) {
                    flex-wrap: wrap;
                    justify-content: flex-start;
                }
            }
        }
    }
</style>
