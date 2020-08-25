<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.h2.g-mb_2 Данные отправлены
        .g-mb_2
            | Ваши данные отправлены на проверку. #[br]
            | Логин и пароль для авторизации отправлен #[br] на Ваш email
        span(class="btn btn_primary g-col_xs_12 g-col_md_a" @click.prevent="confirm(true)") Перейти в кабинет
</template>
<script>
    export default {
        created() {
            this.$store.commit('register/clear');
        },
        methods: {
            confirm(answer) {
                window.events.$emit('after-register-auto-auth-ok', answer);
            }
        },
    }
</script>
