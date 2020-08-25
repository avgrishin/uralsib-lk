<template lang="pug">
    nav.nav-main(:class="{'nav-main_open': navMainOpen, 'nav-main_title': !hasActiveElements }")
        .nav-main__inner
            .g-grid
                .nav-main__grid
                    span.nav-main__toggle.g-hidden.g-show_xs
                        span.g-icon-down.g-clr_wh(@click.prevent="toggleNavMain()", :class="{'g-icon-down_open': navMainOpen }")
                    ul.nav-main__list.g-plain
                        router-link(tag="li" to="/" class="nav-main__item" active-class="active" :class="{active: $store.state.caseSection}" exact)
                            a.nav-main__link Портфель
                        router-link(tag="li" to="/funds" class="nav-main__item", active-class="active", :class="{active: $store.state.fundsSection && $route.query.stype !== 'DU' && $route.query.stype !== 'IIS'}" exact)
                            a.nav-main__link Паевые инвестиционные фонды
                        router-link(tag="li" to="/strategies/iis", :class="{active: iidDuSection}", class="nav-main__item" active-class="active" exact)
                            a.nav-main__link ИИС и Доверительное управление
                    .nav-main__text(@click.prevent="toggleNavMain", :class="{'g-icon-down_open': navMainOpen }")
</template>

<script>
    export default {
        watch: {
            '$route' (from, to) {
                this.navMainOpen = false;
            }
        },
        data() {
            return {
                navMainOpen: false
            }
        },
        mounted() {
            this.makeEvents();
        },
        beforeDestroy() {
            document.removeEventListener('click', this.clickEvents);
        },
        methods: {
            toggleNavMain() {
                this.navMainOpen = !this.navMainOpen;

            },
            makeEvents() {
                document.addEventListener('click', this.clickEvents);
            },
            clickEvents(event) {

                if (event.target &&  event.target.parentElement && event.target.parentElement.matches('.nav-main__item.active')) this.toggleNavMain();
                if (!event.target.matches('nav.nav-main, nav.nav-main *')) this.navMainOpen = false;
            }
        },
        computed: {
            hasActiveElements() {
                return (
                    this.$route.path.includes('/case/') ||
                    this.$route.path == '/history' ||
                    this.$route.path == '/documents' ||
                    this.$route.path == '/' ||
                    this.$store.state.fundsSection ||
                    this.$route.path.includes('strategies')
                )
            },
            iidDuSection() {
                return _.includes(this.$route.path, '/strategies/');
            }
        },
        created() {
            window.log(this.$router.currentRoute)
        },
    }
</script>

