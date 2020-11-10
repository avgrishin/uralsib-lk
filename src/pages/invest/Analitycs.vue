<template lang="pug">
    casenav
        article.content
            h1.g-hide_xs Аналитика
            section.page-section
                date-filter(text="Динамика стоимости пая" @filter_time="customDate" @start_of="defaultDate")
                .case-data
                    app-table(:rows="table_data" :loaded="loaded.table")
                        caption.case-table__title(slot="caption") Пифы
                        th.case-table__th-name Наименование фонда
                        th Цена пая #[br] на конец #[br] периода*
                        th Количество #[br] паев на конец #[br] периода*
                        th Стоимость #[br] активов на конец #[br] периода*
                        th Доход #[br] за  период*
                        th Доходность #[br] за период*
                        th Операции с паями
                .case-data__nav.g-row
                    .g-col.g-col_md_4
                        router-link(to="/operations" class="btn btn_primary btn_block g-mb_2_xs" @click.native="yandexTarget()") Купить паи другого фонда
                    p.g-col.g-col_md_8
                        small.text-note(v-text="disclaimerTextAnalytics")
            //.spinner.g-mt_5.g-mb_5(v-if="!loaded.chart")
            section.page-section.js-tabs(v-show="loaded.chart")
                .g-mb_6.g-mb_2_xs
                    h2.g-mb_0 Динамика изменений стоимости пая
                form.case-dynamics#FORM_DYNAMICS
                    .control.g-row
                        .g-col.g-col_md_12
                            .control
                                .checkbox.checkbox_framed.no-mod
                                    input(type="checkbox" id="FD_PIF_ALL" v-model="showAll" name="pif_all")
                                    label(for="FD_PIF_ALL") Все ПИФы
                            fieldset.control
                                .g-mb_3.checkbox-list_framed
                                    .checkbox.checkbox_framed(v-for="(item, index) in charts")
                                        input(type="checkbox", v-model="show" :id="'FD_PIF_'+index", :value="item.name", name="pif")
                                        label(:for="'FD_PIF_'+ index" v-html="`<span class='checkbox__marker' style='background-color: ${item.color}'></span><span class='g-ib'>${item.name}</span>`")

                        .g-col.g-col_md_12.g-mb_4
                            fieldset.control
                                .g-row.g-mb_2_xs
                                    .g-col.g-col_lg_7.g-col_lg_pr_0.g-mb_2_md
                                        .g-row.g-row_ib
                                            .g-col.g-va_m.g-ws_nw.g-w_a.g-mb_1_xs
                                                .control__label.g-mb_0_i
                                                    label Сравнить с индексом:
                                            .g-col.g-col_lg_8.g-col_md_4.g-va_m.g-col_md_pl_0.g-col_lg_pr_0
                                                div.g-d_f.g-ai_c
                                                    span.v-select-analytics-color(v-if="index")
                                                    v-select.v-select_analytics.g-col_xs_12(v-model="index" :options="benchmarks" label="longName" :searchable="true" placeholder="Выберите индекс" maxHeight="100px").field-select.field-select_sz_1
                                    .g-col.g-col_lg_5.g-d_f.g-jc_fe.g-flw.g-jc_fs_md.g-jc_sb_xs
                                        button.btn.btn_o.btn_icon.btn_p_1.g-col_xs_12.g-col_md_a.g-mt_2_xs(@click.prevent="convertToXLS()")
                                            span.g-icon.g-mr_1
                                                svg(width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.474 93.474" enable-background="new 0 0 93.474 93.474")
                                                    path(fill="#002e6c",d="M54.804 51.293l-6.241 5.991v-21.129c0-1.104-.896-2-2-2s-2 .896-2 2v21.908l-6.52-6.771c-.78-.781-1.922-.781-2.703 0s-.719 2.047.062 2.828l9.825 9.795c.375.375.899.586 1.43.586.531 0 1.047-.211 1.422-.586l.147-.143c.173-.126.326-.277.451-.451l9.203-9.201c.781-.781.656-2.047-.125-2.828-.778-.781-2.171-.781-2.951.001zM72.854 34.069c-1.252 0-2.365.347-3.347.652l-.722.217c-4.002-9.179-13.133-15.237-23.221-15.237-12.673 0-23.236 9.248-25.049 21.467-1.082-.213-2.162-.32-3.228-.32-9.694-.001-17.287 7.136-17.287 16.487 0 9.324 7.593 16.438 17.287 16.438h55.566c11.562 0 20.621-8.554 20.621-19.716.001-11.314-9.057-19.988-20.62-19.988zm0 35.705h-55.566c-7.575 0-13.287-5.239-13.287-12.438 0-7.229 5.712-12.583 13.287-12.583 1.289 0 2.616.257 3.886.651l.443.177c.593.204 1.251.13 1.772-.22.521-.353.847-.923.879-1.552.569-11.278 9.924-20.11 21.296-20.11 8.961 0 17.025 5.68 20.068 14.133.285.793 1.113 1.323 1.957 1.323 1.131 0 2.18-.326 3.105-.614.779-.243 1.514-.471 2.158-.471 9.32 0 16.621 6.917 16.621 15.989.002 8.918-7.299 15.715-16.619 15.715z")
                                            | Скачать
                #analitycsDynamicsChart.js-tabs__item.active.case-chart
                    analytics-hchart(:dataProvider="profitability" :show="show" :dataIndex="getSelectIndex" ref="analyticsChart" :graphs="charts")

</template>

<script>
    import moment from 'moment';
    import XLSX from 'xlsx';
    import FileSaver from 'file-saver';

    import AnalyticsHighChart from '../../components/charts/AnalyticsHighChart';
    import AppTable from '../../components/table/AppTable';
    import CaseNav from '../case/CaseNav';
    import Paginator from '../../components/Paginator';

    import { dateFilter, xml } from '../../mixins';

    export default {
        components: {
            'analytics-hchart': AnalyticsHighChart,
            AppTable,
            'casenav': CaseNav,
            Paginator
        },
        mixins: [dateFilter, xml],
        data() {
            return {
                xmlTitle: 'Uralsib Funds',
                xmlSubject: 'Funds',
                sheetName: 'Funds 1',
                disclaimerTextAnalytics: '',
                benchmarks: [],
                profitability: [],
                xls_table: [],
                show: [],
                charts: [],
                table_data: [],

                index: undefined,
                showAll: true,
                selectAll: false,
                page: 1,
                loaded: {
                    table: false,
                    chart: false
                }
            }
        },
        watch: {
            index() {
                this.getData();
            },
            showAll(val) {
                if (val) {
                    let show = [];
                    this.charts.forEach(item => show.push(item.name));
                    this.show = show;
                } else if (this.show.length == this.charts.length) {
                    this.show = [];
                }
            },
            show(val) {
                if (val.length < this.charts.length) this.showAll = false;
                else this.showAll = true;
            },
            userFunds(val, oldVal) {
                if (!oldVal.length && val.length) {
                    this.getGraphs();
                }
            }
        },
        created() {
            this.getTextDisclaimer();
            this.$store.commit('updateCrumbs', [
                {link: '/', text: 'Портфель'}
            ]);
            if (this.userFunds.length) this.getGraphs();

            this.pifTableData();
        },
        methods: {
            getTextDisclaimer() {
                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'Analytics',
                    }
                }).then(({data}) => {

                    this.disclaimerTextAnalytics = data.outText;

                });
            },
            yandexTarget(){
                if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_ANALITYCS_OTHER_FUND');}
            },
            getGraphs() {
                let funds = this.userFunds.map(item => item.description);
                let hideItems = ['УРАЛСИБ Перспективные вложения','УРАЛСИБ Нефть и Газ','УРАЛСИБ Финансовый сектор','УРАЛСИБ Социально-ответственный бизнес']
                axios.get('/analytics/Benchmarks').then(({data}) => {
                    this.benchmarks = data.map(item => {
                        if (item.form == 'ПИФ') {
                            let matches = item.longName.match(/[«"][а-яё -]*[»"]/i);
                            if (matches) item.longName = matches[0].replace(/"|«|»/g, '');
                        }
                        return item;
                    })
                    .filter(item => {
                        return !hideItems.some(text => {return text == item.longName});
                    })
                    .filter(item => {
                        let old = [
                            'Доллар США', 'Индекс РТС', 'Индекс РТС - Финансы RUR', 'Индекс РТС – Нефть и Газ',
                            'Индекс РТС - Электроэнергетика', 'Индекс РТС – Металлы и добыча', 'Индекс РТС – Нефть и Газ',
                            'Индекс РТС – Телекоммуникации'
                        ];
                        return (funds.indexOf(item.longName) < 0) && old.indexOf(item.longName) == -1;
                    })
                    .sort((a, b) => {
                        if ((a.form == 'ПИФ') > (b.form == 'ПИФ')) return -1;
                        if ((a.form == 'ПИФ') < (b.form == 'ПИФ')) return 1;
                        if (a.longName > b.longName) return 1;
                        if (a.longName < b.longName) return -1;
                    });
                    this.getData();
                });
            },
            getTableData() {
                let data = _.cloneDeep(this.xls_table).map(item => {
                    item[1] = item[1].toNumber();
                    item[2] = item[2].toNumber();
                    return item;
                });

                data.unshift([
                    'Дата',
                    'СЧА',
                    'ПАЙ'
                ]);

                return data;
            },
            getData() {
                this.loaded.table = false;

                if (this.$refs.analyticsChart.chart) this.$refs.analyticsChart.chart.showLoading('Загрузка...');

                let fund_ids = this.userFunds.map(item => item.id);
                let indices = [];
                const colors = this.$store.state.colors;

                if (this.index) {
                    if (this.index.form == 'ПИФ') {
                        let fund = this.$store.state.funds.items.find(item => item.instrumentId == this.index.id);

                        if (fund) fund_ids.push(fund.id);
                    } else indices.push(this.index.liquid);
                }

                let params = {
                    idx_id: indices,
                    fund_id: fund_ids,
                    from: this.dateStart ? moment(this.dateStart).format('DD.MM.YYYY') : undefined,
                    to: this.dateStart ? moment(this.dateEnd).format('DD.MM.YYYY'): undefined
                };

                if (fund_ids.length) {
                    axios.get('/ajax-lk/getProfitChart.php', {
                        params,
                        baseURL: 'https://www.uralsib-am.ru'
                    }).then(({data}) => {
                        this.profitability = data.data;
                        if (!this.charts.length) {
                            this.charts = [];
                            let charts = data.data.filter((item) => item.name.includes('УРАЛСИБ'));
                            charts.forEach((item, index) => {
                                this.charts.push({
                                    index,
                                    name: item.name,
                                    color: colors[item.name] || item.color
                                });
                                this.show.push(item.name);
                            });
                        }
                        this.loaded.chart = true;
                        axios.get('/ajax-lk/getSCHAChart.php', {
                            params,
                            baseURL: 'https://www.uralsib-am.ru'
                        });
                    }).then(({data}) => this.setXLSTable(data.data), error => window.log(error));
                }

                this.pifTableData(true);

            },
            pifTableData(loaded) {
                axios.get('/reports/AssetsEstimateDU', {
                    params: {
                        start: this.dateStart,
                        end: this.dateEnd
                    }
                }).then(({data}) => {
                    if (data && data.length == 0) this.loaded.table = true;
                    let table = [];

                    if (data && data.length == 0) this.loaded.table = true;
                    data= data.filter(item => item.pif != 'ДУ');

                    let funds = _.groupBy(data, 'prtf');
					window.log("TCL: pifTableData -> funds", funds)

                    //let fund = data.find(item => item.smallIcon.includes(this.$route.query.fund));
                    for (let name in funds) {
                        let items = funds[name];
                        let formated_data = this.formatTableData(items);
                        if (formated_data.name) table.push(formated_data);
                    }
                    table = table.map((item)=>{
                        if(!this.$store.state.funds.items.some((itemSub)=>item.id==itemSub.webSiteId)) item.history=true;
                        return item;
                    });
                    this.table_data = table;
                    if (loaded) this.loaded.table = true;
                }).catch(() => {
                    this.loaded.table = true;
                });
            },
            setXLSTable(data) {
                let table = [];

                data.forEach(item => {
                    let prices = _.cloneDeep(this.profitability.find(fund => fund.name == item.name).data);

                    item.data.forEach((price, index) => table.push([
                        moment(price[0]).format('DD.MM.YYYY'),
                        price[1].toLocaleString('RU-ru', {minimumFractionDigits: 2}),
                        prices[index][1].toLocaleString('RU-ru', {minimumFractionDigits: 2})
                    ]));
                });

                this.xls_table = table;
            },
            formatTableData(items) {
                let data = {
                    id: '',
                    name: '',
                    price: 0,
                    quantity: 0,
                    amount: 0,
                    profit: 0,
                    profit_per: 0,
                    du:false,
                    children: []
                }

                items.forEach(item => {
                    //if (item.outqnt > 0) {
                        if(item.type=="ДУ") return;
                        let matches = [];

                        if (item.smallIcon) matches = item.smallIcon.match(/\/([a-z0-9]*)-s.jpg$/);
                        if(item.type=="ДУ") {
                            data.du=true;
                        }
                        data.id = matches ? matches[1] : '';
                        data.name = item.prtf;
                        data.price = item.outprc;
                        data.quantity += item.outqnt;
                        data.amount += item.outamnt;
                        data.profit += item.prlost;
                        data.profit_per += item.profiT_2;
                        data.children.push({
                            name: item.opeR_ACC,
                            price: this.formatCurrency(item.outprc),
                            quantity: item.outqnt.toLocaleString('ru-RU', {maximumFractionDigits: 6}),
                            amount: this.formatCurrency(item.outamnt),
                            profit: this.formatCurrency(item.prlost),
                            profit_per: item.profiT_2.toLocaleString('ru-RU', {maximumFractionDigits: 2})
                        });
                  //  }
                });

                data.price = this.formatCurrency(data.price);
                data.quantity = data.quantity ? data.quantity.toLocaleString('ru-RU', {maximumFractionDigits: 6}):0;
                data.amount = this.formatCurrency(data.amount);
                data.profit = this.formatCurrency(data.profit);
                data.profit_per = data.profit_per; //*100;
                data.profit_per = data.profit_per ? data.profit_per.toLocaleString('ru-RU', {maximumFractionDigits: 2}):0;

                return data;
            },
            changePage(page) {
                this.page = page;
            }
        },
        computed: {
            getSelectIndex (){
                return this.index;
            },
            userFunds() {
                if (!this.$store.getters['funds/userFunds']) {
                    this.loaded.table = true;
                    return [];
                } else if (!this.table_data) {
                    this.loaded.table = true;
                    return [];
                }
                return _.cloneDeep(this.$store.getters['funds/userFunds']).filter(item => {
                    return this.table_data.find(fund => fund.id == item.webSiteId);
                }).sort((a, b) => {
                    let textA = a.description.toUpperCase();
                    let textB = b.description.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            },
            allFunds() {
                return this.$store.state.funds.items;
            },
            dateDisclaimer() {
                // if (this.dateEnd) return moment(this.dateEnd).format('DD.MM.YYYY');
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        }
    }
</script>

<style lang="scss">
    .v-select-analytics-color {display:inline-block;width:18px;height:18px;background: #8e979d;border-radius:4px; margin-right:20px;    flex: 1 0 auto;}
</style>

