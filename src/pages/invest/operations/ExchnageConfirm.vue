<template lang="pug">
    casenav
        article.content
            h1.g-hide_xs Обменять паи
            p.red_text 4 июня 2021 производится дробление инвестиционных паев с коэффициентом 1:100, то есть из одного инвестиционного пая образуются 100 инвестиционных паев.
            form.form_approve
                fieldset.g-mb_2
                    legend.control-label-top-title_xs
                        .h2 Паи к обмену
                    .g-row.g-row_ib
                        .control.g-col.g-col_lg_4.g-col_md_5
                            label.control__label-top  Наименование фонда
                            .control__field
                                v-select(
                                    placeholder="Выберите фонд" 
                                    v-validate:fund_from="'required'" 
                                    name="fund_from" 
                                    :class="{invalid_force: errors.has('fund_from')}" 
                                    v-model="fund_from" 
                                    label="description"
                                    :loading="loadingSelect"
                                    :options="funds_from"
                                    @input="fundAvailableToChange"
                                ).field-select
                                    span(slot="no-options")
                        .control.g-col.g-col_lg_3.g-col_md_4
                            label.control__label-top Номер счёта в реестре
                            .control__field
                                v-select(v-model="account_from" key="id" label="title" :options="accounts_from" v-if="accounts_from.length > 1").field-select
                                    span(slot="no-options")
                                input(type="text" :value="account_from.title" style="opacity: 1;" disabled v-else).field_text
                        .g-col.g-col_lg_5.g-hide_md
                        label.control.g-col.g-col_lg_4.g-col_md_5
                            .control__label-top Количество паев
                            .control__field
                                input(type="text", name="amount" v-model="amount" :disabled="account_from == false || account_from == null" v-validate="{required: true, pif: amount_ref}" data-vv-as="кол-во").field_text#amount
                                span.field_error(v-if="errors.has('amount')" v-html="errors.first('amount')")
                        label.control.g-col.g-col_lg_3.g-col_md_4
                            .control__label-top.g-mb_1(v-html="`Стоимость паев, ${rubleSign}`")
                            .control__field.h1.g-clr_gray.g-fw_3.g-ws_nw.g-mb_0(v-html="totalPrice")
                        .control
                fieldset.g-mt_3_m_xs
                    legend.control-label-top-title_xs
                        .h2 Паи к зачислению
                    .g-row
                        .control.g-col.g-col_lg_4.g-col_md_5
                            label.control__label-top  Наименование фонда
                            .control__field
                                v-select(placeholder="Выберите фонд" v-validate:fund_to="'required'" name="fund_to" :class="{invalid_force: errors.has('fund_to')}" v-model="fund_to" key="id" label="description" :options="fundAvailable").field-select
                                    span(slot="no-options")
                        .control.g-col.g-col_lg_3.g-col_md_4
                            .control__label-top
                                label Номер счёта в реестре
                            .select-plus.g-col_xs_12
                                button(@click.prevent="account_to = null" type="button" v-if="account_to").btn.btn_plus.tooltip-wrap
                                    span.g-icon.g-icon_plus
                                    span.tooltip.g-ws_nw Добавить новый номер счёта в реестре
                                v-select(v-model="account_to" key="id" label="title" :options="accounts_to" v-if="accounts_to.length > 1 || (accounts_to.length && !account_to)" placeholder="Новый счет").field-select
                                    span(slot="no-options")
                                input(type="text" :value="account_to ? account_to.title : ''" style="opacity: 1;" :placeholder="accounts_to.length == 0 ? 'Новый счет' : ''" disabled v-else).field_text
                        .control
                    .g-row.g-mb_2
                        .control.g-col.g-col_lg_8
                            label.checkbox(:class="{'checkbox_error': errors.has('correct_data')}")
                                input(type="checkbox", v-model="term1" v-validate="'required'" name="term1")
                                .checkbox__text Срок проведения операции составляет до 5(пяти) рабочих дней
                    .g-row.g-mb_2
                        .control.g-col.g-col_lg_8
                            label.checkbox(:class="{'checkbox_error': errors.has('correct_data')}")
                                input(type="checkbox", v-validate="'required'" v-model="terms" name="correct_data", id="FPP_CORRECT_DATA")
                                span.checkbox__text(v-html="disclaimerTextOperChange")
                    .g-row
                        .control.g-col.g-col_lg_8
                            label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('correct_data')}")
                                input(type="checkbox", v-model="term2" v-validate="'required'" name="term2")
                                .checkbox__text Заявка носит безотзывной характер

                            button(type="submit" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" @click.prevent="exchange").btn.g-col_md_3.g-col_xs_12 Подписать

                            p.g-mt_5
                                small.text-note(v-text="disclaimerTextOperChangeDate")
</template>

<script>
    import Inputmask from "inputmask";
    import moment from 'moment';
    import CaseNav from '../../case/CaseNav.vue';
    import { confirmPersonalData } from '../../../guards';
    export default {
        components: { 'casenav': CaseNav },
        beforeRouteEnter:confirmPersonalData,
        data() {
            return {
                funds_from: [],
                fund_from: null,
                fund_to: null,
                amount: '',
                amount_ref: 0,
                disclaimerTextOperChange: '',
                disclaimerTextOperChangeDate: '',
                accounts_from: [],
                account_from: false,
                accounts_to: [],
                account_to: false,

                fundAvailable: [],

                terms: false,
                term1: false,
                term2: false,
                fund_data: []
            }
        },
        watch: {
            account_from(val){
                if (!val) return;
                this.setAmount();
            },
            fund_from(val) {
                if(!val) {
                    this.refreshComponent();
                    return;
                }

                this.getAccounts('from');
                this.setAmount();
            },
            fund_to(val) {
                if (!val) return;
                this.getTextDisclaimer();
                this.getAccounts('to');
            },
            amount(val) {
                if (parseFloat(val) > this.amount_ref) this.amount = this.amount_ref;
            }
        },
        created() {

            axios.get('/reference/getsitetext', {
                params: {
                    place: 'OperChangeDate',
                }
            }).then(({data}) => {
                this.disclaimerTextOperChangeDate = data.outText;

            });
            this.getTextDisclaimer();

            this.getFundInfo().then(({ data }) => {
                let dataSelect = data
                let dataSelectArr = []
                dataSelect.forEach((dataSelectItem) => {
                    axios.get('/reference/accountsbyfond', {
                        params: {
                            portfolioId: dataSelectItem.iD_PRTF
                        }
                    }).then(({
                        data
                    }) => {
                        data.forEach((dataItem) => {
                            let item = dataSelect.find(item => item.opeR_ACC == dataItem.title)
                            if(item) {
                                dataSelectArr.push(dataSelectItem) 
                            }
                        });
                    });
                });
                this.fund_data = dataSelectArr;
                this.getAvailableFunds();
            });



            this.$store.commit('popupConfirmOff', false);

            window.events.$on('code_confirmed', this.onCodeConfirmed);
            window.events.$on('going_back', this.refreshComponent);

            this.$store.commit('updateCrumbs', [
                {link: '/', text: 'Портфель'},
                {link: '/operations', text: 'Операции с паями'}
            ]);
        },
        mounted() {
            this.$nextTick(() => {
                Inputmask({
                    alias: 'numeric',
                    radixPoint: '.',
                    digits: 6,
                    digitsOptional: true,
                    placeholder: '',
                    rightAlign: false,
                    allowMinus: false
                }).mask(document.getElementById('amount'));
            });
        },
        beforeDestroy() {
            window.events.$off('code_confirmed', this.onCodeConfirmed);
            window.events.$off('going_back', this.refreshComponent);

            [
                document.getElementById('amount')
            ].forEach(item => {
                if (item && item.inputmask) item.inputmask.remove();
            });
        },
        methods: {

            getTextDisclaimer() {

                let ffId, ftId;
                if (this.fund_from) ffId = this.fund_from.id;
                if (this.fund_to) ftId = this.fund_to.id;

                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'OperChange',
                        portfolioId: ffId,
                        portfolio2Id: ftId
                    }
                }).then(({data}) => {

                    this.disclaimerTextOperChange = data.outText;

                });
            },
            getAvailableFunds() {
                axios.get('/exchapps/selectFrom').then(({data}) => {
                   /* data.forEach((dataItem)=>{
                        this.$store.state.funds.items.forEach((item)=>{
                            if(dataItem.id == item.id) {
                                dataItem.idRegistrar = item.idRegistrar
                            }
                        })
                    });*/
                    
                    let fundFromArr = []
                    data.forEach((dataItem) => {
                        let fundSelect = this.fund_data.find(item => item.iD_PRTF == dataItem.id)
                       
                        if(fundSelect) {
                            fundFromArr.push(dataItem)
                        }
                    })
                    this.funds_from = fundFromArr;
                    
                    if (this.$route.query.fund) this.setFund(fundFromArr);
                });
            },
            setFund(data) {
                let fund = data.find(item => item.smallIcon.includes(this.$route.query.fund));

                if (fund) this.fund_from = fund;
                this.setAmount();
                this.fundAvailableToChange();
            },
            getFundInfo() {
                // return axios.get('/reports/AssetsEstimate');
                return axios.get('/reports/AssetsStructPIF');
            },
            getAccounts(direction) {

                axios.get('/reference/accountsbyfond', {
                    params: {
                        portfolioId: this[`fund_${direction}`].id
                    }
                }).then(({data}) => {
                    let dataAccounts = []
                    data.forEach((dataItem) =>{
                        let item = direction == 'from'
                            ? this.fund_data.find(item => item.opeR_ACC==dataItem.title && item.outqnt > 0)
                            : this.fund_data;

                        if(item) {
                            if(dataItem.title !== this.account_from.title) {
                                dataAccounts.push(dataItem)
                            }
                        }
                    });

                    if(direction == 'from') {
                        this[`accounts_${direction}`] = dataAccounts;
                        this.fund_to =  false;
                        this.account_to = '';
                        this.accounts_to = [];
                    } else {
                        this[`accounts_${direction}`] = dataAccounts;
                    }

                    if (dataAccounts.length) this[`account_${direction}`] = this[`accounts_${direction}`][0];
                    else this[`account_${direction}`] = false;
                });

            },
            setAmount() {

                if (!this.fund_data.length) return;

                let item = this.fund_data.find(item => {
                    if(!this.fund_from) return false;
                    return item.prtf == this.fund_from.description && item.outqnt != 0  && item.opeR_ACC==this.account_from.title
                });

                if (item) {
                    this.amount = item.outqnt;
                    this.amount_ref = item.outqnt;
                } else {
                    this.amount = '';
                    this.amount_ref = 0;
                }

                this.getTextDisclaimer();
            },
            exchange() {
               
                if(this.fund_to == false) {
                    this.fund_to =  null
                }
                this.$validator.validateAll().then(result => {
                    if (result) this.sendExchangeRequest();
                });
            },
            sendExchangeRequest() {
                let data = {
                    sourcePortfolioId: this.fund_from.id,
                    sourceAccountId: this.account_from.key,
                    count: this.amount,
                    clientId: this.$store.state.user.info.client.id,
                    portfolioId: this.fund_to.id,
                    bankingDetail: {
                        'bic': this.$store.state.user.info.bankingDetails.bic,
                        'bankName': this.$store.state.user.info.bankingDetails.bankName,
                        'accCorr': this.$store.state.user.info.bankingDetails.accCorr,
                        'accCheck': this.$store.state.user.info.bankingDetails.accCheck,
                        'accPers': this.$store.state.user.info.bankingDetails.accPers,
                        'bankBranchName': this.$store.state.user.info.bankingDetails.bankBranchName,
                        'inn': this.$store.state.user.info.bankingDetails.inn,
                        'id': this.$store.state.user.info.bankingDetails.id
                    }
                };

                if (!this.account_to) {
                    data.accountId = 0;
                    data.openAccountModel = {
                        'allowNotify': true,
                        'sendDocsByPost': true,
                        'agreeProcessPersonalData': true,
                        'notificationMethodId': 7
                    };
                } else data.accountId = this.account_to.key;
                
	            this.$store.commit('buffering', true);
                axios.post('/ExchApps', data).then(({data}) => {
	                this.$store.commit('buffering', false);
                    window.events.$emit('show_popup', ['confirm-operation', {
                        app_id: data.applicationId,
                        app_number: data.number,
                        operation: 'ExchApps',
                        noAccount: !Boolean(this.accounts_to),
                        fund: this.fund_from.description
                    }]);
                }).catch(({ response: error }) => {
	                this.$store.commit('buffering', false);
                    flash([error.data && error.data.message ? error.data.message : 'Неизвестная ошибка.'], 'error');
                });
            },
            onCodeConfirmed() {
                window.events.$emit('show_popup', ['request-accepted', {closable: false,operation: 'exchange'}]);
            },
            refreshComponent() {
                this.fund_from = false;
                this.fund_to = false;
                this.account_from = false;
                this.account_to = false;
                this.accounts_from = [];
                this.accounts_to = [];
                this.terms = false;
                this.term1 = false;
                this.term2 = false;
                this.amount = '';

                this.getAvailableFunds();
            },
            fundAvailableToChange() {
                let funds = []
                if (!this.fund_from) this.fundAvailable = [];
                    else {
                    axios.get('/exchapps/selectTo', {
                        params: {
                            prtfFrom: this[`fund_from`].id
                        }
                    }).then(({data}) => {
                        this.fundAvailable = data
                    });
                }
                // return this.$store.state.funds.items.filter(item => (item.id != this.fund_from.id && item.idRegistrar==this.fund_from.idRegistrar));
               //  return this.$store.state.funds.items
            }
        },
        computed: {
            loadingSelect(){

              if(this.funds_from.length) return false;
                return true;
            },
            allFunds() {

                return this.$store.state.funds.item.filter(item => item.in_case);
            },
            totalPrice() {
                let amount = 0;

                if (this.amount && this.fund_from) amount = (+this.amount * this.fund_from.priceValue);

                return this.formatCurrency(amount) + '*';
            },
            buttonDisabled() {
                return !Boolean(
                    this.fund_from &&
                    this.fund_to &&
                    this.amount &&
                    this.account_from &&
                    this.terms &&
                    this.term1 &&
                    this.term2
                )
            },
            links() {
                let links = [];
                
                if (this.fund_from) {
                    let name = this.fund_from.description;
                    let websiteID = this.fund_from.smallIcon.match(/[a-z-\.]*$/)[0].replace('-s.jpg', '');

                    links.push(`<a href="https://www.uralsib-am.ru/funds/${websiteID}/documents/" target="_blank">${name}</a>`)
                }

                if (this.fund_to) {
                    links.push(`<a href="https://www.uralsib-am.ru/funds/${this.fund_to.webSiteId}/documents/" target="_blank">${this.fund_to.description}</a>`)
                }

                if (links.length) {
                    return '(' + links.join(', ') + ');'
                }

                return '';
            },
            today() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        },
        beforeRouteLeave(to, from, next) {

            if(this.fund_from && !this.$store.state.popupConfirmOff) {
                this.$store.dispatch('confirm')
                    .then(answer => {
                        if (answer) next();
                        else window.events.$emit('close_popup');
                    });
            } else next()
        },
    }
</script>

<style lang="scss">
	.red_text {
		color: red;
	}
</style>

