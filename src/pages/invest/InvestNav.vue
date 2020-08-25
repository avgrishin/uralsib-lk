<template lang="pug">
    div
        nav.nav-page.nav-page_main(:class="{'nav-page_open': pageNavOpen }", v-if="!['DU', 'IIS'].includes($route.query.stype)")
            .nav-page__wrap
                .nav-page__arrow.g-hidden.g-show_xs
                    .g-icon-down(@click.prevent="togglePageNav", :class="{'g-icon-down_open': pageNavOpen }")
                .nav-page__title(data-text="Меню", @click.prevent="togglePageNav")

                ul.nav-page__list.g-plain
                    router-link(
                        tag="li"
                        v-for="(item, index) in navPage"
                        :key="index"
                        :to="item.link"
                        class="nav-page__item"
                        :class="{ 'nav-page__item_parent': item.children, 'g-icon-down-hover': item.children, 'nav-page__link_disabled': item.disabled }"
                        active-class="nav-page__item_active"
                    )
                        .nav-page__name-drop.g-pr(v-if="item.children")
                            span(class="nav-page__link g-hidden g-show_xs" :class="{'nav-page__link_disabled': item.disabled}" hidden v-html="item.name")
                            a(class="nav-page__link g-hide_xs" v-html="item.name" ,:class="{'nav-page__link_disabled': item.disabled}" )
                            span.nav-page__sub-arrow(v-if="item.children")
                                span.g-icon-down.g-clr_inh
                        a(v-else class="nav-page__link" v-html="item.name", :class="{'nav-page__link_disabled': item.disabled}" )
                        ul.nav-page__sub(v-if="item.children")
                            li.nav-page__sub-item(v-for="child in item.children")
                                router-link(
                                    :to="child.link"
                                    class="nav-page__link nav-page__sub-link"
                                        :class="{'nav-page__link_disabled': child.disabled}"
                                    v-html="child.name"
                                    active-class="nav-page__sub-link_active"
                                    @click.native="yandexTarget(child.link)"
                                    v-if="!child.useHtmlTag"
                                )
                                a(
                                    :href="`#${child.link}`"
                                    class="nav-page__link nav-page__sub-link"
                                    :class="{'nav-page__link_disabled': child.disabled}"
                                    v-html="child.name"
                                    @click.prevent="child.clickHandler"
                                    v-else
                                )
        slot
</template>
<script>
    export default {
        data() {
            return {
                pageNavOpen: false
            }
        },
        mounted() {
            this.makeEvents();
        },
        created() {
            this.$store.state.fundsSection = true;
        },

        methods: {
            makeEvents() {
                let element = document.querySelector('.nav-page__item.nav-page__item_active');

                if (element) {
                    element.onclick = () => this.togglePageNav();
                }

                document.addEventListener('click', (event) => {
                    if (!event.target.matches('nav.nav-page_main, nav.nav-page_main *')) this.pageNavOpen = false;
                });
            },

            openSellAlertModal() {
                window.events.$emit('show_popup', 'sell-alert-confirm');
            },

            togglePageNav() {
                this.pageNavOpen = !this.pageNavOpen;
            },

            yandexTarget(link){
                if(link=='/operations/buy') {if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_MENU');}}
            },
        },

        computed: {
            navPage() {
                const authState = this.$store.state.user.state.authState != 2;
                const pifState = this.$store.state.user.state.pifState!=2;
                const funds = this.$store.getters['funds/quantityFunds']==0;

                const buyFunds = this.$store.getters['funds/buyFunds'].length > 0
                const sellFunds = this.$store.getters['funds/sellFunds'].length > 0
                const exchangeFunds = this.$store.getters['funds/exchangeFunds'].length > 0
                return [
                    {
                        link:'/funds',
                        name:'Все фонды'
                    },
                    {
                        link:'/analytics',
                        name:'Аналитика',
                        disabled: authState || pifState
                    },
                    {
                        link:'/operations',
                        name:'Операции с паями',
                        children:[
                            {
                                link:'/operations/buy',
                                name: 'Купить <span class="g-hide_xs">паи</span>',
                                disabled: !buyFunds
                            },
                            {
                                link:'/operations/change',
                                name: 'Обменять <span class="g-hide_xs">паи</span>',
                                disabled: authState || !exchangeFunds
                            },
                            {
                                link:'/operations/repay',
                                name: 'Погасить <span class="g-hide_xs">паи</span>',
                                disabled: authState || !sellFunds,
                                useHtmlTag: true,
                                clickHandler: (event) => {
                                    event.preventDefault();
                                    if (authState || !sellFunds) {
                                        return;
                                    }

                                    this.yandexTarget('/operations/repay');
                                    this.openSellAlertModal();
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>

