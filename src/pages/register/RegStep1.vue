<template lang="pug">
    article.content.g-pt_9.g-pt_4_xs
        h1 Регистрация шаг 1
        .g-row
            aside.g-col.g-col_lg_4
                ul.step.step_number
                    li.step__item.active
                        .h2.g-mb_0 Контактные данные
                    li.step__item
                        .h2.g-mb_0  Персональные данные
            .g-col.g-col_lg_8
                form.form.form-step(autocomplete="off")
                    h3.form-step__title Заполните #[br.g-hidden.g-show_xs] контактные данные:
                    fieldset.form__fieldset.form__fieldset_narrow
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="text"
                                    data-action="validateField"
                                    data-label="lastname"
                                    data-vv-as="фамилия"
                                    v-validate="'required|fulsd_ru|osbw'"
                                    @keypress="onlyLetters"
                                    @keyup="capitalizeFirst"
                                    @change="setValue($event, 'lastName')"
                                    v-model="step_1.lastName"
                                    :disabled="dataEsiaDisabled || stateEsiaDisabled"
                                    name="sirname"
                                    id="FR_SIRNAME"

                                ).field_text.field_text_mtrl.js-validate-datalayer
                                span.control__label Фамилия
                                span.field_error(v-if="errors.has('sirname')" v-html="errors.first('sirname')")
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="text"
                                    data-action="validateField"
                                    data-label="name"
                                    data-vv-as="имя"
                                    v-validate="'required|fulsd_ru|osbw'"
                                    @keypress="onlyLetters"
                                    @keyup="capitalizeFirst"
                                    @change="setValue($event, 'firstName')"
                                    v-model="step_1.firstName"
                                    :disabled="dataEsiaDisabled || stateEsiaDisabled"
                                    name="name"
                                    id="FR_NAME").field_text.field_text_mtrl.js-validate-datalayer

                                span.control__label Имя
                                span.field_error(v-if="errors.has('name')" v-html="errors.first('name')")
                        .control
                            label.control__field.g-d_b
                                input(
                                    type="text"
                                    data-action="validateField"
                                    data-label="patronymic"
                                    data-vv-as="отчество"
                                    @keypress="onlyLetters"
                                    @keyup="capitalizeFirst"
                                    @change="setValue($event, 'middleName')"
                                    v-validate="{required: !step_1.no_middle_name, fulsd_ru: !step_1.no_middle_name, osbw: !step_1.no_middle_name }"
                                    v-model="step_1.middleName"
                                    :disabled="step_1.no_middle_name || dataEsiaDisabled || stateEsiaDisabled"
                                    name="patronymic"
                                    id="FR_PATRONYMIC").field_text.field_text_mtrl.js-validate-datalayer
                                span.control__label Отчество
                                span.field_error(v-if="errors.has('patronymic')" v-html="errors.first('patronymic')")
                            .control__note
                                .checkbox.sz_s
                                    input(type="checkbox", v-model="step_1.no_middle_name" name="hasPatronymic", id="FR_HASPATRONYMIC", value="1")
                                    label(for="FR_HASPATRONYMIC") Нет отчества
                        .control
                            label.control__field.g-d_b
                                input(type="tel", data-action="validateField" data-label="phone" data-vv-as="телефон" v-validate="'required|asc|mp'" v-model="step_1.phone" name="phone", ref="phone_number" id="FR_PHONE").field_text.field_text_mtrl.js-validate-datalayer
                                span.control__label Телефон
                                span.field_error(v-if="errors.has('phone')" v-html="errors.first('phone')")
                            .control__note Укажите номер телефона #[br.g-show_xs] для подтверждения операций
                        .control
                            label.control__field.g-d_b
                                input(type="text", data-action="validateField" data-label="email" data-vv-as="email" v-validate="'required|email'" v-model="step_1.email" name="email", id="FR_EMAIL" inputmode="email").field_text.field_text_mtrl.js-validate-datalayer
                                span.control__label Email
                                span.field_error(v-if="errors.has('email')" v-html="errors.first('email')")
                            .control__note(style="max-width:280px") На указанный email будут направлены #[br.g-show_xs] данные для входа в Личный кабинет
                    fieldset.form__fieldset
                        .control

                            .g-fw_4 Подтверждаю, что:

                            ul.checkbox__label--list.checkbox__label--no-points

                                li.parent
                                    label.checkbox(:class="{'checkbox_error': errors.has('terms')}")
                                        input(type="checkbox", data-vv-as="условия" v-validate="'required'" v-model="step_1.terms" name="terms", id="FR_TERMS", value="1" @click.prevent="termsToggle()")
                                        .checkbox__text Выделить все

                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_nr')}")
                                        input(type="checkbox", data-vv-as="Являюсь налоговым резидентом Российской Федерации" v-validate="'required'" v-model="step_1.term.nr" name="term_nr" value="1")
                                        .checkbox__text Являюсь налоговым резидентом Российской Федерации;
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_sv')}")
                                        input(type="checkbox", data-vv-as="Действую к собственной выгоде (выгодоприобретатель отсутствует)" v-validate="'required'" v-model="step_1.term.sv" name="term_sv" value="1")
                                        .checkbox__text Действую к собственной выгоде (выгодоприобретатель отсутствует);
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_bv')}")
                                        input(type="checkbox", data-vv-as="Сведения о бенефициарных владельцах отсутствуют" v-validate="'required'" v-model="step_1.term.bv" name="term_bv" value="1")
                                        .checkbox__text  Сведения о бенефициарных владельцах отсутствуют;

                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_ip')}")
                                        input(type="checkbox", data-vv-as="Не являюсь Индивидуальным предпринимателем" v-validate="'required'" v-model="step_1.term.ip" name="term_ip" value="1")
                                        .checkbox__text  Не являюсь Индивидуальным предпринимателем;
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_dl')}")
                                        input(type="checkbox", data-vv-as="Не являюсь публичным должностным лицом или его родственником" v-validate="'required'" v-model="step_1.term.dl" name="term_dl" value="1")
                                        .checkbox__text  Не являюсь публичным должностным лицом или его родственником
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_pd')}")
                                        input(type="checkbox", data-vv-as="Согласны на обработку" v-validate="'required'" v-model="step_1.term.pd" name="term_pd" value="1")
                                        .checkbox__text  Согласны на обработку #[a.link.g-fs_i_i(href="/downloads/PD_approval.pdf", download="PD_approval.pdf") Ваших персональных данных;]
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_plk')}")
                                        input(type="checkbox", data-vv-as="Согласны на обработку" v-validate="'required'" v-model="step_1.term.plk" name="term_plk" value="1")
                                        .checkbox__text Ознакомлены и согласны с #[a.link.g-fs_i_i(href="/downloads/EULA.pdf", download="EULA.pdf") Правилами Личного кабинета;]
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_ied')}")
                                        input(type="checkbox", data-vv-as="Согласны на обработку" v-validate="'required'" v-model="step_1.term.ied" name="term_ied" value="1")
                                        .checkbox__text  Ознакомлены и согласны с #[a.link.g-fs_i_i(href="/downloads/EDO_Agreement.pdf", download="EDO_Agreement.pdf") соглашением об использовании электронного документооборота.]
                                li
                                    label.checkbox(:class="{'checkbox_error': errors.has('term_usa')}")
                                        input(type="checkbox", data-vv-as="Не являюсь гражданином и/или налоговым резидентом США; не являюсь налоговым резидентом иностранного государства" v-validate="'required'" v-model="step_1.term.usa" name="term_usa" value="1")
                                        .checkbox__text Не являюсь гражданином и/или налоговым резидентом США; не являюсь налоговым резидентом иностранного государства
                    fieldset.form__fieldset
                        .g-row.g-row_flex.g-row_b_xs
                            .g-col.g-col_md_5.g-mb_2_xs.g-or_1
                                input(type="button" @click="next" value="Далее" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}").btn.btn_block
                            .g-col.g-col_auto
                                div
                                    .g-mt_1 У меня есть Логин
                                    router-link(to="/",class="") Войти в Личный кабинет


