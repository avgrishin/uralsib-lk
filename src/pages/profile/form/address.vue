<template lang="pug">
	article.content
		h1 Анкета
		.g-row
			step
			.g-col.g-col_lg_8
				form.form-step(autocomplete="off")
					fieldset.form__fieldset.form__fieldset_narrow.g-mb_0(:disabled="formDisabled")
						.control
							.g-row_narrow
								.g-col.g-col_md_6
									.control
										label.control__field.g-d_b
											input(
												type="text",
												@input="postCodeChange",
												v-model="registrationAddress.post_code"
												data-vv-as="индекс"
												v-validate="'required|index'"
												name="index"
												id="FPD_INDEX"
												autocomplete="new-password"
											).field_text.field_text_mtrl
											span.control__label Индекс
											span.field_error(v-if="errors.has('index')" v-html="errors.first('index')")
										.control__note.control__note_long Если Вы не помните свой индекс, он будет проставлен автоматически после заполнения полей с адресом.
						.control
							label.control__field.g-d_b
								input(type="text" name="country" value="РФ" disabled).field_text.field_text_mtrl.hasvalue
								span.control__label Страна
						.control
							autocomplete(
								label="Регион / Область"
								name="region"
								id="FPD_REGION"
								validation="required"
								as="регион/область"
								level="1"
								:value="registrationAddress.region"
								@selected="setField($event, 'registrationAddress', 'region')"
								autocomplete="new-password"
							)
						fieldset(:disabled="!regionDisabled")
							.control
								autocomplete(
									label="Район"
									name="district"
									id="FPD_DISTRICT"
									as="район"
									level="3"
									:value="registrationAddress.district"
									:extraParameters="kladr.registrationAddress"
									@selected="setField($event, 'registrationAddress', 'district')"
									autocomplete="new-password"
								)
							.control
								autocomplete(
									label="Город"
									name="city"
									id="FPD_CITY"
									as="город"
									level="4"
									:disabled="disabledBigCity"
									:validation="validationCity"
									:value="registrationAddress.city"
									:extraParameters="kladr.registrationAddress"
									@selected="setField($event, 'registrationAddress', 'city')"
									autocomplete="new-password"
								)
							.control
								autocomplete(
									label="Населенный пункт"
									name="area"
									id="FPD_LOCALITY"
									as="населенный пункт"
									level="6"
									:disabled="disabledBigCity"
									:validation="validationArea"
									:value="registrationAddress.area"
									:extraParameters="kladr.registrationAddress"
									@selected="setField($event, 'registrationAddress', 'area')"
									autocomplete="new-password"
								)
							.control
								autocomplete(
									label="Улица"
									name="street"
									id="FPD_STREET"
									as="улица"
									level="7"
									:value="registrationAddress.street"
									:extraParameters="kladr.registrationAddress"
									@selected="setField($event, 'registrationAddress', 'street')"
									autocomplete="new-password"
								)
							.g-row_narrow
								.control.g-col.g-col_md_4.g-col_xs_4
									autocomplete(
										label="Дом"
										name="house"
										id="FPD_HOUSE"
										as="дом"
										level="8"
										validation="required"
										:value="registrationAddress.house"
										:extraParameters="kladr.registrationAddress"
										@selected="setField($event, 'registrationAddress', 'house', true)"
										autocomplete="new-password"
									)
								.control.g-col.g-col_md_4.g-col_xs_4
									autocomplete(
										label="Корп./Стр."
										name="building"
										id="FPD_BUILDING"
										as="корпус"
										level="9"
										:value="registrationAddress.building"
										:extraParameters="kladr.registrationAddress"
										@selected="setField($event, 'registrationAddress', 'building')"
										autocomplete="new-password"
									)
								.control.g-col.g-col_md_4.g-col_xs_4
									label.control__field.g-d_b
										input(
											type="text",
											v-model="registrationAddress.apartment"
											data-vv-as="квартира"
											v-validate="{required: !registrationAddress.no_aptmnt}"
											name="aptmnt", id="FPD_APTMNT"
											:disabled="registrationAddress.no_aptmnt"
											autocomplete="new-password"
										).field_text.field_text_mtrl
										span.control__label Кв.
										span.field_error(v-if="errors.has('aptmnt')" v-html="errors.first('aptmnt')")
									.control__note.control__note_long
										.checkbox.sz_s
											input(type="checkbox", v-model="registrationAddress.no_aptmnt" name="hasAptmnt", id="FR_HASAPTMNT")
											label(for="FR_HASAPTMNT") Нет номера квартиры
								.control.control_empty
							.g-row_narrow
								p.g-col.control(v-html="registrationAddressFull")
								.control.control_empty
					fieldset.form__fieldset(:disabled="formDisabled")
						.g-row
							.g-col.g-col_md_5
								input(type="button" @click="next" :class="{btn_secondary: buttonDisabled, btn_primary: !buttonDisabled}" :disabled="buffering" value="Сохранить").btn.btn_block

