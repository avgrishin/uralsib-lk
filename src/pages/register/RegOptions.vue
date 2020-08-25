<template lang="pug">
	article.content.content_reg.g-pt_4_xs.content-register(v-if="newTemplate")

		h1.content-header Регистрация
		h3 Уважаемые клиенты!
		.g-row.g-mb_3
			p.g-col.g-col_11.g-col_md_12
				b Управляющая компания УРАЛСИБ предоставляет уникальную возможность зарегистрироваться в Личном кабинете без посещения офиса компании. Любые операции, оплата картой и ежедневная отчетность. Вам потребуется лишь подтверждённая учётная запись на сайте Госуслуги.ру
			p.g-col: a(href="https://www.uralsib-am.ru/how-to-buy/online/" target="_blank") Онлайн-покупка паев без визита в офис
		.g-mb_2.g-mb_2_xs.g-pl_0
			.g-row.g-row_flex
				//- .g-col.g-col_md_6.g-mb_4
				//-     router-link(to="/register/contact").b-login.b-login_site
				//-         h2.b-login__caption Online на сайте
				//-         p.b-login__text
				//-             span.b-login__subcaption.g-fw_4.g-d_b Потребуются:
				//-             | Паспортные данные,
				//-             br
				//-             | СНИЛС, ИНН
				.g-col.g-col_md_6.g-mb_2
					a(href="#" @click.prevent="esia()").b-login.b-login_gu.js-click-datalayer
						h2.b-login__caption.g-mb_3 Через сайт Госуслуги.ру
						p.b-login__text
							span.b-login__subcaption.g-fw_4.g-d_b  Потребуется:
							| Учётная запись
							br
							| на сайте Госуслуги.ру
						.g-pt_1
							button.btn.btn_primary.btn_block(type='button') Регистрация

		.g-row.g-mb_0.g-pl_0
			.g-col.g-col_md_6
				router-link(to="/",class="btn btn_block btn_login g-ta_l") Вход в Личный кабинет
		.g-row.g-pt_3.g-mb_0.g-pl_0
			.g-col.g-col_md_6
				button.btn.btn_secondary.btn_block.btn_help(@click.prevent="showPopup('pixel')") Помощь консультанта

		hr.g-mt_2.g-pl_0
		.g-row.g-row_flex.g-pl_0
			.g-col.g-col_md_6
				div
					span.icon.icon_question
					router-link(to="/help") Помощь
			.g-col.g-col_md_6
				div
					span.icon.icon_comment
					a(href="javascript:" @click.prevent="showPopup") Форма обратной связи



	article.content.content_reg.g-pt_4_xs(v-else)
		h1 Регистрация
		.g-mb_2.g-mb_0_xs
			.g-row.g-row_flex
				.g-col.g-col_md_6.g-mb_4
					//-router-link(:to="{name: 'technicalWorks'}").b-login.b-login_site
					router-link(to="/register/contact" data-action="register" data-label="online").b-login.b-login_site.js-click-datalayer
						h2.b-login__captiont.g-mb_3 Online на сайте
						p.b-login__mark Только для новых клиентов
						p.b-login__text
							span.b-login__subcaption.g-fw_4.g-d_b Потребуются:
							| Паспортные данные,
							br
							| СНИЛС, ИНН
				.g-col.g-col_md_6.g-mb_4
					a(href="#" @click.prevent="esia()" data-action="register" data-label="GOV").b-login.b-login_gu.js-click-datalayer
						//router-link(:to="{name: 'technicalWorks'}").b-login.b-login_gu TODO удалить после завершения тех.работ
						h2.b-login__caption.g-mb_3 Через сайт Госуслуги.ру
						p.b-login__text
							span.b-login__subcaption.g-fw_4.g-d_b  Потребуется:
							| Учётная запись
							br
							| на сайте Госуслуги.ру
		//- p.g-ta_c.g-ta_l_xs.g-mb_2
		//- 	| В связи с проведением технических работ 30 июля в информационном сервисе «Личный Кабинет Клиента» регистрация пользователей Онлайн на сайте через СМЭВ будет временно недоступна. 
		//- 	br
		//- 	| При наличии подтвержденной учетной записи регистрацию можно пройти на портале Госуслуги.ру.
		//- 	br
		//- 	br
		//- 	| С уважением,
		//- 	br
		//- 	| УК УРАЛСИБ			
		p.g-ta_c.g-ta_l_xs.g-mb_0
			| Если у Вас уже есть логин, но Вы не завершили оформление анкеты, #[br] можете продолжить её заполнение после #[router-link(to="/") Авторизации]
		.g-row.g-pt_5.g-mb_0
			.g-col.g-col_md_6
				router-link(to="/",class="btn btn_primary btn_block g-mb_4_xs") Вход в Личный кабинет
			.g-col.g-col_md_6
				button.btn.btn_secondary.btn_block.js-click-datalayer(data-action="openForm" data-label="Помощь консультанта" @click.prevent="showPopup('pixel')") Помощь консультанта

</template>

<script>

	export default {
		data() {
			return {
				newTemplate: false
			}
		},
		created() {
			if(window.location.href.indexOf("?online") > -1) {
				this.newTemplate = false
			}
		},
		methods: {
			showPopup(type) {
				window.events.$emit('show_popup', ['contact', {
					pixel: type === 'pixel'
				}]);
			}
		},
		beforeRouteEnter (to, from, next) {
			next();
		}
	}
</script>
