<template lang="pug">
	header(:class="authState ? 'header' : 'header header_notauth'")
		.g-pr
			.header__top
				.g-grid
					.header__inner.g-row.g-row_ib.g-row_ib_m
						.g-col.g-col_md_5.g-col_xs_4
							.header__logo.g-mt_0_xs
								router-link(to="/").g-bbc_t.g-d_b
									svg-inline(src="/logo_text.svg")
									svg-inline.svg_xs(src="/us_logo_small.svg")
								.du-reset(v-if="devMode && $route.query.duReset" @click="clearDU_SMEV_TEST")
									span.nav__text.g-fw_7 DU RESET
						.g-col.g-hide_md.g-hide_lg.g-col_xs_4.g-ta_c_xs.g-show_ib_xs.hide_noauth
							span.nav__text.g-fw_7(v-html="casePrice")
						.g-col.g-col_md_7.g-col_xs_4.g-f_r.g-f_n_xs(v-if="authState")
							app-navuser(@toggleUserMenu="toggleUserMenu" :menuState="menuExpanded")
						template(v-else)
							p.g-col.g-col_md_6.g-col_xs_4.g-f_n_xs.header__phones.g-pt_0_xs
								a(href="tel:84957237674").header__phone.h3.g-ws_nw 8 (495) 723 76 74
								br.g-hidden
								a(href="tel:88002009058").header__phone.h3.g-ws_nw.g-ml_6.g-hide_xs 8 (800) 200 90 58 #[small (бесплатно)]
		.header-menu(:class="{'header-menu_show': menuExpanded }" v-if="authState")
			user-menu(@close="closeUserMenu")
		.header__nav(v-if="authState")
			app-navmain
</template>

<script>
	import NavMain from './NavMain.vue'
	import NavUser from './NavUser.vue'
	import UserMenu from './UserMenu';
	const proc = process.env

	export default {
		components: {
			'app-navmain': NavMain,
			'app-navuser': NavUser,
			UserMenu
		},
		watch: {
			authState(val){
				if(typeof ga !== "undefined" && !val) {
					this.$ga.event('event', 'lk', 'pageview', 'lk'); //google цели
				}
				if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('lk')};
			},
			'$route' (to, from) {
				this.menuExpanded = false;
				document.querySelector('.site').classList.remove('site_overlay');
			}
		},
		data() {
			return {
				menuExpanded: false,
			}
		},
		mounted() {
			this.makeEvents();

		},
		beforeDestroy() {
			document.removeEventListener('click', this.clickEvents);
		},
		methods: {
			clearDU_SMEV_TEST() {
				if (!this.devMode) return;
				axios.post('amcontracts/clearDU').then(() => {
					alert('Done!');
					location.reload();
				}).catch(() => {
					alert('Error!');
				})
			},
			toggleUserMenu() {
				this.menuExpanded = !this.menuExpanded;

				if (this.menuExpanded) {
					document.querySelector('.site').classList.add('site_overlay');
				} else {
					document.querySelector('.site').classList.remove('site_overlay');
				}

			},
			makeEvents() {
				document.addEventListener('click', this.clickEvents);
			},
			clickEvents(event) {
				// if (event.target.matches('.g-bbc_t.router-link-active')) {
				//     this.toggleUserMenu();
				// }
				if (!event.target.matches('.header, .header *')) {
					this.menuExpanded = false;
					document.querySelector('.site').classList.remove('site_overlay');
				}
			},
			closeUserMenu() {
				this.menuExpanded = false;
				document.querySelector('.site').classList.remove('site_overlay');
			}
		},
		computed: {
			devMode() {
				return proc.NODE_ENV === 'development';
			},
			authState() {
				return this.$store.state.user.authenticated && this.$store.state.user.state_loaded;
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
	.header__logo {
		position: relative;
		display: flex;
		align-items: center;
	}
	.header_notauth {
		.du-reset {
			color: #fff;
		}
	}
	
	.du-reset {
		position: absolute;
		color: #002250;
		right: 0;
		top: 0;
		bottom: 10px;
		display: flex;
		align-items: flex-end;
		cursor: pointer;
	}
</style>

