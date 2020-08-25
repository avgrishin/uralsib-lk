<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0(v-html="`Заявка № ${payload.doc.number}`")
        .popup__text(v-if="payload.doc.portfolio")
            p.h4.g-lh_15
                | на #[span(v-html="payload.doc.type == 'buy' ? 'покупку' : payload.doc.type == 'sell' ? 'погашение' : 'обмен'")] инвестиционных паев физическими лицами #[br](Заявка носит безотзывный характер)
        .popup__text(v-else)
            p.h4.g-lh_15 на изменение анкетных данных
        .g-mt_4
            .g-row.g-mb_4.g-mb_2_xs(v-if="payload.doc.portfolio")
                .g-col.g-col_md_5.h3.g-mb_0(v-html="`${payload.doc.type == 'buy' ? 'Приобретаемые' : payload.doc.type == 'sell' ? 'Погашаемые' : 'Обмениваемые'} паи`")
                .g-col.g-col_md_7(v-text="`ОПИФ ${fundName}`")
            .g-row.g-mb_4.g-mb_2_xs(v-if="payload.doc.type == 'exch'")
                .g-col.g-col_md_5.h3.g-mb_0 Получаемые паи
                .g-col.g-col_md_7(v-text="`ОПИФ ${destinationFund}`")
            .g-row.g-mb_4.g-mb_2_xs(v-if="payload.doc.portfolio")
                .g-col.g-col_md_5.h3.g-mb_0 Номер лицевого счёта
                .g-col.g-col_md_7(v-html="payload.doc.accountNumber || '-'")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Время принятия заявки
                .g-col.g-col_md_7(v-html="(payload.doc.time)?`${payload.doc.time} МСК` : '-'")
            .g-row.g-mb_4.g-mb_2_xs
                .g-col.g-col_md_5.h3.g-mb_0 Дата проведения операции
                .g-col.g-col_md_7(v-html="payload.doc.sentDate || '-'")
            .g-row
                .g-col.g-col_md_5.h3.g-mb_0 Статус
                .g-col.g-col_md_7(v-html="payload.doc.statusName || '-'")
</template>

<script>
    import moment from 'moment';
    export default {
        props: ['payload'],
        data() {
            return {
                destinationFund: ''
            }
        },
        created() {







            if (this.payload.doc.type == 'exch') {
                axios.get(`/ExchApps/${this.payload.doc.applicationId}`).then(({data}) => {
                    let info = data.destinationAccount || data.accountOpenData;
                    if (info.portfolio.description.includes('УК УралСиб')) {
                        let shortName = info.portfolio.description.match(/УралСиб [А-ЯЁа-яё ]*/i);
                        this.destinationFund = shortName ? 'УРАЛСИБ ' + shortName[0].replace(/УралСиб|Фонд/g, '').trim() : '';
                    } else {
                        this.destinationFund = info.portfolio.description
                    }
                })
            }
        },
        computed: {
            fundName() {
                if (!this.payload.doc.portfolio) return '';

                return this.payload.doc.portfolio.description.replace(' &ensp;<br />', ' ');
            },
            quantity() {
                return this.payload.doc.quantity.toLocaleString('ru-RU', {maximumFractionDigits: 10});
            }
        }
    }
</script>

