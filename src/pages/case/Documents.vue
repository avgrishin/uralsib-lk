<template lang="pug">
    casenav
        section
            // h1.g-hide_xs Документы
            .g-tabs
                .g-tabs__header.g-mb_6.g-mb_2_xs
                    a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 0}" @click.prevent="selected_tab = 0") Заявки
                    a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 3}" @click.prevent="selected_tab = 3") Анкета
                    .g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 1}" @click.prevent="selected_tab = 1") Документы клиента
                    a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 4}" @click.prevent="selected_tab = 4") Отчёты ДУ
                    //- a.g-tabs__btn.g-mb_1_xs.g-mr_3_md(:class="{active: selected_tab == 2}" @click.prevent="selected_tab = 2") Отчёты ДУ
                .g-tabs__contents
                    applications(:show="selected_tab == 0")
                    .g-tabs__content(v-show="selected_tab == 1")
                        ul.g-plain
                            li.g-mb_2(v-if="lastPdf")
                                button(type="button" @click.prevent="disableDownload=true;downloadFile(`/ClientProfileApp/${lastPdf}/pdf`, 'анкета.pdf',$event)" :disabled="disableDownload").btn.btn_file.btn_o
                                    | Анкета клиента #[span.g-fw_3 (50КБ)]
                                    span(title="pdf").icon.icon_file_pdf.g-fr
                            template(v-if="strategiesDocsFiltered && strategiesDocsFiltered.length")
                                li.g-mb_2(v-for="(item, index) in strategiesDocsFiltered", :key="`docs_strategy_${index}`")
                                    button(
                                        type="button",
                                        @click.prevent="disableDownload=true; downloadFile({duUrl:`/amContracts/${item.portfolioID}/GenerateDuJoiningApplicationPdf`}, `Заявление на присоединение к договору «${item.findStrategy.strategyName}» №${item.number}.pdf`,$event)" :disabled="disableDownload"
                                    ).btn.btn_file.btn_o Заявление на присоединение к договору «{{item.findStrategy.strategyName}}» №{{item.number}}
                                        span(title="pdf").icon.icon_file_pdf.g-fr
                            template(v-if="userDocs && userDocs.length")
                                li.g-mb_2(v-for="(item, index) in userDocs", :key="`user_document_${index}`")
                                    button.btn.btn_file.btn_o(
                                        type="button",
                                        @click.prevent="download(item,$event)" :disabled="disableDownload"
                                    )
                                        | {{ item.docName.replace(/_/g, ' ') }}
                                        span(title="pdf").icon.icon_file_pdf.g-fr
                            li.g-mb_2(v-if="0")
                                a(href="/downloads/account.pdf" download="account.pdf").btn.btn_file.btn_o
                                    | Заявление на открытие счета в реестре #[span.g-fw_3 (70КБ)]
                                    span(title="pdf").icon.icon_file_pdf.g-fr
                            li.g-mb_2(v-if="0")
                                button(type="button" @click.prevent="downloadDoc('/docs/RiskNotationPdf')" :disabled="disableDownload").btn.btn_file.btn_o
                                    | Уведомление о рисках #[span.g-fw_3 (70КБ)]
                                    span(title="pdf").icon.icon_file_pdf.g-fr
                        .spinner(v-show="isLoading")

                    .g-tabs__content(v-show="selected_tab == 2  || selected_tab == 4")
                        .page-section
                            .case-data
                                table.case-table(v-show="!isLoading")
                                    caption.case-table__title Отчёты
                                    thead
                                        tr
                                            th Отчет
                                            th
                                            th № отчета
                                            th Дата отчета
                                    tr.case-table__tr-md(v-for="(report, index) in duReports" :key="index - 1000" , :class="{'case-table__tr-md_open': isRowOpen(index, 'reportTable') }")
                                        td.case-table__td-md-name.g-hide-b_xs(title="Отчет")
                                            .td__name(@click="download(report)", :class="{'g-link-disabled': disableDownload}" v-html="report.docName.replace(/_/g, ' ')")
                                            .case-table__toggle.g-hidden.g-show_md
                                                .g-icon-down(@click.prevent="jsToggleTable(index, 'reportTable')", :class="{'g-icon-down_open': isRowOpen(index, 'reportTable') }")
                                        td.case-table__td-md(title="Скачать")
                                            button.btn.btn_preview.btn_o.g-mr_1.g-va_m.btn_o(@click="download(report,$event)" :disabled="disableDownload")
                                                span(title="Просмотр").icon.icon_file_pdf
                                                span.g-sr-only Скачать
                                            span(v-html="`(${report.fileSizeString} МБ)`")
                                        td.case-table__td-md(title="№ отчета" v-html="report.docNumber")
                                        td.case-table__td-md(title="Дата отчета" v-html="formatDate(report.docDate)")
                                .spinner(v-show="isLoading")
                    forms(:show="selected_tab == 3")
