<template lang="pug">

    article.content.strategy-contract
        h1 Заявление на присоединение к договору {{strategyType.text}} #[br] стратегия {{strategySelect.strategyName}}
        form()
            fieldset.g-mb_4
                legend.h2 1. Клиент
                .g-row
                    .control.g-col.g-col_md_6
                        .control__label-top
                            label(for="id-FIO") Ф.И.О
                        .control__field
                            input(type="text", name="full_name" id="id-FIO"  v-model="full_name",disabled).field_text

            fieldset.g-mb_4(disabled)
                legend.h2 2. Паспортные данные
                .g-row.g-mb_6_xs
                    .g-col.g-col_md_6.g-mb_4_xs
                        .g-row.g-row_narrow.g-row_ib.g-row_ib_b
                            .control.g-col.g-va.g-col_md_4
                                .control__label-top
                                    label(for="FPD_PASSPORT") Серия и номер
                                .control__field
                                    input(type="text", name="full_name" id="FPD_PASSPORT"  v-model="passport").field_text
                            .control.g-col.g-va.g-col_md_4
                                .control__label-top
                                    label(for="FR_DATE_ISSUE") Дата выдачи
                                .control__field
                                    input(type="text", name="full_name" id="FR_DATE_ISSUE"  v-model="date_issue").field_text
                            .control.g-col.g-va.g-col_md_4
                                .control__label-top
                                    label(for="FR_PASSPORT_CODE") Код подразделения
                                .control__field
                                    input(type="text", name="full_name" id="FR_PASSPORT_CODE"  v-model="passport_code").field_text
                    .g-col.g-col_md_6
                        .control__label-top
                        p Если Вы заметили ошибку в паспортных данных, отредактируйте их #[br] в разделе Анкета (потребуется приложить копию паспорта)
                            br
                            router-link(to="/user/passport") Перейти в анкету
                .g-row.g-mt_2_m
                    .g-col.g-col_md_6.g-mb_0_xs
                        .control
                            .control__label-top
                                label(for="FR_ISSUER") Орган, выдавший документ
                            .control__field
                                input(type="text", name="issuer", id="FR_ISSUER"  v-model="issuer").field_text
                    .g-col.g-col_md_6

            fieldset.g-mb_4()
                legend.h2 3. Сведения о стратегии управления
                .g-row
                    .g-col.g-col_md_6.g-mb_0_xs
                        .g-row.g-row_narrow.g-row_ib.g-row_ib_b
                            .control.g-col(:class="{'g-col_md_6': this.strategyType.val == 'iis', 'g-mb_0' : this.strategyType.val == 'du'}")
                                .control__label-top
                                    label(for="strategy") Наименование стратегии
                                .control__field
                                    input(type="text", name="strategy" id="strategy"  v-model="strategySelect.strategyName" disabled).field_text
                            .control.g-col.g-col_md_6(v-if="(this.strategyType.val == 'iis')")
                                .control__label-top
                                    label(for="sum") Предполагаемая сумма инвестирования* #[br] {{strategyType.text}} {{formatCurrency(amount_min, true)}} - {{formatCurrency(amount_max, true)}}
                                .control__field
                                    .tooltip-wrap(:class="{active: tollTipShowMin || tollTipShowMax}")
                                        .tooltip(v-html="`${tollTipShowMin ? `Минимальная сумма ${formatCurrency(amount_min, true)}` : `Максимальная сумма ${formatCurrency(amount_max, true)}`}`")
                                        input(
                                            type="text",
                                            id="sum",
                                            v-model="amount",
                                            v-money="money",
                                            name="sum",
                                            v-validate="`required|amountMinMax:${[amount_min, amount_max]}`",
                                            @input="changeInput()",
                                            :class="{'show-currency' : styleHidden(amount), invalid_force: getError('sum') }"
                                        ).field_text
                                        span
                    .g-col.g-col_md_6.g-mt_2_xs(v-show="(this.strategyType.val == 'iis')")
                        p *Указывается сумма в размере не менее минимальной суммы инвестирования, предусмотренной выбранной Стратегией управления.
            fieldset.g-mb_4(v-if="(this.strategyType.val == 'iis')")
                legend.h2 4. Подтверждаю, что:
                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_1')}")
                    input(type="checkbox", v-validate="'required'" name="term_1", v-model="term_1" value="1")
                    .checkbox__text у меня отсутствует договор с другим профессиональным участником рынка ценных бумаг на ведение индивидуального инвестиционного счета (ИИС), а в случае его наличия, я обязуюсь расторгнуть такой договор в срок не позднее одного месяца с даты вступления Договора в силу в части, не связанной с доверительным управлением, определяемой согласно условиями Договора;
                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_2')}")
                    input(type="checkbox", v-validate="'required'" name="term_2", v-model="term_2" value="1")
                    .checkbox__text осознаю правовые последствия введения компании в заблуждение относительно заявлений, содержащихся выше;

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_3')}")
                    input(type="checkbox", v-validate="'required'" name="term_3", v-model="term_3" value="1")
                    .checkbox__text внимательно и в полном объёме изучил условия Договора, в том числе приложения к нему, касающегося описания рисков, которые могут возникнуть при совершении операций с активами на рынке ценных бумаг;

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_4')}")
                    input(type="checkbox", v-validate="'required'" name="term_4", v-model="term_4" value="1")
                    .checkbox__text мне понятны все существенные условия выбранной Стратегии управления, в том числе Стандартной стратегии управления, включая размер и порядок выплаты вознаграждения, взимаемого Компанией;

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_5')}")
                    input(type="checkbox", v-validate="'required'" name="term_5", v-model="term_5" value="1")
                    .checkbox__text в случае выбора мною Стандартной стратегии управления, даю своё согласие на присваиваемый мне Стандартный инвестиционный профиль, соответствующий выбранной мной Стандартной стратегии управления.

                label.checkbox.g-mb_0(:class="{'checkbox_error': errors.has('term_8')}")
                    input(type="checkbox", v-validate="'required'" name="term_8", v-model="term_8" value="1")
                    .checkbox__text ознакомлен с 
                        a(target="_blank" href="/downloads/Базовый стандарт_перечень информации_2021_1.pdf") информацией о профессиональном участнике рынка ценных бумаг и договоре доверительного управления ценными бумагами
                        | .

            fieldset.g-mb_4(v-else)
                legend.h2 4. Подтверждаю, что:
                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_1')}")
                    input(type="checkbox", v-validate="'required'" name="term_1", v-model="term_1" value="1")
                    .checkbox__text внимательно и в полном объеме изучил условия Договора, в том числе приложения к нему, касающегося описания рисков, которые могут возникнуть при осуществлении операций на рынке ценных бумаг, осознаю, что оказываемые Управляющим услуги не являются услугами по открытию банковских счетов и приему вкладов, а также тот факт, что денежные средства, передаваемые в рамках Договора не подлежат страхованию в соответствии с Федеральным законом от 23.12.2003 № 177-ФЗ «О страховании вкладов физических лиц в банках Российской Федерации»;
                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_2')}")
                    input(type="checkbox", v-validate="'required'" name="term_2", v-model="term_2" value="1")
                    .checkbox__text осознаю правовые последствия введения Компании в заблуждение (предоставление недостоверных сведений) относительно заявлений (гарантий), содержащихся в настоящем заявлении и в Договоре;

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_3')}")
                    input(type="checkbox", v-validate="'required'" name="term_3", v-model="term_3" value="1")
                    .checkbox__text соглашаюсь на использование при взаимодействии с Компанией документов, подписанных со стороны Компании факсимиле (аналогом собственноручной подписи) уполномоченного лица Компании и(или) электронных документов, подписанных, в том числе, электронными подписями Сторон, в том числе простыми электронными подписями;

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_4')}")
                    input(type="checkbox", v-validate="'required'" name="term_4", v-model="term_4" value="1")
                    .checkbox__text мне понятны все существенные условия выбранной Стратегии управления, в том числе Стандартной стратегии управления, включая размер и порядок выплаты вознаграждения, взимаемого Компанией;

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_6')}")
                    input(type="checkbox", v-validate="'required'" name="term_6", v-model="term_6" value="1")
                    .checkbox__text уведомлен и согласен с приобретением инвестиционных паев паевых инвестиционных фондов, доверительное управление которыми осуществляет Управляющий и лица, указанные в п.5.12 Договора. Освобождаю Управляющего от обязанности предварительного уведомления при реализации им указанного права приобретения.

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_7')}")
                    input(type="checkbox", v-validate="'required'" name="term_7", v-model="term_7" value="1")
                    .checkbox__text настоящим предоставляю в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных» АО «УК УРАЛСИБ» (ОГРН 1027739003489, 129110, город Москва, Проспект Мира, дом 69, строение 1, этаж 3, пом.3-07, лицензия профессионального участника рынка ценных бумаг на осуществление деятельности по управлению ценными бумагами № 045-06475-001000 выдана 05.03.2003), а также каждому из указанных в п. 14.4 Договора юридических лиц (каждый в отдельности именуется – Оператор, а совместно — Операторы) право (согласие) (далее – Согласие) на обработку моих персональных данных, под которыми понимаются, в том числе, но не ограничиваясь: мои ФИО, номер телефона, адрес электронной почты, адрес места регистрации, адрес места жительства, ИНН, реквизиты паспорта, иные данные, содержащиеся в нем, а также иные данные, указанные в Заявлении или полученные АО «УК УРАЛСИБ» иным образом в связи с заключением/исполнением/прекращением Договора (далее – ПДн), как самостоятельно, так и совместно с другими Операторами, в том числе на передачу ПДн между Операторами.

                label.checkbox.g-mb_2(:class="{'checkbox_error': errors.has('term_5')}")
                    input(type="checkbox", v-validate="'required'" name="term_5", v-model="term_5" value="1")
                    .checkbox__text в случае выбора мной Стандартной стратегии управления, даю свое согласие на присваиваемый мне Стандартный инвестиционный профиль, соответствующий выбранной мной Стандартной стратегии управления.

                label.checkbox.g-mb_0(:class="{'checkbox_error': errors.has('term_8')}")
                    input(type="checkbox", v-validate="'required'" name="term_8", v-model="term_8" value="1")
                    .checkbox__text ознакомлен с 
                        a(target="_blank" href="/downloads/Базовый стандарт_перечень информации_2021_1.pdf") информацией о профессиональном участнике рынка ценных бумаг и договоре доверительного управления ценными бумагами
                        | .

            fieldset.g-mb_4(v-if="(this.strategyType.val == 'iis')")
                legend.h2 5. Мне понятно, что:
                label.checkbox(:class="{'checkbox_error': errors.has('understand')}")
                    input(type="checkbox",  v-validate="'required'" name="understand",  v-model="understand" value="1")
                    .checkbox__text В целях использования права на получение налоговых вычетов (иных льгот) не допускается наличие более чем одного ИИС, за исключением случаев, предусмотренных действующим законодательством Российской Федерации. Нарушение действующего порядка может повлечь за собой отказ в предоставлении налогового вычета (льготы).
            p(v-if="(this.strategyType.val == 'iis')")
                strong Подписывая настоящее заявление и передавая необходимые документы, Я в соответствии со статьей 428 ГК РФ полностью и безоговорочно присоединяюсь к&nbsp;
                a(target="_blank" href="https://www.uralsib-am.ru/about/disclosure/cb-info/") Договору доверительного управления
                | &nbsp;ценными бумагами на ведение индивидуального инвестиционного счета (далее – Договор), условия которого определены в стандартной форме и раскрыты на сайте АО «УК УРАЛСИБ» (далее – Компания) в информационно-телекоммуникационной сети «Интернет» по адресу&nbsp;
                a(target="_blank" href="https://www.uralsib-am.ru/") www.uralsib-am.ru
            p(v-else)
                strong Подписывая настоящее заявление и передавая необходимые документы, Я
                | &nbsp;в соответствии со статьей 428 Гражданского кодекса Российской Федерации полностью и безоговорочно присоединяюсь к&nbsp;
                a(target="_blank" href="https://www.uralsib-am.ru/about/disclosure/cb-info/") Договору доверительного управления
                | &nbsp;ценными бумагами (далее – Договор), условия которого определены в стандартной форме и раскрыты на сайте АО «УК УРАЛСИБ» (далее – Компания) в информационно-телекоммуникационной сети «Интернет» по адресу&nbsp;
                a(target="_blank" href="https://www.uralsib-am.ru/") www.uralsib-am.ru

            button(type="button", class="btn g-mt_4 g-col_xs_12 g-col_md_a", :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}"  @click="validateForm") Подписать заявление


