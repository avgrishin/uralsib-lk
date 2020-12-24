<template lang="pug">
    .g-tabs__content(v-show="show")
        .case-data
            table.case-table.g-mb_4(v-show="loaded")
                caption.case-table__title Анкета
                thead
                    tr
                        th Заявка
                        th № заявки
                        th Дата заявки
                        th
                            drop-down.dropdown_trans.case-table__sort.dropdown_status(name="Статус")
                                .dropdown__item
                                    button.g-btn-txt(@click.prevent="sortStatus = '*'") Все статусы
                                .dropdown__item(v-for="item in requestFilters.statuses")
                                    button.g-btn-txt(@click.prevent="sortStatus = item" v-html="item")
                        th
                tr.case-table__tr-md(v-for="item in paginatedTable" :key="item.applicationId")
                    td.case-table__td-md-name(title="Заявка") Изменение анкетных данных
                    td.case-table__td-md(title="№ заявки" v-html="item.number")
                    td.case-table__td-md(title="Дата заявки" v-html="item.date")
                    td.case-table__td-md(title="Статус" v-html="item.statusName")
                    td.case-table__td-md(title="Просмотр").g-hide-b_xs
                        .g-ws_nw
                            button.btn.btn_preview.btn_o.g-mr_4.g-mr_2_xs(@click="downloadForm(item,$event)" :disabled="disableDownload")
                                span(title="pdf").icon.icon_file_pdf
                                span.g-sr-only Скачать pdf
                            button.btn.btn_preview.btn_o(@click="showPopup(item)")
                                span(title="Просмотр").icon.icon_preview_2
                                span.g-sr-only Просмотр
            .spinner(v-show="!loaded")
            paginator(:settings="{page: page, max_page: sortedRequests.length / 20}" @paginate="changePage")
</template>
<script>
    import FileSaver from 'file-saver';
    import moment from 'moment-timezone';
    import Dropdown from '../components/Dropdown.vue';
    import Paginator from './Paginator';

    export default {
        components: {Paginator, 'drop-down': Dropdown},
        props: ['show'],
        data() {
            return {
                forms: [],
                loaded: false,
                disableDownload: false,

                page: 1,
                toggleCaseChild: false,
                sortStatus: '*',
                table: []
            }
        },
        created() {
            this.getForms();
        },
        methods: {
            formatDate(date){
                let checkDate = moment(date).clone();
                return checkDate.isValid() ? checkDate.format('DD.MM.YYYY') : '–';
            },
            getForms() {
                axios.get('/apps/cpapps').then(({data}) => {

                    this.forms = data.map(item => {

                        if (item.created) {
                            let date = moment(item.created);

                            item.time = moment.parseZone(date).format('HH:mm');
                            item.sentDate = moment.parseZone(date).format('DD.MM.YYYY');
                        } else {
                            item.time = '';
                            item.sentDate = '';
                        }

                        //item.date = this.formatDate(item.created);
                        //item.sentDate = this.formatDate(item.sentDate);

                        return item;
                    });

                    this.loaded = true;
                }).then(null, err => window.log(err));
            },
            downloadForm(profile,event) {
                this.disableDownload = true;

                this.downloadFile(`/ClientProfileApp/${profile.applicationId}/pdf`, `${profile.number}.pdf`,event);
            },
            showPopup(doc) {
                window.events.$emit('show_popup', ['preview-docs', {doc}]);
            },
            changePage(page) {
                this.page = page;
            },
            jsToggleTable(index) {
                let array_index = this.table.indexOf(index);

                if (array_index > -1) this.table.splice(array_index, 1);
                else this.table.push(index);
            },
            isRowOpen(index) {
                return this.table.indexOf(index) > -1;
            }
        },
        computed: {
            sortedRequests() {

                let data = _.cloneDeep(this.forms);
                data = data
                    .filter(item=> {
                        return item.status !=-1;
                    })
                    .filter(item => {
                    if (this.sortStatus == '*') return true;

                    return item.statusName == this.sortStatus;
                });

                return data;
            },
            requestFilters() {
                let data = _.cloneDeep(this.sortedRequests);

                return {
                    statuses: _.uniq(data.map(item => item.statusName.trim())).sort(),
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
