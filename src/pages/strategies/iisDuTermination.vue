<template lang="pug">
    article.content
        h1 Расторжение договора
        .content__termination
            p.g-mb_6 Уважаемый клиент, операция расторжения Договора доверительного управления оформляется только в офисе УК УРАЛСИБ и Банка УРАЛСИБ при личном визите
            p.g-mg_6 Пожалуйста, свяжитесь с нами, если Вам необходима консультация специалиста.
        contact-block(:strategies="true", apiMethod="/amcontracts/close")
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
                    text: 'Расторжение договора'
                }
            ]);
        }
    }
</script>

<style lang="scss">
    .popup__title{display:none}

    .content__termination {
        max-width: 700px;

        p {
            margin-bottom: 0;
        }

        p:last-child {
            margin-bottom: 20px;
        }
    }
</style>

