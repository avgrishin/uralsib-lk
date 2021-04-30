<template lang="pug">
    form
        div(:class="{'spinner':getLoaderOrders}")
        div(v-if="!getLoaderOrders")
            h3(v-if="fundWithOrders.length > 0 && getSelectedFundsNoOrders") Вы выбрали {{fundsEnd[0]}}
                template(v-for="(item, index) in fundWithOrders") "{{item.description.replace('', '')}}",
                | по {{fundsEnd[1]}} у Вас уже {{fundsEnd[2]}} {{fundsEnd[3]}}.
            div(v-if="getSelectedFundsNoOrders")
                .g-row(v-for="(fund, index) in getSelectedFundsNoOrders" :key="index")
                    .control.g-col.g-col_lg_4.g-col_md_5
                        .control__label-top(v-if="index==0")
                            label() Наименование фонда
                        .control__field
                            input(type="text" placeholder="Будет присвоен автоматически" disabled :value="fund.description").field_text

                    .control.g-col.g-col_lg_4.g-col_md_4.g-col-FPP_NUM.g-maw_n_xs
                        .control__field
                            .control__label-top(v-if="index==0")
                                label Номер заявки
                            input(type="text" placeholder="Будет присвоен автоматически" disabled).field_text

                fieldset.control
                    .control__field
                        .control
                            label.checkbox(:class="{'checkbox_error': errors.has('open_account')}")
                                input(type="checkbox" v-validate="{required: !order }" v-model="open_account" name="open_account" id="FPP_OPEN_ACCOUNT" )
                                span.checkbox__text Прошу открыть мне лицевой счёт в реестре на основании сформированных документов
                .control.g-col_md_8
                    button(type="submit" :class="{btn_secondary: singButtonDisabled, btn_primary: !singButtonDisabled}" @click.prevent="sign" v-html="'Подписать'").btn.g-col_md_3
            div(v-else)
                fieldset.carousel.carousel_fund-pay-thumb.g-cb
                    carousel(:perPageCustom="[[767, 1],[768, 3]]",:paginationEnabled="true",:navigationEnabled="true",:perPage="3",:minSwipeDistance="3",paginationActiveColor="#7382a0",paginationColor="#c0c6ca")
                        slide(@slideClick="handleSlideClick(index)" v-for="(fund, index) in selected_funds" :key="index").g-col_md_4
                            label.fund-pay-thumb.g-fs_1.g-clr_pr.g-db(:id="'fundInput_'+ index" :class="'fund-pay-thumb_'+fund.webSiteId")
                                input(type="radio" name="funds" v-model="selected_fund" :value="fund" :disabled="fund.paid" style="display: none;").fund-pay-thumb__input
                                .fund-pay-thumb__inner
                                    .fund-pay-thumb__row.fund-pay-thumb__layout-disabled
                                        .fund-pay-thumb__avatar.g-mr_3
                                            svg-inline(:src="`/funds/${fund.webSiteId}.svg`")
                                        .fund-pay-thumb__cell.g-ib
                                            .fund-pay-thumb__name.g-mb_1 Фонд УРАЛСИБ
                                            .fund-pay-thumb__text.g-fw_5(v-html="fund.description.replace('УРАЛСИБ', '')")
                                    .fund-pay-thumb__row
                                        .fund-pay-thumb__icon.g-mr_3.g-ta_c.fund-pay-thumb__layout-disabled
                                            svg-inline(src="/icons/arrow-right.svg" v-show="!fund.paid")
                                            svg-inline(src="/icons/check.svg" v-show="fund.paid")
                                        .fund-pay-thumb__cell.g-ib
                                            .fund-pay-thumb__price.g-clr_err.fund-pay-thumb__layout-disabled(v-if="!fund.paid" v-html="formatCurrency(fund.amount) + ' оплатить'")
                                            .fund-pay-thumb__price.g-clr_hl.fund-pay-thumb__layout-disabled(v-else v-html="formatCurrency(fund.amount) + ' оплачено'")
                                            .fund-pay-thumb__price(v-if="invoiceLink[index]" @click.prevent="pdfMultipleActions('download', index)") Скачать квитанцию на оплату
                //- hr.g-mb_4
                div.g-mb_4
                div(v-if="!isFundSigned(fund)")
                    //- fieldset
                    //-     .g-row
                    //-         .control.g-col.g-col_lg_4.g-col_md_5(v-show="0")
                    //-             .control__label-top
                    //-                 label(for="FPP_name") Наименование фонда
                    //-             .control__field
                    //-                 v-select(placeholder="Выберите фонд" v-validate:fund="'required'" name="fund" :class="{invalid_force: errors.has('fund')}" v-model="fund" key="id" label="description" :options="$store.state.funds.items").field-select
                    //-                     span(slot="no-options")
                    //-         .control.g-col.g-col_lg_4.g-col_md_4.g-col-FPP_NUM.g-maw_n_xs
                    //-             .control__field
                    //-                 .control__label-top
                    //-                     label(for="FPP_NUM") Номер заявки
                    //-                 .select-plus.g-col_xs_12(v-if="ordersByFund.length != 0")
                    //-                     button(@click.prevent="newAccount" type="button" v-if="order").btn.btn_plus.tooltip-wrap
                    //-                         span.g-icon.g-icon_plus
                    //-                         span.tooltip.g-ws_nw Добавить новый номер счёта в реестре
                    //-                     v-select(v-model="order" key="id" label="number" :options="ordersByFund" v-if="ordersByFund.length > 1 || (ordersByFund.length != 0 && !order)" placeholder="Будет присвоен автоматически").field-select#FPP_NUM
                    //-                         span(slot="no-options")
                    //-                     input(type="text" :value="order ? order.number : ''" placeholder="Будет присвоен автоматически" style="opacity: 1;" disabled v-else).field_text#FPP_NUM
                    //-                 input(type="text", name="num", id="FPP_NUM", placeholder="Будет присвоен автоматически" style="opacity: 1;" disabled v-else).field_text
                    //-         .control.g-col.g-col_lg_2.g-col_md_3
                    //-             .control__label-top
                    //-                 label(for="FPP_SUM") Введите сумму
                    //-             .tooltip-wrap(:class="{active: minThousand}")
                    //-                 .tooltip(v-html="`Минимальная сумма 1000 ${rubleSign}`")
                    //-                 input(type="text", v-model="amount" name="sum" v-validate="'required|mink'" :class="{invalid_force: getError('sum')}").g-maw_n_xs.field_text.FPP_SUM.numeric-mask#FPP_SUM
                    //-         .control.control_empty
                    //- fieldset.control(v-show="!order")
                    //-     .control__field
                    //-         .control
                    //-             label.checkbox(:class="{'checkbox_error': errors.has('open_account')}")
                    //-                 input(type="checkbox" v-validate="{required: !order }" v-model="open_account" name="open_account" id="FPP_OPEN_ACCOUNT" )
                    //-                 span.checkbox__text Прошу открыть мне лицевой счёт в реестре на основании сформированных документов
                    .control.g-col_md_8
                        button(type="submit" :class="{btn_secondary: singButtonDisabled, btn_primary: !singButtonDisabled}" @click.prevent="sign" v-html="order ? 'Купить' : 'Подписать'").btn.g-col_md_3
                div(v-else)
                    .control
                        p
                            span(v-if="order.applicationNumber") Вы подписали заявки на приобретение паев и открытие лицевого счёта в реестре.
                    fieldset.control(style="max-width:600px")
                        .g-row.g-mb_2.g-mb_2_xs
                            h3.g-col.g-col_md_5.g-mb_0 Наименование фонда
                            p.g-col.g-col_md_7(v-html="fund.description")
                        .g-row.g-mb_2.g-mb_2_xs
                            h3.g-col.g-col_md_5.g-mb_0 Номер заявки
                            p.g-col.g-col_md_7(v-html="order.number || order.applicationNumber")
                        .g-row.g-mb_2
                            h3.g-col.g-col_md_5.g-mb_0 Сумма
                            p.g-col.g-col_md_7
                                span(v-html="formatCurrency(amount)")
                        .control.control_empty
                        div(v-if="0")
                            .g-mb_2.h3 Реквизиты фонда
                            .g-row
                                h4.g-col.g-col_md_5.g-mb_0 Получатель
                                p.g-col.g-col_md_7  АО «УК УРАЛСИБ»
                            .g-row
                                h4.g-col.g-col_md_5.g-mb_0 ИНН
                                p.g-col.g-col_md_7 7702172846
                            .g-row
                                h4.g-col.g-col_md_5.g-mb_0 БИК
                                p.g-col.g-col_md_7 044525787
                            .g-row
                                h4.g-col.g-col_md_5.g-mb_0 Коррсчет
                                p.g-col.g-col_md_7 30101810100000000787
                            .g-row
                                h4.g-col.g-col_md_5.g-mb_0 Расчётный счёт
                                p.g-col.g-col_md_7 40701810300480000169
                            .control.control_empty
                    fieldset.control
                        p(v-if="isOrderLK") Надбавка к расчетной стоимости пая для заявок, оформленных в Личном кабинете #[strong не взимается]
                        div(v-if="!isOrderLK").g-row.g-mb_2
                            .control.g-col.g-col_lg_8
                                label.checkbox(:class="{'checkbox_error': errors.has('term2')}")
                                    input(type="checkbox", v-model="term2" v-validate="'required'" name="term2")
                                    .checkbox__text Надбавка к расчетной стоимости пая составит 0.5%#[br]При приобретении на сумму 3 млн руб. и более #[strong 0%]
                        //- p Надбавка к расчетной стоимости пая при приобретении в Личном кабинете #[strong не взимается]
                        .g-row.g-mb_2
                            .control.g-col.g-col_lg_8
                                label.checkbox(:class="{'checkbox_error': errors.has('term1')}")
                                    input(type="checkbox", v-model="term1" v-validate="'required'" name="term1")
                                    .checkbox__text Срок проведения операции составляет до 5(пяти) рабочих дней
                        .g-row.g-mb_2
                            .control.g-col.g-col_lg_8
                                label.checkbox(:class="{'checkbox_error': errors.has('correct_data')}")
                                    input(type="checkbox",v-validate="'required'", v-model="checkbox" name="correct_data", id="FPP_CORRECT_DATA" )
                                    span.checkbox__text(v-html="disclaimerTextOperBuy")
                    fieldset.control
                        p Выберите удобный для Вас способ оплаты
                        .g-row.g-row_flex
                            p.g-col.g-col_lg_4.g-col_md_5
                                label.radio.radio_card(@click.prevent="pay(1)")
                                    input(type="radio" name="method" value="1")
                                    span.radio__text
                                        span.radio__bg.radio__bg_us(hidden)
                                            svg-inline(src="/us_logo_small.svg")
                                        span.radio__images(hidden)
                                            span.radio__image.radio__image_card
                                                svg-inline(src="/us_logo_small.svg")
                                        span.radio__text-wrap
                                            span.radio__name БАНК УРАЛСИБ
                                            small.radio__note Оплата картой

                            p.g-col.g-col_lg_4.g-col_md_5
                                label.radio.radio_card(@click.prevent="pay(1.1)")
                                    input(type="radio" name="method" value="1")
                                    span.radio__text
                                        span.radio__bg.radio__bg_card(hidden)
                                            svg-inline(src="/credit-card.svg")
                                        span.radio__images(hidden)
                                            span.radio__image.radio__image_card
                                                svg-inline(src="/credit-card.svg")
                                        span.radio__text-wrap
                                            span.radio__name Карта другого банка
                                            small.radio__note Оплата картой
                            .g-col.g-col_md_12
                            p.g-col.g-col_lg_4.g-col_md_5
                                label.radio.radio_card(@click.prevent="pay(2), popupExitOff(), showInvoiceLink(currSlideIndex)")
                                    input(type="radio" name="method" value="2")
                                    span.radio__text.radio__text_kv
                                        span.radio__bg.radio__bg_kv(hidden)
                                            svg-inline(src="/banks/kv.svg")
                                        span.radio__images(hidden)
                                            span.radio__image.radio__image_kv
                                                svg-inline(src="/banks/kv.svg")
                                        span.radio__text-wrap
                                            span.radio__name Квитанция на оплату
                                            small.radio__note Печать квитанции для оплаты в Банке

                            p.g-col.g-col_lg_4.g-col_md_5
                                label.radio.radio_card(@click.prevent="pay(3)")
                                    input(type="radio" name="method" value="3")
                                    span.radio__text
                                        span.radio__bg.radio__bg_ib(hidden)
                                            svg-inline(src="/us_logo_small.svg")
                                        span.radio__images(hidden)
                                            span.radio__image.radio__image_ib

                                        span.radio__text-wrap
                                            span.radio__name Интернет-банк
                                            small.radio__note Перейти в УРАЛСИБ Интернет-банк
