<template lang="pug">
    form.popup__content.popup__content_sz_1
        .popup__title.h2.g-mb_2 Уважаемый пользователь
        .g-mb_2
            | В целях упрощения дальнейшего оформления документов рекомендуем пройти идентификацию через сайт Госуслуг. В этом случае Вам не потребуется прикреплять скан паспорта.
        .g-mb_2
            | Внимание! Для прохождения идентификации необходимо иметь подтвержденную учетную запись на сайте Госуслуг
        .popup__buttons
            div(class="btn btn_primary g-col_xs_6 g-col_md_a" @click="registerStateSend") Ок
            div(class="btn btn_primary g-col_xs_6 g-col_md_a" @click="registerStateDenied") Отказаться
</template>
<script>
    export default {
        data() {
            return {
                returnUrl: window.location.origin
            }
        },
        created() {},
        methods: {
            registerStateSend() {
                axios.get('/registrar/redirecturl', {
                    params: {
                        returnUrl: this.returnUrl,
                    }
                }).then(({data}) => {
                    window.location.href = data
                    window.log(data)

                });

            },
            registerStateDenied() {
                axios.get('/registrar/denied').then((data) => {
                    window.events.$emit('close_popup');
                });

            }
        }
    }
</script>
