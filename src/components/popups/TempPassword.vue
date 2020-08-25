<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.h2.g-mb_2 Уважаемый клиент!
        .g-mb_2
            | Пожалуйста, установите постоянный пароль для доступа к Личному кабинету. Временный пароль действует ограниченное время.
        span(@click="goToEditProfile", class="btn btn_primary g-col_xs_12 g-col_md_a") Сменить
</template>
<script>
export default {
    name: 'temp-password',
    methods: {
        goToEditProfile() {
            this.$router.push('/user/change-password');
            window.events.$emit('close_popup');
        }
    },
}
</script>
