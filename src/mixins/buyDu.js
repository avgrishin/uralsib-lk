// buy
import FileSaver from 'file-saver';

export default {
    watch: {


        ordersByFund(val) {
            if (val.length) window.log('TCL: ordersByFund -> val', val[0])

            // Check if any applications have been created, if there have been, select the first one
            // if (val.length) this.order = val[0];
            // else this.order = false;
        },
        getSelectVal(val){
            this.$store.commit('popupConfirmOff',!val);
        }
    },
    data() {
        return {
            // Switch between screens
            fundList:[],
            signed: false,
            selected_funds:[],
            disclaimerTextOperBuy: '',
            application: '',
            // Current selected fun
            fund: null,
            // All applications
            orders: [],
            // Current selected application
            order: '',
            // Ammoun
            amount: '',
            // If new application is created
            open_account: false,
            // Terms and conditions
            checkbox: false,

            pdf: null
        }
    },
    created() {
        window.events.$on('code_confirmed', this.onCodeConfirmed);
        window.events.$on('reset_payment', this.onResetPayment);
        this.$store.commit('popupConfirmOff', true);
        this.getSelectFunds();
        this.getOrders();
        this.getActivePaymnets();
        this.checkCancelledPayment();
    },
    mounted() {
        this.applyNumericMask();
    },
    beforeDestroy() {
        window.events.$off('code_confirmed', this.onCodeConfirmed);
        window.events.$off('reset_payment', this.onResetPayment);
    },
    methods: {
        newAccount() {
            this.order = '';
        },
        getOrders() {
            // Get all applications with status codes 0, 1, 3, 4, 6 or 7
            axios.get('/apps/select').then(({ data }) => {
                this.orders = data.filter(item => [0, 1, 3, 4, 6, 7].indexOf(item.status) >= 0 && item.type == 'buy');

            });
        },
        getError(field) {
            return this.errors.items.find(item => item.field == field);
        },
        sign() {
            if(typeof yaCounter50062190 !== "undefined") yaCounter50062190.reachGoal('BTN_BUY_OPERATIONS_STEP_1'); //яндекс цель купить
            this.$validator.validateAll().then(result => {
                if (result) this.buy();
            });
        },
        getTextDisclaimer() {
            /*
            axios.get('/reference/getsitetext', {
                params: {
                    place: 'OperBuy',
                    portfolioId: this.fund.id
                }
            }).then(({data}) => {
                window.log(data.outText);
                this.disclaimerTextOperBuy = data.outText;

            });
            */
        },
        buy() {
            // Check if user has filled in the form

            if (!this.$store.state.user.info) return this.$emit('buyerror');

            let fund = _.cloneDeep(this.fund);
            // let amount = { amount: this.amount.replace(/\D/g,'') }
            /*
            fund.account = this.account;
            fund.amount = this.amount.toNumber();
            fund.application = this.order;
            */

            this.getTextDisclaimer();



            // Save the operation details for future screens
            // this.$store.commit('funds/updateOperation', {
            //     path: 'fund',
            //     data: fund
            // });


            if (_.isArray(this.getSelectedFundsNoOrders) && this.getSelectedFundsNoOrders.length) {//множественное подписание заявок
                window.log(this.getSelectedFundsNoOrders);
                this.getSelectedFundsNoOrders.forEach((fund)=>{
                    window.log(fund);

                    this.makePurchaseRequest(fund.id).then(({ data }) => {
                        window.log(data);
                        this.$store.commit('funds/updateOperation', {
                            path: 'fund.applicationID',
                            data: data.applicationId
                        });
                        this.multiAplications.push({
                            app_id:data.applicationId,
                            app_number:data.number,
                            fund:fund.description,
                            id:fund.id,
                            fileSize:0,
                            loading:true
                        })
                    });
                });
                return
            }

            // If application has been chosen, proceed without sms confirmation

            if (this.order) {

                this.$store.commit('funds/updateOperation', {
                    path: 'fund.applicationID',
                    data: this.order.applicationId
                });
                this.$store.commit('funds/updateOperation', {
                    path: 'fund.number',
                    data: this.order.pifNumber
                });
                return this.onCodeConfirmed();
            }

            window.log('Send application creation request');

            // Send application creation request

            this.makePurchaseRequest().then(({ data }) => {
                this.$store.commit('funds/updateOperation', {
                    path: 'fund.applicationID',
                    data: data.applicationId
                });
                this.$store.commit('funds/updateOperation', {
                    path: 'fund.number',
                    data: data.number
                });
                window.events.$emit('show_popup', ['confirm-operation', {
                    app_id: data.applicationId,
                    app_number: data.number,
                    operation: 'BuyApps',
                    fund: this.fund.description
                }]);
            });
        },
        makePurchaseRequest(multiFundId) {
            let data = {
                clientId: this.$store.state.user.info ? this.$store.state.user.info.client.id : 0,
                portfolioId: multiFundId ? multiFundId : this.fund.id,
                bankingDetail: this.$store.state.user.info.bankingDetails || this.$store.state.user.bankingDetails,
                accountId: 0,
                openAccountModel: {
                    'allowNotify': true,
                    'sendDocsByPost': true,
                    'agreeProcessPersonalData': true,
                    'notificationMethodId': 7
                }
            };
            return axios.post('/BuyApps', data);
        },
        getActivePaymnets() {
            // Check if any payments have been started, delete payments with statuses 1 and 4
            axios.get('/payments/activepaymentsNoCard').then(({data}) => {

                if (!data || !data.length) return;

                data.forEach(payment => {

                    if (payment.status == 1 || payment.status == 4) axios.post(`/payments/${payment.id}/delpay`).catch(() => {});

                    else if (payment.status == 2) window.location = payment.orderHref;
                });
            });
        },
        pay(method) {
            // Validate the form, if valid, proceed
            this.$validator.validateAll().then(result => {
                if (result) {
                    if (this.order) {
                        this.$store.commit('buffering', true);
                        this.addPayRequest(method);
                    } else {
                        axios.post(`AmContracts/${this.strategySelect.id}`).then(({data}) => {
                            const {contractId} = data;
                            if (!contractId) {
                                flash([`Неизвестная ошибка`], 'error');
                                return;
                            };

                            window.events.$emit('show_popup', ['confirm-operation-du-contract', {
                                app_id: contractId,
                                operation: 'BuyApps',
                                fund: this.strategySelect,
                                fundType: this.strategySelect.sType == 'IIS' ? 'ИИС' : 'ДУ',
                                strategyBuy: true,
                                payMethod: method
                            }]);
                        }).catch(({response: { data : error } }) => {
                            this.$store.commit('buffering', false);
                            const {message} = error;
                            flash([message ? message : 'Неизвестная ошибка'], 'error');
                        });

                    }
                }
            });
        },
        createPayRequest() {
            let amount = this.amount.toNumber();

            // Create payment
            if (amount <= 0) {
                this.$store.commit('buffering', false);
                return
            };

            return new Promise((resolve, reject) => {
                axios.post(`/AmAssets?cid=${this.order.id}&acttype=1&summ=${amount}`).then(({data}) => {
                    resolve(data);
                }).catch((e) => reject(e));
            });
       },
        addPayRequest(method) {
            // If a user has selected online payment methods
            if (method == 1 || method == 1.1) {

                if(method == 1) {if(typeof yaCounter50062190 !== "undefined") yaCounter50062190.reachGoal('BTN_CARD_1');}
                if(method == 2) {if(typeof yaCounter50062190 !== "undefined") yaCounter50062190.reachGoal('BTN_CARD_2');}


                // Remove non numeric characters from string
                let amount = this.amount.toNumber();

                // Create payment
                if (amount <= 0) {
                    this.$store.commit('buffering', false);
                    return
                };
                return this.createPayRequest().then((data) => {
                    if (!data) {
                        this.$store.commit('buffering', false);
                        return;
                    }
                    return axios.post(`/payments/${this.order.iD_INSTR}/${amount}/addpayment`, {
                        contractNumber: this.order.number,
                    }).then(({ data: addPayment }) => {

                        if (!addPayment) {
                            this.$store.commit('buffering', false);
                            return;
                        }
                        // Save payment id for future screensz
                        this.$store.commit('funds/updateOperation', {
                            path: 'fund.payment_id',
                            data: data
                        });
                        this.$store.commit('funds/updateOperation', {
                            path: 'fund.application',
                            data: this.storeSrategyById().contract.find(item =>  {
                                if (typeof this.order == 'object') {
                                    return item.pifNumber == this.order.pifNumber
                                } else {
                                    return item.pifNumber == this.order
                                }
                            })
                        });

                        // Save card type for future
                        localStorage.setItem('cardType', method == 1 ? 'uralsib' : 'other');
                        this.$router.push(`/strategies/operations/buy/approve?card=${method == 1 ? 'uralsib' : 'other'}&stype=${this.storeSrategyById().sType}`);
                        this.$store.commit('buffering', false);
                    })
                }).catch(({response})=>{
                    this.$store.commit('buffering', false);
                    if (response.data.message) {
                        flash([response.data.message], 'error');
                    } else {
                        flash(['Неизвестная ошибка'], 'error');
                    }
                });
            } else if (method == 2) {
                this.$store.commit('buffering', true);
                const iisDuContract = this.storeSrategyById().contract.find(contract => {
                    return typeof this.order == 'object' ? contract.pifNumber == this.order.pifNumber : contract.pifNumber == this.order;
                });


	            // this.storeSrategyById(this.operationDetails.fund.params.webSiteID)

                this.createPayRequest().then((data) => {
                    this.setFund().then(() => {
                        this.$store.commit('buffering', false);
                        if(this.checkAllPaid) {
                            window.events.$emit('show_popup', ['invoice', {
                                multiple: this.selected_funds !== undefined,
                                btnNext: this.checkAllPaid(),
                                type: 'du',
                                iisDuContract: iisDuContract,
                                application: this.application,
                                assetId: data.assetId,
                            }]);
                        } else {
                            window.events.$emit('show_popup', ['invoice', {
                                multiple: this.selected_funds !== undefined,
                                type: 'du',
                                iisDuContract: iisDuContract,
                                application: this.application,
                                assetId: data.assetId,
                            }]);
                        }
                    });
                }).catch(() => {
                    this.$store.commit('buffering', false);
                    flash([`Неизвестная ошибка`], 'error');
                });
            } else if (method == 3) {
                this.$store.commit('buffering', false);
                if(typeof yaCounter50062190 !== "undefined") yaCounter50062190.reachGoal('BTN_CARD_3');
                let ibank = window.open('https://i.uralsib.ru/');
                // Check if the window has been opened, if it hasn't alert
                if (!ibank) {
                    window.events.$emit('show_popup', ['not-confirmed', { text: 'В случае, если страница Интернет-банка ПАО "БАНК УРАЛСИБ" не открывается, Вам необходимо в браузере разрешить всплывающие окна. Либо пройдите по этой ссылке <a href="https://i.uralsib.ru" target="_blank">https://i.uralsib.ru/</a>' }])
                }
            }
        },
        onResetPayment() {
            if (this.selected_funds === undefined) {
                this.fund = null;
                this.amount = '';
                this.order = false;

                this.$store.commit('funds/clearOperations');

                this.signed = false;
                this.$emit('setTile', 'Формирование документов');
            }

            window.events.$emit('close_popup');
        },
        checkCancelledPayment() {
            if (this.$route.query.nopay) {

                axios.post('/payments/nopayback')
                    .then((response)=> {
                        localStorage.removeItem('fundData');
                    })
                    .catch((error)=>{window.log(error);})
            }
        },
        getSelectFunds(){
            axios.get('/buyapps/select')
                .then(({data})=> {
                    data.filter((item)=>{
                        //window.log(item);
                    })


                    return this.fundList=data;
                })

        },
    },
    computed: {

        getSelectVal(){

            return (this.fund || this.fund_from)
        },
        singButtonDisabled() {
            return !Boolean(
                this.fund &&
                this.amount &&
                (this.open_account || this.order) &&
                !this.minThousand
            );
        },
        buttonDisabled() {
            return !Boolean(
                this.fund &&
                this.amount &&
                this.checkbox &&
                !this.minThousand
            );
        },
        minThousand() {
            if (!this.amount) return false;

            return this.amount.toNumber() < 1000;
        },
        ordersByFund() {
            // All applications that have been created for the selected fund
            if (!this.fund || !this.orders.length) return [];

            let orders = _.cloneDeep(this.orders);

            return orders.filter(item => item.portfolio.id == this.fund.id);
        },
        strategySelect() {
            if (this.$store.state.funds.operations.fund) {
                return this.$store.state.funds.operations.fund.params;
            } else {
                return '';
            }
        },
    }
};
