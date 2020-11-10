<template lang="pug">
    casenav
        section
            h2(v-html="`Данные по портфелю <br class='g-hidden g-show_xs'> на ${dateDisclaimer}*`")
            casetable(:table="case_table" v-show="!isLoading")
            .spinner(v-show="isLoading")
            .g-row.g-pt_7.g-pt_2_md
                p.g-col.g-col_md_4
                    router-link(to="/funds", class="btn btn_primary btn_block g-mb_1_xs") Все фонды
                p.g-col.g-col_md_4
                    router-link(to="/strategies/du",  class="btn btn btn_primary btn_block g-mb_1_xs g-hide_md g-show_xs") Доверительное управление
                    router-link(to="/strategies/du",  class="btn btn btn_primary btn_block g-mb_1_xs g-hidden g-show_md g-hide_xs" hidden) Ду
                p.g-col.g-col_md_4
                    router-link(to="/strategies/iis",  class="btn btn btn_primary btn_block g-mb_1_xs") ИИС
                p.g-col.g-col_md_12
                    ui-disclaimer.text-note(tag="small")

</template>
<script>
import moment from 'moment';

import CaseTable from '../../components/case-table/Table';
import CaseNav from './CaseNav';
import UiDisclaimer from '../../components/ui/UiDisclaimer';

    export default {
        components: {
            UiDisclaimer,
            'casetable': CaseTable,
            'casenav': CaseNav
        },
        data() {
            return {
                disclaimerTextBalance: '',
                case_table: {},
                loaded: {
                    balance: false
                },
                isLoading: false,
            }
        },
        created() {
            this.getCaseTableData();
            this.getTextDisclaimer();
        },
        methods: {
            getTextDisclaimer() {
                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'Balance',
                    }
                }).then(({data}) => {

                this.disclaimerTextBalance = data.outText;

            });
        },
        getCaseTableData() {
            this.isLoading = true;
            axios.all([
                !this.$store.state.iisDU.list.length ? this.$store.dispatch('iisDU/iisDuGetList') : '',
                axios.get('/reports/AssetsEstimateDU')
            ])
                .then(
                    axios.spread(({ data: iisDuGetList }, { data: AssetsEstimateDU }) => {

                        let table_data = {
                            total: 0,
                            total_pif: 0,
                            total_du: 0,
                            profit_pif: 0,
                            profit_2: 0,
                            share_pif: 0,
                            share_du: 0,
                            data: []
                        };

                        if (!AssetsEstimateDU.length) {
                            this.loaded.balance = true;
                            return this.case_table = table_data;
                        }

                        window.temp = 0;

                        AssetsEstimateDU.forEach(item => {
                            if (item.pif == 'ДУ') {
                                item.sCode = item.smallIcon;
                                item.smallIcon = `Styles/Images/PrtfIcons/${item.iD_PRTF}-s.jpg`;
                                /*   item.outqnt=1;*/
                                table_data.total_du += item.outamnt;

                                // if (item.outqnt > 0) {
                                    table_data.profit_du += item.prlosT_NR;
                                // }

                            } else /*if (item.outqnt > 0)*/ {
                                table_data.profit_pif += item.prlosT_NR;

                                window.temp += item.profiT_2;
                            }

                        });
                        /**/
                        let funds = _.groupBy(AssetsEstimateDU, 'prtf');

                        for (let name in funds) {
                            let items = funds[name];
                            let item = this.formatTableData(items);
                            if (item.type != 'ДУ') {
                                table_data.total_pif += item.amount;

                                //window.log(table_data.profit_pif);

                            }
                            table_data.data.push(item);
                        }

                        table_data.total = table_data.total_pif + table_data.total_du;
                        if (table_data.total != 0) {
                            table_data.share_pif = table_data.total_pif * 100 / table_data.total;
                            table_data.share_du = table_data.total_du * 100 / table_data.total;
                        }
                        
                        table_data.data = table_data.data.map(item => {
                            item.share = item.amount * 100 / table_data.total;
                            item.children = item.children.map(child => {
                                child.share = child.amount * 100 / table_data.total;
                                return child;
                            });

                            return item;
                        });

                        this.loaded.balance = true;
                        this.loaded.case_structure = true;

                        this.case_table = table_data;

                        axios.get('/reports/AssetsEstimateTotal').then(({ data }) => {
                            if (data.length > 0){
                                this.case_table.profit_pif = data[0].prlosT_NR;
                                this.case_table.profit_2 = data[0].profiT_2;
                            }
                        });

                        this.case_table.data = this.case_table.data.filter(item => /*item.id &&*/ item.share);
                    })
                )
                .catch((error) => {
                    flash([error.message], 'error');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        formatTableData(items) {
            let data = {
                id: '',
                name: '',
                amount: 0,
				amountVal: 0,
				Val: '',
                profit: 0,
                profit_per: 0,
                children: [],
                type: '',
                quantity: 0,
                sCode: '',
                sCodeType: ''
            };

            items.forEach(item => {
                const sCode = _.get(item, 'sCode', '');
                const productInState = this.$store.state.iisDU.list.find(str => str.sCode.toLowerCase() === sCode.toLowerCase());
                const productInStateSType = productInState ? productInState.sType : '';

                //if (item.outqnt > 0) {
                    let matches = [];
                    if (item.smallIcon) matches = item.smallIcon.match(/\/([a-z0-9]*)-s.jpg$/);
                    data.type = item.pif;
                    data.id = matches ? matches[1] : '';
                    data.name = item.prtf;
                    data.amount += item.outamnt;
					data.amountVal += item.outamntusd > 0 ? item.outamntusd : item.outamnt;
                    data.Val = item.outamntusd > 0 ? 'Доллары США' : 'Рубли РФ';
                    data.profit += item.outamntusd > 0 ? item.prlosT_NR_USD: item.prlosT_NR;
                    data.profit_per += item.profiT_2;
                    data.children.push({
                        name: item.opeR_ACC,
                        amount: item.outamnt,
                        profit: this.formatCurrency(item.prlosT_NR),
                        profit_per: item.profiT_2 ? item.profiT_2.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : 0
                    });
                    data.quantity += item.outqnt;
                    data.sCode = item.sCode;
                    data.sCodeType = data.type === 'ДУ' ? productInStateSType : '';
                //}
            });

            data.amount = data.amount;
            data.profit = this.formatCurrency(data.profit, false, data.Val);

            data.profit_per = data.profit_per;
            data.profit_per = data.profit_per ? data.profit_per.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : 0;

            return data;
        }
    },
    computed: {
        dateDisclaimer() {
            return this.$store.state.user.state.portfolioDate;
        }
    }
};
</script>
