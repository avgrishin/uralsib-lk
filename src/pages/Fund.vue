<template lang="pug">
    article.content.fond-detail
        .g-hidden.g-show_md
            .fond-detail__title.g-mb_4
                h1.g-mb_0(v-html="fund_full.description")
                .fond-detail__title-img.g-hidden.g-show_xs
                    svg-inline(:src="`/funds/${fund_full.webSiteId}.svg`")
        section.page-section.g-row.g-row_flex.g-mb_9.g-mb_7_xs
            .g-col.g-col_lg_2.g-col_md_3.g-or_1_xs
                .g-col_xs_12
                    .fond-detail__avatar.g-mb_4.g-hide_xs
                        svg-inline(:src="`/funds/${fund_full.webSiteId}.svg`")
                    a(class="btn btn_primary btn_block" href="#" @click.prevent="buy") Купить
            .g-col.g-col_lg_5.g-col_md_12.g-pt_4_md.g-or_1_md.g-or_0_xs.g-pt_0_xs
                .g-col_xs_12
                    .g-mb_2.g-d_b.g-hide_md(hidden)
                        .h1.g-mb_0(v-html="fund_full.description")
                    .g-mb_1.h4  Минимальная сумма инвестирования: #[span.g-ws_nw(v-html="`1000 ${rubleSign}`")]
                    .g-mb_2.h4 Рекомендуемый срок инвестирования: #[span.g-ws_nw от 1 года]
                    p.g-mb_1(v-text="fund_full.text")
                    a(:href="`https://www.uralsib-am.ru/funds/${this.fund}/`" target="_blank").g-fw_5 Полное описание фонда
                    br
                    a.fond-detail__results(href="https://www.uralsib-am.ru/services/advisor/" target="_blank").g-fw_5 Результаты управления фондом
            .g-col.g-col_lg_5.g-col_md_a
                .fond-detail__info.g-lh_1
                    .g-mb_2
                        .h2.g-mb_0(v-html="`Доходность фонда за год*: ${fund_full.profitability}`")
                    .g-mb_1.g-fw_5.g-mb_2(v-html="`Риск - ${fund_full.risk || ''}`")
                    .fond-detail__info-decor
                    .fond-detail__date.g-clr_gray(v-html="`на ${tableData.date_two || ''}:`")
                    div.g-d_f.g-d_b_xs
                        div.g-mr_6.g-mb_2_xs.g-mr_0_xs
                            .h4.g-mb_1 Стоимость пая:
                            span.h3( v-html="tableData.price ? tableData.price[1] : ''")
                            .spinner(v-show="!loaded.fund_chart")
                        div
                            .h4.g-mb_1  СЧА:
                            span.h3(v-html="tableData.scha ? tableData.scha[1] : ''")
                            .spinner(v-show="!loaded.fund_chart")
        table.case-table.g-mb_9.g-mb_7_xs
            caption.case-table__title ПИФы
            thead
                tr
                    th Наименование фонда
                    th(v-html="`на ${tableData.date_one || ''}`")
                    th(v-html="`на ${tableData.date_two || ''}`")
                    th Изменение
            tr
                td.g-hide-b_xs(title="Наименование" v-html="`Расчётная стоимость пая, ${rubleSign}`")
                td(:title="`на ${tableData.date_one}`" v-html="tableData.price ? tableData.price[0] : ''")
                td(:title="`на ${tableData.date_two}`" v-html="tableData.price ? tableData.price[1] : ''")
                td(title="Изменение")
                    span.g-mr_1.g-va_m(v-html="(tableData.price ? tableData.price[2] : '') + '%'")
                    .icon.icon_dir_up.g-va_m.g-va_m(v-if="tableData.price && tableData.price[3]")
                    .icon.icon_dir_dn.g-va_m.g-va_m(v-else)
            .spinner(v-show="!loaded.fund_chart")
            tr
                td.g-hide-b_xs(title="Наименование" v-html="`Стоимость чистых активов, ${rubleSign}`")
                td(:title="`на ${tableData.date_one}`" v-html="tableData.scha ? tableData.scha[0] : ''")
                td(:title="`на ${tableData.date_two}`" v-html="tableData.scha ? tableData.scha[1] : ''")
                td(title="Изменение")
                    span.g-mr_1.g-va_m(v-html="(tableData.scha ? tableData.scha[2] : '') + '%'")
                    .icon.icon_dir_up.g-va_m.g-va_m(v-if="tableData.scha && tableData.scha[3]")
                    .icon.icon_dir_dn.g-va_m.g-va_m(v-else)
        section.page-section
            div(style="margin-top:-2em")
                date-filter(text="Динамика стоимости пая" @filter_time="customDate" @start_of="defaultDate")
        section.page-section
            ul.g-mb_5.page-section__nav.g-mb_3_xs.g-mt_0
                li.g-mr_4.g-ib
                    a(href="#" @click.prevent="tab = 0" :class="{active: tab == 0}").nav__link.h2.g-ib.g-bbc_t.g-mb_0 Динамика стоимости пая
                li.g-mr_4.g-ib
                    a(href="#" @click.prevent="tab = 1" :class="{active: tab == 1}").nav__link.h2.g-ib.g-bbc_t.g-mb_0 Динамика СЧА
            div(v-show="tab == 0")
                fund-chart.chartdiv.chartdiv_pd(:dataProvider="profitability" :min="chart_min" :max="chart_max" :range="chart_range" v-show="loaded.fund_chart")
                .spinner(v-show="!loaded.fund_chart")
            div(v-show="tab == 1")
                fund-chart.chartdiv(:dataProvider="scha" :scha="true" :min="chart_min" :max="chart_max" :range="chart_range" v-show="loaded.fund_chart")
                .spinner(v-show="!loaded.fund_chart")
        section.page-section
            h2.page-section__caption Структура портфеля фонда
            .g-row
                .g-col.g-col_lg_6(v-show="loaded.fund_structure" style="height: 300px")
                    div(ref="pie_chart")
                .spinner(v-show="!loaded.fund_structure")
        p.g-mt_6.g-col_8
            ui-disclaimer.text-note(tag="small")


