<template lang="pug">
    .page.page_payment
        .page__head.page__head_nav
            .page-nav.page-nav_help
                div(v-for="item in navPage",:class="'nav__item'+(item.children ? ' parent': '')")
                    router-link(:to="item.link",class="nav__link" v-html="item.name")
                    .nav-sub(v-if="item.children")
                        .nav__item(v-for="child in item.children")
                            router-link(:to="child.link",class="nav__link" v-html="child.name")
        .page__head
            .h1 Оплатить паи
        form.page__entry
            .payment-card
                .payment-card__front.payment-card__front_new
                    .payment-card__caption Новая карта
                    .payment-card__types
                        img(src="/dist/img/mc.png",alt="mc")
                        img(src="/dist/img/vi.png",alt="visa")
                    .control
                        .control__field
                            input(type="text", name="num", id="FP_CARD_NUM",placeholder="Номер карты").field_text
            .payment-nav
                .checkbox.payment-nav__remember
                    input(type="checkbox", name="remember", id="FP_CARD_REMEMBER",value="1",checked="checked")
                    label(for="FP_CARD_REMEMBER") Запомнить карту
                input(type="submit",value="Продолжить").btn.btn_primary.g-f_r
</template>

<script>
    import Inputmask from "inputmask"; //https://github.com/RobinHerbots/Inputmask

    export default {
        data() {
            return {
                navPage:[
                    {
                        link:'/analytics',
                        name:'Аналитика'
                    },
                    {
                        link:'/structure',
                        name:'Структура'
                    },
                    {
                        link:'/operations',
                        name:'Операци с паями',
                        children:[
                            {
                                link:'#',
                                name:'Подменю 1'
                            },
                            {
                                link:'#',
                                name:'Подменю 2'
                            },
                        ]
                    },
                    {
                        link:'/history',
                        name:'История операций ПИФ'
                    },
                    {
                        link:'/documents',
                        name:'Документы'
                    },
                ]
            }
        },
        mounted(){
            this.$nextTick(() => {
                Inputmask("9999 9999 9999 9999").mask(document.getElementById('FP_CARD_NUM'));
            });
        },
        beforeDestroy() {
            [
                document.getElementById('FP_CARD_NUM')
            ].forEach(item => {
                if (item && item.inputmask) item.inputmask.remove();
            });
        }
    }
</script>

<style lang="scss">
    @import "../../../../../assets/styles/vars";
    .page_payment {
        .page {
            &__head {
                margin-bottom: 58px;
                &_nav {
                    margin-bottom: 82px;
                }
            }
        }
    }
</style>