<template lang="pug">
    article.content
        h1 Формирование анкеты
        form.form-questionary.g-row
            .g-col.g-col_lg_8
                fieldset.control-fieldset.g-mb_6.g-mb_3_xs
                    .control.g-d_f.g-ai_c.g-d_b_xs
                        .control__label.g-fs_2.form-questionary__caption
                            label(for="FPD_NOTIFY") Способ получения уведомлений
                        .control__field.g-col_md_6.g-pl_2.g-pl_0_xs
                            v-select(:options="notificationOptions" label="name" v-model="notificationOption").field-select#FPD_NOTIFY
                    .control.h3.g-fw_4.g-lh_15.form-questionary__h3
                        p Если Ваши данные изменились, Вы обнаружили ошибку или несоответствие в персональных данных, пожалуйста, вернитесь в необходимый раздел анкеты и скорректируйте данные до подписания анкеты.
                        p Неверно предоставленные данные могут вызвать проблемы при оформлении документов.
                    .control.control_nav
                        label.checkbox(:class="{'checkbox_error': errors.has('terms')}")
                            input(type="checkbox", v-validate="'required'" data-vv-as="условия" name="terms", v-model="terms" id="FPD_TERMS", value="1")
                            .checkbox__text
                                .g-fw_4 Нажимая «Подписать», Вы подтверждаете:
                                ul.checkbox__label--list
                                    li Что информация, приведенная в настоящей анкете, является полной и достоверной.
                                    li
                                        | Обязуетесь незамедлительно информировать организацию обо всех изменениях предоставленной информации.
                                        br
                                        | В случае совершения операций к выгоде третьих лиц, не указанных в данной анкете, обязуетесь в письменной форме предоставить организации сведения о выгодоприобретателях,
                                        br
                                        | а также подлинники или надлежащим образом заверенные копии документов, содержащие такие сведения.
                fieldset.control-fieldset
                    .control
                        .control__field.h3.g-fw_4.g-lh_15.g-mb_0.form-questionary__caption
                            p Для клиентов, приобретающих паи паевых инвестиционных фондов:
                        .control__field
                            label.checkbox(:class="{'checkbox_error': errors.has('reesr')}")
                                input(type="checkbox", v-validate="'required'" v-model="reestr" data-vv-as="лицеовой счет" name="reesr")
                                span.checkbox__text
                                    | Да, лицевой счёт в реестре владельцев ПИФ открывается для единоличного владения
                        .control-wrap.g-ptb_3.g-plr_4.g-mt_3
                            .g-row.g-row_table.g-row_b_xs
                                .g-col_md_9.g-col
                                    label(for="FPD_ALLOW_Y") Разрешаю Регистратору получать от меня документы, являющиеся основанием для совершения операций по счетам в реестре, почтовым отправлением.
                                .g-col_md_3.g-col
                                    .radio-list_inline.g-pl_6.g-pl_0_xs.g-mt_2.g-jc_fs_xs
                                        .radio.radio_vertical_mi-xs.g-mr_2_xs
                                            input(type="radio", name="allow", v-model="allow" :value="true", id="FPD_ALLOW_Y")
                                            label(for="FPD_ALLOW_Y") Да
                                        .radio.radio_vertical_mi-xs.g-mr_2_xs
                                            input(type="radio", name="allow", v-model="allow" :value="false", id="FPD_ALLOW_N")
                                            label(for="FPD_ALLOW_N") Нет
                    .control__note
                        .g-mb_2_xs (в соответствии с п.3.8. Приказа ФСФР России от 30.07.2013 N 13-65/пз-н
                        div «О порядке открытия и ведения держателями реестров владельцев ценных бумаг лицевых и иных счетов»)
                    .control.g-mt_2.g-mt_4_xs.g-row
                        .g-col.g-col_md_4
                            input(type="submit", :disabled="buffering" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" @click.prevent="validateForm" value="Подписать").btn.btn_block
</template>

<script>
    export default {
        watch: {
            notificationOption() {
                this.changeNotificationOption();
            },
            allow() {
                this.changeNotificationOption();
            }
        },
        data() {
            return {
                terms: true,
                reestr: true,
                allow: true,
                notificationOptions: [],
                notificationOption: null,
                buffering: false
            }
        },
        created() {
            this.$store.commit('updateCrumbs', [
                { link: '/user/personal', text: 'Анкета' }
            ]);

            let notificationOptions = localStorage.getItem('notificationOptions');
            if (!this.notificationOptions.length && notificationOptions) this.notificationOptions = JSON.parse(notificationOptions);

            this.getNotificationMethods();
        },
        methods: {
            validateForm() {
                this.$validator.validateAll().then(result => {
                    if (result) this.signForm();
                });
            },
            signForm() {
                this.buffering = true;

                this.changeNotificationOption();
                axios.post('/ClientProfileApp').then(({data}) => {
                    this.buffering = false;
                    window.events.$emit('show_popup', ['form-confirm', {
                        phone: this.phone,
                        app_number: data.number,
                        app_id: data.applicationId
                    }]);
                }).catch((error) => {
                    // console.log('error', error);
                    this.buffering = false;
                });
            },
            getNotificationMethods() {
                axios.get('/reference/notificationmethods').then(({data}) => {
                    this.notificationOptions = data;
                    localStorage.setItem('notificationOptions', JSON.stringify(data));

                    return axios.get('/ClientProfile/NotificationMethod');
                }).then(({data}) => {
                    let method = this.notificationOptions.find(item => item.id == data.notificationMethod);

                    // if (method) this.notificationOption = method;
                    this.notificationOption = this.notificationOptions[2];
                });
            },
            changeNotificationOption() {
                axios.post('/ClientProfile/NotificationMethod', null, {
                    params: {
                        notificationMethod: this.notificationOption.id,
                        postYea: this.allow
                    }
                });
            }
        },
        computed: {
            buttonDisabled() {
                return !Boolean(
                    this.terms &&
                    this.reestr &&
                    this.notificationOption
                );
            },
            phone() {
                if (!this.$store.state.user.state || !this.$store.state.user.state.phone) return '';

                let phone = this.$store.state.user.state.phone;

                let m = phone.match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

                if (m.length != 6) return '';

                return `+${m[1]} (${m[2]}) ${m[3]} ${m[4]} ${m[5]}`;
            },
            notifications() {
                return [
                    this.notificationOption,
                    this.allow
                ]
            }
        }
    }

</script>

<style lang="scss">
    @import "../../../assets/styles/vars";
    .form-questionary{
        .control{

            &-wrap{
                @include box-decor(1, 0, 1);
                @include media($width_xs){
                    background-color:$clr_blue;
                    padding:nth($m-em, 3) nth($m-em, 2);
                    box-shadow:none;
                    .radio label:before{
                        background-color:#fff;
                    }
                }

            }

            &__field{
                & + .control__field{
                    margin-top:15px;
                }
            }
            &__note{
                margin-top:30px;
                position:static;
                margin-left:0;
                transform:translate(0);
            }

        }
        .g-row_table{
            .g-col{
                vertical-align:middle;
            }
        }
        @include media($width_xs){
            &__h3{
                font-size:1em;
            }
            &__caption{
                font-size:$fs_15;
                font-weight:500;
                display:block;
                margin-bottom:nth($m_em, 2);
            }
        }
    }
</style>