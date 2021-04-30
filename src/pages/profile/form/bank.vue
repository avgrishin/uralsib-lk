<template lang="pug">
    article.content
        h1  Анкета
        .g-row
            step
            .g-col.g-col_lg_8
                form.form-step(autocomplete="off")
                    fieldset.form__fieldset.form__fieldset_narrow(:disabled="formDisabled")
                        .g-row_narrow
                            .control.g-col.g-col_md_5

                                label.control__field.g-d_b
                                    input(type="text", v-model="bik" v-validate="'required'" data-vv-as="БИК" name="bik", id="FR_BIK").field_text.field_text_mtrl
                                    span.control__label БИК
                                    span.field_error(v-if="errors.has('bik')" v-html="errors.first('bik')")
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
                                input(type="text", v-model="check_acc" v-validate="`required|rs:${bik}|an`" data-vv-as="расчётный счёт" name="check_acc", id="FPD_CHECK_ACC").field_text.field_text_mtrl
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
                                textarea(v-model="name_branch" data-vv-as="наименование филиала банка" name="name_branch", id="FPD_NAME_BRANCH").field_text.field_text_mtrl
                                span.control__label Наименование филиала банка
                                span.field_error(v-if="errors.has('name_branch')" v-html="errors.first('name_branch')")
                    fieldset.form__fieldset(:disabled="formDisabled")
                        .g-row
                            .g-col.g-col_md_5
                                input(type="button" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" :disabled="disableBtn, buffering" @click="next" value="Сохранить").btn.btn_block

</template>

<script>
    //import { fillUserInfo, formProfileStepChange,} from '../../../mixins';
    import Inputmask from 'inputmask';
    import step from './step.vue';
    import { mapState } from 'vuex';
    import { mapActions } from 'vuex';
    export default {
        components: { step, },
        // mixins: [fillUserInfo],
        // mixins: [formProfileStepChange],
        watch: {
            bik(val) {
                let regex = /^[0-9]{9}$/;

                if (this.loaded && regex.test(val)) this.getBankByBik();
            }
        },
        data() {
            return {
                bik: '',
                bank_name: '',
                corr_acc: '',
                check_acc: '',
                acc: '',
                name_branch: '',
                buffering: false,
                loaded: false,
                disableBtn: false,
            }
        },
        created() {
            this.fillData();
        },
        mounted() {
            this.$nextTick(() => {
                this.$onBlur();
                this.$checkInputs();

                let account_mask = Inputmask({
                    mask: '99999.999.9.99999999999',
                    autoUnmask: true
                });

                Inputmask('999999999').mask(document.getElementById('FR_BIK'));
                Inputmask('99999999999999999999').mask(document.getElementById('FPD_CORR_ACC'));
                account_mask.mask(document.getElementById('FPD_CHECK_ACC'));
                account_mask.mask(document.getElementById('FPD_ACC'));

                [document.getElementById('FPD_ACC'), document.getElementById('FPD_CHECK_ACC')].forEach(item => {
                    item.addEventListener('copy', this.handleCopy);
                });
            });
        },
        beforeDestroy() {
            this.$removeOnBlurEvents();

            [document.getElementById('FPD_ACC'), document.getElementById('FPD_CHECK_ACC')].forEach(item => {
                item && item.removeEventListener('copy', this.handleCopy);
            });

            [
                document.getElementById('FR_BIK'),
                document.getElementById('FDP_CORR_ACC'),
                document.getElementById('FDB_CHECK_ACC'),
                document.getElementById('FDP_ACC')
            ].forEach(item => {
                if (item && item.inputmask) item.inputmask.remove();
            });
        },
        methods: {
	        ...mapActions('progress', [
		        'A_GET_PROGRESS_PROFILE'
	        ]),
            handleCopy(e) {
                e.clipboardData.setData('text/plain', e.target.value);
                e.preventDefault();
            },
            next() {
                this.buffering = true;
                this.$validator.validateAll().then((result) => {
                    if (result) this.updateInfo();
                    else this.buffering = false;
                });

                // if (this.$store.state.user.state.authState == 2) {
                //     axios.get('/ClientProfile/BankingDetails').then(({
                //         data
                //     }) => {
                //         let thisCheckAcc = this.check_acc.replace(/\./g, '')
                //         let thisAcc = this.acc.replace(/\./g, '')

                //         if (!data) return this.loaded = true
                //         if (
                //             this.bik != data.bic ||
                //             this.bank_name != data.bankName ||
                //             this.corr_acc != data.accCorr ||
                //             thisCheckAcc != data.accCheck ||
                //             thisAcc != data.accPers ||
                //             this.name_branch != data.bankBranchName
                //         ) {
                //             this.buffering = true;
                //             this.$validator.validateAll().then((result) => {
                //                 if (result) this.updateInfo();
                //                 else this.buffering = false;
                //             });
                //         } else {
                //             let stepPath = this.$store.state.formStep.path
                //             if (stepPath == '') {
                //                 // this.buffering = true;
                //                 // this.$router.push('/user/personal');
                //                 this.buffering = true;
                //                 this.$validator.validateAll().then((result) => {
                //                     if (result) this.updateInfo();
                //                     else this.buffering = false;
                //                 });
                //             } else {
                //                 this.buffering = true;
                //                 this.$store.commit('setFormStepStatus', true);
                //                 this.$router.push(stepPath);
                //             }
                //         }
                //     });
                // } else {
                //     this.buffering = true;
                //     this.$validator.validateAll().then((result) => {
                //         if (result) this.updateInfo();
                //         else this.buffering = false;
                //     });
                // }

            },
            fillData() {
                axios.get('/ClientProfile/BankingDetails').then(({data}) => {
                    if (!data) return this.loaded = true;

                    this.bik = data.bic ? Inputmask.format(data.bic, { mask: '999999999' }) : '';
                    this.bank_name = data.bankName || '';
                    this.corr_acc = data.accCorr ? Inputmask.format(data.accCorr, { mask: '99999999999999999999' }) : '';
                    this.check_acc = data.accCheck ? Inputmask.format(data.accCheck, { mask: '99999.999.9.99999999999' }) : '';
                    this.acc = data.accPers ? Inputmask.format(data.accPers, { mask: '99999.999.9.99999999999' }) : '';
                    this.name_branch = data.bankBranchName || '';

                    setTimeout(() => {
                        this.$checkInputs();
                        this.loaded = true;
                    }, 100);
                });
            },
            updateInfo() {
                if (!this.$store.state.user.state.allowEditClientProfile) {
                    this.buffering = false;
                    return;
                }

                let data = {
                    bic: this.bik,
                    bankName: this.bank_name,
                    accCorr: this.corr_acc,
                    accCheck: this.check_acc,
                    accPers: this.acc.replace(/\./g, ''),
                    bankBranchName: this.name_branch
                };

                data.accCorr = data.accCorr.replace(/\./g, '');
                data.accCheck = data.accCheck.replace(/\./g, '');

                axios.post('/ClientProfile/BankingDetails', data).then(({data}) => {
                    this.$store.dispatch('user/formChanged');
                    //this.$store.dispatch('user/getForm');
                    this.A_GET_PROGRESS_PROFILE();

                    this.buffering = false;
                    if (this.$store.state.user.state.authState == 2 && 1 == 2) {
                        window.events.$emit('show_popup', 'form-step');
                    } else {
                        let percentageData = this.S_PROGRESS;
                        if (percentageData.bankingDetailsRate >= 50) {
                            this.$router.push('/user/finish');
                        }
                        this.$router.push('/user/finish'); // не знаю для чего условие выше, из за него срабатывало со второго раза, добавил эту строчку
                    }

                }).catch(({data}) => this.buffering = false);
            },
            getBankByBik() {
                axios.get('/reference/banksbybic', {
                    params: {
                        count: 1,
                        bic: this.bik
                    }
                }).then(({data}) => {
                    if (!data.length) return flash(['Банк не найден']);

                    this.bank_name = data[0].namep.replace(/&quot;/g, '"');
                    this.corr_acc = data[0].knsp;


                    setTimeout(() => this.$checkInputs(), 50);
                });
            }
        },
        computed: {
	        ...mapState('progress', [
		        'S_PROGRESS'
	        ]),
            buttonDisabled() {
                return !Boolean(
                    this.bik &&
                    this.bank_name &&
                    this.corr_acc &&
                    this.check_acc
                );
            },
            formDisabled() {
                return this.loaded && !this.$store.state.user.state.allowEditClientProfile;
            }
        }
    }

</script>

