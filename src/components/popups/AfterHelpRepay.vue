<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.h2.g-mb_2.g-d_bi Благодарим Вас за обращение.
        .popup__text.g-mb_4
            | Наш консультант свяжется с Вами
            br
            | в ближайшее время.

        a(@click.prevent="closePopup()" class="btn btn_primary").g-col_xs_12 ОК
</template>
<script>
    export default {
        methods: {
            closePopup() {
                window.events.$emit('close_popup')
            }
        }
    }
</script>
