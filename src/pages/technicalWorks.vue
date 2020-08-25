<template lang="pug">
	.page.g-ta_c.typo
		.b-title-404
			h1
				| В настоящий момент в  "Личном Кабинете Клиента" не доступен сервис регистрации и входа через портал Госуслуги.ру.
			h2
				| Ведутся работы по устранению данного сбоя.
			h2
				| Приносим свои извинения за временные неудобства.
		button.btn(@click="showPopup", class="btn btn_primary") Получить консультацию
</template>
<script>
	export default {
		methods: {
			showPopup() {
				window.events.$emit('show_popup', ['contact', {
				}]);
			}
		},
	}
</script>

<style lang="scss">
	h1,
	h2 {
		margin-bottom: 15px;
	}
</style>

