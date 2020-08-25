<template lang="pug">

    article.content

        h1 Индивидуальный инвестиционный счёт
        .g-row
            .g-col.g-col_lg_8.g-col_md_7
                section.strategy-page__section.g-mb_6.g-bgrclr_blue.g-p_2.g-ptb_4.g-br_1
                    p Индивидуальный инвестиционный счет - персональный счет доверительного управления, который предназначен для обособленного учета денежных средств и ценных бумаг Клиента
                    p
                        router-link(:to="{name:'duStrategies'}" class="btn btn_primary") Выбрать стратегии ИИС
            aside.g-col.g-col_lg_3.g-col.g-col_md_5.g-hide_xs.manager_aside_us
                .manager
                    .g-row.g-row_narrow
                        .manager__image.g-col.g-col_xs_3.g-col_md_4
                            figure.manager__img.manager__img_2()
                        .manager__info.g-col.g-col_xs_9.g-col_md_8
                            .manager__row.manager__name.h4 Получить консультацию
                            .manager__row.manager__phone
                                a(href="tel:88002009058") 8 (800) 200-90-58
                            .manager__email
                                a(href="mailto:support@am-uralsib.ru") support@am-uralsib.ru
        section.strategy-page__section.g-mb_6.g-col_lg_8
            h2 Особенности ИИС
            ul
                li Низкий порог входа;
                li Открыть ИИС может физическое лицо, являющееся налоговым резидентом РФ;
                li Физическое лицо вправе иметь только один договор на ведение ИИС;
                li Вносить на ИИС можно только рубли, максимальный взнос 1 млн. рублей в год;
                li Частичный или полный вывод средств (в т. ч. полученной прибыли) до истечения 3-х лет с даты открытия ИИС означает досрочное расторжение договора на ведение; ИИС и лишает права на получение налоговых вычетов.
        section.strategy-page__section.g-mb_6
            h2 Как это работает?
            ol.g-row.g-ta_c.list-numb-big
                li.g-col.g-col_md_4.g-mb_3 Открываете индивидуальный инвестиционный счет (ИИС) и вносите на счёт от 200 тыс.Р до 1 млн. Р
                li.g-col.g-col_md_4.g-mb_3 Ваши денежные средства используются для приобретения ценных бумаг согласно выбранной стратегии
                li.g-col.g-col_md_4.g-mb_3 Вы получаете инвестиционный доход от управления средствами и налоговый вычет от государства.
        section.strategy-page__section.g-mb_6
            h2 Вкладывая деньги в этот инструмент, #[br] Вы формируете финансовый результат из 3 показателей

            ul
                li Вложеннные деньги в ИИС
                li Результат от инвестирования
                li Налоговый вычет
                li Финансовый результат
        section.strategy-page__section.g-mb_6
            h2 Типы налогового вычета
            h3 Существует 2 возможности получить налоговый вычет: (Совмещение двух типов вычетов НЕВОЗМОЖНО)
            ul.g-row.g-row_flex.iis-box
                li.g-col.g-col_md_6
                    .iis-box__item
                        h4 ИИС с вычетом на взносы (тип А)
                        p Получение налогового вычета 13% от суммы внесенных средств (но не более 52 тысяч в год), т.е. максимальная сумма внесенных средств за год, по которой будет рассчитан налоговый вычет, составляет 400 тыс. руб.
                li.g-col.g-col_md_6
                    .iis-box__item
                        h4 ИИС с вычетом на доходы (тип Б)
                        p Освобождение от уплаты налогов на доходы, полученных от инвестирования.
            p
                | Выбрать можно #[strong только один тип вычета] (А или Б).
                br
                | Решение в пользу того или иного можно #[strong принять в течение 3-х лет], чтобы оценить какой из них выгоднее.
            p Если инвестор #[strong уже получил вычет] на взносы за первый год, то поменять тип вычета на данном ИИС нельзя.
            p Для получения вычета на взнос необходимо иметь официальный доход, облагаемый по ставке 13%

        section.strategy-page__section.g-mb_6
            h2 Для открытия ИИС
            ul.g-mb_4
                li Изучите наши готовые инвестиционные стратегии
                li Ознакомьтесь с уведомлением о рисках, связанных с осуществлением операций на рынке ценных бумаг
                li Ответьте на вопросы нашей Анкеты с целью определения инвестиционного профиля
                li Вам будет предложены наиболее подходящие вашему инвестиционному профилю стратегии
                li Выберите одну из предложенных стратегий
            p: router-link(:to="{name:'duQuestionary'}" class="btn btn_primary") Узнать инвест профиль

        section.strategy-page__section.g-mb_6
            h2 Консультационная поддержка
            p Менеджеры УК УРАЛСИБ предоставят необходимую поддержку и помощь в оформлении документов по налоговому вычету.
            button(type="button" @click.prevent="showPopup" class="btn btn_secondary") Помощь консультанта




</template>

<script>
    export default {
        methods: {
            showPopup() {
                window.events.$emit('show_popup', 'contact');
            }
        },
        created() {
            this.$store.commit('mainClass', 'g-ai_fs');
        }
    }
</script>

<style lang="scss">
    @import "../../assets/styles/vars";
    .list-numb-big{
        list-style-type:none;
        counter-reset: list;
        padding:0;
        li {
            &:before{
                counter-increment: list;
                content: counter(list);
                display:block;
                border-radius:50%;
                border:1px solid $clr_primary;
                margin:0 auto .5em;
                $sz:2em;
                font-size:$sz;
                min-width:$sz;
                width:$sz;
                height:$sz;
                line-height:$sz;
                text-align:center;
            }

        }
    }
    .iis-box {
        list-style-type:none;
        margin:0;
        padding:0;

        margin-bottom:nth($m_em,5);
        li {margin-bottom:nth($m_em,2)}
        &__item {
            @include box-decor(1,0,0);
            padding:nth($m_em,4) nth($m_em,4) nth($m_em,3);

            text-align:center;
            height: 100%;
        }
    }
</style>