</template>
<script>
    import moment from 'moment';

    import DateFilter from '../components/DateFilter';
    import FundChart from '../components/charts/FundChart';
    import NotFound from './404.vue';

    import { caseStructure } from '../mixins.js';
    import UiDisclaimer from '../components/ui/UiDisclaimer';

    export default {
        components: { UiDisclaimer, DateFilter, FundChart, NotFound },
        mixins: [caseStructure],
        data() {
            return {
                fund: '',
                tab: 0,
                data: [],
                profitability: [],
                scha: [],
                selected_fund_pie_chart: [],
                pie_chart_height: 300,
                loaded: {
                    fund_chart: false,
                    fund_structure: false
                },

                chart_min: 0,
                chart_max: 0,
                chart_range: -1,
                fundDescDate: '',
            }
        },
        watch: {
            '$route' (to, from) {
                this.fund = to.params.fund_name;
            },
            fund_full(val) {
                this.getData();
                this.getPieChartData();

                this.$store.commit('updateCrumbs', [
                    {link: '/funds', text: 'Паевые инвестиционные фонды'},
                    {link: '', text: val.description}
                ]);
            },
            selected_fund_pie_chart(val) {
                if (val.length) this.initPieChart();
            }
        },
        created() {
            this.fund = this.$route.params.fund_name;
            this.getTextDisclaimer();
        },
        methods: {
            getTextDisclaimer() {
                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'FundDescDate',
                    }
                }).then(({data}) => {
                    this.fundDescDate = data.outText;

                });
            },
            getData() {
                let profitability = [];

                let params = {
                    fund_id: [this.fund_full.id],
                };


                axios.get('/ajax-lk/getProfitChart.php', {
                    params,
                    baseURL: 'https://www.uralsib-am.ru'
                })
                .then(({data}) => {
                    this.profitability = data.data;
                    data.data[0].field = 'price';
                    profitability = data.data;

                    return axios.get('/ajax-lk/getSCHAChart.php', {
                        params,
                        baseURL: 'https://www.uralsib-am.ru/'
                    });
                }).then(({data}) => {
                    this.scha = data.data;

                    data.data[0].field = 'scha';
                    this.data = profitability.concat(data.data);

                    this.loaded.fund_chart = true;
                });
            },
            getPieChartData() {
                axios.get(`/ajax-lk/getFundStructure.php`, {
                    params: {
                        fund: this.fund_full.id
                    },
                    baseURL: 'https://www.uralsib-am.ru/'
                }).then(({data}) => this.selected_fund_pie_chart = data);
            },
            defaultDate(event) {
                this.chart_range = event[1];
            },
            customDate(event) {
                if (event[0] == 'dateStart') this.chart_min = moment(event[1]).valueOf();
                else this.chart_max = moment(event[1]).valueOf();
            },
            buy() {
                let data = { funds: [ this.fund_full ] };

                if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_FUND_PAGE');}//яндекс цель купить
                this.$store.commit('funds/setOperation', data);

                this.$router.push('/operations/buy');
            },
        },
        computed: {

            isFound() {
                if (!this.$store.state.funds.items.length) return true;

                return Object.values(this.fund_full).length;
            },
            fund_full() {
                let fund = _.cloneDeep(this.$store.state.funds.items.find(item => item.webSiteId == this.fund));

                if (!fund) return {};

                axios.get('/reference/getsitetext', {
                    params: {
                        place: this.fund,
                    }
                }).then(({data}) => {

                    fund.text = data.outText;

                });

                fund.profitability = fund.profitability.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + '%';

                return fund;
            },
            tableData() {
                let result = {};
                let data = _.cloneDeep(this.data);

                data.map(item => {
                    item.data = item.data.slice(item.data.length - 2);
                    return item;
                }).forEach(item => {
                    let field;
                    let change = (item.data[1][1] / item.data[0][1] * 100) - 100;
                    let up = (change > 0) ? true : false;

                    change = Math.abs(change).toLocaleString('ru-RU', {maximumFractiosnDigits: 2});

                    result.date_one = moment(item.data[0][0]).format('DD.MM.YYYY');
                    result.date_two = moment(item.data[1][0]).format('DD.MM.YYYY');

                    result[item.field] = item.data.map(item => this.formatCurrency(item[1]));
                    result[item.field].push(change);
                    result[item.field].push(up);
                });

                return result;
            },
            disclaimerDate() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        }
    }
