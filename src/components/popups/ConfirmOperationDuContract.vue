<template lang="pug">
	form.popup__content.popup__content_sz_2(autocomplete="off")
		.popup__title.g-mb_3
			.h2.g-mb_0 Подтверждение
		.popup__text
			.popup__info
				.g-mr_4.g-hide_xs
					svg-inline.popup__info-icon(src="/icons/info.svg")
				.h3.g-lh_15.g-mb_0 Подписание заявления на присоединение #[br.g-hide_xs] к договору {{payload.fundType}} стратегия «{{payload.fund.strategyName}}»
			.g-mb_3
				span(v-if="spinnerShow") Договор будет оформлен в течение нескольких минут и Вы сможете выбрать удобный способ перевода средств.#[br] Пожалуйста, подождите #[mark.error и не закрывайте окно!]
			.g-mb_3(v-if="spinnerShow")
				span Сформированное заявление будет отражено в разделе Портфель - Документы клиента
			.spinner-container(:class="{'sp-show': spinnerShow}")
				.h4.g-lh_15
					| Для подтверждения операции на Ваш телефон #[span(v-html="phone")] #[br] был отправлен SMS-код:
				.g-row
					.g-col.g-col_md_6
						.control
							.control__field.g-mb_1
								input(type="text" v-model="sms_code").field_text.field_text_mtrl#CODE
								label(for="CODE").control__label Введите код
							.g-fs_05.g-clr_gray(v-show="countDownSeconds.status")
								AppTimer(
									ref="appTimer",
									@onProgressEnd="handleCountdownProgress"
								)
							button.g-btn-txt.g-fs_05.g-clr_gray.g-clr_pr_h.g-fw_6(type="button" @click.prevent="requestCode") Запросить код повторно
					.g-col.g-col_md_6.g-mt_3_xs
						input(type="submit" :disabled="!sms_code" value="Отправить" @click.prevent="submitCode").btn.btn_block.btn_primary.g-mb_2

</template>

<script>


	import {countDownMixin} from '../../mixins';
	export default {
		mixins: [countDownMixin],
		props: ['payload'],
		watch: {
			payload(val) {
				this.sms_code = '';
				this.app_id = val.app_id;
				this.operation = val.operation;
				this.requestCode();
			}
		},
		data() {
			return {
				app_id: this.payload.app_id,
				sms_code: '',
				operation: this.payload.operation,
				disabled: false,
				requesting: false,
				loading: false,
				spinnerShow: false
			}
		},
		created() {
			this.requestCode();
		},
		mounted() {
			this.$onBlur();
		},
		methods: {
			submitCode() {
				let qParams = this.$route.params;
				this.$emit('onLoading', true);
				this.spinnerShow = true;
				axios.post(`/amcontracts/${this.app_id}/otp/${this.sms_code}`).then(({data: amcontracts}) => {
					axios.post(`/amcontracts/state?pifid=${this.app_id}&stat=2`).then(({data: contractStatus}) => { // устанавливаем статус 2
						this.$store.dispatch('iisDU/iisDuGetList').then(({getDUAllContracts}) => {
							if (!getDUAllContracts || getDUAllContracts.length == 0) {
								this.spinnerShow = false
								this.$emit('onLoading', false);
								window.events.$emit('close_popup');
								flash(['Неизвестная ошибка - addDUContract = null'], 'error');
								return;
							}
							this.spinnerShow = false
							this.$emit('onLoading', false);

							if (this.payload.strategyBuy) {
								this.$root.$emit('iisDuSendContract', {data: amcontracts, method: this.payload.payMethod });
							} else {
								this.$router.push(`/strategies/${qParams.selectedStrategy}/${qParams.strategyPrefix}/buy`)
							}
							window.events.$emit('close_popup');
						});
					});
				}).catch(({response: { data : error}}) => {
					this.spinnerShow = false;
					this.$emit('onLoading', false);
					if (error && error.message) flash([error.message], 'error');
					window.events.$emit('close_popup');
				});
			},
			requestCode() {
				if (this.requesting) return;
				this.requesting = true;
				axios.get(`/amcontracts/${this.app_id}/otp/`).then(({data}) => {
					this.handleRequestSMScode(data);
				}).catch((response) => {
					if (!response && !response.data) {
						flash(['Неизвестная ошибка'], 'error');
						return;
					}
					if (response.data && response.data.message) flash([response.data.message], 'error');
				})
			},

		},
		computed: {
			phone() {
				if (!this.$store.state.user.info.phone) return;

				let m = this.$store.state.user.info.phone.match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

				if (m.length != 6) return '';

				return `+${m[1]} (${m[2]}) ${m[3]} ${m[4]} ${m[5]}`;
			},
			applicationFileSize() {
				if (this.file) return Math.round(this.file.size / 1024);
				return 0;
			}
		}
	}
</script>

