<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0 Оплата
        .g-mt_4
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Дата
                .g-col.g-col_md_7(v-html="payload.evtDate || '-'")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Время
                .g-col.g-col_md_7(v-html="(payload.evtTime)?`${payload.evtTime} МСК` : '-'")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Продукт
                .g-col.g-col_md_7(v-html="payload.desc")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Сумма
                .g-col.g-col_md_7(v-html="payload.summ")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Примечание
                .g-col.g-col_md_7(v-html="payload.reason")
</template>

<script>
    export default {
        props: ['payload']
    }
</script>

