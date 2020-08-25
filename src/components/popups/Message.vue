<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.g-ta_c
            .h3.g-lh_15.g-mb_0(v-html="payload.msgSubject")
        .popup__text.g-mt_3(v-if="payload.msgBody", v-html="payload.msgBody")
        a.g-col_xs_12.g-mt_3(
            v-if="payload.msgBtn"
            @click.prevent="closePopup()",
            class="btn btn_primary"
        ) Закрыть

</template>

<script>
    export default {
        props: ['payload'],
        computed: {},
        methods: {
            closePopup() {
                window.events.$emit('close_popup')
            }
        },
    }
</script>

