<template lang="pug">
	.notice
		.notice__list
			transition-group(name="fade-select")
				.notice__item.g-p_2.g-pr_5(v-for="(message, index) in messages", :key="`tooltip-${message.id}`" :class="{'notice__item_err': error}")
					.notice__close.g-p_2.g-cr_p(@click="removeMessage(index)")
						svg-inline(src="/icons/close.svg")
					.notice__text.h3.g-mb_0(v-html="message.mess")

</template>

<script>
	export default {
		watch: {
			messages(val) {
				if (!val.length) {
					clearTimeout(this.timeout);
					this.visible = false;
				} else {
					clearTimeout(this.timeout);
					this.timeout = setTimeout(() => this.closeAll(), 7000);
				}
			},
			'$route' (to, from) {
				// this.closeAll();
			},
			authState() {
				this.closeAll();
			}
		},
		data() {
			return {
				visible: false,
				error: false,
				messages: [],
				hiddenMessages: [],
				timeout: null,
				count: 0
			}
		},
		created() {
			window.events.$on('flash', this.showMessages);
		},
		beforeDestroy() {
			window.events.$off('flash', this.showMessages);
		},
		methods: {
			showMessages([messages, type]) {
				if (type == 'error') this.error = true;
				else this.error = false;
	
				messages.map(mess => this.messages.push({
					mess: mess,
					id: `f${(+new Date).toString(16)}`
				}));

				if (this.messages.length) this.visible = true;
			},
			removeMessage(index) {
				this.$delete(this.messages, index);
			},
			closeAll() {
				this.$delete(this.messages, 0);
				if (!this.messages.length) {
					this.messages = [];
					this.error = false;
				}
			}
		},
		computed: {
			authState() {
				return this.$store.state.user.authenticated;
			}
		}
	}
</script>

<style lang="scss">
	
	.fade-select-enter-active,
	.fade-select-leave-active {
		transition: all .5s ease;
		transform: translateY(0) perspective(0) rotateX(0);
		transform-origin: top center;
	}
	
	.fade-select-enter {
		opacity: 0;
		transform: translateY(100px) perspective(150px) rotateX(20deg);
		transform-origin: top center;
	}
	
	.fade-select-leave-to {
		opacity: 0;
		transform: translateY(100px) perspective(150px) rotateX(-20deg);
		transform-origin: top center;
	}
</style>
