<template lang="pug">
    form.popup__content.popup__after
        .popup__title.h2.g-mb_2 Уважаемый пользователь!
        .g-mb_2
            | Благодарим Вас за регистрацию. #[br]
            | Проверка Ваших данных может занять не более 10 минут. #[br]
            | В случае успешного завершения проверки #[br]
            | на Ваш email - адрес будут направлены Логин и Пароль.
        span(@click="goToHome", class="btn btn_primary g-col_xs_12 g-col_md_a") Продолжить
</template>
<script>
    export default {
        data(){
            return { closable: false}
        },
        created() {
            this.$store.commit('register/clear');
        },
        methods: {
            goToHome() {
                this.$router.push('/');
                window.events.$emit('close_popup');
            }
        },
    }
</script>

<style lang="scss">
    .popup__after {
        max-width: 435px;
    }
</style>
