<template lang="pug">
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


</template>

<script>
    import Inputmask from "inputmask";
    import moment from 'moment';







    export default {

        components: { },
        data() {
            return {
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
            userInfo(val) {
                this.fillData(val);
            },

        },
        created() {

            if (this.$store.state.user.info.client) this.fillData(this.$store.state.user.info);

            window.events.$on('code_confirmed', this.onCodeConfirmed);



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


                [document.getElementById('id-PS'), document.getElementById('id-AC')].forEach(item => {
                    item.addEventListener('copy', this.handleCopy);
                });
            });
        },
        beforeDestroy() {
            window.events.$off('code_confirmed', this.onCodeConfirmed);


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

            repay() {
                this.$validator.validateAll().then(result => {
                    if (result) this.sendRepayRequest();
                });
            },
            sendRepayRequest() {
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
                    window.events.$emit('show_popup', ['confirm-operation', {
                        app_id: data.applicationId,
                        app_number: data.number,
                        operation: 'SellApps',
                        fund: this.fund.description
                    }]);
                });
            },
            onCodeConfirmed() {
                window.events.$emit('show_popup', ['request-accepted', {
                    operation: 'repay',
                    closable: false
                }]);
            },

        },
        computed: {


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

            today(){
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        },

    }
</script>

