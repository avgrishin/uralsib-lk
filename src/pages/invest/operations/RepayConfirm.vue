<template lang="pug">
    casenav
        article.content
            h1.g-hide_xs Погасить паи
            form.form_approve
                fieldset
                    legend.control-label-top-title_xs
                        .h2 Паи к погашению
                    .g-row.g-row_ib
                        .control.g-col.g-col_lg_4.g-col_md_5
                            label.control__label-top Наименование фонда
                            .control__field
                                v-select( :loading="loadingSelect" placeholder="Выберите фонд" v-validate:fund="'required'" inputId="id1" name="fund" :class="{invalid_force: errors.has('fund')}" v-model="fund" label="description" :options="available_funds").field-select
                                    span(slot="no-options")
                        .control.g-col.g-col_lg_3.g-col_md_4
                            label.control__label-top Номер счёта в реестре
                            .control__field
                                v-select(v-model="account" label="title" :options="accounts" inputId="id2" v-if="accounts.length > 1").field-select
                                    span(slot="no-options")
                                input(type="text" :value="account.title" style="opacity: 1;" disabled v-else).field_text
                        .g-col.g-col_lg_5.g-hide_md
                        label.control.g-col.g-col_lg_4.g-col_md_5
                            .control__label-top Количество паев
                            .control__field
                                input(type="text" name="amount" v-model="amount"  style="opacity: 1;" :disabled="fund == false || fund == null" v-validate="{required: true, pif: amount_ref}" data-vv-as="кол-во").field_text#amount
                                span.field_error(v-if="errors.has('amount')" v-html="errors.first('amount')")
                        label.control.g-col.g-col_lg_3.g-col_md_4
                            .control__label-top.g-mb_1(v-html="`Стоимость паев, ${rubleSign}`")
                            .control__field.h1.g-clr_gray.g-fw_3.g-ws_nw.g-mb_0(v-html="totalPrice")
                        .control
                    .g-row.g-mb_6
                        .control.g-col.g-col_lg_8
                            label.checkbox(:class="{'checkbox_error': errors.has('correct_data')}")
                                input(type="checkbox", v-model="terms" v-validate="'required'" name="correct_data", id="FPP_CORRECT_DATA")
                                .checkbox__text(v-html="disclaimerTextRepay")
                fieldset.g-mt_2_m_xs
                    legend.h2.g-mb_3 Проверьте или измените Ваши банковские реквизиты:
                    .g-row
                        .g-col.g-col_lg_8.g-col_md_11
                            .box.g-mb_3
                                .g-row.g-row_ib
                                    .control.g-col.g-col_md_7
                                        .control__label-top
                                            label(for="id-FIO") Ф.И.О
                                        .control__field
                                            input(type="text", name="full_name" id="id-FIO" v-validate="'required'" v-model="full_name",disabled).field_text
                                            span.field_error(v-if="errors.has('full_name')" v-html="errors.first('full_name')")
                                    .control.g-col.g-col_md_5
                                        .control__label-top
                                            label(for="id-PRF") Паспорт РФ серия и номер
                                        .control__field
                                            input(type="text", name="passport" id="id-PRF" v-validate="'required'" v-model="passport",disabled).field_text
                                            span.field_error(v-if="errors.has('passport')" v-html="errors.first('passport')")
                                    .control.g-col.g-col_md_3
                                        .control__label-top
                                            label(for="id-BIK") Бик
                                        .control__field
                                            input(type="text",id="id-BIK" name="bik" v-validate="'required'" v-model="bik").field_text
                                            span.field_error(v-if="errors.has('bik')" v-html="errors.first('bik')")
                                    .control.g-col.g-col_md_9
                                        .control__label-top
                                            label(for="id-NB") Наименование банка
                                        .control__field
                                            input(type="text",id="id-NB" name="bank_name" v-validate="'required'" v-model="bank").field_text
                                            span.field_error(v-if="errors.has('bank_name')" v-html="errors.first('bank_name')")
                                    .control.g-col.g-col_md_7
                                        .control__label-top
                                            label(for="id-KS") Корреспондентский счёт
                                        .control__field
                                            input(type="text",id="id-KS" name="account_corr" v-validate="'required|an'" v-model="account_corr").field_text
                                            span.field_error(v-if="errors.has('account_corr')" v-html="errors.first('account_corr')")
                                    .control.g-col.g-col_md_5
                                        .control__label-top
                                            label(for="id-PS") Расчётный счёт
                                        .control__field
                                            input(type="text",id="id-PS" name="account_check" v-validate="`required|rs:${bik}|an`" v-model="account_check").field_text
                                            span.field_error(v-if="errors.has('account_check')" v-html="errors.first('account_check')")
                                    .control.g-col.g-col_md_12
                                        .control__label-top
                                            label(for="id-AC") Лицевой счёт
                                        .control__field
                                            input(type="text",id="id-AC" name="account_per" v-validate="'an'" v-model="account_per").field_text
                                            span.field_error(v-if="errors.has('account_per')" v-html="errors.first('account_per')")
                                    .control.g-col.g-col_md_12
                                        .control__label-top
                                            label(for="id-BN") Название филиала банка
                                        .control__field
                                            input(type="text",id="id-BN" name="branch_name" v-model="branch_name").field_text
                                            span.field_error(v-if="errors.has('branch_name')" v-html="errors.first('branch_name')")
                                    .g-col.g-col_xs_6
                                    .g-col.g-col_xs_6.g-ta_r
                                        button(type="submit" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" @click.prevent="repay").btn.g-col_md_8 Подписать
                                .g-row
                            p
                                small.text-note.g-mt_5(v-text="disclaimerTextRepayDate")
</template>

<script>
    import Inputmask from "inputmask";
    import moment from 'moment';
    import { confirmPersonalData } from '../../../guards';
    import CaseNav from '../../case/CaseNav.vue';
    import { DEFERRED_SELL_SUM } from '../../../constatnts';
    import { buildAppsDictionary } from '../../../helpers';
    import { sellAppsApiService } from '../../../api';

    export default {
        components: { 'casenav': CaseNav },
        beforeRouteEnter:confirmPersonalData,
        data() {
            return {
                accounts: [],
                fund_data: [],
                available_funds: [],
                disclaimerTextRepay: '',
                disclaimerTextRepayDate: '',
                fund: null,
                account: false,
                amount: '',
                amount_ref: 0,

                full_name: '',
                passport: '',
                bik: '',
                bank: '',
                account_corr: '',
                account_check: '',
                account_per: '',
                branch_name: '',

                terms: false,

                loaded: false
            }
        },
        watch: {
            account(val){
                if (!val) return;
                this.setAmount();
            },
            fund(val) {
                if(!val) {
                    this.refreshComponent()
                    return;
                }

                this.getAccounts();
                this.setAmount();
                this.getTextDisclaimer();
            },
            userInfo(val) {
                this.fillData(val);
            },
            bik(val) {
                let regex = /^[0-9]{9}$/;

                if (this.loaded && regex.test(val)) this.getBankByBik();
            },
            amount(val) {
                if (parseFloat(val) > this.amount_ref) this.amount = this.amount_ref;
            }
        },
        created() {
            this.getTextDisclaimer();
            axios.get('/reference/getsitetext', {
                params: {
                    place: 'RepayDate',
                }
            }).then(({data}) => {
                this.disclaimerTextRepayDate = data.outText;
            });

            this.getFundInfo().then(({data}) => {
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

            if (this.$store.state.user.info.client) this.fillData(this.$store.state.user.info);

            window.events.$on('code_confirmed', this.onCodeConfirmed);
            window.events.$on('going_back', this.refreshComponent);

            this.$store.commit('updateCrumbs', [
                { link: '/', text: 'Портфель'},
                { link: '/operations', text: 'Операции с паями' }
            ]);
        },
        mounted() {
            this.$nextTick(() => {
                let account_mask = Inputmask({
                    mask: '99999.999.9.99999999999',
                    autoUnmask: true
                });

                Inputmask('999999999').mask(document.getElementById('id-BIK'));
                Inputmask('99999999999999999999').mask(document.getElementById('id-KS'));
                account_mask.mask(document.getElementById('id-PS'));
                account_mask.mask(document.getElementById('id-AC'));
                Inputmask({
                    alias: 'numeric',
                    radixPoint: '.',
                    digits: 6,
                    digitsOptional: true,
                    placeholder: '',
                    rightAlign: false,
                    allowMinus: false
                }).mask(document.getElementById('amount'));

                [document.getElementById('id-PS'), document.getElementById('id-AC')].forEach(item => {
                    item.addEventListener('copy', this.handleCopy);
                });
            });
        },
        beforeDestroy() {
            window.events.$off('code_confirmed', this.onCodeConfirmed);
            window.events.$off('going_back', this.refreshComponent);

            [document.getElementById('id-PS'), document.getElementById('id-AC')].forEach(item => {
                item && item.removeEventListener('copy', this.handleCopy);
            });

            [
                document.getElementById('id-BIK'),
                document.getElementById('id-KS'),
                document.getElementById('id-PS'),
                document.getElementById('id-AC'),
                document.getElementById('amount')
            ].forEach(item => {
                if (item && item.inputmask) item.inputmask.remove();
            });
        },
        methods: {
            getTextDisclaimer() {
                let id;
                if (this.fund) id = this.fund.id;


                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'Repay',
                        portfolioId: id,

                    }
                }).then(({data}) => {

                    this.disclaimerTextRepay = data.outText;

                });
            },
            getBankByBik() {
                axios.get('/reference/banksbybic', {
                    params: {
                        count: 1,
                        bic: this.bik
                    }
                }).then(({data}) => {
                    if (!data.length) return flash(['Банк не найден']);

                    this.bank = data[0].namep.replace(/&quot;/g, '"');
                    this.account_corr = data[0].knsp;

                    setTimeout(() => this.$checkInputs(), 50);
                });
            },
            handleCopy(e) {
                e.clipboardData.setData('text/plain', e.target.value);
                e.preventDefault();
            },
            fillData(user) {
                const bankingDetails = user.bankingDetails;

                this.full_name = user.client.longName;
                this.passport = user.dulData.series + ' ' + user.dulData.number;
                this.bik = bankingDetails.bic;
                this.bank = bankingDetails.bankName;
                this.account_check = bankingDetails.accCheck || '';
                this.account_corr = bankingDetails.accCorr ? Inputmask.format(bankingDetails.accCorr, { mask: '99999.999.9.99999999999' }) : '';
                this.account_per = bankingDetails.accPers ? Inputmask.format(bankingDetails.accPers, { mask: '99999.999.9.99999999999' }) : '';
                this.branch_name = bankingDetails.bankBranchName;

                this.loaded = true;
            },
            setFund(data) {
                let fund = data.find(item => item.smallIcon.includes(this.$route.query.fund));

                if (fund) this.fund = fund;
            },
            getAvailableFunds() {
                axios.get('/sellapps/select').then(({data}) => {
                    let fundFromArr = []
                    data.forEach((dataItem) => {
                        let fundSelect = this.fund_data.find(item => item.iD_PRTF == dataItem.id)

                        if(fundSelect) {
                            fundFromArr.push(dataItem)
                        }
                    });

                    this.available_funds = fundFromArr;
                    if (this.$route.query.fund) this.setFund(fundFromArr);
                });
            },
            getFundInfo() {
                return axios.get('/reports/AssetsEstimate');
            },
            getAccounts(direction) {
                axios.get('/reference/accountsbyfond', {
                    params: {
                        portfolioId: this.fund.id
                    }
                }).then(({data}) => {

                    let dataAccounts = []
                    data.forEach((dataItem) =>{
                        let item = this.fund_data.find(item => item.opeR_ACC==dataItem.title && item.outqnt > 0)
                        if(item) {
                             dataAccounts.push(dataItem)
                        }
                    });

                    this.accounts = dataAccounts;
                    if (this.accounts.length) this.account = this.accounts[0];
                    else this.account = false;
                });
            },
            setAmount() {
                if (!this.fund_data.length) return;

                let item = this.fund_data.find(item => {

                    return item.prtf == this.fund.description && item.outqnt != 0 && item.opeR_ACC==this.account.title

                });

                if (item) {
                    this.amount = item.outqnt;
                    this.amount_ref = item.outqnt;
                } else {
                    this.amount = '';
                    this.amount_ref = 0;
                }
            },
            repay() {
                this.$validator.validateAll().then(result => {
                    if (result) this.sendRepayRequest();
                });
            },

            openConfirmOperation(data) {
                window.events.$emit('show_popup', ['confirm-operation', {
                    app_id: data.applicationId,
                    app_number: data.number,
                    operation: 'SellApps',
                    fund: this.fund.description
                }]);
            },

            async startDefferSell(data) {
                const appIds = buildAppsDictionary([{
                    app_id: data.applicationId,
                    app_number: data.number,
                }]);

                const requestData = await sellAppsApiService.requestSmsCode(appIds);

                if (!requestData.isDeferred) {
                    window.flash(['Ошибка: несоответствие условий погашения на клиенте и сервере'], 'error');
                    // return;
                }

                this.$router.push('/funds');
                window.events.$emit('show_popup', ['sell-alert-final', {}]);
            },

            sendRepayRequest() {
	            this.$store.commit('buffering', true);
                axios.post('/SellApps', {
                    count: this.amount,
                    clientId: this.$store.state.user.info.client.id,
                    portfolioId: this.fund.id,
                    accountId: this.account.key,
                    bankingDetail: {
                        bic: this.bik,
                        bankName: this.bank,
                        accCorr: this.account_corr,
                        accCheck: this.account_check,
                        accPers: this.account_per,
                        bankBranchName: this.branch_name,
                        inn: null
                    }
                }).then(({data}) => {
	                this.$store.commit('buffering', false);

	                if (this.totalPriceNum >= 100000) {
	                    this.startDefferSell(data);
	                    return data;
                    }

	                this.openConfirmOperation(data);

                }).catch(() => {
	                this.$store.commit('buffering', false);
                });
            },
            onCodeConfirmed() {

                window.events.$emit('show_popup', ['request-accepted', {
                    operation: 'repay',
                    closable: false
                }]);
            },
            refreshComponent() {
                this.fund = false;
                this.accounts = [];
                this.account = false;
                this.terms = false;
                this.amount = '';

                this.getAvailableFunds();
            }
        },
        computed: {
            loadingSelect(){
                if(this.available_funds.length) return false;
                return true;
            },
            fundAvailableToSell() {
                return this.$store.state.funds.items.filter(item => item.in_case);
            },
            totalPriceNum() {
                let amount = 0;

                if (this.amount && this.fund) amount = (+this.amount * this.fund.priceValue);

                return amount;
            },
            totalPrice() {
                return this.formatCurrency(this.totalPriceNum) + '*';
            },
            userInfo() {
                return this.$store.state.user.info;
            },
            buttonDisabled() {
                return !Boolean(
                    this.fund &&
                    this.account &&
                    this.amount &&
                    this.full_name &&
                    this.passport &&
                    this.bik &&
                    this.bank &&
                    this.account_corr &&
                    this.account_check &&
                    this.terms
                )
            },
            link() {
                if (this.fund) {
                    let name = this.fund.description;
                    let websiteID = this.fund.smallIcon.match(/[a-z-\.]*$/)[0].replace('-s.jpg', '');

                    return `(<a href="https://www.uralsib-am.ru/funds/${websiteID}/documents/" target="_blank">${name}</a>)`;
                }

                return '';
            },
            today(){
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        },
        beforeRouteLeave(to, from, next) {
            if(this.fund && !this.$store.state.popupConfirmOff) {

                this.$store.dispatch('confirm')
                    .then(answer => {
                        if (answer) next();
                        else window.events.$emit('close_popup');
                    });
            } else next()
        },
    }
</script>

