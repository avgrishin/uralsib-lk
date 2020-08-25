<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0(v-html="`Заявка № ${payload.opertaion.orderNum}`")
        .popup__text
            p.h4.g-lh_15(v-html="`на ${payload.opertaion.operName} инвестиционных паев физическими лицами <br /> (Заявка носит безотзывный характер)`")
        .g-mt_4
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0(v-if="payload.opertaion.operName == 'Обмен'") Обмениваемые паи
                .g-col.g-col_md_5.h3.g-mb_0(v-else-if="payload.opertaion.operName == 'Приобретение'") Приобретаемые паи
                .g-col.g-col_md_5.h3.g-mb_0(v-else) Погашаемые паи
                .g-col.g-col_md_7(v-html="`ОПИФ ${fundName}`")
            .g-row.g-mb_4.g-mb_2_xs(v-if="payload.opertaion.operName == 'Обмен'")
                .g-col.g-col_md_5.h3.g-mb_0 Получаемые паи
                .g-col.g-col_md_7(v-html="`ОПИФ ${fundTo}`")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Номер лицевого счёта
                .g-col.g-col_md_7(v-html="payload.opertaion.registryAccountNumber")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Дата проведения операции
                .g-col.g-col_md_7(v-html="payload.opertaion.date")
            .g-row
                .g-col.g-col_md_5.h3.g-mb_0 Сумма операции
                .g-col.g-col_md_7(v-html="payload.opertaion.amount")
            // .g-row.g-mb_4.g-mb_2_xs
            //     .g-col.g-col_md_5.h3.g-mb_0 Размер комиссии
            //     .g-col.g-col_md_7(v-html="payload.opertaion.commission || '-'")
            // .g-row
            //     .g-col.g-col_md_5.h3.g-mb_0 Налог
            //     .g-col.g-col_md_7(v-html="payload.opertaion.tax || '-'")
</template>

<script>
    export default {
        props: ['payload'],
        computed: {
            operName() {
                _.capitalize(this.payload.opertaion.operName);
            },
            fundTo() {
                return (this.payload.opertaion.exchange ? this.payload.opertaion.exchange.replace('', 'Уралсиб '):0 ) || (this.payload.opertaion.subPortfolio ? this.payload.opertaion.subPortfolio.replace('', 'Уралсиб '):0);
            },
            fundName() {
                return this.payload.opertaion.subPortfolio.replace('', 'Уралсиб ')
            },
            quantity() {
                return this.payload.opertaion.quantity.toLocaleString('ru-RU', {maximumFractionDigits: 10});
            }
        }
    }
</script>

