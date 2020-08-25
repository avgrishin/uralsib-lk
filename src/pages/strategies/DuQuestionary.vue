<template lang="pug">

    article.content
        h1.h2 Анкета для определения инвестиционного портфеля Клиента
        section.page-section.g-col_md_8
            form.du-questionary-form.g-mb_6
                .h3 {{step}}/{{count}}
                fieldset.g-mb_4(v-show="1 == step")
                    legend.h3 1. Ваш возраст
                    .radio-list_du.radio-list_inline
                        each v,k in ['До 30','30-40','40-50','50-60','Старше 60']
                            .radio
                                input(type="radio", v-model="q1" value=k name="QU_1", id="QU_1" + k)
                                label(for="QU_1" + k)=v
                fieldset.g-mb_4(v-show="2 == step")
                    legend.h3 2. Опишите свое отношение к инвестициям
                    .radio-list_du.radio-list
                        each v,k in ['Для меня крайне важна сохранность моих вложений','Сохранность вложений для меня важнее доходности','Доходность не менее важна, чем сохранность','Доходность важнее, чем сохранность (не рискуя, невозможно заработать)','Высокая доходность – главное, даже ценой риска']
                            .radio
                                input(type="radio", v-model="q2" value=k name="QU_2", id="QU_2_" + k)
                                label(for="QU_2_" + k)=v
                fieldset.g-mb_4(v-show="3 == step")
                    legend.h3 3. На какой срок Вы готовы инвестировать?
                    .radio-list_du.radio-list_inline
                        each v,k in ['До 1 года','1-2 года','2-3 года','3-5 лет','От 5 лет']
                            .radio
                                input(type="radio", v-model="q3" value=k name="QU_3", id="QU_3_" + k)
                                label(for="QU_3_" + k)=v
                fieldset.g-mb_4(v-show="4 == step")
                    legend.h3 4. Есть ли у вас знания в области инвестирования, какими инструментами #[br] Вы уже пользовались?
                    .radio-list_du.radio-list
                        each v,k in ['Ранее не инвестировал','Банковские вклады','Страхование жизни, пенсионные фонды','Паевые фонды, доверительное управление, металлические счета, брокерские счета','Самостоятельная активная торговля ценными бумагами, FOREX']
                            .radio
                                input(type="radio", v-model="q4" value=k name="QU_4", id="QU_4_" + k)
                                label(for="QU_4_" + k)=v
                fieldset.g-mb_4(v-show="5 == step")
                    legend.h3 5. На какой среднегодовой рост Ваших инвестиций Вы рассчитываете?
                    .radio-list_du.radio-list
                        each v,k in ['РДо 10% годовых в российских рублях/2% годовых в иностранной валюте','До 15% годовых в российских рублях/5% годовых в иностранной валюте','До 20% годовых в российских рублях/10% годовых в иностранной валюте','До 25% годовых в российских рублях/15% годовых в иностранной валюте','Свыше 25% годовых в российских рублях/15% годовых в иностранной валюте']
                            .radio
                                input(type="radio", v-model="q5" value=k name="QU_5", id="QU_5_" + k)
                                label(for="QU_5_" + k)=v
                fieldset.g-mb_4(v-show="6 == step")
                    legend.h3 6. На какой среднегодовой рост Ваших инвестиций Вы рассчитываете?
                    .radio-list_du.radio-list
                        each v,k in ['РДо 10% годовых в российских рублях/2% годовых в иностранной валюте','До 15% годовых в российских рублях/5% годовых в иностранной валюте','До 20% годовых в российских рублях/10% годовых в иностранной валюте','До 25% годовых в российских рублях/15% годовых в иностранной валюте','Свыше 25% годовых в российских рублях/15% годовых в иностранной валюте']
                            .radio
                                input(type="radio", v-model="q6" value=k name="QU_6", id="QU_6_" + k)
                                label(for="QU_6_" + k)=v
                fieldset.g-mb_4(v-show="7 == step")
                    legend.h3 7. В какой валюте Вы рассчитываете получить доход?
                    .radio-list_du.radio-list
                        each v,k in ['В российских рублях','В иностранной валюте']
                            .radio
                                input(type="radio", v-model="q7" value=k name="QU_7", id="QU_7_" + k)
                                label(for="QU_7_" + k)=v
                fieldset.g-mb_4(v-show="8 == step")
                    legend.h3 8. При снижении стоимости Ваших инвестиций ниже приемлемого уровня Вы…
                    .radio-list_du.radio-list
                        each v,k in ['Немедленно выведете все деньги в наличные или депозиты','Выведете половину денег в наличные или депозиты','Подождете 3-6 месяцев, и если ситуация не улучшится, будете действовать','Ничего не предпримете, поскольку бывают плохие и хорошие периоды','Инвестируете еще, воспользовавшись низкими ценами']
                            .radio
                                input(type="radio", v-model="q8" value=k name="QU_8", id="QU_8_" + k)
                                label(for="QU_8_" + k)=v
                fieldset.g-mb_4(v-show="9 == step")
                    legend.h3 9. Планируете ли Вы выводить существенную часть денег (больше 20%)?
                    .radio-list_du.radio-list
                        each v,k in ['Да, примерно раз в 3-6 месяцев','Да, примерно раз 6-12 месяце','Да, примерно раз год-полтора','Не планирую, но такое возможно','Не планирую']
                            .radio
                                input(type="radio", v-model="q9" value=k name="QU_9", id="QU_9_" + k)
                                label(for="QU_9_" + k)=v
                fieldset.g-mb_4(v-show="10 == step")
                    legend.h3 10. Ваш примерный среднемесячный доход за последние 12 месяцев
                    .radio-list_du.radio-list
                        each v,k in ['До 500 000 рублей','Свыше 500 000 рублей']
                            .radio
                                input(type="radio", v-model="q10" value=k name="QU_10", id="QU_10_" + k)
                                label(for="QU_10_" + k)=v
                fieldset.g-mb_4(v-show="11 == step")
                    legend.h3 11. Как Ваши среднемесячные доходы соотносятся со среднемесячными расходами за последние 12 месяцев
                    .radio-list_du.radio-list
                        each v,k in ['Доходы превышают расходы более, чем на 80%','Доходы превышают расходы более, чем на 50%','Доходы превышают расходы менее, чем на 50%','Доходы соответствуют расходам','Расходы превышают доходы']
                            .radio
                                input(type="radio", v-model="q11" value=k name="QU_11", id="QU_11_" + k)
                                label(for="QU_11_" + k)=v
                fieldset.g-mb_4(v-show="12 == step")
                    legend.h3 12. Примерный объем Ваших сбережений
                    .radio-list_du.radio-list
                        each v,k in ['До 1 миллиона рублей','От 1 миллиона до 3 миллионов рублей','От 3 миллионов до 10 миллионов рублей','От 10 миллионов до 30 миллионов рублей','Свыше 30 миллионов рублей']
                            .radio
                                input(type="radio", v-model="q12" value=k name="QU_12", id="QU_12_" + k)
                                label(for="QU_12_" + k)=v
                fieldset.g-mb_4(v-show="13 == step")
                    legend.h3 13. Какую часть своих сбережений Вы планируете инвестировать?
                    .radio-list_du.radio-list
                        each v,k in ['Активы, передаваемые в доверительное управление, составляют не более 5 % от сбережений','Активы, передаваемые в доверительное управление, составляют не более 10 % от сбережений','Активы, передаваемые в доверительное управление, составляют не более 25% от сбережений','Активы, передаваемые в доверительное управление, составляют не более 50% от сбережений','Активы, передаваемые в доверительное управление, составляют более 50% от сбережений']
                            .radio
                                input(type="radio", v-model="q13" value=k name="QU_13", id="QU_13_" + k)
                                label(for="QU_13_" + k)=v
                .btn.btn_primary(@click="nav()" v-show="step < count") Следующий
                input.btn.btn_primary(type="button",value="Ваш инвестиционный профиль" v-show="step == count", @click="appropriated++")
            form.risk-result(v-if="appropriated")
                .h3 Вам присвоен:
                p Риск профиль - умеренный (средний риск, средняя доходность)
                p
                    small Если Вы согласны с присвоенным Вам риск-профилем, подпишите #[br]
                    a(href="#" title="Скачать в pdf" @click.prevent="pdfActions('download')")
                        small Соглашение о выборе риск-профиля
                    span.icon.icon_file_pdf.g-va_m.g-ml_1

                p.g-d_f
                    button(type="button").btn.btn_o.g-mr_2.g-mb_2_xs.g-mr_0_xs Пройти риск профиль снова
                    button(type="submit").btn.btn_primary Подписать
</template>
<script>
    export default {
        data(){
            return {
                count: 13,
                step: 1,
                btnNext: true,
                appropriated: false,
                q1: false,
                q2: false,
                q3: false,
                q4: false,
                q5: false,
                q6: false,
                q7: false,
                q8: false,
                q9: false,
                q10: false,
                q11: false,
                q12: false,
                q13: false,
            }
        },
        methods: {
            nav(){
                this.step++;
                if (this.count == this.step) {
                    this.btnNext = false;
                }

            }
        }
    }

</script>

