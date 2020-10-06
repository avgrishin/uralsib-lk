<template lang="pug">
	.g-grid.g-pr
		.header-menu__close.g-ib.icon.icon_trash.g-cr_p.g-mr_1_m.g-mt_2_m.g-mr_2_md.g-hide_xs(@click="closeMenu")
		.g-row
			.g-col.g-col_lg_4.g-col_md_4.g-ml_0_md
				form.header-menu__avatar.g-mb_2.g-mb_2_xs
					fieldset.field-image
						.g-d_f_xs.g-ai_c_xs
							label.field-image__image.header-menu__avatar-image.js-field-image__preview#avatar(for="FR_SCAN_AVATAR" :style="getBackgroundImage('avatar')" :class="{spinner: avatar_loading}")
							.header-menu__avatar-text(hidden).g-show_xs
								.header-menu__avatar-text-name.g-mr_1(v-text="longName[0]")
								.header-menu__avatar-text-name.g-mr_1(v-text="longName[1]")
								.header-menu__avatar-text-name(v-text="longName[2]")
						.g-fs_15.g-mb_1.g-hide_xs(v-if="!avatar") Загрузите изображение
						.field-image__note.g-hide_xs(v-if="!avatar") Рекомендуемые форматы: #[br].PDF (до 2мб), .JPG или .TIF #[br]
						.field-image__filename
							.js-field-image__filename(v-text="getIMGName('avatar')")
							button(type="button" @click="deleteAvatar, clear('avatar')").icon.icon_trash
								.g-sr-only Очистить
						input(type="file",name="avatar",id="FR_SCAN_AVATAR" accept=".jpg,.tiff,.pdf,.tif" @change="uploadIMG($event, 'avatar')").field-image__input.g-hide_xs
				div.g-mb_2
					.g-mr_2.g-ml_1_xs.g-d_b.g-hide_xs
						.header-menu__progress
							.h3(key="mouseoverKey", v-text="`Ваш профиль заполнен на ${Math.ceil(S_PROGRESS.totalRate)}%`")
								app-progress(:percentage="S_PROGRESS.totalRate")
						div.g-mt_1(v-if="formPercentages.fields.length")
							router-link(to="/user/personal").g-fw_5
								small Заполнить профиль
						.status-nrk.g-mt_2(v-if="profileStatus")
							//- .status-nrk__title.h3 Статус идентификации в регистраторе
							.status-nrk__result.h4.g-bbc_t.g-mb_2
								span {{profileStatus[0]}}
								.tooltip-wrap
									//- .tooltip(v-html="`Вам необходимо обновить анкетные данные`")
									svg-inline(:src="'/icons/' + profileStatus[1]+ '.svg'")
						.status-nrk.g-mt_2(v-if="nrkStatus")
							.status-nrk__title.h3 Статус идентификации в Регистраторе
							.status-nrk__result.h4.g-bbc_t
								span {{nrkStatus[0]}}
								.tooltip-wrap
									//- .tooltip(v-html="`Вам необходимо обновить анкетные данные`")
									svg-inline(:src="'/icons/' + nrkStatus[1]+ '.svg'")
			nav.header-menu__nav.g-col.g-col_lg_3.g-col_md_4.g-col_pr_0.g-f_r
				.g-mb_4.g-hide_xs
					.h2.g-mb_0 Меню
				ul.header-menu__list.h3.g-mb_0
					li.header-menu__item
						router-link(to="/").g-bbc_t
							| Портфель
							small(hidden v-html="'\u2002' + casePrice").g-show_ib_xs
					li.header-menu__item
						router-link(to="/user/personal").g-bbc_t
							| Анкета
							small.g-hidden.g-show_ib_xs(v-html="'\u2002' + Math.ceil(formPercentages.percentage) + '%'")
					li.header-menu__item
						router-link(to="/funds").g-bbc_t Паевые инвестиционные фонды
					li.header-menu__item
						router-link(to="/strategies/iis").g-bbc_t Доверительное управление
					li.header-menu__item.g-hidden.g-show_xs(hidden)
						router-link(to="/messages").g-bbc_t
							| Сообщения
							small.g-hidden.g-show_ib_xs(v-html="$store.getters['user/unreadMessages'] ? `\u2002(${$store.getters['user/unreadMessages']})` : ''")
					li.header-menu__item
						router-link(to="/help").g-bbc_t Помощь
					li.header-menu__item
						router-link(to="/cmp").g-bbc_t Форма обратной связи
						a(href="#", @click.prevent="showPopup_feedback" v-if="1==2").g-bbc_t Форма обратной связи
					li.header-menu__item.g-hidden.g-show_xs(hidden)
						button(@click="logout").link.g-bbc_t.g-btn-txt.g-fw_5 Выход
			.g-col.g-col_lg_5.g-col_md_4.header-menu__info.g-ml_0_md.g-mb_8_xs.g-hide_xs
				.g-mb_4
					.h2.g-mb_0 Персональные данные
				.header-menu_row.g-mb_3
					.h3 ФИО
					.g-fs_1.g-fw_4(v-text="' ' + longName.join(' ')")
				.header-menu_row.g-mb_3
					.h3 Мобильный телефон
					a(:href="`tel:${phone}`" v-text="' ' + formatPhone(phone)").h4
				.header-menu_row.g-mb_4
					.h3 Электронная почта
					a.h4.g-bbc_t(:href="`mailto:${email}`" v-text="' ' + email")
				.header-menu_row.g-mb_4
					router-link(to="/user/change-password").h4.g-bbc_t Изменение пароля

