<template lang="pug">
	article.content
		.g-d_f.g-jc_sb
			h1() Помощь
			b-search.g-ml_6.g-flex_1.g-mt_1_m.g-ml_1_xs(v-if="0")
		div
			.g-row
				.g-col.g-col_lg_8.g-mb_6.g-mb_2_xs
					.nav-page.js-nav-page_help.g-pt_0.g-mb_0(:class="{'nav-page_open': pageNavOpen }")
						.nav-page__wrap
							span.nav-page__arrow.g-hidden.g-show_xs
								span.g-icon-down(@click.prevent="togglePageNav", :class="{'g-icon-down_open': pageNavOpen }")
							.nav-page__title(data-text="Меню", @click.prevent="togglePageNav")
							ul.nav-page__list.g-plain
								li.nav-page__item(v-if="1" @click.prevent="togglePageNav" data-href="#tab_2" @click="current_tab = 1" :class="{'nav-page__item_active': current_tab == 1}")
									button.nav-page__link.g-btn-txt Инструкции
								li.nav-page__item(@click.prevent="togglePageNav" data-href="#tab_1" @click="current_tab = 0" :class="{'nav-page__item_active': current_tab == 0}")
									button.nav-page__link.g-btn-txt Вопросы и ответы

								li.nav-page__item(v-if="0", @click.prevent="togglePageNav" data-href="#tab_3" @click="current_tab = 2" :class="{'nav-page__item_active': current_tab == 2}")
									button.nav-page__link.g-btn-txt Правила пользования
			.g-row
				.g-col.g-col_lg_8
					#tab_2.js-tabs__item(v-show="current_tab == 1"  :class="{active: current_tab == 1}")
						b-collapse(v-for="item in instructions",:key="item.id",:item="item" :fireGTMEvents="true")
					#tab_1.js-tabs__item(v-show="current_tab == 0"  :class="{active: current_tab == 0}")
						b-collapse(v-for="item in faq",:key="item.id",:item="item")
					#tab_3.js-tabs__item(v-show="current_tab == 2"  :class="{active: current_tab == 2}")
						ul.g-plain
							li.g-mb_2
								a(href="#").btn.btn_file.btn_o
									| Правила пользования #[span.g-fw_3 (70КБ)]
									span(title="pdf").icon.icon_file_pdf.g-fr
							li.g-mb_2
								a(@click.prevent="downloadForm" download="#").btn.btn_file.btn_o
									| Анкета клиента #[span.g-fw_3 (70КБ)]
									span(title="pdf").icon.icon_file_pdf.g-fr
							li.g-mb_2
								a(href="#").btn.btn_file.btn_o
									| Заявление на открытие счета в реестре #[span.g-fw_3 (70КБ)]
									span(title="pdf").icon.icon_file_pdf.g-fr
							li.g-mb_2
								a(@click.prevent="downloadDoc('/docs/RiskNotationPdf', 'risks')" href="#").btn.btn_file.btn_o
									| Уведомление о рисках #[span.g-fw_3 (70КБ)]
									span(title="pdf").icon.icon_file_pdf.g-fr


</template>


