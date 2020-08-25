<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0(v-html="heading")
        .g-mb_4(v-if="text != ''")
            .h4.g-mb_0(v-html="text")
        .g-row
            .g-col.g-col_xs_6
                button(type="button" @click.prevent="confirm(true)").btn.btn_primary.btn_block Да
            .g-col.g-col_xs_6
                button(type="button"  @click.prevent="confirm(false)").btn.btn_o.btn_block Отмена
</template>

<script>
    export default {
        props: ['payload'],
        methods: {
            confirm(answer) {
                window.events.$emit('confirm-exit', answer);
                setTimeout(()=>window.events.$emit('confirm-exit', answer),500) //для бага в новом клиенте
            }
        },
        computed: {
            heading() {
                if (this.payload.heading != undefined) return this.payload.heading;
                // this.$store.commit('funds/clearOperations');
                return 'Вы действительно хотите уйти?';
            },
            text() {
                if (this.payload.text != undefined) return this.payload.text;

                return 'У вас есть несохраненные изменения.';
            }
        }
    }
</script>