</template>

<script>
	import Progress from './partials/Progress';
	import {mapActions, mapState} from "vuex";
	
	import {DnD} from '../mixins';
	
	export default {
		components: {
			'app-progress': Progress,
		},
		mixins: [DnD],
		watch: {
			avatar_file(val, oldVal) {
				if (val && oldVal != null) this.uploadAvatar();
				else if (!val && oldVal) this.deleteAvatar();
				
				if (val && oldVal == null) {
					this.uploadAvatar()
				}
			}
		},
		data() {
			return {
				formData: {},
				avatar: null,
				avatar_file: null,
				avatar_loading: false,
				
				allowed_files: ['application/pdf', 'image/tiff', 'image/tif', 'image/jpeg'],
			}
		},
		created() {
			this.getAvatar();
			this.A_GET_PROGRESS_PROFILE();
		},
		mounted() {
			this.addEvents({avatar: document.querySelector('#avatar')});
		},
		methods: {
			...mapActions('progress', ['A_GET_PROGRESS_PROFILE']),
			logout() {
				this.$store.dispatch('user/logout')
					.then(() => {
						this.$router.push('/');
						document.querySelector('.site').classList.remove('site_overlay');
					});
			},
			formatPhone(val) {
				if (!val) return ''
				
				let m = val.match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
				
				if (m && m.length == 6) return `+${m[1]} (${m[2]}) ${m[3]} ${m[4]} ${m[5]}`;
				
				return '';
			},
			showPopup_feedback() {
				window.events.$emit('show_popup', 'contact');
			},
			uploadAvatar() {
				this.avatar_loading = true;
				
				const formData = new FormData();
				formData.append('file', this.avatar_file, this.avatar_file.name);
				
				axios({
					method: 'POST',
					url: '/ClientProfile/avatar',
					data: formData,
					headers: {
						'Content-Type': 'multipart/form-data'
					},
				}).then(() => {
					this.avatar_loading = false;
				})
			},
			getAvatar() {
				axios({
					method: 'GET',
					url: '/ClientProfile/avatar',
					responseType: 'arraybuffer'
				}).then(({data, headers}) => {
					this.uploadIMG(this.fileToBlob(data, headers), 'avatar', false);
					this.avatar_downloading = false;
				}).catch(() => this.avatar_file = false);
			},
			deleteAvatar() {
				this.avatar_loading = true;
				window.log("delete")
				axios.delete('/ClientProfile/avatar').then(() => {
					window.log('delete complete')
					this.avatar_loading = false
				});
			},
			fileToBlob(data, headers) {
				const blob = this.arrayBufferToBlob(data, headers);
				
				let extension = blob.type.split('/')[1];
				blob.name = `avatar.${extension}`;
				
				return blob;
			},
			closeMenu() {
				this.$emit('close');
			}
		},
		computed: {
			...mapState('progress', ['S_PROGRESS']),
			passportValidationState() {
				return this.$store.state.form.completed.passport.registrarValidationState[0];
			},
			profileStatus() {
				if (this.$store.state.user.state.authState !== 2) {
					return ['Требуется актуализация анкеты', 'exclamation']
				} else {
					return;
				}
			},
			nrkStatus() {
				let nrkState = this.passportValidationState;
				if (nrkState == 3) {
					return ['Подтвержден', 'valid'];
				} else if (nrkState == 2 || nrkState == 0 || nrkState == 4 || nrkState == 1) {
					return ['Не пройдена', 'notvalid'];
				} else {
					return;
				}
			},
			formPercentages() {
				return this.$store.getters['form/mainPercentage'];
			},
			longName() {
				if (!this.$store.state.user.state || !this.$store.state.user.state.fullName) return [];
				
				return this.$store.state.user.state.fullName.split(' ');
			},
			phone() {
				if (!this.$store.state.user.state || !this.$store.state.user.state.phone) return '';
				
				return this.$store.state.user.state.phone;
			},
			email() {
				if (!this.$store.state.user.state || !this.$store.state.user.state.email) return '';
				
				return this.$store.state.user.state.email;
			},
			casePrice() {
				let cost = 0;
				
				if (this.$store.state.user.state.totalPortfolioCost) cost = this.$store.state.user.state.totalPortfolioCost;
				
				return this.formatCurrency(cost);
			}
		}
	}
</script>

<style lang="scss">
	.status-nrk {
		.tooltip {
			box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.25);
			min-width: 230px;
			text-align: left;
			top: -92px;
			left: -162px;
			font-weight: normal;
			
			&:after {
				bottom: -16px;
				left: auto;
				right: 40px;
				transform: translateX(-50%) rotate(180deg);
			}
			
			&-wrap {
				&:hover {
					.tooltip {
						display: block;
						opacity: 1;
						visibility: visible;
					}
				}
			}
		}
		
		&__result {
			display: flex;
			align-items: center;
			justify-content: space-between;
			max-width: 280px;
			
			&.h4 {
				margin-bottom: 5px;
				
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
		
		&__title {
			&.h3 {
				margin-bottom: 11px;
			}
		}
		
		.svginline {
			width: 16px;
			height: 16px;
			// cursor: pointer;
		}
	}
</style>