</script>

<style lang="scss">
    @import "../../src/assets/styles/vars";
    .fond-detail{
        &__title{
            @include media($width_xs){
                display:flex;
                align-items:center;
                &-img{
                    order:-1;
                    width:67px;
                    margin-right:10px;
                }
                .svginline{
                    width:100%;
                    height:100%;


                }
            }
        }
        &__date{
            margin-bottom:nth($m_em, 2);
        }
        &__info{
            background-color:$clr_blue;
            padding:nth($m_em, 4);
            border-radius:$br_1;

            @include media($width_xs){
                padding:nth($m_em, 2);
                margin:nth($m_em, 4) 0;
                font-size:.8em;
                width:100%;
            }

            &-decor{
                height:1px;
                background:$clr_gray_1;
                margin:1em 0;
                opacity:.2;
            }
        }

        &__results {
            display: inline-block;
            margin-top: 0.5em;
            color: $clr_highlight;
        }
    }
    .fond-detail__avatar{
        position:relative;
        @include box-decor(1, 0, 1);


        height:160px;
        padding:2em;
        svg{
            display:block;
            max-width:100%;
            width:auto;
            height:65%;
            position:absolute;
            left:0;
            right:0;
            top:0;
            bottom:0;
            margin:auto;
        }

        @include media($width_xs){
            @include box-decor(0, 0, 0);
        }
    }

    div.google-visualization-tooltip {
        pointer-events: none;
        background-color: #fff;
        border: 1px solid #eaf1f8;
        border-radius:$br_1;
        box-shadow: 0px 7px 28px 5px rgba(211, 218, 228, 0.4);

        ul {
            padding: 10px 20px;

            li {
                display: inline;
            }
        }
    }
</style>
