<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.g-mb_3
            .h2.g-mb_0
                | Анкета отправлена
                br
                | на проверку
        .g-row
            .g-col
                router-link(to="/").btn.btn_primary.btn_block Вернуться в Личный кабинет

</template>

<script>
    export default {
        created() {
            this.$store.dispatch('user/getProfile');
        }
    }
</script>

