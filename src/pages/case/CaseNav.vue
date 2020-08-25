<template lang="pug">
    article.content
        h1.g-hide_xs Портфель
        section.page-section
            .page-section__nav-grid
                span.nav-main__toggle.g-hidden.g-show_xs(@click.prevent="toggleNavSubMain")
                    span.g-icon-down(:class="{'g-icon-down_open': navSubMainOpen }")
                ul.g-mb_5.page-section__nav.g-mb_3_xs(:class="{'show-menu': navSubMainOpen }")
                    li.g-mr_4.g-ib.nav__link-title.nav__link.active
                        a(href="javascript:voit(0)") Меню
                    router-link(tag="li" v-if="!disableStructureAndBalanceLinks" class="g-mr_4 g-ib" to="/", :class="activeStructure" active-class="active" exact).nav__link.h2.g-ib.g-bbc_t.g-mb_0
                        a(:class="disabled") Структура
                    router-link(tag="li" v-if="!disableStructureAndBalanceLinks" class="g-mr_4 g-ib" to="/case/balance" :class="disabled" active-class="active").nav__link.h2.g-ib.g-bbc_t.g-mb_0
                        a(:class="disabled") Баланс
                    router-link(tag="li" class="g-mr_4 g-ib" to="/case/chart" :class="disabledChart" active-class="active").nav__link.h2.g-ib.g-bbc_t.g-mb_0
                        a(:class="disabledChart") Динамика
                    router-link(tag="li" class="g-mr_4 g-ib" to="/history" :class="disabledHistory" active-class="active").nav__link.h2.g-ib.g-bbc_t.g-mb_0
                        a(:class="disabledHistory") История#[span.g-hide_xs &nbsp;операций ПИФ]
                    router-link(tag="li" class="g-ib" to="/documents" active-class="active").nav__link.h2.g-ib.g-bbc_t.g-mb_0
                        a Документы
        slot
</template>
<script>
    import {noUserFunds } from '../../guards.js';
    export default {
        data() {
            return {
                navSubMainOpen: false
            }
        },
        mounted() {
            this.makeEvents();
        },
        beforeDestroy() {
            document.removeEventListener('click', this.clickEvents);
        },
        methods: {
            toggleNavSubMain() {
                this.navSubMainOpen = !this.navSubMainOpen;

            },
            makeEvents() {
                document.addEventListener('click', this.clickEvents);
            },
            clickEvents(event) {
                if (!event.target.matches('.page-section__nav-grid, .page-section__nav-grid *')) {
                    this.navSubMainOpen = false;
                }
            }
        },
        computed: {

            disabledHistory() {
                return {'g-cr_d':this.$store.state.user.state.pifState != 2}

            },
            disabledChart() {
                return {'g-cr_d':!(this.$store.state.user.state.duState == 1 || this.$store.getters['funds/quantityFunds'] || this.$store.state.user.state.pifState == 2)}
            },

            disableStructureAndBalanceLinks() {
                return !(this.$store.state.user.state.duState == 1 || this.$store.getters['funds/quantityFunds']);
            },

            disabled() {
                return {'g-cr_d':!(this.$store.state.user.state.duState == 1 || this.$store.getters['funds/quantityFunds'])}
            },
            activeStructure() {
                return {'active': this.$route.path == '/'}
            }
        }
    }
</script>
