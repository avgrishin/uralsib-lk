<template lang="pug">
    article.content
        h1 Расторжение договора
        .content__termination(v-if="step==1")
            template(v-if="loading")
                .spinner
            template(v-else)
                p.g-mb_3 Уважаемый клиент!
                p.g-mb_2 Перед оформлением операции по расторжению договора #[strong {{ dogNumber }}] от #[strong {{ beginDate }}], 
                    | пожалуйста, ознакомьтесь с информацией ниже:
                ul
                    li.g-mb_2(v-if="daysRest>0") До конца срока Вашего договора осталось #[strong {{ daysRest }}] ДНЕЙ, после истечения которых будет выход без комиссий
                    li.p.g-mb_2 При расторжении до окончания целевого срока инвестирования вы теряете возможность получить доходность, на которую ориентирована стратегия
                    li.p.g-mb_2(v-if="sType=='IIS'") И плюс для ИИС: срок меньше трех лет – вы теряете право на получение налогового вычета
                p.g-mt_4
                    input(type="button" @click.prevent="next1" class="btn btn_primary g-mr_2 g-mr_0_xs g-mb_0_xs g-col_md_a g-col_xs_12" value="Продолжить")
                    input(type="button" @click.prevent="prev" class="btn btn_secondary g-col_md_a g-col_xs_12 g-mb_0_xs" value="Отказаться")
                    a(href="#" @click.prevent="doc").btn.btn_file.btn_o.g-col_xs_12
                            | Уведомление
                            span(title="pdf" ,:class="{spinner:loading}").icon.icon_file_pdf.g-fr
                    input(type="button" @click.prevent="doc" class="btn btn_secondary g-col_md_a g-col_xs_12 g-mb_0_xs" value="Уведомление")
        .content__termination(v-if="step==2")
            .g-col.g-col_lg_8
                form(autocomplete="off")
                    fieldset.form__fieldset
                        p.g-mb_2
                            label Настоящим, согласно условиям Договора доверительного управления ценными бумагами № #[strong {{ dogNumber }}] от #[strong {{ beginDate }}] (далее – Договор), уведомляю АО «УК УРАЛСИБ»
                            .radio-list.g-pl_2.g-pl_0_xs.g-mt_2.g-jc_fs_xs
                                .radio.g-mr_2_xs
                                    input(type="radio", name="cancelType", v-model="cancelType", v-validate="'required|in:1,2'" :value="1" id="FR_T1")
                                    label(for="FR_T1") {{ term1 }}
                                .radio.g-mr_2_xs
                                    input(type="radio", name="cancelType", v-model="cancelType" :value="2" id="FR_T2")
                                    label(for="FR_T2") {{ term2 }}
                                .g-col: span.field_error(v-if="errors.has('cancelType')") Поле обязательно для заполнения
                        p.g-mb_2 Денежные средства, составляющие Активы Клиента, прошу перевести на банковский счет
                    fieldset.form__fieldset.form__fieldset_narrow
                        .control
                            label.control__field.g-d_b
                                input(type="text",v-model="receiver" v-validate="'required'" data-vv-as="получатель" name="receiver", id="FPD_RECEIVER").field_text.field_text_mtrl
                                span.control__label Получатель
                                span.field_error(v-if="errors.has('receiver')" v-html="errors.first('receiver')")
                        .g-row_narrow
                            .control.g-col.g-col_md_5
                                label.control__field.g-d_b
                                    input(type="text", v-model="bic" v-validate="'required'" data-vv-as="БИК" name="bic", id="FR_BIC").field_text.field_text_mtrl
                                    span.control__label БИК
                                    span.field_error(v-if="errors.has('bic')" v-html="errors.first('bic')")
                            .control.g-col.g-col_md_7
                                label.control__field.g-d_b
                                    input(type="text", v-model="bank_name" v-validate="'required'" data-vv-as="Наименование банка" name="bank_name", id="FPD_BANK_NAME").field_text.field_text_mtrl
                                    span.control__label Наименование банка
                                    span.field_error(v-if="errors.has('bank_name')" v-html="errors.first('bank_name')")
                                .control__note.control__note_long Если Вы знаете БИК банка, реквизиты #[br]будут заполнены автоматически
                            .control.control_empty
                        .control
                            label.control__field.g-d_b
                                input(type="text",v-model="corr_acc" v-validate="'required|an'" data-vv-as="корреспондентский счёт" name="corr_acc", id="FPD_CORR_ACC").field_text.field_text_mtrl
                                span.control__label Корреспондентский счёт
                                span.field_error(v-if="errors.has('corr_acc')" v-html="errors.first('corr_acc')")
                        .control
                            label.control__field.g-d_b
                                input(type="text", v-model="check_acc" v-validate="`required|rs:${bic}|an`" data-vv-as="расчётный счёт" name="check_acc", id="FPD_CHECK_ACC").field_text.field_text_mtrl
                                span.control__label Расчётный счёт
                                span.field_error(v-if="errors.has('check_acc')" v-html="errors.first('check_acc')")
                        .control
                            label.control__field.g-d_b
                                input(type="text", v-model="acc" v-validate="'an'" data-vv-as="лицевой счёт" name="per_acc", id="FPD_ACC").field_text.field_text_mtrl
                                span.control__label Лицевой счёт
                                span.field_error(v-if="errors.has('per_acc')" v-html="errors.first('per_acc')")
                            .control__note.control__note_long При наличии
                        .control
                            label.control__field.g-d_b
                                input(v-model="name_branch" data-vv-as="наименование филиала банка" name="name_branch", id="FPD_NAME_BRANCH").field_text.field_text_mtrl
                                span.control__label Наименование филиала банка
                                span.field_error(v-if="errors.has('name_branch')" v-html="errors.first('name_branch')")
                            .control__note.control__note_long При наличии
                    fieldset.form__fieldset.form__fieldset_narrow
                        p.g-pb_4
                            input(type="button" @click.prevent="next2" :class="{'spinner_bg': loading }" :disabled="loading" value="Продолжить").btn.btn_primary.g-mr_2.g-mr_0_xs.g-mb_0_xs.g-col_md_a.g-col_xs_12
                            input(type="button" @click.prevent="prev" class="btn btn_secondary g-col_md_a g-col_xs_12 g-mb_0_xs" value="Отказаться")
        .content__termination(v-if="step==3")
            .g-col.g-col_lg_8
                form(autocomplete="off")
                    fieldset.form__fieldset
                        p Настоящим, согласно условиям Договора доверительного управления ценными бумагами № #[strong {{ dogNumber }}] от #[strong {{ beginDate }}] (далее – Договор), уведомляю АО «УК УРАЛСИБ»
                            ul
                                li.g-mb_2(v-if="cancelType==1") {{ term1 }}
                                li.g-mb_2(v-if="cancelType==2") {{ term2 }}
                        p Денежные средства, составляющие Активы Клиента, прошу перевести на банковский счет
                        h4.g-col.g-col_md_3.g-mb_0 Получатель
                        p.g-col.g-col_md_9(v-text="receiver")

                        h4.g-col.g-col_md_3.g-mb_0 Счет
                        p.g-col.g-col_md_9(v-text="check_acc")

                        h4.g-col.g-col_md_3.g-mb_0 Банк
                        p.g-col.g-col_md_9(v-text="bank_name")

                        h4.g-col.g-col_md_3.g-mb_0 Кор. счет
                        p.g-col.g-col_md_9(v-text="corr_acc")

                        h4.g-col.g-col_md_3.g-mb_0 БИК
                        p.g-col.g-col_md_9(v-text="bic")

                        template(v-if="acc!=''")
                            h4.g-col.g-col_md_3.g-mb_0 Лицевой счёт
                            p.g-col.g-col_md_9(v-text="acc")

                        template(v-if="name_branch!=''")
                            h4.g-col.g-col_md_3.g-mb_0 Филиал
                            p.g-col.g-col_md_9(v-text="name_branch")

                    p.g-mb_2 Для подтверждения данных на Ваш телефон #[span(v-html="phone || ''")] был отправлен SMS-код:
                    fieldset.form__fieldset.form__fieldset_narrow
                        .g-row_narrow
                            .g-col.g-col_md_6
                                input.js-validate-datalayer(data-action="validateField" data-label="smscode" type="text" v-validate="'required|sms'" data-vv-as="smscode" v-model="smscode" maxlength="5").field_text.field_text_mtrl#SMSCODE
                                label(for="SMSCODE").control__label Введите код
                                .g-fs_05.g-clr_gray(v-show="countDownSeconds.status")
                                    AppTimer(ref="appTimer", @onProgressEnd="handleCountdownProgress")
                                button.g-btn-txt.g-fs_05.g-clr_gray.g-clr_pr_h.g-fw_6(type="button" @click.prevent="requestCode") Запросить код повторно
                            .g-col.g-col_md_6
                                input(type="submit" :class="{'spinner_bg': loading }" value="Отправить" :disabled="loading" @click.prevent="next3").btn.btn_block.btn_primary.g-mb_2.g-mb_0_xs
                    fieldset.form__fieldset
                        p
                            input(type="button" @click.prevent="prev3" value="Изменить реквизиты").btn.btn_secondary.g-mb_3.g-mb_0_xs 
        .content__termination(v-if="step==4")
            p.g-mb_3 Уважаемый клиент!
            p.g-mb_2 Уведомление о расторжении договора № #[strong {{ dogNumber }}] от #[strong {{ beginDate }}] отправлено на рассмотрение в АО «УК УРАЛСИБ»
            p
                a(href="#" @click.prevent="doc").btn.btn_file.btn_o
                    | Уведомление
                    span(title="pdf" ,:class="{spinner:downloading}").icon.icon_file_pdf.g-fr        
