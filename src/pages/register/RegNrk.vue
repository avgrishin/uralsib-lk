<template lang="pug">
    article.nrk-wrapper.g-col.g-col_lg_7.g-col_md_12
        h2.content-header.g-mt_2_xs В соответствии с законодательством РФ
            br
            | и правилами фонда, данные о Вас должны храниться в специализированном регистраторе 
            br
            | АО "НРК - Р.О.С.Т.". Специализированный регистратор по закону обязан выполнить процедуру Вашей идентификации.
        .g-mb_5.g-mb_2_xs.g-pl_0
            .g-row.g-row_flex
                .g-col.g-col_md_4.g.-col_xs_10.g-mt_0.g-mt_0_xs
                    a(@click.prevent="clickNrkLink").btn.btn_primary.btn_block.btn_nrk Ок

</template>

<script>
    export default {
        data() {
            return {
                nrkLink: ''
            }
        },
        created() {

        },
        methods: {
            clickNrkLink() {
                if (this.$route.query.registrarValidation) {
                    let link = window.atob(this.$route.query.registrarValidation);
                    window.location.href = link
                } else {
                    axios.get('/registrar/redirecturl', {
                        params: {
                            returnUrl: window.location.origin,
                        }
                    }).then(({data}) => {
                        window.location.href = data
                        window.log(data)
                    });
                }
            }
        }
    }
</script>

