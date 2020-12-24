<template lang="pug">
article.content
        h1 Анкета
        .g-row
            step
            .g-col.g-col_lg_8
                form.form-step(autocomplete="off")
                    fieldset.form__fieldset.form__fieldset_narrow(:disabled="formDisabled")
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="text",
                                    @keypress="onlyLetters",
                                    @keyup="capitalizeFirst",
                                    v-model="last_name",
                                    data-vv-as="фамилия",
                                    v-validate="'required|fulsd_ru|osbw'",
                                    name="sirname",
                                    id="FPD_SIRNAME",
                                    :disabled="regEsia"
                                ).field_text.field_text_mtrl
                                span.control__label Фамилия
                                span.field_error(v-if="errors.has('sirname')" v-html="errors.first('sirname')")
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="text",
                                    @keypress="onlyLetters",
                                    @keyup="capitalizeFirst",
                                    v-model="name",
                                    data-vv-as="имя",
                                    v-validate="'required|fulsd_ru|osbw'",
                                    name="name",
                                    id="FPD_NAME",
                                    :disabled="regEsia"
                                ).field_text.field_text_mtrl
                                span.control__label Имя
                                span.field_error(v-if="errors.has('name')" v-html="errors.first('name')")
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="text",
                                    v-model="middle_name",
                                    @keypress="onlyLetters",
                                    @keyup="capitalizeFirst",
                                    data-vv-as="отчество",
                                    v-validate="{required: !has_middle_name, fulsd_ru: !has_middle_name, osbw: !has_middle_name }",
                                    name="patronymic",
                                    id="FPD_PATRONYMIC",
                                    :disabled="regEsia"
                                ).field_text.field_text_mtrl
                                span.control__label Отчество
                                span.field_error(v-if="errors.has('patronymic')" v-html="errors.first('patronymic')")
                            .control__note
                                .checkbox.sz_s
                                    input(type="checkbox", v-model="has_middle_name" name="hasPatronymic", id="FPD_HASPATRONYMIC", value="1")
                                    label(for="FPD_HASPATRONYMIC") Нет отчества
                    fieldset.form__fieldset.form__fieldset_narrow(:disabled="formDisabled")
                        .control.control_date
                            label.control__field.g-d_b
                                input(
                                    type="text",
                                    v-model="dob",
                                    data-vv-as="дата рождения",
                                    v-validate="'required|df|age'",
                                    name="birthdate",
                                    id="FPD_BIRTDATE_",
                                    autocomplete="off"
                                ).field_text.field_text_mtrl
                                span.control__label Дата рождения
                                span.field_error(v-if="errors.has('birthdate')" v-html="errors.first('birthdate')")
                        .control
                            .g-row_narrow
                                .g-col.g-col_xs_3.g-col_md_3.g-ws_nw
                                    span.h4 Ваш пол:
                                .g-col.g-col_xs_8.g-col_md_7
                                    .control
                                        .control__field
                                            .radio-list_inline
                                                .radio
                                                    input(type="radio", v-model="sex" data-vv-as="пол", v-validate="'required|in:1,2'" name="sex", id="FPD_SEX_F", value="1")
                                                    label(for="FPD_SEX_F") Женский
                                                .radio
                                                    input(type="radio", v-model="sex" data-vv-as="пол", name="sex", id="FPD_SEX_M", value="2")
                                                    label(for="FPD_SEX_M") Мужской
                                    .g-col: span.field_error(v-if="errors.has('sex')") Поле обязательно для заполнения
                        .control
                            label.control__field.g-d_b
                                input(type="text", v-model="birth_place" data-vv-as="место рождения" v-validate="'required|osbw|lsndd_ru'" name="birthplace", id="FPD_BIRTHPLACE").field_text.field_text_mtrl
                                span.control__label Место рождения
                                span.field_error(v-if="errors.has('birthplace')" v-html="errors.first('birthplace')")
                            .control__note Строго в соответствии с паспортом
                        .control
                            .control__field
                                input(type="text" value="Гражданство РФ" id="FPD_CITIZENSHIP" disabled).field_text.field_text_mtrl
                        .control
                            .g-row_narrow
                                .g-col.g-col_xs_6
                                    .control
                                        label.control__field.g-d_b
                                            input(type="text" v-model="snils" data-vv-as="СНИЛС" v-validate="'snils'" name="snils" id="FPD_SNILS").field_text.field_text_mtrl
                                            span.control__label СНИЛС
                                            span.field_error(v-if="errors.has('snils')" v-html="errors.first('snils')")
                                .g-col.g-col_xs_6
                                    .control
                                        label.control__field.g-d_b
                                            input(type="text", v-model="inn" data-vv-as="ИНН" v-validate="'required|inn'" name="inn", id="FPD_INN").field_text.field_text_mtrl
                                            span.control__label ИНН
                                            span.field_error(v-if="errors.has('inn')" v-html="errors.first('inn')")
                            .control__note Вы можете узнать Ваш ИНН #[br] на сайте #[a(href="https://service.nalog.ru/inn.do", target="_blank") Налог.ру]
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="tel",
                                    v-model="phone",
                                    data-vv-as="телефон",
                                    name="phone",
                                    v-validate="'required|asc|mp'",
                                    id="FPD_PHONE",
                                    ref="phone_number"
                                ).field_text.field_text_mtrl
                                span.control__label Телефон
                                span.field_error(v-if="errors.has('phone')" v-html="errors.first('phone')")
                            .control__note Укажите номер телефона #[br.g-show_xs] для подтверждения операций
                        .control
                            label.control__field.g-d_b
                                input(type="text", :disabled="true" v-model="email" data-vv-as="email" v-validate="'required|email'" name="email", id="FPD_EMAIL").field_text.field_text_mtrl
                                span.control__label Email
                                span.field_error(v-if="errors.has('email')" v-html="errors.first('email')")
                            .control__note Изменение Логина/Email в банке
                    fieldset.form__fieldset(:disabled="formDisabled")
                        .g-row
                            .g-col.g-col_md_5
                                input(type="button" @click="next" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" :disabled="buffering" value="Сохранить").btn.btn_block
</template>

<script>
import step from './step.vue';
import moment from 'moment';
// import 'inputmask/dist/inputmask/phone-codes/phone-ru.js';
import '../../../assets/js/vendor/phone-ru.js';
import Inputmask from 'inputmask';
import { formProfileStepChange } from './../../../mixins';
import { mapActions, mapState } from 'vuex';
export default {
    components: {
        step,
    },
    mixins: [formProfileStepChange],
    data() {
        return {
            last_name: '',
            name: '',
            middle_name: '',
            has_middle_name: false,
            dob: '',
            sex: '',
            birth_place: '',
            citizenship: '643',
            snils: '',
            inn: '',
            phone: '',
            email: '',
            buffering: false,
            loaded: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$onBlur();
            this.$checkInputs();
            this.initMaskInputs();
        });

        this.fillData();
        //this.anketaEnter();
    },
    beforeDestroy() {

        this.$removeOnBlurEvents();

        [
            document.getElementById('FPD_SNILS'),
            document.getElementById('FPD_INN'),
            document.getElementById('FPD_BIRTDATE'),
            document.getElementById('FPD_PHONE'),
            document.getElementById('FPD_EMAIL')
        ].forEach(item => {
            if (item && item.inputmask) item.inputmask.remove();
        });
    },

    methods: {
	    ...mapActions('progress', [
		    'A_GET_PROGRESS_PROFILE'
        ]),
        
        initMaskInputs() {
            try {
                Inputmask('999-999-999 99').mask(document.getElementById('FPD_SNILS'));
                Inputmask('999999999999').mask(document.getElementById('FPD_INN'));
                Inputmask('99.99.9999').mask(document.getElementById('FPD_BIRTDATE'));

                if (this.mobileOS != 'Android') {
                    Inputmask('email').mask(document.getElementById('FPD_EMAIL'));
                }

                Inputmask('phoneru').mask(document.getElementById('FPD_PHONE'));
            } catch (e) {

            }
        },

        next() {
            if (this.$store.state.user.state.authState == 2) {
                axios.get('/ClientProfile/PersonalData').then(({
                    data
                }) => {
                    if (!data) return;
                    let dataBd = moment.utc(data.birthDate, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY')
                    let thisPhone = this.phone.replace(/[^0-9]/g, '')
                    let dataPhone
                    if(data.phone) {
                        dataPhone = data.phone.replace(/[^0-9]/g, '')
                    } else {
                        dataPhone = ''
                    }


                    if (this.last_name != data.lastName ||
                        this.name != data.firstName ||
                        this.middle_name != data.middleName ||
                        this.dob != dataBd ||
                        this.sex != data.gender ||
                        this.birth_place != data.birthPlace ||
                        this.citizenship != data.citizenshipCountryNum ||
                        this.snils != data.snils ||
                        this.inn != data.inn ||
                        thisPhone != dataPhone ||
                        this.email != data.email
                    ) {

                        this.buffering = true;
                        this.$validator.validateAll().then((result) => {
                            if (result) {
                                this.updateInfo();
                            } else {
                                this.buffering = false;
                            }
                        });
                    } else {

                        let stepPath = this.$store.state.formStep.path
                        if (stepPath == '') {

                            this.buffering = true;
                            this.$validator.validateAll().then((result) => {
                                if (result) this.updateInfo();
                                else this.buffering = false;
                            });
                        } else {

                            this.buffering = true;
                            this.$store.commit('setFormStepStatus', true);
                            this.$router.push(stepPath);
                        }
                    }
                });
            } else {
                this.buffering = true;
                this.$validator.validateAll().then((result) => {
                    if (result) this.updateInfo();
                    else this.buffering = false;
                });
            }
        },

        // anketaEnter() {
        //     axios.post('/ClientProfile/AnketaEnter');
        // },

        fillData() {
            axios.get('/ClientProfile/PersonalData').then(({
                data
            }) => {
                if (!data) return;

                this.last_name = data.lastName || '';
                this.name = data.firstName || '';
                this.middle_name = data.middleName || '';
                this.has_middle_name = data.middleName ? false : true;
                this.dob = data.birthDate ? moment.utc(data.birthDate, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY') : '';
                this.sex = data.gender;
                this.birth_place = data.birthPlace || '';
                this.citizenship = data.citizenshipCountryNum || '';
                this.snils = data.snils ? Inputmask.format(data.snils, {
                    mask: '999-999-999 99'
                }) : '';
                this.inn = data.inn || '';
                this.phone = data.phone ? Inputmask.format(data.phone, {
                    alias: 'phoneru'
                }) : '';
                this.email = data.email ? Inputmask.format(data.email, {
                    alias: 'email'
                }) : '';

                setTimeout(() => {
                    this.$checkInputs();
                    this.setDatePicker('FPD_BIRTDATE', 'dob');

                    this.loaded = true;
                }, 100);
            });
        },

        updateInfo(showModal) {
            if (!this.allowEditClientProfile) {
                this.buffering = false;
                return;
            }

            let data = {
                lastName: this.last_name,
                firstName: this.name,
                middleName: this.middle_name,
                fullName: `${this.last_name} ${this.name} ${this.middle_name}`,
                shortName: `${this.last_name} ${this.name.charAt(0)}. ${this.middle_name.charAt(0)}.`,
                phone: _.clone(this.phone).replace(/\D/g, ''),
                email: this.$store.state.user.state.email,
                birthPlace: this.birth_place,
                birthDate: moment.utc(this.dob, 'DD.MM.YYYY').toISOString(),
                gender: this.sex,
                citizenshipCountryNum: this.citizenship,
                snils: this.snils,
                inn: this.inn
            };

            axios.post('/ClientProfile/PersonalData', data).then(() => {
                this.$store.dispatch('user/formChanged');
                this.$store.dispatch('user/getForm');
	            this.A_GET_PROGRESS_PROFILE();
                this.buffering = false;

                if (this.$store.state.user.state.authState == 2) {
                    window.events.$emit('show_popup', 'form-step');
                } else {
                    if (!localStorage.getItem('questionaryStep')) {
                        let obj = {
                            '/user/passport': 1,
                            '/user/address': 0,
                            '/user/bank': 0,
                            '/user/finish': 0
                        };
                        localStorage.setItem('questionaryStep', JSON.stringify(obj))
                    };

                    this.$router.push('/user/passport')
                }

            }).then(data, (error) => {

            }).catch((error) => {

                this.buffering = false
            });
        }
    },
    computed: {
        ...mapState('user', {
            allowEditClientProfile: state => state.state.allowEditClientProfile
        }),
        
        regEsia(){
            return false /* Grishin A.V. 14.07.2020 */ && this.$store.state.user.state.registrationProvider == 'ESIA' && this.$store.state.user.state.authState == 1 && this.$store.state.user.state.hasEsia == true
        },

        buttonDisabled() {
            return !Boolean(
                this.last_name &&
                this.name &&
                (this.has_middle_name || this.middle_name) &&
                this.dob &&
                this.sex &&
                this.birth_place &&
                this.citizenship &&
                /* this.snils &&
                 this.inn &&*/
                this.phone &&
                this.email
            );
        },
        
        formDisabled() {
            return this.loaded && !this.allowEditClientProfile;
        }
    }
}
</script>
<style>
.personal-disabled {
    margin-bottom: 50px;
}
</style>