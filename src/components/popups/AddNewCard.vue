<template lang="pug">
    form.popup__content
        .popup__title.g-mb_3
        .payment-card__front.payment-card__front_new
            .payment-card__caption Новая карта
            .payment-card__types.g-hide_xs
                img(src="/dist/img/mc.png",alt="mc")
                img(src="/dist/img/vi.png",alt="visa")
            .control
                .control__field
                    input(type="text" v-validate="required|card" data-vv-as="номер карты" v-model="number" name="num" id="FP_NEW_CARD_NUM" placeholder="Номер карты").field_text
                    span.field_error(v-if="errors.has('num')" v-html="errors.first('num')")
        .payment-nav
            input(type="submit", @click.prevent="saveCard" value="Сохранить").btn.btn_primary
</template>

<script>
    import Inputmask from "inputmask"; //https://github.com/RobinHerbots/Inputmask

    export default {
        data() {
            return {
                number: ''
            }
        },
        mounted() {
            this.$nextTick(() => {
                Inputmask("9999 9999 9999 9999").mask(document.getElementById('FP_NEW_CARD_NUM'));
            });
        },
        beforeDestroy() {
            [
                document.getElementById('FP_NEW_CARD_NUM')
            ].forEach(item => {
                if (item && item.inputmask) item.inputmask.remove();
            });
        },
        methods: {
            saveCard() {
                axios.post(`/payments/${this.number}/addcard`)
                .then((data) => {
                    window.events.$emit('close_popup');
                    window.events.$emit('card_added', this.number);
                })
                .catch(() => {});
            }
        }
    }
</script>

<style lang="scss">
    .page_payment{
        .page{
            &__head{
                margin-bottom:58px;
                &_nav{
                    margin-bottom:82px;
                }
            }
        }
    }
</style>