</template>
<script>
import '../../assets/js/vendor/phone-ru.js';
import Inputmask from 'inputmask';
import { addPixelImg, CONST_EXP, getRegDataUS, removeFromStorage } from '../../assets/js/functions/global';
import step from '../../components/Step.vue';
import { checkAndFireEvent } from '../../helpers';

const { QU_UTM_SOURCE, QU_REG_DATA_FROM_US } = CONST_EXP;

export default {
    components: {
        'reg-step': step
    },
    data() {
        return {
            buffering: false,
            dataEsiaDisabled: false,
            stateEsiaDisabled: this.$store.state.register.regesia,
            step_1: {
                lastName: '',
                firstName: '',
                middleName: '',
                no_middle_name: false,
                phone: '',
                email: '',
                terms: false,
                term: {
                    nr: false,
                    sv: false,
                    bv: false,
                    ip: false,
                    dl: false,
                    pd: false,
                    plk: false,
                    ied: false,
                    usa: false
                }
            }
        };
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
                    label: 'step 1'
                });
            }
        },

        buttonTerms(val) {
            this.step_1.terms = val;

        },
        buttonTerm(val) {
            this.step_1.terms = val;
        }
    },
    created() {
        this.setUserParamsBy_REG_DATA_US();
        if (this.$store.state.register.step_1) {
            this.step_1 = { ...this.step_1, ...this.$store.state.register.step_1 };

            setTimeout(() => this.$checkInputs(), 20);
        }

        if (this.$route.query.regesia) {
            // this.$router.push({name: 'technicalWorks'}); // TODO удалить после завершения тех. работ;
            this.$store.commit('register/setRegEsia', true);
        } else {
            // this.$router.push({name: 'technicalWorks'}); // TODO удалить после завершения тех. работ;
        }

        if (this.$route.query.form) {
            let queryForm = this.$route.query.form;
            if (queryForm.indexOf('?utm_source') !== -1) {
                queryForm = queryForm.substr(0, queryForm.indexOf('?utm_source'));
            }
            this.$store.commit('register/setFormId', queryForm);
            this.getPersonalData();
        } else if (localStorage.getItem('form_id')) {
            this.$store.commit('register/setFormId', localStorage.getItem('form_id'));
            this.getPersonalData();
        }
    },
    mounted() {
        this.$onBlur();
        this.$nextTick(() => {
            if (this.mobileOS != 'Android') {
                Inputmask({
                    alias: 'email',
                    disablePredictiveText: true,
                    placeholder: ''
                }).mask(document.getElementById('FR_EMAIL'));
            }
            Inputmask({ alias: 'phoneru' }).mask(document.getElementById('FR_PHONE'));
        });
    },
    beforeDestroy() {
        [
            document.getElementById('FPD_EMAIL'),
            document.getElementById('FR_PHONE')
        ].forEach(item => {
            if (item && item.inputmask) item.inputmask.remove();
        });
    },
    methods: {
        setUserParamsBy_REG_DATA_US() {
            if (!getRegDataUS()) {
                removeFromStorage(QU_REG_DATA_FROM_US);
                return;
            }
            ;
            let { name, surname, phone } = getRegDataUS();
            if (phone.charAt(0) !== '+') phone = `+${phone}`;
            this.step_1.lastName = surname;
            this.step_1.firstName = name;
            this.step_1.phone = phone;
            this.$checkInputs();
        },
        termsToggle() {
            if (!this.step_1.terms) {
                this.step_1.terms = true;
            } else {
                for (let prop in this.step_1.term) {
                    this.step_1.term[prop] = false;
                }
            }
        },
        getPersonalData() {
            let id = this.$store.state.register.form_id;

            axios.get(`/SignUp/PersonalData/${id}`).then(({ data }) => {
                this.dataEsiaDisabled = this.$store.state.register.regesia;
                this.step_1 = { ...this.step_1, ...data };

                /* this.step_1.phone = this.step_1.phone ? this.step_1.phone.substr(2) : '';*/

                setTimeout(() => this.$checkInputs(), 100);
            });
        },
        next() {
            this.buffering = true;
            this.$validator.validateAll().then((result) => {
                if (result) {
                    removeFromStorage(QU_REG_DATA_FROM_US);
                    this.processData();
                } else {
                    this.buffering = false;
                }
            });
        },

        processData() {
            addPixelImg();
            this.$store.commit('register/save', { data: this.$data.step_1, step: 1 });

            let data = _.cloneDeep(this.step_1);

            data.fullName = `${data.firstName} ${data.middleName} ${data.lastName}`;
            data.shortName = `${data.firstName} ${data.lastName}`;
            data.phone = data.phone.replace(/\D/g, '');

            if (this.$store.state.register.form_id) {
                let id = this.$store.state.register.form_id;
                let getUtm = localStorage.getItem(QU_UTM_SOURCE);
                if (getUtm == null || getUtm == undefined) getUtm = '';

                axios.patch(`/SignUp/PersonalData/${id}${getUtm}`, data)
                    .then(({ data }) => {
                        this.$router.push('/register/passport');
                        localStorage.removeItem(QU_UTM_SOURCE);
                    }).catch(({ data }) => {
                    let messages = Object.values(data.response.data.modelState).reduce((acc, val) => acc.concat(val), []);
                    flash(messages, 'error');
                    this.buffering = false;
                });
            } else {
                let getUtm = localStorage.getItem(QU_UTM_SOURCE);
                if (getUtm == null || getUtm == undefined) getUtm = '';
                axios.post(`/SignUp/PersonalData${getUtm}`, data)
                    .then(({ data }) => {
                        this.$store.commit('register/setFormId', data.requestId);
                        localStorage.removeItem(QU_UTM_SOURCE);
                        localStorage.setItem('form_id', data.requestId);
                        localStorage.setItem('phone', this.step_1.phone);

                        checkAndFireEvent({
                            action: 'sendForm',
                            label: 'step 1'
                        });

                        this.$router.push('/register/passport');
                    }).catch((data) => {
                    let messages = Object.values(data.response.data.modelState).reduce((acc, val) => acc.concat(val), []);
                    flash(messages, 'error');
                    this.buffering = false;
                });
            }
        },
        setValue(event, field) {
            this.step_1[field] = event.target.value;
        }
    },
    computed: {
        buttonTerms() {
            if (this.step_1.terms) {
                for (let prop in this.step_1.term) {
                    this.step_1.term[prop] = true;
                }
            }
            return this.step_1.terms;
        },
        buttonTerm() {

            return (
                this.step_1.term.nr &&
                this.step_1.term.sv &&
                this.step_1.term.bv &&
                this.step_1.term.bv &&
                this.step_1.term.ip &&
                this.step_1.term.dl &&
                this.step_1.term.pd &&
                this.step_1.term.pd &&
                this.step_1.term.plk &&
                this.step_1.term.plk &&
                this.step_1.term.ied &&
                this.step_1.term.usa
            );
        },
        buttonDisabled() {
            return (
                !this.buffering &&
                this.step_1.lastName &&
                this.step_1.firstName &&
                (this.step_1.middleName || this.step_1.no_middle_name) &&
                this.step_1.phone &&
                this.step_1.email &&
                this.step_1.terms
            ) == false;
        }
    }
}
</script>

