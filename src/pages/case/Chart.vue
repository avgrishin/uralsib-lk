<template lang="pug">
casenav
    //- section.page-section
    .g-tabs
        .g-tabs__header.g-mb_3.g-mb_2_xs
            a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 1}" @click.prevent="changeTab(1)") ПИФ
            a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 2}" @click.prevent="changeTab(2)") ДУ
            a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 3}" @click.prevent="changeTab(3)") Итого
    date-filter(text="Выбор периода" @filter_time="customDate($event, 'chart')" @start_of="defaultDate($event, 'chart')")
    h2.g-fw_3.filter__title Динамика изменения стоимости портфеля ({{caseName}})
    #chart_1.chartdiv
        div
            casechart(
                :profitChart="profits"
                :min="chart_min"
                :max="chart_max"
                :range="chart_range"
                ref='casechart'
                v-show="loaded.case_chart"
            )
            .spinner(v-show="!loaded.case_chart")
    #chart_2.chartdiv(v-show="loaded.case_chart && selected_tab > 1")
        div
            casechartusd(
                :profitChart="profitsUsd"
                :min="chart_min"
                :max="chart_max"
                :range="chart_range"
                ref='casechartusd'
                v-show="loaded.case_chart && selected_tab > 1"
            )
            .spinner(v-show="!loaded.case_chart && selected_tab > 1")
</template>
<script>
    import moment from 'moment';

    import CaseHightChart from '../../components/charts/CaseHightChart';
    import CaseHightChartUSD from '../../components/charts/CaseHightChartUSD';
    import CaseNav from './CaseNav';

    export default {
        components: {
            'casechart': CaseHightChart,
            'casechartusd': CaseHightChartUSD,
            'casenav': CaseNav
        },
        data() {
            return {
                profits: [],
                profitsUsd: [],
                chart_min: 0,
                chart_max: 0,
                chart_range: -1,

                selected_tab: 3,

                loaded: {
                    casechart: false
                }
            }
        },
        created() {
            this.$store.commit('updateCrumbs', [{ link: '/', text: 'Портфель' }]);
            this.getData(3, true);
        },
        computed: {
            caseName() {
                return this.selected_tab == 1 ? 'ПИФ' : this.selected_tab == 2 ? 'ДУ' : this.selected_tab == 3 ? 'Итого' : '';
            }
        },
        methods: {
            getData(selected_tab, onLoad = false) {
                if (!onLoad && selected_tab == this.selected_tab) return;
                let apiBase = '';
                let apiBaseUrl = '';
                let apiBaseCharts = [{
                    name: 'Портфель',
                    data: []
                }, {
                    name: 'Портфель',
                    data: []
                }];

                switch (selected_tab) {
                    case 0:
                    case 1:
                        apiBase = axios;
                        apiBaseUrl = '/reports/PortfolioCost';
                        break;
                    case 2:
                        apiBase = axios
                        apiBaseUrl = '/reports/PortfolioCostDU';
                        break;
                    case 3:
                        apiBase = axios
                        apiBaseUrl = '/reports/PortfolioCostFull';
                        break;
                    default:
                        break;
}
                this.profits = [];
                this.profitsUsd = [];
                this.loaded.case_chart = false;
                apiBase.get(apiBaseUrl).then(({data}) => {
                    this.getCaseChartData(data, apiBaseCharts);
                });
            },
            getCaseChartData(data, charts) {
                charts = charts;
                data.forEach(item => {
                    charts[0].data.push([moment(item.date).valueOf(), item.amount]);
                    charts[1].data.push([moment(item.date).valueOf(), item.amountUSD]);
                });

                charts[0].data = charts[0].data.sort((a, b) => {
                    if (a[0] < b[0]) return -1;
                    else if (a[0] > b[0]) return 1;
                    return 0;
                });
                
                charts[1].data = charts[1].data.sort((a, b) => {
                    if (a[0] < b[0]) return -1;
                    else if (a[0] > b[0]) return 1;
                    return 0;
                });

                this.profits.push(charts[0]);
                this.profitsUsd.push(charts[1]);
                this.loaded.case_chart = true;
            },
            defaultDate(event, type) {
                this.chart_range = event[1];
            },
            customDate(event, type) {
                if (event[0] == 'dateStart') {
                    this.chart_min = moment(event[1]).valueOf();
                } else {
                    this.chart_max = moment(event[1]).valueOf();

                }
            },
            changeTab(tab) {
                this.getData(tab);
                this.selected_tab = tab;
            }
        }
    }
</script>

<style lang="scss">
    #chart_1 .spinner {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
    }
</style>

