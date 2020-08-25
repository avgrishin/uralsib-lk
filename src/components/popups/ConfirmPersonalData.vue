<template lang="pug">
    form.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0
                | Внимание необходимо  подтвердить #[br] анкетные данные
        .g-mb_4
            .h4.g-mb_0
                | Вам необходимо актуализировать анкетные данные, #[br] если вы не подтвердите актуальность анкеты, #[br] действия по портфелю невозможны
        .g-row
            .g-col.g-col_xs_6
                .btn.btn_primary.btn_block(@click="goToPersonalPage") Перейти в анкету
            .g-col.g-col_xs_6
                a(href="#" @click="closePopup").btn.btn_o.btn_block Просмотр портфеля
</template>

<script>
    export default {
        props: ['payload'],
        created() {


        },
        methods: {
            closePopup() {
                window.events.$emit('close_popup');
            },
            goToPersonalPage() {
                let personalUrl = '/user/personal'
                let currenrRoute = this.$router.currentRoute
                // window.log(currenrRoute.path)
                // window.log(personalUrl)
                if(currenrRoute.path == personalUrl) {
                    this.closePopup()
                    window.log('1')
                } else {
                    this.$router.push(personalUrl)
                    window.log('2')
                }
                
            }
        }

    }
</script>