</template>

<script>
    import moment from 'moment';
    import {Money, VMoney} from 'v-money'
    import {fillUserInfo} from '../../mixins';

    export default {
        directives: {money: VMoney},
        components: {},
        mixins: [fillUserInfo],
        data() {
            return {
                strategyType: {
                    val: this.$route.params.selectedStrategy == 'iis' ? 'iis' : 'du',
                    text: this.$route.params.selectedStrategy == 'iis' ? 'ИИС' : 'ДУ'
                },
                money: {
                    decimal: ',',
                    thousands: ' ',
                    prefix: '',
                    suffix: '\u20BD',
                    precision: 0,
                    masked: false
                },
                amountT: '',
                selected_tab: 1,
                full_name: '',
                passport: '',
                passport_code: '',
                date_issue: '',
                issuer: '',
                amount: '',
                amount_min: '',
                amount_max: '1000000',
                strategy: '',
                understand: false,
                term_1: false,
                term_2: false,
                term_3: false,
                term_4: false,
                term_5: false,
                term_6: false,
                term_7: false,
                term_8: false,
            }
        },

        created() {
            if (!this.strategySelect){
                this.$router.push('/strategies/iis');
                return
            }
            if (this.strategySelect.strategyName.length > 1) {
                this.strategySelect.strategyName = this.strategySelect.strategyName.replace('«', '').replace('»', '').replace('ИИС ', '').trim()
            }

            this.$store.commit('updateCrumbs', [
                {
                    link: `/strategies/${this.strategyType.val}`,
                    text: 'ИИС и Доверительное управление'
                },
                {
                    link: `/strategies/${this.strategyType.val}`,
                    text: `Стратегии ${this.strategyType.text}`
                },
                {
                    link: `/strategies/${this.strategyType.val}/${this.strategySelect.webSiteID}`,
                    text: this.strategySelect.strategyName.replace('ИИС ', 'Стратегия ')
                },
                {
                    link: '',
                    text: `Оформление договора ${this.strategyType.text}`
                }
            ]);
            this.amount = this.amount_min.toString();
        },
        methods: {
            getError(field) {
                return this.errors.items.find(item => item.field == field);
            },
            changeInput() {
                let value = this.amount;
                value = value.replace(/\D/g, "")
                let valueP = '0'

                if (value.length == 16) {
                    this.amountT = this.amount
                } else if (value.length >= 17) {
                    this.amount = this.amountT
                }
            },
            styleHidden(value) {
                if (value) {
                    value = value.replace(/\D/g, "")
                    return value == 0
                }
            },
            fillData(user) {
            	if (!user) return;
                this.full_name = user.client ? user.client.longName : '';
                this.passport = user.dulData.series + ' ' + user.dulData.number;
                this.passport_code = user.dulData.issueCode;
                this.issuer = user.dulData.issuer;

                this.date_issue = moment.utc(user.dulData.issueDate, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY');

                this.loaded = true;
            },
            createContract() {
	            this.$store.commit('buffering', true);
                axios.post(`AmContracts/${this.strategySelect.id}`).then(({data}) => {
	                this.$store.commit('buffering', false);
                    const {contractId} = data;
                    if (!contractId) {
                        flash([`Неизвестная ошибка`], 'error');
                        return;
                    };

                    window.events.$emit('show_popup', ['confirm-operation-du-contract', {
                        app_id: contractId,
                        operation: 'BuyApps',
                        fund: this.strategySelect,
                        fundType: this.strategyType.val == 'iis' ? 'ИИС' : 'ДУ'
                    }]);
                }).catch(({response: { data : error } }) => {
	                const {message} = error;
	                flash([message ? message : 'Неизвестная ошибка'], 'error');
	                this.$store.commit('buffering', false);

                });
            },
            signContract() {
                this.$store.commit('funds/updateOperation', {
                    path: 'fund.amount',
                    data: this.amount.replace(/\D/g,'')
                });
                this.createContract();
            },
            showPopup() {
                window.events.$emit('show_popup', 'contact');
            },
            validateForm() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.signContract();
                    } else {
                    	flash(['Заполните обязательные поля'], 'error');
                    }
                });
            },
        },
        computed: {
            strategySelect() {
                if (this.$store.state.funds.operations.fund) {
                    this.amount_min = this.$store.state.funds.operations.fund.params.sfp.minSumm
                    return this.$store.state.funds.operations.fund.params;
                } else {
                    return '';
                }
            },
            tollTipShowMin() {
                let value = parseInt(this.amount.replace(/\D/g, ""));
                let min = this.amount_min && typeof this.amount_min == 'string' ?  parseInt(this.amount_min.replace(/\D/g, "")) : parseInt(this.amount_min);
                return (value >= 0 && value < min);
            },
            tollTipShowMax() {
                let value = parseInt(this.amount.replace(/\D/g, ""));
                let max = parseInt(this.amount_max.replace(/\D/g, ""));
                return (value > max);
            },
            buttonDisabled() {
                if (this.strategyType.val == 'iis') {
                    return !Boolean(
                        this.amount &&
                        this.term_1 &&
                        this.term_2 &&
                        this.term_3 &&
                        this.term_4 &&
                        this.term_5 &&
                        this.term_8 &&
                        this.understand
                    )
                } else {
                    return !Boolean(
                        this.term_1 &&
                        this.term_2 &&
                        this.term_3 &&
                        this.term_4 &&
                        this.term_5 &&
                        this.term_6 &&
                        this.term_7 &&
                        this.term_8
                    )
                }
            },
        }

    }
</script>


