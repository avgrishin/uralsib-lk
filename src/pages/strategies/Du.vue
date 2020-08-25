<template lang="pug">

article.content.g-pt_0

    .g-row
        .g-col.g-col_lg_8.g-col_md_7
            h1 Доверительное управление
            section.page-section.g-mb_4_md
                .g-row.g-mb_2
                    .g-col.g-col_md_12
                        p Доверительное управление — это вид профессиональной финансовой деятельности, которое позволяет с максимальной эффективностью использовать возможности фондового рынка для размещения и управления свободными денежными средствами.
                .g-row.g-mb_6
                    .g-col.g-col_md_12
                        p В отличие от паевых инвестиционных фондов доверительное управление помимо готовых инвестиционных портфелей предлагает индивидуальные финансовые решения, настроенные в соответствии с персональными инвестиционными целями.
                        | Индивидуальные стратегии предоставляются при сумме активов от 10 млн рублей.
                .g-row
                    .g-col.g-col_md_12
                        p.h2.g-mb_3 Ключевые преимущества
                        ul
                            li.g-mb_4
                                p.g-fw_7.g-mb_2 Индивидуальный подход
                                p Вы определяете инвестиционные цели, горизонт инвестирования и свое отношение к риску – вам предоставляется доступ к широкому спектру инвестиционных продуктов и услуг.
                            li.g-mb_4
                                p.g-fw_7.g-mb_2 Профессиональное управление
                                p Вы доверяете свой капитал профессионалам с многолетним опытом работы на финансовых рынках.
                            li.g-mb_4
                                p.g-fw_7.g-mb_2 Прозрачность
                                p На ежеквартальной основе предоставляется детальный финансовый отчет о результатах управления вашим портфелем.
                .g-row.g-mb_4
                    .g-col.g-col_md_12
                        p Для того, чтобы подобрать наиболее подходящую стратегию и узнать об условиях инвестирования, Вы можете связаться с Клиентским менеджером и назначить персональную встречу.
                button.btn.btn_primary.du_btn(@click.prevent="showPopup") Связаться с клиентским менеджером
            section.page-section.g-bgrclr_blue.g-p_2.g-ptb_4.g-br_1(v-show="false")
                .g-row
                    .g-col.g-col_md_12
                        p Чтобы инвестиционный портфель не доставлял вам беспокойства и соответствовал вашей толерантности к риску, мы предлагаем вам пройти анкетирование, которое может занять не более 5 минут вашего времени.
                        p Для выбора оптимального набора стратегий определите ваш &nbsp;
                            button.g-btn-txt(@click.prevent="showPopup")
                                span.link риск - профиль.
                        p Для оформления договора доверительного управления вам необходимо пройти анкетирование и дать свое согласие на присвоение вам уникального профиля.
                        p
                            router-link(to="/" class="btn btn_primary") Пройти тестирование

                    .g-col.g-col_md_4(v-show="false")
                        img(src="" alt="kartinka" height="500px" width="100")
            section.page-section(v-show="false")
                h2.g-ta_c Уровень риска
                form.g-mb_4.g-col_lg_5.g-col_md_6
                    fieldset
                        .radio-list_inline
                            each v,k in ['Все стратегии',' Низкий','Средний','Высокий']
                                .radio.radio_flat
                                    input(type="radio",  value=k name="CASE_FILTER_PERIOD", id="CASE_FILTER_PERIOD_" + k)
                                    label(for="CASE_FILTER_PERIOD_" + k)=v
                div.g-row.g-row_narrow_md
                    .g-col.g-col_md_4
                        article.fund-cart
                            .fund-cart__inner
                                header
                                    h4.fund-cart__title
                                        span.fund-cart__name-primary Депозитная доходность
                                .fund-cart__options
                                    .fund-cart__option
                                        span.fund-cart__options-text Доходность за год:*
                                        strong.g-f_r.fund-cart__options-val  12%
                                    .fund-cart__option
                                        span.fund-cart__options-text Риск
                                        strong.g-f_r.fund-cart__options-val  Высокий
                    .g-col.g-col_md_4
                        article.fund-cart
                            .fund-cart__inner
                                header
                                    h4.fund-cart__title
                                        span.fund-cart__name-primary Консервативная
                                .fund-cart__options
                                    .fund-cart__option
                                        span.fund-cart__options-text Доходность за год:*
                                        strong.g-f_r.fund-cart__options-val  12%
                                    .fund-cart__option
                                        span.fund-cart__options-text Риск
                                        strong.g-f_r.fund-cart__options-val  Высокий
                    .g-col.g-col_md_4
                        article.fund-cart
                            .fund-cart__inner
                                header
                                    h4.fund-cart__title
                                        span.fund-cart__name-primary Стратегии ИИС
                                .fund-cart__options
                                    .fund-cart__option
                                        span.fund-cart__options-text Доходность за год:*
                                        strong.g-f_r.fund-cart__options-val  +32,25%%
                                    .fund-cart__option
                                        span.fund-cart__options-text Риск
                                        strong.g-f_r.fund-cart__options-val  Средний
                    .g-col.g-col_md_4
                        article.fund-cart
                            .fund-cart__inner
                                header
                                    h4.fund-cart__title
                                        span.fund-cart__name-primary Депозитная доходность
                                .fund-cart__options
                                    .fund-cart__option
                                        span.fund-cart__options-text Доходность за год:*
                                        strong.g-f_r.fund-cart__options-val  12%
                                    .fund-cart__option
                                        span.fund-cart__options-text Риск
                                        strong.g-f_r.fund-cart__options-val  Высокий
                    .g-col.g-col_md_4
                        article.fund-cart
                            .fund-cart__inner
                                header
                                    h4.fund-cart__title
                                        span.fund-cart__name-primary Консервативная
                                .fund-cart__options
                                    .fund-cart__option
                                        span.fund-cart__options-text Доходность за год:*
                                        strong.g-f_r.fund-cart__options-val  12%
                                    .fund-cart__option
                                        span.fund-cart__options-text Риск
                                        strong.g-f_r.fund-cart__options-val  Высокий
                    .g-col.g-col_md_4
                        article.fund-cart
                            .fund-cart__inner
                                header
                                    h4.fund-cart__title
                                        span.fund-cart__name-primary Стратегии ИИС
                                .fund-cart__options
                                    .fund-cart__option
                                        span.fund-cart__options-text Доходность за год:*
                                        strong.g-f_r.fund-cart__options-val  +32,25%%
                                    .fund-cart__option
                                        span.fund-cart__options-text Риск
                                        strong.g-f_r.fund-cart__options-val  Средний
        aside.g-col.g-col_lg_3.g-col.g-col_md_5.manager_aside_us
            .manager
                //.g-row.g-row_narrow
                    .manager__image.g-col.g-col_xs_6
                        figure.manager__img()
                    .manager__info.g-col.g-col_xs_6
                        .manager__row.manager__name Данила Жандаров!
                        .manager__row.manager__name Ведущий менеджер Дирекции продаж частным клиентам
                        .manager__row.manager__phone
                            a(href="tel:88002009058") 8 (800) 200-90-58
                            br
                            | доб 74-34
                        .manager__email
                            a(href="mailto:ZhandarovDS@uralsib.ru") ZhandarovDS@uralsib.ru
            .manager
                .g-row.g-row_narrow
                    .manager__image.g-col.g-col_xs_3.g-col_md_3
                        figure.manager__img.manager__img_2()
                    .manager__info.g-col.g-col_xs_9.g-col_md_9
                        .manager__name.h4 Получить консультацию
                        .manager__row.manager__phone
                            a(href="tel:88002009058") 8 (800) 200-90-58
                        .manager__row.manager__email
                            a(href="mailto:support@am-uralsib.ru") support@am-uralsib.ru



</template>

<script>
    export default {
        methods: {
            showPopup() {
                window.events.$emit('show_popup', 'contact');
            }
        },
        created(){
            this.$store.commit('mainClass', 'g-ai_fs');
            this.buffering = false
        }
    }
</script>

