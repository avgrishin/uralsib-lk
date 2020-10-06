<template lang="pug">
    form.popup__content.popup__content_sz_2(autocomplete="off")
        .popup__title.g-mb_3
            .h2.g-mb_0 Подтверждение
        .popup__text
            .popup__info
                .g-mr_4.g-hide_xs
                    svg-inline.popup__info-icon(src="/icons/info.svg")
                .h3.g-lh_15.g-mb_0
                    | Время оформления Заявки на погашение составит не более 60 минут. Для подтверждения данной операции Вам необходимо будет ввести sms- код, направленный на Ваш номер телефона.
                    br
                    | Срок действия sms-кода 24 часа.
            .g-row
                .g-col.g-col_md_12
                    button.btn.btn_primary.btn_block(@click.prevent="closePopup") Продолжить
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
    DEFERRED_APPS_STORE_KEY,
    CHECK_DEFERRED_APPS_ACTION,
    CHECK_DEFERRED_APPS_RESULT,
} from '../../store/modules/deferred-apps';

export default {
    name: 'SellAlertFinal',

    props: ['payload'],

    computed: {
        ...mapState(
            DEFERRED_APPS_STORE_KEY,
            {
                deferredResult: CHECK_DEFERRED_APPS_RESULT,
            }
        ),
    },

    methods: {
        ...mapActions(
            DEFERRED_APPS_STORE_KEY,
            {
                fireDeferredAction: CHECK_DEFERRED_APPS_ACTION,
            }
        ),

        toggleConfirm(flag) {
            this.$store.commit('popupConfirmOff', flag);
        },

        closePopup() {
            this.toggleConfirm(true);

            this.$nextTick(() => {
                window.events.$emit('close_popup');
                this.$router.push('/funds');
                this.toggleConfirm(false);
            });
        },

        closePopupAndOpenFunds() {
            this.toggleConfirm(true);

            setTimeout(() => {
                this.$router.push('/funds');
            }, 10000);

            setTimeout(() => {
                this.toggleConfirm(false);
                window.events.$emit('close_popup');
            }, 12000);
        },

        startPolling() {
            this.fireDeferredAction();
        },
    },

    mounted() {
        this.startPolling();
        this.closePopupAndOpenFunds();
    },
};
</script>

