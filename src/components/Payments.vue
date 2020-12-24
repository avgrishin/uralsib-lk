<template lang="pug">
    .g-tabs__content(v-show="show")
        date-filter(text="Выберите период" @filter_time="customDate" @start_of="defaultDate")
        .page-section
            .case-data
                table.case-table.g-mb_4()#js-paginator-scroll-top
                    caption.case-table__title Оплаты
                    thead
                        tr
                            th Дата
                            th Сумма
                            th Продукт
                            th
                                .g-ws_nw(style="visibility: hidden")
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
                    tbody.case-table__style-icon_xs(v-for="(request, index) in paginatedTable"       :key="index" :class="{'case-table__style-icon_open': isRowOpen(index) }")
                        tr.case-table__tr-md(@click.prevent="jsToggleTable(index)", :class="{'case-table__tr-md_open': isRowOpen(index) }")
                            td.case-table__td-md-name.case-table__td-icon.g-hide-b_xs(title="Дата")
                                .td__name(:class="'td__name_'+index")
                                    .case-table__icon-wrap
                                        div(v-html="request.evtDate")
                                .case-table__toggle.g-hidden.g-show_md
                                    .g-icon-down(:class="{'g-icon-down_open': isRowOpen(index) }")
                            td.case-table__td-promo(title="Сумма" v-html="formatCurrency(Math.abs(request.summ))")
                            td.case-table__td-md(title="Продукт" v-html="request.desc").g-ws_nw
                            td.case-table__td-md(title="Просмотр").g-hide-b_xs
                                .g-ws_nw
                                    button.btn.btn_preview.btn_o(@click="showPopup(request), jsToggleTable(index)")
                                        span(title="Просмотр").icon.icon_preview_2
                                        span.g-sr-only Просмотр
                paginator(:settings="{page: page, max_page: requests.length / 7}" @paginate="changePage")
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

                axios.get('/payments/allpayed', {
                    params: {
                        start: this.dateStart && dateStart.isValid() ? dateStart.format('YYYY-MM-DD') : undefined,
                        end: this.dateEnd && dateEnd.isValid() ? dateEnd.format('YYYY-MM-DD') : undefined
                    }
                }).then(({ data }) => {
                    this.requests = data;
                    this.loaded = true;
                    this.page = 1;
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
            showPopup(data) {
                window.events.$emit('show_popup', ['preview-payms', { ...data }]);
            },
            changePage(page) {
                this.page = page;
            },
            jsToggleTable(index) {
                let array_index = this.requestTable.indexOf(index);

                if (array_index > -1) this.requestTable.splice(array_index, 1);
                else this.requestTable.push(index);
            },
            isRowOpen(index) {
                return this.requestTable.indexOf(index) > -1;
            }
        },
        computed: {
            paginatedTable() {
                let data =  _.cloneDeep(this.requests);
                data = data.splice((this.page - 1) * 7, 7);
                return data;
            }
        }
    }
</script>
