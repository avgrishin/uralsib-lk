<template lang="pug">
	casenav
		article.content
			h1 Оплата банковской картой
			form
				.payment-data
					.g-mb_4
						//- .g-row.g-mb_4
							h3.g-col.g-col_lg_3.g-col_md_4 Карта:
							.g-col.g-col_lg_3.g-col_md_4.payment-data__value
								.dropdown.g-col_xs_12.dropdown_cards.g-mb_2_xs
									a(href="#" @click.prevent="() => {}").dropdown__name.g-icon-down-focus
										span.dropdown__arrow
											span.g-icon-down
										.payment-data__numb(v-html="isSelectedCard ? '*' + selected_card.cardNumber.substr(-4) : 'Выберите карту'")
										.payment-data__icon(v-if="isSelectedCard")
											img(:src="selected_card.bankLogo" v-if="selected_card.bankLogo")
									ul.dropdown__content
										li.dropdown__item(v-for="(card, index) in cards" :key="card.id")
											a(href="#" @click.prevent="selectCard(card)")
												.payment-data__numb(v-html="'*' + card.cardNumber.substr(-4)")
												.payment-data__icon
													img(:src="card.bankLogo" v-if="card.bankLogo")
												button(title="Удалить" @click="deleteCard(card, index)").icon.icon_trash.g-icon-close.g-icon-close_center
							.g-col.g-col_md_4
								a.btn.btn_o.g-col_xs_12.g-col_md_a(@click.prevent="addNewCard()")
									span.g-icon.g-icon_plus.g-mr_1.g-va_m
									| Добавить
									span.g-hide_md &nbsp;новую
									| &nbsp;карту
						.g-row.g-mb_4
							h3.g-col.g-col_lg_3.g-col_md_4 Назначение платежа:
							.g-col.g-col_lg_5.g-col_md_8.payment-data__value
								p(v-if="this.$route.query.stype !== 'DU'", v-html="`Оплата по Договору доверительного управления на ведение ИИС № ${operationText}`")
								p(v-else, v-html="`Оплата стратегии «${$store.state.funds.operations.fund && $store.state.funds.operations.fund.params.strategyName}» <br class='g-hide_md' /> по договору ${this.$route.query.stype == 'DU'? 'ДУ': 'ИИС'} № ${operationText}`")
								p Плательщик #[span(v-html="$store.state.user.state.fullName")]. #[br] НДС не облагается
						.g-row.g-mb_4
							h3.g-col.g-col_lg_3.g-col_md_4.g-col_xs_6.g-mb_0 Сумма:
							.g-col.g-col_md_5.g-col_xs_6.payment-data__value.g-ta_r_xs(v-html="formatCurrency(payment ? payment.summ || 0 : operationDetails.fund.amount)")
						//- .g-row.g-mb_4
							h3.g-col.g-col_lg_3.g-col_md_4.g-col_xs_6.g-mb_0  Комиссия:
							.g-col.g-col_md_5.g-col_xs_6.payment-data__value.g-ta_r_xs(v-html="commission")
						//- .g-row.g-mb_4
							h3.g-col.g-col_lg_3.g-col_md_4.g-col_xs_6.g-mb_0  Сумма к оплате:
							.g-col.g-col_md_5.g-col_xs_6.payment-data__value.g-ta_r_xs.payment-data__value_price(v-html="finalSum")
					.control.g-row
						label.checkbox.g-col.g-col_lg_9(:class="{'checkbox_error': errors.has('terms')}")
							input(type="checkbox" v-validate="'required'" data-vv-as="условия" name="terms", v-model="terms" id="FPD_TERMS")
							span.checkbox__text(v-html="disclaimerTextBuyApprove")
					.control
					
					.control
						input(type="submit", @click.prevent="finish" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" value="Оплатить" :disabled="buffering").btn.g-col_lg_2.g-col_md_3.g-col_xs_12
</template>

<script>
	import { authAfterRouter, iisDU} from '../../../mixins';
	import Inputmask from "inputmask";
	import CardInfo from 'card-info';
	import moment from 'moment';
	import { confirmPersonalData } from '../../../guards';
	import CaseNav from '../../case/CaseNav.vue';

	export default {
		beforeRouteEnter:confirmPersonalData,
		mixins: [authAfterRouter, iisDU],
		watch: {
			selected_card(val) {
				if (val) this.recalulatePayment();
			},
			loaded(val){
				if(val){
					this.$store.commit('mainClass', 'spinner')
				} else this.$store.commit('mainClass', '');
			}
		},
		data() {
			return {
				disclaimerTextBuyApprove: '',
				cards: [],
				selected_card: {},
				terms: false,
				success:false,
				payment: {},
				request_id: 0,
				loaded_activepaymentsNoCard:false,
			}
		},
		components: {
			'casenav': CaseNav
		},
		created() {
			let sType = this.$route.query.stype;
			this.getTextDisclaimer();
			// CardInfo.setDefaultOptions({
			//     banksLogosPath: '/dist/img/banks/logos/',
			//     brandsLogosPath: '/dist/img/banks/brand-logos/'
			// });
			let fund = this.$store.state.funds.operations.fund;
			if (this.$route.query.success) {
				this.success = this.$route.query.success;
				this.payment = fund.order;
				this.checkPayment();
			} else this.addPaymentRequest();

			if (!fund.application) this.getApplicationDetail();


			// this.getCards();
			
			if (sType === 'DU' || sType === 'IIS') {
				const type = {
					IIS: {
						val: 'iis',
						text: 'ИИС'
					},
					DU: {
						val: 'du',
						text: 'ДУ'
					}
				};
				const fund = this.$store.state.funds.operations.fund.params;
				this.$store.commit('updateCrumbs', [
					{
						link: `/strategies/${type[sType].val}`,
						text: 'ИИС и Доверительное управление'
					},
					{
						link: `/strategies/${type[sType].val}`,
						text: `Стратегии ${type[sType].text}`
					},
					{
						link: `/strategies/${type[sType].val}/${fund.webSiteID}`,
						text: fund.strategyName.replace('ИИС ', 'Стратегия ')
					},
					{
						link: `/strategies/${type[sType].val}/${fund.webSiteID}/buy`,
						text: `Перевод денежных средств`
					}
				]);
			} else {
				this.$store.commit('updateCrumbs', [
					{ link: '/', text: 'Портфель'},
					{ link: '/operations', text: 'Купить паи' }
				]);
			}

	

			window.events.$on('card_added', this.getCards);
		},
		beforeDestroy() {
			window.events.$off('card_added', this.getCards);
			window.events.$off('close_popup', this.toOperations);
		},
		beforeRouteLeave(to, from, next) {
			if (this.$route.query.success) return next();
			
			this.$store.dispatch('confirm')
				.then(answer => {
					if (answer) {
						next();
						this.$store.commit('funds/clearOperations');
						axios.post('/payments/undorequest');
					} else window.events.$emit('close_popup');
				});
		},
		methods: {
			getTextDisclaimer() {
				axios.get('/reference/getsitetext', {
					params: {
						place: 'BuyApprove',
					}
				}).then(({data}) => {

					this.disclaimerTextBuyApprove = data.outText;

				});
			},
			finish() {
				this.$validator.validateAll().then(result => {
					if (result) {
						// if (!this.operationText) {
						//     flash(['Неизвестная ошибка'], 'error');
						//     return;
						// };
						localStorage.setItem('leavingTimeSec', (60 * 21));
						const domain = window.location.origin;
	
						let i = 1,max=3;
						let request =()=> {

							if(i<=max) {
								this.buffering=true;

								this.$store.commit('flashErrorOn', false);}
							else  {
								this.$store.commit('flashErrorOn', true);
								this.buffering=false;

							}

							if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_PAY')};

							axios.get(`/payments/sendpaym`, {
								params: {
									id: this.payment.id,
									returnurl: `${domain}/scripts/paymentDu.php?success=1&strategies=1`,
									failurl: `${domain}/scripts/paymentDu.php?success=0&strategies=1`
								}
							})
							// axios.post(`/payments/${this.payment.id}/sendpay`)
							.then(({data}) => {
								window.location = data})
							.catch((error)=>{
								if(error) {
									if(i<=max) {
										setTimeout(()=>{i++;request()},2000);
									}
								}
								if (error.response) {
									// The request was made and the server responded with a status code
									// that falls out of the range of 2xx
								}
							});
						}
						request();
					}
				});
			},
			addNewCard() {
				window.events.$emit("show_popup", "add-new-card");
			},
			getCards(cardNumber = '') {
				axios.get('/payments/cards').then(({data}) => {
					this.cards = data.map(item => {
						const info = new CardInfo(item.cardNumber);
						item.bankLogo = info.bankLogo ? info.bankLogo.replace('png', 'svg') : null;
						item.bankName = info.bankName;

						return item;
					}).filter((item) => {
						let card_type = this.$route.query.card;

						if (card_type == 'other') return item.cardType == 2;
						else return item.cardType == 1;
					});

					if (cardNumber) {
						let card = data.find(item => item.cardNumber == cardNumber.replace(/ /g, ''));

						if (card) {
							this.selected_card = card;
							this.cards = this.array_move(data, data.length - 1, 0);
						}
					}
				}).catch();
			},
			selectCard(card) {
				this.selected_card = card;
			},
			addPaymentRequest() {

				axios.post('/payments/addpayrequest')
					.then(({data}) => {
						this.request_id = data;
						return axios.get('/payments/activepaymentsNoCard');
					}).then(({data}) => {
						this.payment = data.find(item => item.requestID == this.request_id);
						// if (this.selected_card.id) this.recalulatePayment();
						this.recalulatePaymentNoCard();
					})
			},
			recalulatePayment() {
				if (!this.payment.id) return;

				let fund = this.$store.state.funds.operations.fund;
				let sType = this.$route.query.stype
				axios.get('/payments/recalcCardType', {
					params: {
						id: this.payment.id,
						typeC: this.selected_card.cardType,
						accountnum: this.operationText,
						isDu: true
					}
				})
				.then(({data}) => axios.get('/payments/activepaymentsNoCard'))
				.then(({data}) => {
					let payment = data.find(item => item.requestID == this.request_id);
					
					this.payment = payment;

					this.$store.commit('funds/updateOperation', {
						path: 'fund.order',
						data: payment
					});

					localStorage.setItem('fundData', JSON.stringify(this.$store.state.funds.operations));
				});
			},
			recalulatePaymentNoCard() {
				if (!this.payment.id) return;

				let fund = this.$store.state.funds.operations.fund;
				let cardType = localStorage.getItem('cardType') || 'uralsib';
				let sType = this.$route.query.stype


				if (sType == 'DU' || 'IIS') {
					axios.get('/payments/recalcCardType', {
						params: {
							id: this.payment.id,
							typeC: (this.$route.query.card == 'other' || cardType == 'other') ? 2 : 1,
							accountnum: this.operationText,
							isDu: true
						}
					})
					.then(({data}) => axios.get('/payments/activepaymentsNoCard'))
					.then(({data}) => {
						let payment = data.find(item => item.requestID == this.request_id);

						this.payment = payment;

						this.$store.commit('funds/updateOperation', {
							path: 'fund.order',
							data: payment
						});

						localStorage.setItem('fundData', JSON.stringify(this.$store.state.funds.operations));
					});
				}

			},
			deleteCard(card, index) {
				this.$store.dispatch('confirm', {
					heading: 'Вы действительно хотите удалить карту?',
					text: ''
				})
				.then(answer => {
					window.events.$emit('close_popup');

					if (answer) return axios.post(`/payments/${card.id}/delcard`);
				}).then(({data}) => {
					if (this.selected_card == card) this.selected_card = {};
					this.cards.splice(index, 1);
				});
			},
			getApplicationDetail() {
				axios.get('/apps/allapps').then(({data}) => {
					let application = data.find(item => item.applicationId == this.operationDetails.fund.applicationID);

					this.$store.commit('funds/updateOperation', {
						path: 'fund.application',
						data: {
							number: application.number,
							created: moment().toISOString()
						}
					});;
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

							this.loaded_activepaymentsNoCard=true;


							if(operation.merchantNumber.toNumber() % 2 == 1) { // Карта урал сиба
								if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('POPUP_CARD_1')};
							} else {if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('POPUP_CARD_2');}}

							window.events.$emit('show_popup', ['request-accepted', {
								operation: 'buy',
								data:operation,
								closable: false,
								type: 'du'
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
			toAuthAfterRouter(){
			  this.authAfterRouter()
				//this.$router.push('/funds/');
			},
			toOperations() {
				this.$router.push('/operations/buy');
			}
		},
		computed: {
			loaded(){
				return this.loaded_activepaymentsNoCard
			},
			today() {
				return moment().subtract(2, 'days').format('DD.MM.YYYY')
			},
			commission() {
				return this.formatCurrency(this.payment ? this.payment.commission || 0 : 0)
		  /*      let cardType = localStorage.getItem('cardType') || 'uralsib';

				if (this.$route.query.card == 'uralsib' || cardType == 'uralsib') {
					return this.formatCurrency(this.payment ? this.payment.commission || 0 : 0)
				} else if (this.$route.query.card == 'other' || cardType == 'other') {
					return 'В соответствии с тарифами банка';
				}

				return '';*/
			},
			finalSum() {
				return this.formatCurrency(this.payment.totalSumm ? this.payment.totalSumm || 0 : 0);
		  /*      let cardType = localStorage.getItem('cardType') || 'uralsib';

				if (this.$route.query.card == 'uralsib' || cardType == 'uralsib') {
					return this.formatCurrency(this.payment.totalSumm ? this.payment.totalSumm || 0 : 0);
				} else if (this.$route.query.card == 'other' || cardType == 'other') {
					return this.formatCurrency(this.payment.summ ? this.payment.summ || 0 : 0);
				}

				return '';*/
			},
			operationDetails() {
				let data = {};

				if (this.$store.state.funds.operations.fund) data.fund = this.$store.state.funds.operations.fund;

				return data;
			},
			isSelectedCard() {
				return Object.values(this.selected_card).length;
			},
			getOperationDate() {
				const { contractAll } = this.storeSrategyById(this.operationDetails.fund.params.webSiteID);
				if (!contractAll) return '';
				const contract = contractAll.find(contract => contract.number == this.operationDetails.fund.number);
				return contract.beginDate;
			},
			operationText() {
				if (!this.operationDetails || !this.operationDetails.fund) return '';
				if (!this.operationDetails.fund.application) return '';
				
				let date;
				let number = this.operationDetails.fund.number;

				if (this.getOperationDate) {
					date = moment(this.getOperationDate, [moment.ISO_8601, 'DD.MM.YYYY']).format('DD.MM.YYYY');
				} else {
					date = moment().format('DD.MM.YYYY');
				}

				return `${number} от ${date}`;
			},
			buttonDisabled() {
				return !Boolean(this.terms)
			}
		}
	}
</script>

