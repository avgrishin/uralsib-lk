<template lang="pug">
        article.content
            h1 Частичный вывод денежных средств
            p.g-mb_6 Для частичного вывода денежных средств обратитесь к инвестиционному консультанту.
            contact-block(apiMethod="/amcontracts/withdraw")
</template>

<script>
    import Contact   from '../../components/popups/Contact'
    export default {
        components:{'contact-block':Contact},
        data() {
            return {

            }
        },
        created() {
            this.$store.commit('updateCrumbs', [
                {
                    link: '/',
                    text: 'Портфель'
                },
                {
                    link: '/case/balance',
                    text: 'Баланс'
                },
                {
                    link: '',
                    text: 'Частичный вывод средств'
                }
            ]);
        }
    }
</script>

<style lang="scss">
    .popup__title{display:none}
</style>