<script>
	export default {
		data() {
			return {
				pageNavOpen: false,
				faq: [
					{
						id: 1,
						name: ' Как получить доступ к системе?',
						content:  `
						<p>Для получения доступа необходимо обратиться в ближайшее отделение ПАО «БАНК УРАЛСИБ» (адрес ближайшего отделения можно уточнить по ссылке <a href="https://www.uralsib-am.ru/about/contacts/offices/russia/" target="_blank">https://www.uralsib-am.ru/about/contacts/offices/russia/</a>), в котором осуществляется обслуживание клиентов по операциям с паями ПИФов под управлением АО «УК УРАЛСИБ», где необходимо заполнить и подписать Заявление на подключение. В этом помогут сотрудники ПАО «БАНК УРАЛСИБ». После обработки заявления на адрес электронной почты будет направлено уведомление с временным («техническим») паролем. Срок действия «технического» пароля ограничен 24-мя часами, таким образом в течение 24-х часов необходимо войти в систему и изменить пароль с временного на постоянный.</p>
						<p>Регистрация Пользователя в Системе может быть выполнена без личной явки с использованием сети Интернет:<br>
                         - при помощи подтвержденной учетной записи портала «Госуслуги» (для существующих и новых клиентов);<br>
                         - заполнив онлайн форму регистрации (потребуется предоставить данные паспорта, ИНН или СНИЛС) - только для новых клиентов, не имеющих подтвержденной учетной записи на портале «Госуслуги».
                        </p>
                        <p>При регистрации в Системе Пользователь выражает свое согласие с настоящими Правилами и Соглашением об электронном документообороте, а также предоставляет право Управляющей компании на обработку персональных данных. Согласие предоставляется в виде ввода кода из СМС-сообщения, направленного системой при осуществлении регистрационных действий. Пользователь обязуется поддерживать информацию, содержащуюся в Анкете, в актуальном состоянии.</p>
                        `,
						isActive: true
					},
					{
						id: 2,
						name: ' Я не успел войти в систему в течение 24-х часов после получения уведомления о подключении. Что мне делать?',
						content: 'Заполните «Форму обратной связи» на титульной станице <a href="https://i.am-uralsib.ru/" target="_blank">https://i.am-uralsib.ru/</a> или  напишите по электронной почте письмо с того почтового ящика, который был указан в качестве логина в систему, на адрес <a href="mailto:support@am-uralsib.ru">support@am-uralsib.ru</a>. После обработки запроса будет выслано уведомление с новым «техническим» паролем.',
						isActive: false
					},
					{
						id: 3,
						name: ' Какие требования предъявляются к постоянному паролю?',
						content: 'Пароль должен содержать буквы, цифры и как минимум один специальный символ – знак препинания или иной знак, не являющийся цифрой или буквой (за исключением символов "<", ">").',
						isActive: false
					},
					{
						id: 4,
						name: ' Я забыл пароль. Что мне делать?',
						content:
                        `
                        <p>Если Вы забыли пароль, воспользуйтесь, функцией Восстановления пароля. Нажмите ссылку «Забыли пароль?» на титульной странице <a href="https://i.am-uralsib.ru/" target="_blank">https://i.am-uralsib.ru/</a></p>
                        <p>В строке Восстановление пароля введите ваш еmail, указанный в качестве Логина при подключении Личного кабинета. На указанный e-mail будет направлено письмо с ссылкой, по которой Вам будет необходимо перейти в Личный кабинет и ввести новый пароль.</p>
                        <p>Обращаем Ваше внимание, что срок действия ссылки 2 часа.</p>
                        `,
						isActive: false
					},
					{
						id: 5,
						name: ' "Как рассчитывается показатель "доходность" в формируемых отчетах по Договорам доверительного управления, в т.ч. на ведение индивидуального инвестиционного счета?',
						content: 'Показатель "доходность" рассчитывается по методике TWR (Time-Weighted Return). Данный показатель означает относительный прирост (знак "плюс")/уменьшение (знак "минус") стоимости портфеля за рассматриваемый период. Показатель рассчитывается на ежедневной основе. Для получения показателя за период времени доходности "суммируются" путём перемножения доходностей за каждый день, входящий в рассматриваемый период.',
						isActive: false
					},
					{
						id: 6,
						name: ' Я совершил операцию приобретения/обмена/погашения, но в ЛКК нет изменений количества паев в портфеле. Где посмотреть историю операций?',
						content: 'После оформления операции по заявкам на приобретение, обмен или погашение паев данные по операции отражаются в режиме онлайн в разделе Портфель-Документы-Заявки. После исполнения операций приобретения/обмена/погашения в реестре статус операции будет отражен в разделе Портфель – История операций. ',
						isActive: false
					},
					{
						id: 7,
						name: ' У меня изменился адрес электронной почты (email), как изменить собственный логин в Личном кабинете?',
						content: 'Сменить логин в Личном кабинете клиента возможно только в отделении ПАО "БАНК УРАЛСИБ" или в пункте приема заявок АО "УК УРАЛСИБ" при личном визите. Для изменения логина необходимо оформить заявление на смену логина. Адрес ближайшего отделения можно уточнить по ссылке <a href="https://www.uralsib-am.ru/about/contacts/offices/russia/" target="_blank">https://www.uralsib-am.ru/about/contacts/offices/russia/</a>',
						isActive: false
					},
					{
						id: 8,
						name: ' Что делать если не поступает смс для подтверждения операции?',
						content:
                        `
                        <ol>
                            <li>Необходимо повторить попытку и заново отправить СМС-код при подтверждении операции. Для этого необходимо выбрать кнопку «Отправить СМС повторно»</li>
                            <li>В случае, если при повторном запросе пароля СМС не поступило, необходимо создать обращение и отправить на адрес технической поддержки <a href="mailto:support@am-uralsib.ru">support@am-uralsib.ru</a> или заполнить «Форму обратной связи» на титульной станице <a href="https://i.am-uralsib.ru/" target="_blank">https://i.am-uralsib.ru/</a> </li>
                        </ol>
                        `
                        ,
						isActive: false
					},
					{
						id: 9,
						name: ' Я не входил в КК, но ко мне поступает смс о входе. Что делать?',
						content:
                        `
                            <p>В случае подозрения на несанкционированный вход необходимо сменить пароль. Изменение пароля возможно произвести следующими способами:</p>
                            <ol>
                                <li>На стартовой страничке Личного кабинета клиента <a href="https://i.am-uralsib.ru" target="_blank">https://i.am-uralsib.ru</a> кликнуть по ссылке «Забыли пароль» и перейти на страничку сброса/восстановления пароля <a href="https://i.am-uralsib.ru/#/recover" target="_blank">https://i.am-uralsib.ru/#/recover</a>. Далее необходимо указать Ваш Email адрес, используемый в качестве Логина и нажать «Далее». На почту будет отправлено письмо с инструкцией о дальнейших действиях. </li>
                                <li>Находясь в Личном кабинете клиента, кликнув в правом верхнем углу на ФИО Пользователя, выбрать в меню «Изменение пароля» и следовать дальнейшим инструкциям. </li>
                            </ol>
                        `
                        ,
						isActive: false
					},
					{
						id: 10,
						name: ' Как часто нужно актуализировать анкетные данные?',
						content: 'Актуализацию данных необходимо производить не реже одного раза в год.',
						isActive: false
					},
					{
						id: 11,
						name: ' Могу ли я получить справку 2 - НДФЛ через ЛКК. Если да, то в какие сроки?',
						content: 'Справки 2-НДФЛ отправляются заказными письмами клиентам ежегодно в марте-апреле по факту их готовности. В случае если Вам необходимо получить справку 2-НДФЛ в иные сроки, необходимо написать на адрес <a href="mailto:support@am-uralsib.ru">support@am-uralsib.ru</a> - письмо будет переадресовано специалисту, отвечающему за данные документы. Отражение справок 2-НДФЛ в Личном кабинете клиента не реализовано в настоящее время. ',
						isActive: false
					},

				],
				instructions: [
					{
						id: 1,
						name: 'Регистрация Госуслуги',
						content: '<a target="_blank" href="/downloads/instructions/Регистрация Госуслуги.pdf">Скачать (842кб)</a>',

						isActive: true
					},
					{
						id:2,
						name: 'Регистрация СМЭВ',
						content: '<a target="_blank" href="/downloads/instructions/Регистрация_СМЭВ.pdf">Скачать (788кб)</a>',
						isActive: true
					},
					{
						id:3,
						name: 'Заполнение анкеты',
						content: '<a target="_blank" href="/downloads/instructions/Заполнение анкеты в личном кабинете.pdf">Скачать (972кб)</a>',
						isActive: true
					},
					{
						id: 4,
						name: 'Восстановление пароля',
						content: '<a target="_blank" href="/downloads/instructions/Восстановление пароля в личном кабинете.pdf">Скачать (837кб)</a>',
						isActive: true
					},
					{
						id:5,
						name: 'Приобретение паев',
						content: '<a target="_blank" href="/downloads/instructions/Приобретение паев.pdf">Скачать (1.375мб)</a>',
						isActive: true
					},
					{
						id:6,
						name: 'Оформление Договора ДУ',
						content: '<a target="_blank" href="/downloads/instructions/Оформление Договора ДУ ИИС.pdf">Скачать (584кб)</a>',
						isActive: true
					},
                    {
                        id:7,
                        name: 'Обмен паев',
                        content: '<a target="_blank" href="/downloads/instructions/Обмен паев.pdf">Скачать (584кб)</a>',
                        isActive: true
                    },
                    {
                        id:8,
                        name: 'Изменение анкетных данных',
                        content: '<a target="_blank" href="/downloads/instructions/Изменение анкетных данных.pdf">Скачать (584кб)</a>',
                        isActive: true
                    }
				],
				rules: [],

				current_tab: 1,
				disableDownload: false
			}
		},
		mounted() {
			this.makeEvents();
		},
		methods: {
			makeEvents() {
				document.addEventListener('click', (event) => {
					if (!event.target.matches('.js-nav-page_help, .js-nav-page_help *')) this.pageNavOpen = false;
				});
			},
			togglePageNav() {
				this.pageNavOpen = !this.pageNavOpen;
			},
			downloadForm() {
				if (this.disableDownload) return;

				this.disableDownload = true;

				axios.get('/ClientProfileApp').then(({data}) => {
					let id = Math.max.apply(Math, data.map(item => item.applicationId));

					this.downloadFile(`/ClientProfileApp/${id}/pdf`, 'анкета.pdf');
				});
			},
			downloadDoc(url, name) {
				this.downloadFile(url, `${name}.pdf`);
			}
		}
	}
</script>

