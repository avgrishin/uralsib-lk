<template lang="pug">
    div.popup__content.popup__content_sz_2.popup__content--sell-alert(:class="{ spinner: isLoading }")
        .popup__title.g-mb_3
            .h2.g-mb_0 Уважаемый клиент

        .popup__text.popup__text--sell-alert
            p Перед оформлением заявки на погашение мы хотели бы Вам напомнить, что Управляющая компания удерживает:
            ul
                li комиссию в случае владения паями менее 732 дней;
                li НДФЛ в размере 13% для резидентов и 30% для нерезидентов в случае владения паями менее 3-х лет. (Налоговая льгота распространяется на паи, приобретенные не ранее 01.01.2014)
            p При высокой волатильности рынков не стоит принимать необдуманных решений, мы хотели бы Вас предостеречь от финансовых потерь.
            p Если у Вас есть сомнения, оставьте заявку на консультацию.
        .g-row
            .g-col.g-col_md_6
                button.btn.btn_primary.btn_block(@click.prevent="sendMessageAndOpenModal") Мне потребуется консультация
            .g-col.g-col_md_6
                a(:href="formLink" @click="goToSell" target="_blank" rel="noreferrer nofollow").btn.btn_o.btn_block Пройти опрос и продолжить
</template>

<script>
import { mapState } from 'vuex';

import { DEFERRED_SELL_FORM_LINK } from '../../constatnts';
import { sellAppsApiService } from '../../api';

export default {
    name: 'SellAlertConfirm',

    props: ['payload'],

    data() {
        return {
            isLoading: false,
            error: null,
            formLink: DEFERRED_SELL_FORM_LINK,
        };
    },

    computed: {
        ...mapState('user', {
            userInfo: 'info',
        }),
    },

    methods: {
        goToSell() {
            this.$router.push({
                path: '/operations/repay',
                query: this.payload,
            });
        },

        async sendMessageAndOpenModal() {
            try {
                this.isLoading = true;
                this.error = null;
                await sellAppsApiService.getConsultation();
                this.openSuccessModal();
            } catch (e) {
                this.error = 'Ошибка при отправке заявки на консультацию';
                console.error(e.message);
            } finally {
                this.isLoading = false;
            }
        },

        openSuccessModal() {
            window.events.$emit('show_popup', 'after-help-repay');
        },
    },
};
</script>

<style>
    .popup__content--sell-alert > * {
        transition: all 0.25s ease-out;
    }

    .popup__text.popup__text--sell-alert {
        padding-bottom: 1.25rem;
    }

    .popup__content--sell-alert ul {
        padding-left: 1rem;
    }

    .popup__content--sell-alert ul li {
        margin-bottom: 0.5rem;
        color: #ba000e;
    }

    .popup__content--sell-alert.spinner > * {
        opacity: 0.5;
        pointer-events: none;
    }
</style>
