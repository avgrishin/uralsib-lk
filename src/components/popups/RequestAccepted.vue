<template lang="pug">
	form.popup__content.popup__content_sz_2
		.popup__title.g-mb_3
			.h2.g-mb_0(v-html="header")
		.g-mb_4
			.h4.g-mb_1(v-html="description")

			.h4.g-mb_0(v-if="!payload.btnNext && payload.type !== 'du'")
				| Узнать статус операции Вы можете в разделе &nbsp;
				router-link(to="/history") «История операций».
		.g-mb_4(v-if="payload.operation == 'buy'")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 ФИО пользователя
				.g-col.g-col_md_5(v-text="$store.state.user && $store.state.user.state && $store.state.user.state.fullName")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Кабинет клиента
				.g-col.g-col_md_5 АО «УК УРАЛСИБ»
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Идентификатор заказа
				.g-col.g-col_md_5(v-text="payload.data.requestID")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Дата операции
				.g-col.g-col_md_5(v-text="formatDate(payload.data.evtDate)")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Сумма заказа
				.g-col.g-col_md_5(v-text="formatCurrency(payload.data.totalSumm)")
			//- .g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Размер комиссии, взимаемой с держателя #[br] при оплате заказа
				.g-col.g-col_md_5(v-text="formatCurrency(payload.data.commission)")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Имя держателя
				.g-col.g-col_md_5(v-text="payload.data.cardHolderName")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Код авторизации
				.g-col.g-col_md_5(v-text="payload.data.approvalCode")
			.g-row.g-mb_2
				.g-col.g-col_md_7.h3.g-mb_0 Услуга, оплаченная при помощи реквизитов карты
				.g-col.g-col_md_5(v-text="getOrderReason")
			.g-row.g-mb_2
				.g-col.g-col_md_12
					span.icon.icon_print.sz_2.print-hide(@click="print")
						span.icon_print-label Распечатать
		.g-row(v-if="payload.btnNext").print-hide
			.g-col.g-col_md_5
				a(href="#" @click.prevent="goBack").btn.btn_primary.btn_block Продолжить
		.g-row(v-else).print-hide
			.g-col.g-col_md_7.g-mb_2_xs
				router-link(to="/").btn.btn_primary.btn_block Перейти в портфель
			.g-col.g-col_md_5(v-if="payload.type !== 'du'")
				a(href="#" @click.prevent="goBack").btn.btn_o.btn_block Вернуться
</template>

<script>
	export default {
		props: ['payload'],
		data() {
			return {}
		},
		watch: {
			'$route'(to, from) {
				if (!this.payload.btnNext) {
					this.$store.state.funds.operations = {};
					localStorage.removeItem('fund');
				}


				window.events.$emit('close_popup');
				window.log('RequestAccepted watch')
			}
		},
		created() {
			window.log(this.payload);
			if (!this.payload.btnNext) this.$store.commit('popupConfirmOff', true);
			this.$store.dispatch('user/getProfile');

		},
		methods: {

			operationBay() {

			},
			logout() {
				axios.post('/Account/Logout')
					.then(() => {
						this.$store.dispatch('user/logout')
							.then(() => {
								this.$router.push('/');
								document.querySelector('.site').classList.remove('site_overlay');
								window.events.$emit('close_popup');
							});

					});
			},
			goBack() {
				if (this.payload.operation == 'buy') return this.$router.push('/operations/buy');

				window.events.$emit('going_back');
				window.events.$emit('close_popup');
			},
			print() {

				// let w = window.open();
				// w.document.write('<html>' + document.querySelector('head').innerHTML, '<body class="body g-hidden"><div class="popup popup_print popup_show">' + document.querySelector('.popup_show').innerHTML + '</div></body></html>')

				// setTimeout(() => {
				//     w.focus();
				//     w.print();
				//     w.close();
				// }, 500);
				setTimeout(() => window.print(), 500)

			}
		},

		computed: {
			getOrderReason() {
				let text = (this.payload.data.orderReason) ? this.payload.data.orderReason.split(' Плательщик')[0] : '';
				if (this.payload.type == 'du' || this.payload.type == 'iis') {
					text = text + ` Плательщик ${this.$store.state.user.state.fullName}. НДС не облагается`;
				}
				return text;
			},
			header() {
				// if (this.payload.operation == 'buy') return 'Оплата прошла успешно';
				if (this.payload.operation == 'buy') return 'Ваша заявка на приобретение принята';
				else if (this.payload.operation == 'exchange') return 'Ваша заявка на обмен принята';

				return 'Ваша заявка на погашение принята';
			},
			description() {
				if (this.payload.operation == 'buy') return 'Срок проведения операции составляет до 5-ти рабочих дней.';
				else if (this.payload.operation == 'exchange') return 'Срок проведения операции составляет до 5-ти рабочих дней.';

				return 'Срок проведения операции составляет до 13-ти рабочих дней. '
			}
		}
	}
</script>

