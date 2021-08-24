<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0(v-html="`Заявка № ${payload.orderNum}`")
        .popup__text
            p.h4.g-lh_15(v-html="`на ${payload.operName} инвестиционных паев физическими лицами <br /> (Заявка носит безотзывный характер)`")
        .g-mt_4
            .g-row.g-mb_2.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Дата проведения операции
                .g-col.g-col_md_7(v-html="payload.date")
            .g-row.g-mb_2.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0(v-if="payload.operName == 'Обмен'") Обмениваемые паи
                .g-col.g-col_md_5.h3.g-mb_0(v-else-if="payload.operName == 'Приобретение'") Приобретаемые паи
                .g-col.g-col_md_5.h3.g-mb_0(v-else) Погашаемые паи
                .g-col.g-col_md_7(v-html="`УРАЛСИБ ${payload.portfolio}`")
            .g-row.g-mb_2.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Номер лицевого счёта
                .g-col.g-col_md_7(v-html="payload.account")
            .g-row.g-mb_2.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Количество паев
                .g-col.g-col_md_7(v-html="qnt")
            .g-row.g-mb_2.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Цена за 1 пай
                .g-col.g-col_md_7(v-html="payload.price")
            .g-row.g-mb_2.g-mb_2_xs(v-if="payload.operName == 'Обмен'")
            .g-row.g-mb_2.g-mb_2_xs(v-if="payload.operName == 'Обмен'")
                .g-col.g-col_md_5.h3.g-mb_0 Получаемые паи
                .g-col.g-col_md_7(v-html="`УРАЛСИБ ${payload.exchPortfolio}`")
            .g-row.g-mb_2.g-mb_2_xs(v-if="payload.operName == 'Обмен'")
                .g-col.g-col_md_5.h3.g-mb_0 Номер лицевого счёта
                .g-col.g-col_md_7(v-html="payload.exchAccount")
            .g-row.g-mb_2.g-mb_2_xs(v-if="payload.operName == 'Обмен'")
                .g-col.g-col_md_5.h3.g-mb_0 Количество паев
                .g-col.g-col_md_7(v-html="exchQnt")
            .g-row.g-mb_3.g-mb_2_xs(v-if="payload.operName == 'Обмен'")
                .g-col.g-col_md_5.h3.g-mb_0 Цена за 1 пай
                .g-col.g-col_md_7(v-html="payload.exchPrice")
            .g-row.g-mb_2
                .g-col.g-col_md_5.h3.g-mb_0 Сумма операции
                .g-col.g-col_md_7(v-html="payload.amount")
            .g-row
                .g-col.g-col_md_5.h3.g-mb_0 Сумма комиссии
                .g-col.g-col_md_7(v-html="payload.commis")
</template>

<script>
    export default {
        props: ['payload'],
        computed: {
            qnt() {
                return this.payload.qnt.toLocaleString('ru-RU', {maximumFractionDigits: 10});
            },
            exchQnt() {
                return this.payload.exchQnt.toLocaleString('ru-RU', {maximumFractionDigits: 10});
            }
        }
    }
</script>