</template>

<script>
	import step from './step.vue';
	import Autocomplete from '../../../components/Autocomplete.vue';
	import Inputmask from "inputmask";
	import {mapActions} from 'vuex';
	export default {
		components: {Autocomplete, step},
		watch: {
			regPostCode(val) {
				if (!/^[0-9]{6}$/.test(val)) {
					this.dataLoaded = false;
					return;
				} else {
					this.dataLoaded = true;
				}
				this.getDataByPostCode(val, 'registrationAddress');
			},
		},
		data() {
			return {
				kladr: {
					registrationAddress: {}
				},
				registrationAddress: {
					post_code: '',
					region: '',
					district: '',
					city: '',
					area: '',
					street: '',
					house: '',
					building: '',
					apartment: '',
					no_aptmnt: false
				},
				buffering: false,
				dataLoaded: false,
				loaded: false,
				startDisabledRegion:false,
			}
		},
		created() {
			this.fillData();
		},
		mounted() {
			this.$nextTick(() => {
				this.$onBlur();
				this.$checkInputs();

				Inputmask("999999").mask(document.getElementById('FPD_INDEX'));
			});
		},
		beforeDestroy() {
			this.$removeOnBlurEvents();
				[
					document.getElementById('FPD_INDEX')
				].forEach(item => {
					if (item && item.inputmask) item.inputmask.remove();
				});

		},
		methods: {
			...mapActions('progress', [
				'A_GET_PROGRESS_PROFILE'
			]),
			next() {
				this.buffering = true;
				this.$validator.validateAll().then((result) => {
					if (result) this.updateInfo();
					else this.buffering = false;
				});
				// if(this.$store.state.user.state.authState == 2) {
				// axios.get('/ClientProfile/Addresses').then(({data}) => {
				// 	if (!data) return;
				// 	if (
				// 		this.registrationAddress.post_code != data.registrationAddress.zipCode ||
				// 		this.registrationAddress.region != data.registrationAddress.state ||
				// 		this.registrationAddress.district != data.registrationAddress.region ||
				// 		this.registrationAddress.city != data.registrationAddress.city ||
				// 		this.registrationAddress.area != data.registrationAddress.area ||
				// 		this.registrationAddress.street != data.registrationAddress.street ||
				// 		this.registrationAddress.house != data.registrationAddress.building ||
				// 		this.registrationAddress.building != data.registrationAddress.block ||
				// 		this.registrationAddress.apartment != data.registrationAddress.appartment
				// 	) {
				// 		this.buffering = true;

				// 		this.$validator.validateAll().then((result) => {
				// 			if (result) this.updateInfo();
				// 			else this.buffering = false;
				// 		});
				// 	} else {
				// 		let stepPath = this.$store.state.formStep.path
				// 		if (stepPath == '') {
				// 			// this.buffering = true;
				// 			// this.$router.push('/user/bank');
				// 			this.buffering = true;
				// 			this.$validator.validateAll().then((result) => {
				// 				if (result) this.updateInfo();
				// 				else this.buffering = false;
				// 			});
				// 		} else {
				// 			this.buffering = true;
				// 			this.$store.commit('setFormStepStatus', true);
				// 			this.$router.push(stepPath);
				// 		}
				// 	}
				// });
				// } else {
				// 	this.buffering = true;
				// 	this.$validator.validateAll().then((result) => {
				// 		if (result) this.updateInfo();
				// 		else this.buffering = false;
				// 	});
				// }
			},
			fillData(user) {
				axios.get('/ClientProfile/Addresses').then(({data}) => {
					if (!data) return;
					
					this.registrationAddress.post_code = data.registrationAddress.zipCode;
					this.registrationAddress.region = data.registrationAddress.state;
					this.registrationAddress.district = data.registrationAddress.region;
					this.registrationAddress.city = data.registrationAddress.city;
					this.registrationAddress.area = data.registrationAddress.area;
					this.registrationAddress.street = data.registrationAddress.street;
					this.registrationAddress.house = data.registrationAddress.building;
					this.registrationAddress.building = data.registrationAddress.block;
					this.registrationAddress.apartment = data.registrationAddress.appartment;
					this.registrationAddress.no_aptmnt = data.registrationAddress.appartment ? false : true;

					setTimeout(() => {
						this.$checkInputs();
						this.dataLoaded = true;
						this.loaded = true;
					}, 100);
				});
			},
			updateInfo() {
				if (!this.$store.state.user.state.allowEditClientProfile) {
					this.buffering = false;
					return;
				}

				let data = {
					registrationAddress: {
						zipCode: this.registrationAddress.post_code,
						citizenshipCountryNum: 643,
						state: this.registrationAddress.region,
						region: this.registrationAddress.district,
						city: this.registrationAddress.city,
						area: this.registrationAddress.area,
						street: this.registrationAddress.street,
						building: this.registrationAddress.house,
						block: this.registrationAddress.building,
						appartment: this.registrationAddress.apartment
					},
					residentialAddress: null
				};

				axios.post('/ClientProfile/Addresses', data).then(({data}) => {
					this.$store.dispatch('user/formChanged');
					//this.$store.dispatch('user/getForm');
					this.A_GET_PROGRESS_PROFILE();

					this.buffering = false;

					if (this.$store.state.user.state.authState == 2 && 1 == 2) {
						window.events.$emit('show_popup', 'form-step');
					} else {

						if(localStorage.getItem('questionaryStep'))  {
							let obj = {
								'/user/passport':1,
								'/user/address':1,
								'/user/bank':1,
								'/user/finish':0
							};
							localStorage.setItem('questionaryStep',JSON.stringify(obj))

						};
						this.$router.push('/user/bank')
					}

				}).catch(({data}) => this.buffering = false);
			},
			setField(event, address, field) {

				if (event && event.title) {
					this[address][field] = event.title;
					this.kladr[address][field] = event;

					if (event.key) this.getPostCode(address, event.key);
				} else {
					this[address][field] = event;
					if (!event) delete this.kladr[address][field];
				}

				if (event && event.postalCode) this[address].post_code = event.postalCode;

				this.$checkInputs();
			},
			getDataByPostCode(val, address) {
				if (!this.dataLoaded) return;

				axios.get('/reference/addressbyindex', {
					params: {
						index: val
					}
				}).then(({data}) => {
					for (let i = 1; i < 8; i++) {
						let items = data.filter(item => item.level == i);
						
						if (items.length != 1) continue;

						let field = '';

						if (i == 1) field = 'region';
						if (i == 3) field = 'district';
						if (i == 4) field = 'city';
						if (i == 6) field = 'area';
						if (i == 7) field = 'street';

						if (!field) continue;

						this[address][field] = items[0].title;
						this.kladr[address][field] = items[0];
					}
				});
			},
			getPostCode(address, code) {
				axios.get('/reference/indexbykladr', {
					params: {
						kladrCode: code
					}
				}).then(({data}) => {
					if (data.length == 1 && data[0].postIndex) this[address].post_code = data[0].postIndex;

					this.$checkInputs();
				});
			},
			postCodeChange() {

			}
		},
		computed: {
			disabledBigCity(){
				// return(this.registrationAddress.region == 'Москва г' ||
				//     this.registrationAddress.region == 'Санкт-Петербург г' ||
				//     this.registrationAddress.region == 'Севастополь г'
				// )
				return(this.registrationAddress.region == 'Санкт-Петербург г' ||
					this.registrationAddress.region == 'Севастополь г'
				)
			},
			validationCity(){
				let val = 'required';
				if(this.registrationAddress.region == 'Москва г' ||
					this.registrationAddress.region == 'Санкт-Петербург г' ||
					this.registrationAddress.region == 'Севастополь г' ){
					val =''

				} else if(this.registrationAddress.area && this.registrationAddress.area.length) val ='';

				return val
			},
			validationArea(){
				let val = 'required';
				if(this.registrationAddress.region == 'Москва г' ||
					this.registrationAddress.region == 'Санкт-Петербург г' ||
					this.registrationAddress.region == 'Севастополь г' ){
					val =''

				} else if(this.registrationAddress.city.length)val ='';




				return val
			},
			regionDisabled(){
				this.registrationAddress.region;
				let arr=[]
				for (let field in this.registrationAddress) {
					if (field !='post_code' && field != 'region')  arr.push(this.registrationAddress[field])
				}
				let  disabled = arr.some((item) => {return item != ''})




				return disabled || !!this.kladr.registrationAddress.region
			},
			buttonDisabled() {
				return !Boolean(
					this.registrationAddress.post_code &&
					this.registrationAddress.region &&
					this.registrationAddress.street &&
					(this.registrationAddress.no_aptmnt || this.registrationAddress.apartment)
				);
			},
			regPostCode() {
				return this.registrationAddress.post_code;
			},
			registrationAddressFull() {
				let address = [
					this.registrationAddress.post_code || null,
					this.registrationAddress.region || null,
					this.registrationAddress.district || null,
					this.registrationAddress.city || null,
					this.registrationAddress.area || null,
					this.registrationAddress.street || null,
					(
						this.registrationAddress.house ?
							'д ' + this.registrationAddress.house +
							(this.registrationAddress.building ? ', ' + this.registrationAddress.building : '')
							: null
					),
					(this.registrationAddress.apartment && !this.registrationAddress.no_aptmnt) ? 'кв ' + this.registrationAddress.apartment : null
				];

				return address.filter(item => item).join(', ');
			},
			formDisabled() {
				return  this.loaded && !this.$store.state.user.state.allowEditClientProfile;
			},
			formStepStatus() {
				return this.$store.state.formStep.status
			}
		}
	}
</script>

