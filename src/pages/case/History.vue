<template lang="pug">
casenav
    section
            date-filter(text="Выберите период" @filter_time="customDate" @start_of="defaultDate")
            .case-data
                table.case-table()
                    caption.case-table__title
                        | ПИФы
                        drop-down.dropdown_trans.dropdown_trans.g-f_r.g-fs_05.g-mt_1_m_xs.g-hidden.g-show_xs.g-mr_1_m_xst(name="Тип операции")
                            .dropdown__item
                                button.g-btn-txt(@click.prevent="filterOpertaions = '*'") Все операции
                            .dropdown__item(v-for="(item, index) in filters.type", :key="index")
                                button.g-btn-txt(@click.prevent="filterOpertaions = item" v-html="item")
                    thead
                        tr
                            th.case-table__th-name
                                drop-down.dropdown_trans.case-table__sort(name="Наименование фонда")
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="filterName = '*', selected[0] = null", :class="{'active': selected[0] == null}") Все фонды
                                    .dropdown__item(v-for="(item, index) in filters.name", :key="index")
                                        button.g-btn-txt(@click.prevent="filterName = item, selected[0] = index", :class="{'active': index == selected[0] }", v-html="item")
                            th Дата#[br]проведения#[br]операции
                            th
                                drop-down.dropdown_trans.dropdown_trans.case-table__sort(name="Тип операции")
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="filterOpertaions = '*', selected[1] = null", :class="{'active': selected[1] == null}") Все операции
                                    .dropdown__item(v-for="(item, index) in filters.type", :key="index")
                                        button.g-btn-txt(@click.prevent="filterOpertaions = item, selected[1] = index", :class="{'active': index == selected[1] }" v-html="item")
                            th Сумма#[br]операции
                            th
                                drop-down.dropdown_trans.case-table__sort(name="Фонд, на паи<br>которого<br> произведен<br>обмен")
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="filterExchange = '*', selected[2] = null", :class="{'active': selected[3] == null}") Все фонды
                                    .dropdown__item(v-for="(item, index) in filters.exchange", :key="index")
                                        button.g-btn-txt(@click.prevent="filterExchange = item, selected[2] = index", :class="{'active': index == selected[2] }" v-html="item")
                            //- th Комиссия
                            //- th Налог
                            th Просмотр
                    tbody.case-table__loaded(v-if="!loaded")
                        tr.case-table__loaded-tr
                            td.case-table__loaded_td(colspan="8")
                                .spinner
                    tbody.case-table__loaded(v-if="loaded && operationsFiltered.length==0")
                        tr.case-table__loaded-tr
                            td.case-table__loaded_td(colspan="8")
                                | Нет данных
                    tbody.case-table__style-icon_xs(v-for="(operation, index) in operationsFiltered" :key="index" :class="{'case-table__style-icon_open': isRowOpen(index) }")
                        tr.case-table__tr-md(@click.prevent="jsToggleTable(index)", :class="{'case-table__tr-md_open': isRowOpen(index) }")
                            td.case-table__td-md-name.case-table__td-icon.g-hide-b_xs(title="Наименование фонда")
                                .case-table__bg-td(hidden).g-show_xs
                                    svg-inline(:src="getSrcFundIcon(operation.webSiteId)")
                                .td__name(:class="'td__name_'+index")
                                    .case-table__icon-wrap
                                        .case-table__icon(hidden).g-show_xs
                                            svg-inline(:src="getSrcFundIcon(operation.webSiteId)")
                                        div
                                            span.g-hide_xs УРАЛСИБ
                                            | #[br.g-hide_xs]
                                            span(v-html="operation.subPortfolio")
                                .case-table__toggle.g-hidden.g-show_md
                                    .g-icon-down(:class="{'g-icon-down_open': isRowOpen(index) }")
                            td.case-table__td-md(title="Дата проведения операции" v-html="operation.date").g-ws_nw
                            td.case-table__td-md(title="Тип операции" v-html="operation.operName")
                            td.case-table__td-promo(title="Сумма операции" v-html="operation.amount").g-ws_nw
                            td.case-table__td-md(title="Фонд на паи которого произведен обмен" v-html="operation.exchange || '–'")
                            //- td.case-table__td-md(title="Размер комссии" v-html="operation.commission || '–'").g-ws_nw
                            //- td.case-table__td-md(title="Налог" v-html="operation.tax || '–'").g-ws_nw
                            td.case-table__td-md.g-hide-b_xs(title="Просмотр")
                                button.btn.btn_preview.btn_o(@click="showPopup(operation), jsToggleTable(index)")
                                    span.icon.icon_preview
                                    .g-sr-only Просмотр

            .g-pt_6.g-ta_r
                a(href="#" @click.prevent="convertToXLS()").btn.btn_preview.btn-link.btn_preview_download.btn_o.g-col_xs_12.g-col_md_a
                    span.g-icon.g-mr_1
                        svg(width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.474 93.474" enable-background="new 0 0 93.474 93.474")
                            path(fill="",d="M54.804 51.293l-6.241 5.991v-21.129c0-1.104-.896-2-2-2s-2 .896-2 2v21.908l-6.52-6.771c-.78-.781-1.922-.781-2.703 0s-.719 2.047.062 2.828l9.825 9.795c.375.375.899.586 1.43.586.531 0 1.047-.211 1.422-.586l.147-.143c.173-.126.326-.277.451-.451l9.203-9.201c.781-.781.656-2.047-.125-2.828-.778-.781-2.171-.781-2.951.001zM72.854 34.069c-1.252 0-2.365.347-3.347.652l-.722.217c-4.002-9.179-13.133-15.237-23.221-15.237-12.673 0-23.236 9.248-25.049 21.467-1.082-.213-2.162-.32-3.228-.32-9.694-.001-17.287 7.136-17.287 16.487 0 9.324 7.593 16.438 17.287 16.438h55.566c11.562 0 20.621-8.554 20.621-19.716.001-11.314-9.057-19.988-20.62-19.988zm0 35.705h-55.566c-7.575 0-13.287-5.239-13.287-12.438 0-7.229 5.712-12.583 13.287-12.583 1.289 0 2.616.257 3.886.651l.443.177c.593.204 1.251.13 1.772-.22.521-.353.847-.923.879-1.552.569-11.278 9.924-20.11 21.296-20.11 8.961 0 17.025 5.68 20.068 14.133.285.793 1.113 1.323 1.957 1.323 1.131 0 2.18-.326 3.105-.614.779-.243 1.514-.471 2.158-.471 9.32 0 16.621 6.917 16.621 15.989.002 8.918-7.299 15.715-16.619 15.715z")

                    | Скачать
</template>
<script>
    import moment from 'moment-timezone';
    import XLSX from 'xlsx';
    import FileSaver from 'file-saver';
    
    import AppTable from '../../components/table/AppTable';
    import CaseNav from './CaseNav';
    import Dropdown from '../../components/Dropdown';

    import { dateFilter, xml } from '../../mixins';

    export default {
        components: {AppTable, 'casenav': CaseNav, 'drop-down': Dropdown},
        mixins: [dateFilter, xml],
        data() {
            return {
                dateStart: undefined,
                dateEnd: undefined,
                
                xmlTitle: 'Uralsib Operations',
                xmlSubject: 'Operations',
                sheetName: 'Operations 1',
                toggleTable: [],
                operations: [],
                selected: [],
                filterName: '*',
                filterOpertaions: '*',
                filterExchange: '*',

                loaded: false
            }
        },
        created() {
            this.$store.commit('updateCrumbs', [
                {link: '/', text: 'Портфель'}
            ]);
            
            this.getData();
        },
        methods: {
            setActiveClass(index, val) {
               return val
            },
            jsToggleTable(index) {
                let array_index = this.toggleTable.indexOf(index);

                if (array_index > -1) this.toggleTable.splice(array_index, 1);
                else this.toggleTable.push(index);
            },
            isRowOpen(index) {
                return this.toggleTable.indexOf(index) > -1;
            },
            getData() {
                this.loaded = false;
	            const body = {
		            clientId: this.$store.state.user.state.clientId,
		            start: this.dateStart ? moment(this.dateStart).format('YYYY-MM-DD') : undefined,
		            end: this.dateEnd ? moment(this.dateEnd).format('YYYY-MM-DD') : undefined,
		            pageNumber: 1
	            };
	            
                axios.all([
                    axios.post('/reports/Operations', body),
                    axios.post('/reports/OperationsForPeriod', body)
                ]).then(
                    axios.spread(({ data: operations }, { data: detail }) => {
                        this.operations = this.convertData(operations.items, detail.items);
                        this.loaded = true;
                    })
                );
            },
            convertData(operations, detail) {
	            operations = _.uniqBy(operations, 'iD_OPER');
	            detail = _.uniqBy(detail, 'iD_OPER');
                return detail.map(dItem => {
                    let item = operations.find(oper => oper.iD_OPER == dItem.iD_OPER);

                    if (item) {
                        item.amount =  item.amount ? this.formatCurrency(Math.abs(item.amount)) : '';
                        item.commission = item.commission ? this.formatCurrency(item.commission) : '';
                        item.tax = item.tax ? this.formatCurrency(item.tax) : '';
                        item.subPortfolio = item.subPortfolio.replace('УРАЛСИБ', '').trim();

                        if (item.orderDate) {
                            let date = moment(item.orderDate);
	                        
                            let userDate = date.clone();
	                        
                            item.date = userDate.format('DD.MM.YYYY');
                        } else {
                            item.date = '';
                        }

                        item.exchange = dItem.exchPrtf ? dItem.exchPrtf.replace('УРАЛСИБ', '').trim() : null;

                        if (item.operName == null) {
                            item.operName = dItem.operType
                        }
                        
                        return item;
                    }
                }).filter(item => item);
            },
            convertDate(data) {

                return data.map(item => {
                    item.amount =  item.amount ? this.formatCurrency(item.amount) : '';
                    item.commission = item.commission ? this.formatCurrency(item.commission) : '';
                    item.tax = item.tax ? this.formatCurrency(item.tax) : '';

                    if (item.orderDate) {
                        let date = moment.tz(item.orderDate, 'Europe/Moscow');
                        let userDate = date.clone().tz(this.timezone);

                        item.date = userDate.format('DD.MM.YYYY');
                    } else {
                        item.date = '';
                    }

                    return item;
                });
            },
            getTableData() {
                let data = this.checkRows();

                data.unshift([
                    'Наименование фонда',
                    'Дата проведения операции',
                    'Тип операции',
                    'Сумма операции',
                    'Фонд, на паи которого произведен обмен',
                    // 'Размер комссии',
                    // 'Налог'
                ]);
                return data;
            },
            checkRows() {
                let list = _.cloneDeep(this.operations)
                    .map(item => {
                        return [
                            item.subPortfolio,
                            item.date,
                            item.operName || '',
                            item.amount.toNumber() || '',
                            item.exchange,
                            item.commission.toNumber() || '',
                            item.tax.toNumber() || ''
                        ]
                    });

                return list;
            },
            showPopup(opertaion) {
                window.events.$emit('show_popup', ['preview-operation', {opertaion}]);
            },
            defaultDate(event, type) {
                this.dateStart = event[0];
                this.dateEnd = undefined;

                this.getData();
            },
            customDate(event, type) {
                if (event[0] == 'dateStart') this.dateStart = event[1];
                else this.dateEnd = event[1];

                this.getData();
            }
        },
        computed: {
            operationsFiltered() {
                if (!this.operations.length) return [];

                let data = _.cloneDeep(this.operations);


                return data.filter(item => {
                    if (this.filterName == '*') return true;

                    return item.subPortfolio == this.filterName;
                }).filter(item => {
                    if (this.filterOpertaions == '*') return true;

                    return item.operName == this.filterOpertaions;
                }).filter(item => {
                    if (this.filterExchange == '*') return true;

                    return item.exchange == this.filterExchange;
                });
            },
            filters() {
                let data = _.cloneDeep(this.operations);

                return {
                    name: _.uniq(data.map(item => item.subPortfolio)).sort(),
                    type: _.uniq(data.map(item => item.operName)).sort(),
                    exchange: _.uniq(data.map(item => item.exchange)).filter(item => item).sort()
                }
            }
        }
    }
</script>

