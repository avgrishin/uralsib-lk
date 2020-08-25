<template lang="pug">
	.nav_user
		.nav__item.g-hide(
		:class_off='{spinner:!loaded_total}'
		)
			router-link(to="/", title="Портфель" class="nav__link nav__link_highlight g-bbc_t")
				span.icon.icon_case
				span.nav__text.g-hide_md(v-html="casePrice")
		.nav__item.g-hide_xs
			router-link(to="/messages", title="Сообщения" class="nav__link g-bbc_t")
				span.icon.icon_email
					span.nav__counter(v-if="$store.getters['user/unreadMessages']" v-html="$store.getters['user/unreadMessages']")
		.nav__item(:class="{open: menuState}" title="Открыть меню")
			.nav-main-toggle.g-hidden.g-show_xs(@click.prevent="toggleUserMenu")
				span.nav-main-toggle__icon

			a.nav__link.g-bbc_t.g-hide_xs(href="#" @click.prevent="toggleUserMenu")
				span.icon.icon_person
				span.nav__text.g-hide_md
					span.nav__text-name.g-mr_1(v-text="userName[0]")
					span.nav__text-name.g-mr_1(v-text="userName[1]")
					span.nav__text-name(v-text="userName[2]")
				span.g-icon-down(:class="{'g-icon-down_open': menuState}")
		.nav__item.g-hide_xs
			button(@click="logout" title="Выход").nav__link.g-bbc_t.g-btn-txt
				span.icon.icon_exit.g-cr_p
				span.g-sr-only Выход

</template>

<script>
	export default {
		props: ['menuState'],
		data(){
		  return {
			  total: 0,
			  loaded_total:false
		  }
		},
		methods: {
			logout() {
				if(!this.$store.state.popupConfirmOff) { // Без этого быд баг при выборе фонда в покупке, попап "Вы действительно хотите уйти" не правильно работал
					this.$store.dispatch('confirm')
						.then(answer => {
							if (answer) {
								this.$store.dispatch('user/logout')
									.then(()=>  {
										this.$router.push('/');
										document.querySelector('.site').classList.remove('site_overlay');
									});
							}

							else window.events.$emit('close_popup');
						});
				} else {
					this.$store.dispatch('user/logout')
						.then(()=>  {
							this.$router.push('/');
							document.querySelector('.site').classList.remove('site_overlay');
						});
				}


			},
			toggleUserMenu() {
				this.$emit('toggleUserMenu');
			},
			getCaseTableData() { //временное решение
				this.$store.state.user.state.totalPortfolioCost=0;
				axios.get('/reports/AssetsEstimateDU').then(({data}) => {
					data.forEach(item => {
						this.total+=item.outamnt;
					});
					this.$store.state.user.state.totalPortfolioCost=this.total;
					this.loaded_total=true;
				})
			},
		},
		created(){
			//this.getCaseTableData()
		},
		computed: {
			userName() {
				if (this.$store.state.user.state.shortName)
					return this.$store.state.user.state.shortName.split(' ');

				return '';
			},
			casePrice() {
				let cost = 0;

				if (this.$store.state.user.state.totalPortfolioCost) cost =  this.$store.state.user.state.totalPortfolioCost;
				//cost = 1234567;


				return this.formatCurrency(cost);
			}
		}
	}
</script>

<style lang="scss">
	@import "../assets/styles/vars";
	.nav {
		&_user {
			.header & {
				padding-top: 9px;
				 @include media($width_xs){
					 padding-top: 0;
				 }

			}
			text-align: right;
			.g-icon-down{
				width:10px;
				height:14px;
				line-height:14px;
				vertical-align:top;
				margin-left:5px;
				display:inline-block;
			}
			.icon {
				vertical-align: top;
				@include media($width_xs){
					position: relative;
					bottom: 1px;
				}
				& + .nav__text {
					margin-left: 7px;

					@include media($width_xs){
						font-size: 16px;
						position: relative;
					}
				}
			}
			.nav {
				&__item {
					display: inline-block;
					vertical-align: top;
					margin-left:69px;
					@include media($width_lg){
						margin-left:40px;
					}
					@include media($width_xs){
						margin-left:17px;
					}
					&:first-child {
						margin-left: 0;
					}
				}
				&__link {
					position: relative;
					font-size: 18px;
					line-height: 20px;
					color:$clr_primary;
					white-space: nowrap;
					&_highlight {
						font-weight: bold;
					}
				}
				&__text {
					display: inline-block;
					vertical-align: top;
					max-width:250px;
					overflow:hidden;
					text-overflow:ellipsis;
					&-name{
						display:inline-block;
						&.g-mr_1{ margin-right:0.312em }
						&:first-letter{
							text-transform:uppercase;
						}
					}


				}
				&__counter {
					position: absolute;
					left: 10px;
					top: -9px;
					font-size: 12px;
					width: 19px;
					height: 19px;
					text-align: center;
					line-height: 19px;
					border-radius: 50%;
					color: #000000;
					background-color:#c0c6ca;
				}
			}
		}
	}
</style>