</template>
<script>
import moment from 'moment-timezone';
import FileSaver from 'file-saver';

import CaseNav from './CaseNav';
import Applications from '../../components/Applications';
import Forms from '../../components/Forms';

export default {
    components: { 'casenav': CaseNav, Applications, Forms },
    data() {
        return {
            reportTable: [],
            selected_tab: 0,
            selected: [],

            duReports: [],
            userDocs: [],

            lastPdf: false,
            disableDownload: false,
            toggleCaseChild: false,

            strategiesDocs: [],
            loaded: {
                reports: false,
            },
            loadingFlags: {
                duReports: false,
                userDocs: false,
                iisDuList: false,
            },
        };
    },
    created() {
        this.getDuIIsList();
        this.getDocs();
        this.chechdownloadFormLast();
        this.$store.commit('updateCrumbs', [
            { link: '/', text: 'Портфель' },
        ]);
        if (this.$route.query.tab) {
            this.selected_tab = this.$route.query.tab;
        }
    },
    methods: {
        jsToggleTable(index, table) {
            let array_index = this[table].indexOf(index);

            if (array_index > -1) this[table].splice(array_index, 1);
            else this[table].push(index);
        },
        isRowOpen(index, table) {
            return this[table].indexOf(index) > -1;
        },

        getDuIIsList() {
            this.loadingFlags.iisDuList = true;
            this.$store.dispatch('iisDU/iisDuGetList').then(({ getDUAllContracts, getlist }) => {
                this.strategiesDocs = getDUAllContracts;
                this.strategiesDocs.map(item => {
                    const findStrategy = getlist.find(strategy => strategy.webSiteID === item.strategyCode);
                    item.findStrategy = findStrategy;
                    return item;
                });
            }).finally(() => {
                this.loadingFlags.iisDuList = false;
            });
        },

        /**
         * Получение данных для вкладки "Отчеты ДУ"
         * @return {Promise<void>}
         */
        async getDUReports() {
            this.loadingFlags.duReports = true;

            try {
                const duReports = await axios.get('/docs/idu').then(({ data }) => data);

                if (!duReports && !Array.isArray(duReports)) {
                    throw new TypeError('Ошибка при получении отчетов ДУ');
                    return;
                }

                this.duReports = duReports;
            } catch (e) {
                flash([e.message], 'error');
            } finally {
                this.loadingFlags.duReports = false;
            }
        },

        /**
         * Получение данных для вкладки "Документы клиенты"
         * @return {Promise<void>}
         */
        async getUserDocs() {
            this.loadingFlags.userDocs = true;

            try {
                const [iisReports, otherDocs] = await Promise.all(
                    [
                        axios.get('/docs/iisReports').then(({ data }) => data),
                        // await axios.get('/docs/idu').then(({ data }) => data), // тоже для теста
                        // await axios.get('/docs/idu').then(({ data }) => data) // тоже для теста
                        // Promise.resolve([]), // на песке не работал iisReports, заглушка для теста
                        axios.get('/docs/other').then(({ data }) => data),
                    ],
                );

                console.log(iisReports, otherDocs);

                if (!iisReports || !Array.isArray(iisReports)) {
                    throw new TypeError('Ошибка при получении документов клиента');
                }

                if (!otherDocs || !Array.isArray(otherDocs)) {
                    throw new TypeError('Ошибка при получении документов клиента');
                }

                this.userDocs = [...iisReports, ...otherDocs];
            } catch (e) {
                window.flash([e.message], 'error');
            } finally {
                this.loadingFlags.userDocs = false;
            }
        },

        async getDocs() {
            this.getDUReports();
            this.getUserDocs();
        },

        formatDate(date) {
            return moment(date).format('DD.MM.YYYY');
        },
        download(file, event) {
            this.disableDownload = true;

            let docID = file.applicationId || file.id;
            let name = file.docName || (file.portfolio.description.replace('<br />', ' ') + '_' + file.number + '_' + file.sentDate);

            this.downloadFile(`/Docs/${docID}`, `${name}.pdf`, event);
        },
        chechdownloadFormLast() {

            axios.get('/ClientProfileApp/last').then(({ data }) => {
                this.lastPdf = data.id;

            }).catch(({ responsive }) => {
            });
        },
        downloadDoc(url) {
            this.downloadFile(url, 'risk.pdf');
        },
    },
    computed: {
        isLoading() {
            return Object.values(this.loadingFlags).some(flag => flag);
        },

        strategiesDocsFiltered() {
            return this.strategiesDocs.filter(document => document.isBoughtFromLKK);
        },
    },
};
</script>


