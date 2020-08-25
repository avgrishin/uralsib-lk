<template lang="pug">
    invest-nav
        article.content
            h1.g-fw_4_xs.g-hide_xs(v-html="title")
            .control-label-top-title_xs.g-show_xs(hidden)
                .h2(v-html="title")
            components(@setTitle="setTitle"  :is="activeComponent" @buyerror="showNotice = true")
            .fixed-line.g-ptb_1(v-if="showNotice")
                .g-grid.g-lh_1.g-d_f.g-ai_c.g-jc_sb
                    div.g-mr_3.g-mr_1_xs
                        .h3.g-mb_1.g-hide_xs Покупка паев
                        .h6.g-mb_0 Для совершения покупки Вам нужно заполнить анкету
                    router-link(to="/user/personal").btn.btn_rare.g-ws_nw.g-ws_n_xs.g-p_1_xs Заполнить анкету
</template>
<script>
    import InvestNav from '../InvestNav';
    import BuySingle from './buy/Single.vue';
    import BuyMultiple from './buy/Multiple';
    import { authAfterRouter } from '../../../mixins';
    import { confirmPersonalData } from '../../../guards';
    import { hookHasOperations } from '../../../guards';
    export default {
        mixins: [authAfterRouter],

        components: { InvestNav, BuySingle, BuyMultiple },
        beforeRouteEnter:confirmPersonalData,
        data() {
            return {
                activeComponent: 'buy-single',
                showNotice: false,
                title: 'Формирование документов',
            }
        },
        created() {
            this.$store.commit('updateCrumbs', [
                { link: '/funds', text: 'Паевые инвестиционные фонды' },
                { link: '/operations', text: 'Операции с паями' },
                { link: '/operations', text: 'Формирование документов' }
            ]);

            this.determineComponent();

        },
        beforeRouteLeave(to, from, next) {
            if (to.path == '/operations/buy/approve' || this.showNotice) return next();


            if(this.$store.getters['funds/quantityFunds']==0 && (to.path=='/operations/change' || to.path=='/operations/repay')) return ;
            if(this.$store.state.user.state.pifState != 2 && to.path=='/analytics') return ;


            if(!this.$store.state.popupConfirmOff) {
                this.$store.dispatch('confirm')
                    .then(answer => {
                        if (answer) return next();

                        else window.events.$emit('close_popup');
                    });
            } else next()


        },
        methods: {
            determineComponent() {
                let operations = this.$store.state.funds.operations;
                
                if (operations.funds && operations.funds.length > 1) this.activeComponent = 'buy-multiple';
            },
            setTitle(title) {
                this.title = title;

                this.$store.commit('updateCrumbs', []);
                this.$nextTick(() => {
                    this.$store.commit('updateCrumbs', [
                        { link: '/funds', text: 'Паевые инвестиционные фонды' },
                        { link: '/operations', text: 'Операции с паями' },
                        { link: '/operations', text: title }
                    ]);
                });
            }
        }
    }
</script>
