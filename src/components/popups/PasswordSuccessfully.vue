<template lang="pug">
    form(style="max-width: 360px;" @submit.prevent="authAfterRouter").popup__content
        .popup__title.h2.g-mb_2 Отлично!
        .g-lh_15.g-fs_1.g-fw_3.g-mb_4 
            | На Вашу почту отправлено #[br]
            | уведомление о смене пароля.
        button(type="submit",class="btn btn_primary g-col_xs_12 g-col_md_a") ОК


</template>

<script>
    import { authAfterRouter } from '../../mixins';

    export default {
            mixins: [authAfterRouter],

        data() {
            return {}
        },
        created() {

        },
        methods: {
            showPopup() {
                window.events.$emit('show_popup', 'feedback');
            }
        }
    }
</script>

