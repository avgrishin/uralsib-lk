<template lang="pug">
	article.content
		h1 Анкета
		.g-row
			step
			.g-col.g-col_lg_8
				form.form.form-step(autocomplete="off")
					fieldset.form__fieldset.g-mb_0(:disabled="formDisabled")
						.g-row_narrow
							.control.g-col.g-col_md_6
								label.control__field.g-d_b
									input(
										type="text",
										disabled,
										value="Паспорт РФ",
										data-vv-as="Паспорт РФ",
										name="passport_doc",
										id="FPD_DOC"
									).field_text.field_text_mtrl.has-value
									span.control__label Документ
							.control.g-col.g-col_md_6
								label.control__field.g-d_b
									input(
										type="text",
										@paste="setField($event, 'passport')",
										v-model="passport",
										data-vv-as="паспорт",
										v-validate="'required|pf|asc'",
										name="passport",
										id="FPD_PASSPORT",
										:disabled="regEsia"
									).field_text.field_text_mtrl
									span.control__label Серия и номер
									span.field_error(v-if="errors.has('passport')" v-html="errors.first('passport')")
							.control.control_empty
						.control
							label.control__field.g-d_b
								input(
									type="text",
									v-model="issue",
									data-vv-as="кем выдан",
									v-validate="'required|poi'",
									name="issue",
									id="FR_ISSUE",
									:disabled="regEsia"
								).field_text.field_text_mtrl
								span.control__label Кем выдан #[strong.red_text (строго в соответствии с паспортом)]
								span.field_error(v-if="errors.has('issue')", v-html="errors.first('issue')")

						.g-row_narrow
							.control.control_date.g-col.g-col_md_6
								label.control__field.g-d_b
									input(
										type="text",
										v-model="date_issue",
										v-validate="'required|df'",
										data-vv-as="дата выдачи",
										name="date_issue",
										id="FR_DATE_ISSUE",
										autocomplete="off",
										:disabled="regEsia"
									).field_text.field_text_mtrl
									span.control__label Дата выдачи
							.control.g-col.g-col_md_6
								label.control__field.g-d_b
									input(
										type="text",
										v-model="passport_code",
										data-vv-as="код подразделения",
										v-validate="'required|pi'",
										name="passport_code",
										id="FR_PASSPORT_CODE",
										:disabled="regEsia"
									).field_text.field_text_mtrl
									span.control__label Код подразделения
									span.field_error(v-if="errors.has('passport_code')" v-html="errors.first('passport_code')")
							.control.control_empty
					.g-pt_2(v-if="passportValidationState !== 3")
						legend.h3(v-if="passportValidationState !== 3") Скан паспорта
					fieldset.form__fieldset.form__fieldset_scans(:disabled="formDisabled", v-if="passportValidationState !== 3")
						.g-row_narrow
							.g-col.g-col_xs_4
								.control.field-image.js-field-image
									.field-image__name Первая страница
									label.field-image__image.field-image__image_pass.js-field-image__preview#first_page(for="first_page_input" :style="getBackgroundImage('first_page')" :class="{spinner:!first_page_loaded}")
									.field-image__note Рекомендуемые форматы: #[br].PDF (до 2мб), .JPG или .TIF #[br]
									.field-image__filename
										.js-field-image__filename(v-html="getIMGName('first_page')")
										button(type="button" @click="clear('first_page')").icon.icon_trash.js-field-image__delete
									input(
										v-if="passportValidationState !== 3",
										type="file",
										v-validate:first_page_file="{not_in: [false],required:true}",
										name="scan_first",
										id="first_page_input",
										accept=".jpg,.tiff,.pdf,.tif",
										@change="uploadIMG($event, 'first_page'), scansStatusChange[0] = true"
									).field-image__input
									input(
										v-else,
										ref="scan1",
										type="file",
										name="scan_first",
										id="first_page_input",
										accept=".jpg,.tiff,.pdf,.tif",
										@input="uploadIMG($event, 'first_page'), scansStatusChange[0] = true"
									).field-image__input
									span.field_error(v-if="errors.has('scan_first')") Поле обязательно для заполнения
							.g-col.g-col_xs_4
								.control.field-image.js-field-image
									.field-image__name(data-text-xs="Регистрация") Страница с регистрацией
									label.field-image__image.field-image__image_pass.js-field-image__preview#second_page(for="second_page_input" :style="getBackgroundImage('second_page')" :class="{spinner:!second_page_loaded}")
									.field-image__note Рекомендуемые форматы: #[br].PDF (до 2мб), .JPG или .TIF #[br]
									.field-image__filename
										.js-field-image__filename(v-html="getIMGName('second_page')")
										button(type="button" @click="clear('second_page')").icon.icon_trash.js-field-image__delete
									input(
										v-if="passportValidationState !== 3",
										type="file",
										v-validate:second_page_file="{not_in: [false],required:true}",
										name="scan_second",
										id="second_page_input",
										accept=".jpg,.tiff,.pdf,.tif",
										@change="uploadIMG($event, 'second_page'), scansStatusChange[1] = true"
									).field-image__input
									input(
										v-else,
										ref="scan2",
										type="file",
										name="scan_second",
										id="second_page_input",
										accept=".jpg,.tiff,.pdf,.tif",
										@input="uploadIMG($event, 'second_page'), scansStatusChange[1] = true"
									).field-image__input
									span.field_error(v-if="errors.has('scan_second')") Поле обязательно для заполнения
							//.g-col.g-col_xs_4
								.control.field-image.js-field-image
									.field-image__name(data-text-xs="Регистрация") Страница с отметкой о замене
									label.field-image__image.field-image__image_pass.js-field-image__preview#third_page(for="third_page_input" :style="getBackgroundImage('third_page')" :class="{spinner:!third_page_loaded}")
									.field-image__note Рекомендуемые форматы: #[br].PDF (до 2мб), .JPG или .TIF #[br]
									.field-image__filename
										.js-field-image__filename(v-html="getIMGName('third_page')")
										button(type="button" @click="clear('third_page')").icon.icon_trash.js-field-image__delete
									input(
										v-if="passportValidationState !== 3",
										type="file",
										v-validate:third_page_file="{not_in: [false],required:true}",
										name="third_page",
										id="third_page_input",
										accept=".jpg,.tiff,.pdf,.tif",
										@change="uploadIMG($event, 'third_page'), scansStatusChange[2] = true"
									).field-image__input
									input(
										v-else,
										ref="scan3",
										type="file",
										name="third_page",
										id="third_page_input",
										accept=".jpg,.tiff,.pdf,.tif",
										@input="uploadIMG($event, 'third_page'), scansStatusChange[2] = true"
									).field-image__input
									span.field_error(v-if="errors.has('third_page')") Поле обязательно для заполнения
							.control.control_empty
					fieldset.form__fieldset(:disabled="formDisabled")
						.g-row
							.g-col.g-col_md_5
								input(type="button" @click="next" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" :disabled="buffering" value="Сохранить").btn.btn_block

</template>

<script>
	import moment from 'moment';
	import Inputmask from 'inputmask';

	import { DnD, fillUserInfo, formProfileStepChange } from './../../../mixins';
	import step from './step.vue';
	import {mapActions} from 'vuex';
	export default {
		components: {step},
		mixins: [DnD, formProfileStepChange],
		data() {
			return {
				passport: '',
				issue: '',
				date_issue: '',
				passport_code: '',

				passportValidationState: this.$store.state.form.completed.passport.registrarValidationState[0] || false,

				first_page: false,
				first_page_file: false,
				first_page_loaded: false,

				second_page: false,
				second_page_file: false,
				second_page_loaded: false,

				third_page: false,
				third_page_file: false,
				third_page_loaded: false,

				scansStatusChange: [false, false, false],

				allowed_files: ['application/pdf', 'image/tiff', 'image/tif', 'image/jpeg'],

				buffering: false,
				loaded: false
			}
		},
		created() {
			this.fillData();

		},
		mounted() {
			this.$nextTick(() => {
				this.$onBlur();
				this.$checkInputs();

				Inputmask('9999 999999').mask(document.getElementById('FPD_PASSPORT'));
				Inputmask('99.99.9999').mask(document.getElementById('FR_DATE_ISSUE'));
				Inputmask('999-999').mask(document.getElementById('FR_PASSPORT_CODE'));

				// document.querySelector('#FR_DATE_ISSUE').DatePickerX.init();

				if (this.passportValidationState !== 3) {
					this.addEvents({
						first_page: document.querySelector('#first_page'),
						second_page: document.querySelector('#second_page'),
						//third_page: document.querySelector('#third_page')
					});
				}
			});
		},
		beforeDestroy() {
			this.$removeOnBlurEvents();
			[
				document.getElementById('FDP_PASSPORT'),
				document.getElementById('FR_DATE_ISSUE'),
				document.getElementById('FR_PASSPORT_CODE')
			].forEach(item => {
				if (item && item.inputmask) item.inputmask.remove();
			});
		},
		methods: {
			...mapActions('progress', [
				'A_GET_PROGRESS_PROFILE'
			]),
			setField(event, field) {
				const clipboardData = event.clipboardData || window.clipboardData;
				let pastedData = clipboardData.getData('Text');

				this[field] = pastedData;
			},
			next() {
				if (this.$store.state.user.state.authState == 2) {
					let checkPassportField = () => {
						axios.get('/ClientProfile/Passport').then(({
							data
						}) => {
							if (!data) return;

							let thisPassport = this.passport.replace(/ /g, "")
							let dataPassport = data.series + data.number
							let dataIssued = moment.utc(data.issued, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY')

							if (thisPassport != dataPassport ||
								this.issue != data.issuer ||
								this.date_issue != dataIssued ||
								this.passport_code != data.issuerCode ||
								this.scansStatusChange[0] != false ||
								this.scansStatusChange[1] != false ||
								this.scansStatusChange[2] != false
							) {

								this.buffering = true;
								this.$validator.validateAll().then((result) => {
									if (result) this.updateInfo();
									else this.buffering = false;
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
					}


					checkPassportField();


				} else {
					this.buffering = true;
					this.$validator.validateAll().then((result) => {
						if (result) this.updateInfo();
						else this.buffering = false;
					});
				}
			},
			fillData() {
				axios.get('/ClientProfile/Passport').then(({data}) => {
					if (!data) return;

					this.passport = (data.series && data.number) ? Inputmask.format(`${data.series} ${data.number}`, { mask: '9999 999999' }) : '';
					this.issue = data.issuer || '';
					this.date_issue = data.issued ? moment.utc(data.issued, 'YYYY-MM-DD[T]HH:mm:ss').format('DD.MM.YYYY') : '';
					this.passport_code = data.issuerCode ? Inputmask.format(data.issuerCode, { mask: '999-999' }) : '';

					setTimeout(() => {
						this.$checkInputs();
						this.setDatePicker('FR_DATE_ISSUE', 'date_issue');
						this.loaded = true;
					}, 100);

					this.getFile(1, 'first_page');
					this.getFile(2, 'second_page');
					// this.getFile(3, 'third_page');
				});
			},
			updateInfo() {
				this.buffering = true;

				if (!this.$store.state.user.state.allowEditClientProfile) {
					this.buffering = false;
					return;
				}

				let passport = this.passport.split(' ');
				let onPassportUpload = () => {
					this.$store.dispatch('user/formChanged').then(data => {
						this.buffering = false;

						this.A_GET_PROGRESS_PROFILE();

						if (this.$store.state.user.state.authState == 2) {
							window.events.$emit('show_popup', 'form-step');
						} else {
							this.$router.push('/user/address');
						}
					})
				}

				axios.post('/ClientProfile/Passport', {
						series: passport[0],
						number: passport[1],
						issued: moment.utc(this.date_issue, 'DD.MM.YYYY').toISOString(),
						issuer: this.issue,
						issuerCode: this.passport_code,
					})
					.then((data) => {
						if (this.passportValidationState !== 3) {
							this.uploadFile('1', 'first_page_file').then(() => {
								this.uploadFile('2', 'second_page_file').then(() => {
									// this.uploadFile('3', 'third_page_file').then(() => {
									// 	this.scansStatusChange[0] = false;
									// 	this.scansStatusChange[1] = false;
									// 	this.scansStatusChange[2] = false;
									// 	onPassportUpload();
									// });
									this.scansStatusChange[0] = false;
									this.scansStatusChange[1] = false;
									// this.scansStatusChange[2] = false;
									onPassportUpload();
								})
							})
						} else {
							onPassportUpload();
						}
					}).catch((data) => {
						flash(['Неизвестная ошибка при сохранении данных'], 'error');
						this.buffering = false;
					});
				},
				uploadFile(page, field) {
					if (!this[field]) return;
					const formData = new FormData();

					formData.append('file', this[field], this[field].name);
					return axios.post(`/ClientProfile/passportscan${page}`, formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					});
				},
				getFile(page, field) {
					axios({
						method: 'GET',
						url: `/ClientProfile/passportscan${page}`,
						responseType: 'arraybuffer'
					}).then(({
						data,
						headers
					}) => {
						this.uploadIMG(this.blobToFile(data, headers, page), field);
					}).catch(({response : { data }}) => {
						const name = {
							1: 'первой',
							2: 'второй',
							3: 'третьей'
						};
						flash([`Скан ${name[page]} страницы не найден`], 'error');
						this[`${field}_loaded`] = true;

					});
				},
				blobToFile(data, headers, page) {
					const blob = this.arrayBufferToBlob(data, headers);
					let extension = blob.type.split('/')[1];

					blob.name = `passportscan${page}.${extension}`;
					blob.lastModified = Date.now();

					return blob;
				}
			},
		computed: {
			regEsia(){
				return false /* Grishin A.V. 14.07.2020 */ && this.$store.state.user.state.registrationProvider == 'ESIA' && this.$store.state.user.state.authState == 1 && this.$store.state.user.state.hasEsia == true
			},
			buttonDisabled() {
				if(this.passportValidationState == 3) {
					return !Boolean(
						this.passport &&
						this.issue &&
						this.date_issue &&
						this.passport_code
					);
				} else {
					return !Boolean(
						this.passport &&
						this.issue &&
						this.date_issue &&
						this.passport_code &&
						this.first_page &&
						this.second_page
						// this.third_page
					);
				}

			},
			formDisabled() {
				return this.loaded && !this.$store.state.user.state.allowEditClientProfile;
			}
		}
	}
</script>

<style lang="scss">

	.drag-over {
		border-color: #bbc0c6;
	}

	.drag-error {
		border-color: #ff3333;
	}

	.red_text {
		color: red;
	}
</style>
