<template lang="pug">
    form.popup__content.popup__content_sz_1
        .g-lh_15.g-fs_1.g-fw_3.g-mb_4
            | Ваша сессия будет прекращена через 1 минуту
        button.btn.btn_primary.g-col_xs_12(@click.prevent="showPopup") Продлить


</template>

<script>
    export default {
        methods: {
            showPopup() {
                window.events.$emit('close_popup');
            }
        }
    }
</script>

