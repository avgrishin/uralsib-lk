<template lang="pug">
    .g-tabs__content(v-show="show")
        date-filter(text="Выберите период" @filter_time="customDate" @start_of="defaultDate")
        .page-section
            .case-data
                table.case-table.g-mb_4()#js-paginator-scroll-top
                    caption.case-table__title ПИФы
                    thead
                        tr
                            th.case-table__th-name.g-col_xs_4
                                drop-down.dropdown_trans.case-table__sort(name="Наименование фонда")
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="sortFundName = '*', selected[0] = null", :class="{'active': selected[0] == null}") Все наименования
                                    .dropdown__item(v-for="(item, index) in requestFilters.names", :key="index")
                                        button.g-btn-txt(@click.prevent="sortFundName = item, selected[0] = index",  :class="{'active': index == selected[0] }", v-html="item")
                            th Дата заявки
                            th
                                drop-down.dropdown_trans.case-table__sort(name="Тип операции")
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="sortType = '*', selected[1] = null", :class="{'active': selected[1] == null}") Все операции
                                    .dropdown__item(v-for="(item, index) in requestFilters.operations", :key="index")
                                        button.g-btn-txt(@click.prevent="sortType = item[0], selected[1] = index",  :class="{'active': index == selected[1] }", v-html="item[1]")
                            th № заявки
                            th № лицевого#[br]счета в реестре
                            th
                                drop-down.dropdown_trans.case-table__sort.dropdown_status(name="Статус")
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="sortStatus = '*', selected[2] = null", :class="{'active': selected[2] == null}") Все статусы
                                    .dropdown__item(v-for="(item, index) in requestFilters.statuses", :key="index")
                                        button.g-btn-txt(@click.prevent="sortStatus = item, selected[2] = index",  :class="{'active': index == selected[2] }", v-html="item")
                            th
                                .g-ws_nw(style="visibility: hidden")
                                    button.btn.btn_preview.btn_o.g-mr_4.g-mr_2_xs()
                                        span(title="pdf").icon.icon_file_pdf
                                        span.g-sr-only Скачать pdf
                                    button.btn.btn_preview.btn_o()
                                        span(title="Просмотр").icon.icon_preview_2
                                        span.g-sr-only Просмотр
                    tbody.case-table__loaded(v-if="!loaded")
                        tr.case-table__loaded-tr
                            td.case-table__loaded_td(colspan="7")
                                .spinner
                    tbody.case-table__loaded(v-if="loaded && paginatedTable.length==0")
                        tr.case-table__loaded-tr
                            td.case-table__loaded_td(colspan="7")
                                | Нет данных
                    tbody.case-table__style-icon_xs(:class="{'case-table__style-icon_open': isRowOpen(index, 'requestTable') }" v-for="(request, index) in paginatedTable" :key="index")
                        tr.case-table__tr-md(@click.prevent="jsToggleTable(index, 'requestTable')", :class="{'case-table__tr-md_open': isRowOpen(index, 'requestTable') }")
                            td.case-table__td-md-name.case-table__td-icon.g-hide-b_xs(title="Наименование фонда")
                                .case-table__bg-td.g-show_xs(v-if="request.portfolio && request.portfolio.webSiteId" hidden)
                                    svg-inline(:src="getSrcFundIcon(request.portfolio.webSiteId)")
                                .td__name(:class="'td__name_'+index")
                                    .case-table__icon-wrap
                                        .case-table__icon.g-show_xs(v-if="request.portfolio" hidden)
                                            svg-inline(:src="getSrcFundIcon(request.portfolio.webSiteId)")
                                        div(v-if="request.portfolio")
                                            span.g-hide_xs УРАЛСИБ
                                            br
                                            span(v-html="request.shortName")
                                        div(v-else) Анкета
                                .case-table__toggle.g-hidden.g-show_md
                                    .g-icon-down(:class="{'g-icon-down_open': isRowOpen(index, 'requestTable') }")
                            td.case-table__td-promo(title="Дата заявки" v-html="request.sentDate || '–'").g-ws_nw
                            td.case-table__td-md(title="Тип заявки" v-html="request.type == 'buy' ? 'Приобретение' : request.type == 'sell' ? 'Погашение' : request.type == 'exch' ? 'Обмен' : 'Изменение анкетных данных'")
                            td.case-table__td-md(title="№ заявки" v-html="request.number").g-ws_nw
                            td.case-table__td-md(title="№ лицевого счета в реестре" v-html="request.accountNumber || '–'").g-ws_nw
                            td.case-table__td-md.g-col_xs_6.g-col_md_a.g-f_l_xs(title="Статус" v-html="request.statusName")
                            td.case-table__td-md(title="Просмотр").g-hide-b_xs
                                .g-ws_nw
                                    button.btn.btn_preview.btn_o.g-mr_4.g-mr_2_xs(@click="jsToggleTable(index, 'requestTable'), getRequestFile(request,$event)" :disabled="disableDownload")
                                        span(title="pdf").icon.icon_file_pdf
                                        span.g-sr-only Скачать pdf
                                    button.btn.btn_preview.btn_o(@click="showPopup(request), jsToggleTable(index, 'requestTable')")
                                        span(title="Просмотр").icon.icon_preview_2
                                        span.g-sr-only Просмотр
                paginator(:settings="{page: page, max_page: sortedRequests.length / 20}" @paginate="changePage")
        .g-pt_3.g-pt_3_xs.g-ta_r
            a(href="#" @click.prevent="convertToXLS()").btn.btn_o.btn-link.btn_preview_download
                span.g-icon.g-mr_1
                    svg(width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.474 93.474" enable-background="new 0 0 93.474 93.474")
                        path(fill="",d="M54.804 51.293l-6.241 5.991v-21.129c0-1.104-.896-2-2-2s-2 .896-2 2v21.908l-6.52-6.771c-.78-.781-1.922-.781-2.703 0s-.719 2.047.062 2.828l9.825 9.795c.375.375.899.586 1.43.586.531 0 1.047-.211 1.422-.586l.147-.143c.173-.126.326-.277.451-.451l9.203-9.201c.781-.781.656-2.047-.125-2.828-.778-.781-2.171-.781-2.951.001zM72.854 34.069c-1.252 0-2.365.347-3.347.652l-.722.217c-4.002-9.179-13.133-15.237-23.221-15.237-12.673 0-23.236 9.248-25.049 21.467-1.082-.213-2.162-.32-3.228-.32-9.694-.001-17.287 7.136-17.287 16.487 0 9.324 7.593 16.438 17.287 16.438h55.566c11.562 0 20.621-8.554 20.621-19.716.001-11.314-9.057-19.988-20.62-19.988zm0 35.705h-55.566c-7.575 0-13.287-5.239-13.287-12.438 0-7.229 5.712-12.583 13.287-12.583 1.289 0 2.616.257 3.886.651l.443.177c.593.204 1.251.13 1.772-.22.521-.353.847-.923.879-1.552.569-11.278 9.924-20.11 21.296-20.11 8.961 0 17.025 5.68 20.068 14.133.285.793 1.113 1.323 1.957 1.323 1.131 0 2.18-.326 3.105-.614.779-.243 1.514-.471 2.158-.471 9.32 0 16.621 6.917 16.621 15.989.002 8.918-7.299 15.715-16.619 15.715z")
                | Скачать
</template>
<script>
    import moment from 'moment';
    import FileSaver from 'file-saver';

    import DateFilter from './DateFilter';
    import Paginator from './Paginator';
    import { xml } from '../mixins';
    import Dropdown from '../components/Dropdown.vue';

    export default {
        components: {Paginator, DateFilter, 'drop-down': Dropdown},
        mixins: [xml],
        props: ['show'],
        watch: {
            sortedRequests() {
                this.page = 1;
            }
        },
        data() {
            return {
                dateStart: undefined,
                dateEnd: undefined,

                xmlTitle: 'Uralsib Requests',
                xmlSubject: 'Requests',
                sheetName: 'Requests 1',
                requestTable: [],

                requests: [],
                sortFundName: '*',
                sortType: '*',
                sortStatus: '*',
                page: 1,

                selected: [],

                disableDownload: false,
                loaded: false
            }
        },
        created() {
            this.getRequests();
        },
        methods: {
            getRequests() {
                this.loaded = false;
                const dateStart = moment(this.dateStart);
                const dateEnd = moment(this.dateEnd);

                axios.get('/apps/allapps', {
                    params: {
                        start: this.dateStart && dateStart.isValid() ? dateStart.format('YYYY-MM-DD') : undefined,
                        end: this.dateEnd && dateEnd.isValid() ? dateEnd.format('YYYY-MM-DD') : undefined
                    }
                }).then(({data}) => {
                    this.requests = data.map(item => {

                        if (item.created) {
                            let date = moment(item.created);


                            item.time = moment.parseZone(date).format('HH:mm');

                            item.sentDate = date.format('DD.MM.YYYY');
                        } else {
                            item.time = '';
                            item.sentDate = '';
                        }

                        if (item.portfolio && item.portfolio.description.includes('УК УралСиб')) {
                            let shortName = item.portfolio.description.match(/УралСиб [А-ЯЁа-яё ]*/i);
                            item.shortName = shortName ? shortName[0].replace(/УралСиб|Фонд/g, '').trim() : '';
                        } else if (item.portfolio && item.portfolio.description) {
                            item.shortName = item.portfolio.description.replace('УРАЛСИБ', '').trim();
                        } else {
                            item.shortName = 'Анкета';
                        }

                        return item;
                    });

                    this.loaded = true;
                });
            },
            defaultDate(event, type) {
                this.dateStart = event[0];
                this.dateEnd = undefined;

                this.getRequests();
            },
            customDate(event, type) {
                if (event[0] == 'dateStart') this.dateStart = event[1];
                else this.dateEnd = event[1];

                this.getRequests();
            },
            getTableData() {
                let data = this.checkRows();

                data.unshift([
                    'Наименование фонда',
                    'Тип заявки',
                    'Дата заявки',
                    '№ заявки',
                    '№ лицевого счета в реестре',
                    'Статус',
                ]);

                return data;
            },
            checkRows() {
                let list = _.cloneDeep(this.sortedRequests)
                    .map(item => {
                        return [
                            item.portfolio ? item.portfolio.description : '',
                            item.type == 'buy' ? 'Приобретение' : item.type == 'sell' ? 'Погашение' : item.type == 'exch' ? 'Обмен' : 'Изменение анкетных данных',
                            item.sentDate || '',
                            item.number || '',
                            item.accountNumber || '',
                            item.statusName || ''
                        ];
                    });

                return list;
            },
            getRequestFile(file,event) {
                this.disableDownload = true;

                let name = file.portfolio.description.replace('<br />', ' ') + ' ' + file.number + ' ' + file.sentDate;
                let operation = file.type == 'buy' ? 'buyapps' : file.type == 'sell' ? 'sellapps' : file.type == 'exch' ? 'exchapps' : 'ClientProfileApp';

                this.downloadFile(`/${operation}/${file.applicationId}/pdf`, `${name}.pdf`,event);
            },
            showPopup(doc) {
                window.log(doc);
                window.events.$emit('show_popup', ['preview-docs', {doc}]);
            },
            changePage(page) {
                this.page = page;
            },
            jsToggleTable(index, table) {
                let array_index = this[table].indexOf(index);

                if (array_index > -1) this[table].splice(array_index, 1);
                else this[table].push(index);
            },
            isRowOpen(index, table) {
                return this[table].indexOf(index) > -1;
            }
        },
        computed: {
            sortedRequests() {
                let data = _.cloneDeep(this.requests);

                data = data.filter(item => {
                    if (this.sortFundName == '*') return true;

                    return item.shortName == this.sortFundName;
                }).filter(item => {
                    if (this.sortType == '*') return true;

                    return item.type == this.sortType;
                }).filter(item => {
                    if (this.sortStatus == '*') {
                        return true;
                    } else if (this.sortStatus == 'Не подтверждено') {
                        return item.statusName == null;
                    } else {
                        return item.statusName == this.sortStatus;
                    }
                });
                return data;
            },
            requestFilters() {
                let data = _.cloneDeep(this.requests);
                return {
                    names: _.uniq(data.map(item => item.shortName.trim())).sort(),
                    operations: _.uniqBy(data.map(item => {
                        return [
                            item.type,
                            item.type == 'buy' ? 'Приобретение' : item.type == 'sell' ? 'Погашение' : item.type == 'exch' ? 'Обмен' : 'Изменение анкетных данных'
                        ]
                    }), 0),
                    statuses: _.uniq(data.map(item => {
                        if(item.statusName !== null) {
                            return item.statusName.trim()
                        } else {
                            return 'Не подтверждено'
                        }
                    })).sort()
                }
               
            },
            paginatedTable() {
                let data =  _.cloneDeep(this.sortedRequests);

                data = data.splice((this.page - 1) * 20, 20);

                return data;
            }
        }
    }
</script>
