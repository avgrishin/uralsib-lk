<template lang="pug">
    article.content.g-pt_9.g-pt_4_xs
        h1 Регистрация шаг 2
        .g-row
            aside.g-col.g-col_lg_4
                ul.step.step_number
                    li.step__item.complete
                        .h2.g-mb_0 Контактные данные
                    li.step__item.active
                        .h2.g-mb_0  Персональные данные
            .g-col.g-col_lg_8
                form(@submit.prevent="register" autocomplete="off").form-step

                    fieldset.form__fieldset.form__fieldset_narrow
                        legend.h3.form-step__title Заполните #[br.g-hidden.g-show_xs] персональные данные
                        .control
                            .g-row_narrow
                                .g-col.g-col_xs_6
                                    .control
                                        label.control__field.g-d_b
                                            input(type="text", data-action="validateField", data-label="snils", data-vv-as="СНИЛС" v-model="step_2.snils" v-validate="'snils'" name="snils", id="FR_SNILS").field_text.field_text_mtrl.js-validate-datalayer
                                            span.control__label СНИЛС
                                            span.field_error(v-if="errors.has('snils')" v-html="errors.first('snils')")
                                .g-col.g-col_xs_6
                                    .control
                                        label.control__field.g-d_b
                                            input(type="text", data-action="validateField", data-label="inn", data-vv-as="ИНН" v-model="step_2.inn" v-validate="!dataEsiaDisabled ? 'required|inn' : 'required|inn'" name="inn", id="FR_INN").field_text.field_text_mtrl.js-validate-datalayer
                                            span.control__label ИНН
                                            span.field_error(v-if="errors.has('inn')" v-html="errors.first('inn')")
                            .control__note Вы можете узнать Ваш ИНН #[br]на сайте #[a(href="https://service.nalog.ru/inn.do", target="_blank") Налог.ру]
                        .control
                            .g-row_narrow
                                .g-col.g-col_xs_4.g-col_md_3.g-ws_nw
                                    span.h4 Ваш пол:
                                .g-col.g-col_xs_8.g-col_md_7
                                    fieldset.control(:class="dataEsiaDisabled")
                                        label.control__field.g-d_b
                                            .radio-list_inline
                                                .radio
                                                    input(type="radio", data-vv-as="пол" v-model="step_2.sex" v-validate="'required|in:1,2'" name="sex", id="FR_SEX_F", value="1")
                                                    label(for="FR_SEX_F") Женский
                                                .radio
                                                    input(type="radio", data-vv-as="пол" v-model="step_2.sex" name="sex", id="FR_SEX_M", value="2")
                                                    label(for="FR_SEX_M") Мужской
                                .g-col: span.field_error(v-if="errors.has('sex')") Поле обязательно для заполнения
                    fieldset.form__fieldset.form__fieldset_narrow
                        legend.g-pt_1.g-mb_3.h3.form-step__title Заполните #[br.g-hidden.g-show_xs] паспортные данные:
                        .control
                            label.control__field.g-d_b
                                input(type="text" value="Гражданство РФ" id="FR_CITIZENSHIP" disabled).field_text.field_text_mtrl
                        .control
                            label.control__field.g-d_b
                                input(type="text", data-vv-as="место рождения" data-action="validateField" data-label="birthplace" v-model="step_2.birthplace" @keypress="onlyRus"  v-validate="'required|lsndd_ru'" name="birthplace", id="FR_BIRTHPLACE").field_text.field_text_mtrl.js-validate-datalayer
                                span.control__label Место рождения
                                span.field_error(v-if="errors.has('birthplace')" v-html="errors.first('birthplace')")
                            .control__note Строго в соответствии с паспортом
                        .control
                            .g-row_narrow
                                .g-col.g-col_xs_6
                                    .control.control_date
                                        label.control__field.g-d_b
                                            input(
                                                type="text"
                                                data-action="validateField"
                                                data-label="birthdate"
                                                v-validate="'required|df|age'"
                                                @keydown="closeDatePicker"
                                                data-vv-as="дата рождения"
                                                v-model="step_2.birthdate"
                                                name="birthdate"
                                                id="FR_BIRTDATE"
                                                autocomplete="off"
                                            ).field_text.field_text_mtrl.js-validate-datalayer
                                            span.control__label Дата рождения
                                            span.field_error(v-if="errors.has('birthdate')" v-html="errors.first('birthdate')")
                                .g-col.g-col_xs_6
                                    label.control__field.g-d_b
                                        input(type="text", v-model="step_2.passport" data-action="validateField" data-vv-as="паспорт" v-validate="'required|pf|asc'" name="passport", id="FPD_PASSPORT", :disabled="dataEsiaDisabled", :class="{hasesia: dataEsiaDisabled}").field_text.field_text_mtrl.js-validate-datalayer
                                        span.control__label Серия и номер
                                        span.field_error(v-if="errors.has('passport')" v-html="errors.first('passport')")
                        .control
                            label.control__field.g-d_b
                                textarea(type="text", data-vv-as="кем выдан" data-action="validateField" data-label="issue" v-model="step_2.issue" @keypress="onlyRus" v-validate="'required|poi|lsndd_ru'" name="issue", id="FR_ISSUE").g-va_t.field_text.field_text_mtrl.field_textarea-only_xs.js-validate-datalayer
                                span.control__label Кем выдан
                                span.field_error(v-if="errors.has('issue')" v-html="errors.first('issue')")
                            .control__note Строго в соответствии с паспортом
                        .control
                            .g-row_narrow
                                .g-col.g-col_md_6
                                    .control.control_date.g-mb_4_xs
                                        label.control__field.g-d_b
                                            input(
                                                type="text"
                                                v-validate="'required|df'"
                                                data-vv-as="дата выдачи"
                                                data-action="validateField"
                                                data-label="date_issue"
                                                v-model="step_2.date_issue"
                                                name="date_issue"
                                                :disabled="dataEsiaDisabled"
                                                id="FR_DATE_ISSUE"
                                                autocomplete="off"
                                                :class="{hasesia: dataEsiaDisabled}"
                                            ).field_text.field_text_mtrl.js-validate-datalayer
                                            span.control__label Дата выдачи
                                            span.field_error(v-if="errors.has('date_issue')" v-html="errors.first('date_issue')")
                                .g-col.control.g-hidden.g-show_xs
                                .g-col.g-col_md_6
                                    .control
                                        label.control__field.g-d_b
                                            input(type="text", data-action="validateField" data-label="passport_code" :class="{hasesia: dataEsiaDisabled}", data-vv-as="код подразделения" v-validate="'required|pi'" v-model="step_2.passport_code" name="passport_code", id="FR_PASSPORT_CODE" :disabled="dataEsiaDisabled").field_text.field_text_mtrl.js-validate-datalayer
                                            span.control__label Код подразделения
                                            span.field_error(v-if="errors.has('passport_code')" v-html="errors.first('passport_code')")

                        .control
                            .g-row_narrow
                                .g-col.g-col_xs_6.g-col_md_4
                                    button(@click.prevent="back").btn.btn.btn_o.btn_block.g-miw_a Назад
                                .g-col.g-col_xs_6.g-col_md_8
                                    input(type="submit", :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" value="Далее").btn.btn_block
</template>

<script>
import step from '../../components/Step.vue';
import moment from 'moment';
import Inputmask from 'inputmask';

import { checkAndFireEvent } from '../../helpers';

export default {
    components: {
        'reg-step': step
    },
    data() {
        return {
            buffering: false,
            dataEsiaDisabled: false,
            step_2: {
                passport: '',
                snils: '',
                inn: '',
                sex: false,
                citizenship: '1',
                birthplace: '',
                birthdate: '',
                issue: '',
                date_issue: '',
                passport_code: ''
            }
            /* step_2: {
                 birthdate:"15.08.2000",
                 birthplace:"аываыва",
                 citizenship:"1",
                 date_issue:"15.08.2018",
                 inn:"123213213132",
                 issue:"йуйцуйцу",
                 passport:"1231 231231",
                 passport_code:"123-123",
                 sex:"2",
                 snils:"145-644-269 74"
             }*/
        };
    },
    created() {
        if (this.$store.state.register.step_2) {
            this.step_2 = Object.assign(this.step_2, this.$store.state.register.step_2);
            setTimeout(() => this.$checkInputs(), 20);
        }

        if (localStorage.getItem('form_id') && !this.$store.state.register.form_id) {
            this.$store.commit('register/setFormId', localStorage.getItem('form_id'));
            this.getClientDocs();
        } else if (this.$store.state.register.form_id) this.getClientDocs();
    },
    mounted() {
        this.$onBlur();
        this.$nextTick(() => {
            Inputmask('999-999-999 99').mask(document.getElementById('FR_SNILS'));
            Inputmask('999999999999').mask(document.getElementById('FR_INN'));
            Inputmask('9999 999999').mask(document.getElementById('FPD_PASSPORT'));

            Inputmask('99.99.9999').mask(document.getElementById('FR_BIRTDATE'));
            Inputmask('99.99.9999').mask(document.getElementById('FR_DATE_ISSUE'));
            Inputmask('999-999').mask(document.getElementById('FR_PASSPORT_CODE'));

            // document.querySelector('#FR_BIRTDATE').DatePickerX.init({
            //     maxDate: moment().subtract(18, 'year').toDate()
            // });
            // document.querySelector('#FR_DATE_ISSUE').DatePickerX.init();
        });
    },
    beforeDestroy() {
        [
            document.getElementById('FR_SNILS'),
            document.getElementById('FR_INN'),
            document.getElementById('FPD_PASSPORT'),
            document.getElementById('FR_BIRTDATE'),
            document.getElementById('FR_DATE_ISSUE'),
            document.getElementById('FR_PASSPORT_CODE')
        ].forEach(item => {
            if (item && item.inputmask) item.inputmask.remove();
        });
    },
    methods: {
        getClientDocs() {
            let id = this.$store.state.register.form_id;
            axios.get(`/SignUp/ClientDocs/${id}`).then(({ data }) => {
                this.dataEsiaDisabled = this.$store.state.register.regesia;
                if (!this.dataEsiaDisabled) {
                    // this.$router.push({name: 'technicalWorks'}); // TODO удалить после завершения тех. работ;
                    // return;
                }
                if (data.clientPassport.series && data.clientPassport.number) this.step_2.passport = data.clientPassport.series + ' ' + data.clientPassport.number;
                if (data.clientPassport.issued) this.step_2.date_issue = moment.utc(data.clientPassport.issued, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY');
                if (data.clientPassport.issuer) this.step_2.issue = data.clientPassport.issuer;
                if (data.clientPassport.issuerCode) this.step_2.passport_code = Inputmask.format(data.clientPassport.issuerCode, { mask: '999-999' });

                if (data.birthPlace) this.step_2.birthplace = data.birthPlace;
                if (data.birthDate) this.step_2.birthdate = moment.utc(data.birthDate, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY');
                if (data.gender) this.step_2.sex = data.gender;
                if (data.citizenshipCountryNum) this.step_2.citizenship = data.citizenshipCountryNum;
                if (data.snils) {
                    this.step_2.snils = Inputmask.format(data.snils, { mask: '999-999-999 99' });

                }
                if (data.inn) this.step_2.inn = Inputmask.format(data.inn, { mask: '999999999999' });

                if (this.$store.state.register.step_2) {
                    this.step_2.sex = this.$store.state.register.step_2.sex;
                }

                setTimeout(() => {
                    this.$checkInputs();
                    this.setDatePicker('FR_BIRTDATE', 'birthdate');
                    this.setDatePicker('FR_DATE_ISSUE', 'date_issue');
                }, 50);
            });
        },
        setDatePicker(id, field, event = null) {
            if (event) {
                this.step_2[field] = event.target.value;
                this.$checkInputs();
                return;
            }

            let picker = document.querySelector(`#${id}`).DatePickerX;
            let date = moment(this.step_2[field], 'DD.MM.YYYY');
            let regex_test = /[0-9]{2}\.[0-9]{2}\.[0-9]{4}/.test(this.step_2[field]);

            if (!date.isValid() || !regex_test) return;

            picker.setValue(moment(this.step_2[field], 'DD.MM.YYYY').toDate());
        },
        back() {
            this.$store.commit('register/save', {
                data: this.$data.step_2,
                step: 2
            });
            this.$router.push('/register/contact');
        },
        register() {
            this.buffering = true;
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.processData();
                } else {
                    this.buffering = false;
                }
            });
        },
        processData() {
            this.$store.commit('register/save', { data: this.$data.step_2, step: 2 });

            let birhday = moment.utc(this.step_2.birthdate, 'DD.MM.YYYY');
            let passport = this.step_2.passport.split(' ');

            if (passport.length != 2) return;

            let data = {
                clientPassport: {
                    series: passport[0],
                    number: passport[1],
                    issued: moment.utc(this.step_2.date_issue, 'DD.MM.YYYY').toISOString(),
                    issuer: this.step_2.issue,
                    issuerCode: this.step_2.passport_code
                },
                birthPlace: this.step_2.birthplace,
                birthDate: birhday.toISOString(),
                age: moment.utc().diff(birhday, 'years'),
                gender: this.step_2.sex,
                citizenshipCountryNum: 643,
                snils: this.step_2.snils,
                inn: this.step_2.inn
            };

            let id = this.$store.state.register.form_id;

            if (!id) return this.buffering = false;

            checkAndFireEvent({
                action: 'sendForm',
                label: 'step 2'
            })

            axios.post(`/SignUp/ClientDocs/${id}`, data)
                .then(({ data }) => {

                    window.events.$emit('show_popup', 'sms');
                    this.buffering = false;

                })
                .catch((data) => {

                    let messages = Object.values(data.response.data.modelState).reduce((acc, val) => acc.concat(val), []);
                    flash(messages, 'error');
                    this.buffering = false;
                });
        }
    },
    computed: {
        buttonDisabled() {
            return (
                !this.buffering &&
                /* this.step_2.snils &&
                 this.step_2.inn &&*/
                this.step_2.sex &&
                this.step_2.citizenship &&
                this.step_2.birthplace &&
                this.step_2.passport &&
                this.step_2.issue &&
                this.step_2.date_issue &&
                this.step_2.passport_code
            ) == false;
        }
    },

    watch: {
        buttonDisabled(disabled) {
            if (disabled) {
                return;
            }

            const errors = this.$el.querySelectorAll('input.error');

            if (!errors.length) {
                checkAndFireEvent({
                    action: 'validateForm',
                    label: 'step 2'
                });
            }
        }
    }
};
</script>

<style lang="scss">
    @import "../../assets/styles/vars";

    .step__item.complete {
        &:before {
            border: 1px solid #002250;
        }
    }
</style>