</template>

<script>
    import moment from 'moment-timezone';
    import Inputmask from 'inputmask';
    import { countDownMixin } from '../../mixins'

    // const TERM = ['о досрочном прекращение Договора', 'о прекращении Договора по истечении срока его действия'];

    export default {
        mixins: [countDownMixin],
        data() {
            return {
                step: 1,
                loading: true,
                downloading: false,
                id: null,
                beginDate: '',
                dogNumber: '',
                daysRest: null,
                sType: '',
                cancelType: 0,
                phone: '',
                smscode: '',
                receiver: '',
                bic: '',
                bank_name: '',
                corr_acc: '',
                check_acc: '',
                acc: '',
                name_branch: '',
                term1: 'о досрочном прекращение Договора',
                term2: 'о прекращении Договора по истечении срока его действия'
            }
        },
        watch: {
            bic(val) {
                let regex = /^[0-9]{9}$/;
                if (regex.test(val)) this.getBankByBic();
            }
        },
        mounted() {
            if (this.$route.params.portfolioId) {
                axios.get(`/amcontracts/info?id=${this.$route.params.portfolioId}`)
                .then(({ data }) => {
                    this.loading = false;
                    this.receiver = data.client;
                    this.daysRest = data.daysRest;
                    this.sType = data.sType;
                    this.dogNumber = data.dogNumber;
                    const dt = moment(data.beginDate);
                    this.beginDate = dt.isValid() ? dt.format('DD.MM.YYYY') : '';

                    if (Object.keys(this.$store.state.user.bankingDetails).length) 
                        this.fillData();
                    else {
                        this.unwatch = this.$store.watch(
                            state => this.$store.state.user.state_loaded,
                            (newValue, oldValue) => this.fillData()
                        );
                    }
                }).catch((error) => {
                    this.loading = false;
                    if (error) flash([error.exceptionMessage], 'error');
                })
            }
        },
        beforeDestroy() {
            this.$removeOnBlurEvents();
            if (this.unwatch) this.unwatch();
        },
        methods: {
            next1() {
                this.$removeOnBlurEvents();
                this.step = 2;
                this.$nextTick(() => {
                    this.$onBlur();

                    const account_mask = Inputmask({ mask: '99999.999.9.99999999999', autoUnmask: true });
                    account_mask.mask(document.getElementById('FPD_CHECK_ACC'));
                    account_mask.mask(document.getElementById('FPD_ACC'));
                    Inputmask('999999999').mask(document.getElementById('FR_BIC'));                    
                    Inputmask('99999999999999999999').mask(document.getElementById('FPD_CORR_ACC'));

                    setTimeout(() => this.$checkInputs(), 50);
                });
            },

            prev() {
                window.history.back();
            },

            next2() {
                this.$validator.validateAll().then(response => {
                    if (response) { 
                        this.loading = true;
                        axios.post('/amcontracts/cancel', {
                            PortfolioID: this.$route.params.portfolioId,
                            Receiver: this.receiver,
                            BIC: this.bic,
                            BankName: this.bank_name,
                            AccCorr: this.corr_acc,
                            AccCheck: Inputmask.unmask(this.check_acc, { mask: '99999.999.9.99999999999', autoUnmask: true }),
                            AccPers: Inputmask.unmask(this.acc, { mask: '99999.999.9.99999999999', autoUnmask: true }),
                            BankBranch: this.name_branch,
                            CancelType: this.cancelType
                        })
                        .then(({data}) => {
                            if (data.isSuccess)
                            {
                                this.id = data.id;
                                this.phone = data.phone;
                                this.$removeOnBlurEvents();
                                this.step = 3;
                                this.$nextTick(() => {
                                    this.$onBlur();
                                    setTimeout(() => this.$checkInputs(), 50);
                                });
                            }
                            else {
                                data.errorDescription ? flash([data.errorDescription], 'error') : flash(['Неизвестная ошибка'], 'error');
                            }
                            this.loading = false;
                        })
                        .catch(({response: error}) => {
                            this.loading = false;
                            if (error) flash([error.data.message], 'error');
                        });
                    }
                });               
            },

            prev3() {
                this.next1();
            },

            next3() {
                this.loading = true;
                axios.get(`/amcontracts/cancelconfirm`, { 
                    params: {
                        id: this.id,
                        code: this.smscode
                    }
                }).then(() => {
                    this.$removeOnBlurEvents();
                    this.step = 4;
                    this.loading = false;
                }).catch(({response: error}) => {
                    this.loading = false;
                    if (error) flash([error.data.message], 'error');
                });        
            },

            doc() {
                this.downloading = true;
                this.downloadFile(`/amcontracts/${this.id}/canceldoc`, `name.pdf`);
                this.downloading = false;
            },

            fillData() {
                const { accCheck, accCorr, bankName, bic, accPers, bankBranchName, isValid } = this.$store.state.user.bankingDetails;
                const { phone } = this.$store.state.user.state;
                if (isValid) {
                    this.bic = bic ? Inputmask.format(bic, { mask: '999999999' }) : '';
                    this.bank_name = bankName || '';
                    this.corr_acc = accCorr ? Inputmask.format(accCorr, { mask: '99999999999999999999' }) : '';
                    this.check_acc = accCheck ? Inputmask.format(accCheck, { mask: '99999.999.9.99999999999' }) : '';
                    this.acc = accPers ? Inputmask.format(accPers, { mask: '99999.999.9.99999999999' }) : '';
                    this.name_branch = bankBranchName || '';
                    this.phone = phone || '';
                }
            },

            getBankByBic() {
                axios.get('/reference/banksbybic', {
                    params: {
                        count: 1,
                        bic: this.bic
                    }
                }).then(({data}) => {
                    if (!data.length) return flash(['Банк не найден']);

                    this.bank_name = data[0].namep.replace(/&quot;/g, '"');
                    this.corr_acc = data[0].knsp;

                    setTimeout(() => this.$checkInputs(), 50);
                });
            },

            submitCode() {
                this.loading = true;
                axios.post(`/amcontracts/cancelconfirm/${this.smscode}`, { Id: this.id })
                .then(() => {
                    this.$removeOnBlurEvents();
                    this.page = 3;
                    this.loading = false;
                }).catch(({response: error}) => {
                    this.loading = false;
                    if (error) flash([error.data.message], 'error');
                });        
            },
            
            requestCode() {
                this.loading = true;
                axios.post(`/message/reqcode`, { Id: this.id })
                    .then(({data}) => {
                        this.loading = false;
                        this.handleRequestSMScode(data);
                    }).catch((error) => {
                        this.loading = false;
                        if (error) flash([error.exceptionMessage], 'error');
                    });
            }

        },
        computed: {
        }
    }
</script>
