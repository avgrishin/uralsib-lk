<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.g-ta_c
            .h3.g-lh_15(v-html="title", :class='{"g-mb_0":!text}')
        .popup__text(v-html="text")

</template>

<script>
    export default {
        props: ['payload'],
        computed: {
            title() {
                if (this.payload.title) return this.payload.title;
                else if (this.$route.query.error == 'Unable_to_update_registered_request')
                    return 'Запрос на регистрацию с данной учетной записью госуслуг уже создан'

                return 'Учетная запись госуслуг не подтверждена';
            },
            text(){
                if (this.payload.text) return this.payload.text;
            }
        }
    }
</script>

