<template lang="pug">
    form.popup__content.popup__content_sz_2(autocomplete="off")
        .popup__title.g-mb_3
            .h2.g-mb_0 Квитанция сформирована
        .popup__text

            fieldset.control.g-mb_3
                span.g-ib
                    button.btn.btn_preview.btn_o.g-mr_1(title="Скачать в pdf" :class="{spinner: !docsLoaded[0]}" @click.prevent="pdfActions('download',$event, 0)")
                        span.icon.icon_file_pdf
                        span.g-sr-only Скачать в pdf
                    button.btn.btn_preview.btn_o.g-mr_1.g-hide_md(title="Распечатать" :class="{spinner: !docsLoaded[1]}" @click.prevent="pdfActions('print',$event, 1)")
                        span.icon.icon_print
                        span.g-sr-only Распечатать
                    button.btn.btn_preview.btn_o.g-mr_1(title="Отправить на почту" :class="{spinner: !docsLoaded[2]}" @click.prevent="pdfActions('send',$event, 2)")
                        span.icon.icon_email
                        span.g-sr-only Отправить на почту
            .g-mb_4
                .h4.g-mb_0
                    p.g-mb_1(v-if="payload.type !== 'du'")
                        | Узнать статус операции после оплаты
                        br
                        | Вы можете в разделе&nbsp;
                        router-link(to="/history") «История операций».

                    p.g-mb_0(v-if="payload.type !== 'du'")
                        | Просмотреть заявку на приобретение Вы можете в разделе&nbsp;
                        router-link(to="/documents") Заявки.
                    p.g-mb_0(v-else)
                        | Заявление о присоединении к Договору находится в разделе&nbsp;
                        router-link(:to="{path: '/documents', query: {tab: 1}}") Документы клиента.

            .g-row
                .g-col.g-col_md_7.g-mb_2_xs
                    router-link(to="/").btn.btn_primary.btn_block Перейти в портфель
                .g-col.g-col_md_5
                    a(href="#" @click.prevent="goBack").btn.btn_o.btn_block Вернуться

</template>

<script>
	import FileSaver from 'file-saver';

	export default {
		props: ['payload'],
		data() {
			return {
				docsLoaded: [true, true, true]
			}
		},
		methods: {
			pdfActions(action, event, index) {
				if (!this.docsLoaded[index]) return;
				this.$set(this.docsLoaded, index, false);
				const loaded = () => this.$set(this.docsLoaded, index, true);
				if (this.$store.state.funds.operations.fund.application) {
					if (this.$store.state.funds.operations.fund.application.canPrint) this.getApplicationID(action);
					else this.getInvoice(action).then(() => loaded());
				} else {
					this.getInvoice(action).then(() => loaded());
				}
			},
			getInvoice(action, event) {
				if (event) {
					event.target.classList.add('spinner');
					event.target.disabled = true
				}
				if (action == 'send') {
					return new Promise(resolve => {
						axios.get(this.payload.type == 'du' ? `/amassets/${this.payload.assetId}/pdftomail` : `/buyapps/mailaddrequest`, {
							params: {
								appNumber: this.payload.type !== 'du' ? this.$store.state.funds.operations.fund.number : ''
							}
						}).then(() => {
							if (event) {
								event.target.classList.remove('spinner');
								event.target.disabled = false
							}
							this.$set(this.docsLoaded, 2, true);
							flash(['Квитанция отправлена на почту'])
						});
					});
					return;
				}


				const axData = {
					url: '',
					params: {}
				};

				if (this.payload.type == 'du') {
					axData.url = `/amassets/${this.payload.assetId || null}/pdf`
					axData.params = {}
				} else {
					axData.url = '/buyapps/addrequest'
					axData.params = {
						appNumber: this.$store.state.funds.operations.fund.number
					}
				}

				return new Promise(resolve => {
					axios.get(axData.url, {
						params: {
							...axData.params,
						},
						responseType: 'arraybuffer'
					}).then(({data, headers}) => {
						resolve();
						const file = this.arrayBufferToBlob(data, headers);
						if (event) {
							event.target.classList.remove('spinner');
							event.target.disabled = false
						}
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
			goBack() {
				window.events.$emit('reset_payment');
			}
		},
		created() {
			this.$store.commit('popupConfirmOff', true);
		},
		computed: {}
	}
</script>