</template>
<script>
    import moment from 'moment';
    import FileSaver from 'file-saver';

    import { buy} from '../../../../mixins';

    import fundThumb from '../../../../components/Fund-thumb.vue';

    export default {
        components: {'fund-thumb': fundThumb,},
        mixins: [buy],
        watch: {
            fundWithOrders(val){
             /*   if (val.length){
                    this.buffering=false;
                } else {
                    this.buffering=true;
                }
                */
            },
            order(val) {
                let text = 'Формирование документов';

                if (val && !this.getSelectedFundsNoOrders.length) text = 'Купить паи';

                this.$emit('setTitle', text);
            },

            selected_fund(val) {
                this.method = null;
                this.checkbox = false;
                this.setFund();
            },
            multiPopupConfirmed(val) {
                if (val) {

                    window.events.$emit('show_popup', ['confirm-operation-multi', {
                        applications: this.multiAplications,
                        operation: 'BuyApps',
                    }]);
                    this.multiAplications=[];
                }
            },
            getSelectedFundsNoOrders(val) {


                if (val) {

                    this.buffering=false;

                    this.$emit('setTitle', 'Формирование документов');
                } else {

                }
            },
        },
        data() {
            return {
                selected_funds: [],
                selected_fund: 0,
                success:false,
                multiAplications: [],
                signed_funds: [],
                fundWithOrders: [],
                currSlideIndex: 0,
                invoiceLink: []
            }
        },
        mounted() {
            
        },
        created() {
            this.setFunds();
            if (this.$route.query.multisuccess) {
                this.success = this.$route.query.multisuccess;
                this.checkPayment();
                this.getIndexSlidePrintArr();
            } else {
                this.getIndexSlidePrintArr();
            }
            window.events.$on('subs_multi_after', () => {
                this.getOrders();
                window.events.$emit('close_popup')
            });

        },
        computed:{
            multiPopupConfirmed() {
                if (this.getSelectedFundsNoOrders.length == 0) return false;
                return this.multiAplications.length == this.getSelectedFundsNoOrders.length
            },
            getSelectedFundsNoOrders() {

                let funds = _.cloneDeep(this.selected_funds);
                let orders = _.cloneDeep(this.orders);
                let result = funds.filter((fund,index) =>{
                    return !orders.some(order => order.portfolio.id == fund.id)});

                this.fundWithOrders = funds.filter(fund => orders.some(order => order.portfolio.id == fund.id));

                if (!result.length) result = false;
                return result;
            },
            fundsEnd() {
                if(this.fundWithOrders.length == 1) {
                    let data = ['фонд', 'которому', 'открыт', 'счет']
                    return data
                } else {
                    let data = ['фонды: ','которым', 'открыты', 'счета']
                    return data
                }
            },
            isOrderLK() {
                return this.order && this.order.number.indexOf('-КК') !== -1;
            }
        },
        methods: {
            getIndexSlidePrintArr() {
                let indexSlidePrintArr = localStorage.getItem('indexSlidePrintArr')
                let sellectedFunds = this.selected_funds
                let cloneIndexSlidePrintArr = []

                if(indexSlidePrintArr) {
                    indexSlidePrintArr = indexSlidePrintArr.split(',');
                    indexSlidePrintArr.forEach(element => {
                        if(element == 'true') {
                            cloneIndexSlidePrintArr.push(true)
                        } else if (element == 'false') {
                            cloneIndexSlidePrintArr.push(false)
                        }
                        
                        
                    });
                    this.invoiceLink = cloneIndexSlidePrintArr
                } else {
                    this.invoiceLink = []
                     for (let [index, item] of sellectedFunds.entries()) {
                        this.invoiceLink.push(false)
                    }
                }
               



            },
            showInvoiceLink(index) {
                if(this.checkbox) {
                   this.invoiceLink[index] = true
                   localStorage.setItem('indexSlidePrintArr', this.invoiceLink)


                    this.getIndexSlidePrintArr()
                }
            },
            popupExitOff() {

            },
            pdfMultipleActions(action, index) {
                let link = document.querySelector('#fundInput_' + index)
               setTimeout(() => {
                    link.click();
                    setTimeout(() => {
                        let orderNumber = this.order.number

                        if (this.$store.state.funds.operations.fund.application.canPrint) this.getApplicationID(action);
                        else this.getInvoice(action, orderNumber);
                    }, 20);
                },20)
            },
            getInvoice(action, orderNumber) {
                let appNumber = this.$store.state.funds.operations.fund.number

                if (action == 'send') {
                    axios.get('/buyapps/mailaddrequest', {
                        params: {
                            appNumber: appNumber
                        }
                    }).then(() => flash(['Квитанция отправлена на почту']));

                    return;
                }

                if (orderNumber) {
                    appNumber = orderNumber
                }

                axios.get('/buyapps/addrequest', {
                    params: {
                        appNumber: appNumber,
                    },
                    responseType: 'arraybuffer'
                }).then(({ data, headers }) => {
                    const file = this.arrayBufferToBlob(data, headers);

                    if (action == 'download' || (action == 'print' && this.isMobile)) {
                        if (file) FileSaver.saveAs(file, 'invoice.pdf');
                        else flash(['Бразуер не поддерживает blob'], 'error');

                        return;
                    }

                    const url = URL.createObjectURL(file);

                    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                        window.open(url);
                        return;
                    }

                    const iframe = document.createElement('iframe');

                    iframe.id = 'invoice';
                    iframe.name = 'invoice';
                    iframe.style.display = 'none';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';

                    iframe.onload = function () {
                        this.contentWindow.focus();
                        this.contentWindow.print();
                    }

                    iframe.src = url;

                    document.body.appendChild(iframe);
                });
            },
            getApplicationID(action) {
                axios.get('/apps/allapps').then(({data}) => {
                    let order = this.$store.state.funds.operations.fund.application;
                    let application = data.find(item => order.orderNum == item.number);

                    return new Promise((resolve, reject) => {
                        if (application) return resolve(application);
                        else reject();
                    });
                }).then((data) => {
                    this.$store.commit('funds/updateOperation', {
                        path: 'fund.applicationID',
                        data: data.applicationId
                    });
                    this.$store.commit('funds/updateOperation', {
                        path: 'fund.number',
                        data: data.number
                    });
                    this.getInvoice(action);
                });
            },
            handleSlideClick(getIndex) {

                if(getIndex !== this.currSlideIndex) {
                    this.currSlideIndex = getIndex
                    this.signed_funds = []
                    this.isFundSigned();
                }
                // if(this.isFundSigned(this.fund)) {
                //     this.sign(false)
                // }
            },
            checkAllPaid(){
                return !this.selected_funds.every(item=>{
                    return item.paid==false
                });
            },
            checkPayment() {
                let i = 1,max=5;
                this.loaded_activepaymentsNoCard=true;
                let request =()=> {
                    axios.get('/payments/activepaymentsNoCard').then(({data}) => {

                        //data = [{status:4}];
                        if( !_.isArray(data) || ( ( _.isArray(data) && !data.length ) || _.isEmpty(data[0]) ) ) {
                            this.authAfterRouter();
                            return;
                        }

                        let operation = data[0];


                        if (operation.status == 2) {

                            if(i<=max) {
                                flash(['Ожидание статуса платежа попытка '+i+' из '+max]);
                                setTimeout(()=>{i++;request()},3000)
                            } else {
                                this.loaded_activepaymentsNoCard=false;
                                if(this.success) window.events.$emit('show_popup', ['not-confirmed', { title: 'Оплата прошла успешно, но из-за технических сложностей квитанция будет сформирована позже.' }]);
                                else {window.events.$emit('show_popup', ['not-confirmed', { title: 'Платеж не был проведен. Попробуйте провести операцию позже.' }])}
                                window.events.$on('popup_closed', this.toAuthAfterRouter);
                                return

                            }

                        } else if (operation.status == 3) {
                            let This = this
                            this.loaded_activepaymentsNoCard=true;


                            if(operation.merchantNumber.toNumber() % 2 == 1) { // Карта урал сиба
                                if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('POPUP_CARD_1')};
                            } else {if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('POPUP_CARD_2');}}

                            window.events.$emit('show_popup', ['request-accepted', {
                                operation: 'buy',
                                data:operation,
                                closable: false,
                                btnNext:This.checkAllPaid()
                            }]);
                        } else if (operation.status == 4) {
                            window.events.$emit('show_popup', ['not-confirmed', { title: 'Оплата завершилась с ошибкой' }]);
                            window.events.$on('popup_closed', this.toOperations);
                        }
                    }).catch((error)=>{

                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx

                        }
                    });
                }

                request();


            },

            setFunds() {
                this.selected_funds = _.cloneDeep(this.$store.state.funds.operations.funds);
                this.selected_fund = _.cloneDeep(this.$store.state.funds.operations.funds.find(item => !item.paid));
            },
            setFund() {
                this.fund = this.selected_fund;
                this.amount = this.selected_fund.amount.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            },
            isFundSigned(fund) {
                if (!fund) return false;
                return this.signed_funds.indexOf(fund.id) >= 0;
            },
            subsMultiAfter() {
                window.events.$emit('close_popup');
            },
            onCodeConfirmed() {
                window.events.$emit('close_popup');
                this.$emit('setTitle', 'Купить паи');
                this.signed_funds.push(this.fund.id);

                if (!this.$store.state.funds.operations.fund.application) {
                    axios.get('/apps/allapps').then(({data}) => {
                        let application = data.find(item => item.applicationId == this.$store.state.funds.operations.fund.applicationID);
                        this.order = {
                            applicationNumber: application.number
                        }
                        
                        this.$store.commit('funds/updateOperation', {
                            path: 'fund.application',
                            data: application
                        });
                    })
                }
            }
        }
    }
</script>

