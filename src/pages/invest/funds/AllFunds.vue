<template lang="pug">
    invest-nav
        article.content
            h1 Фонды с наилучшей доходностью
            .spinner(v-if="loading")
            fund-list(:funds="recommendedFunds" :showBG="true")
            div(v-if="!showAllFunds")
                .g-row.g-row_narrow_md
                    .g-col.g-col_md_4
                        a(href="#" @click.prevent="toggleAllFunds").btn.btn_block.btn_primary Все фонды
            .fund-list(v-else)
                fund-list(:funds="allFunds" :showBG="true")

            p.g-mt_6.g-col_8
                ui-disclaimer.text-note(tag="small")
                    span {{ disclaimerDate }}


</template>

<script>
    import fundThumb from '../../../components/Fund-thumb.vue';
    import FundList from './FundList.vue';
    import InvestNav from '../InvestNav';
    import moment from 'moment';
    import UiDisclaimer from '../../../components/ui/UiDisclaimer';
    export default {
        components: {
            UiDisclaimer,
            'fund-thumb': fundThumb,
            FundList,
            InvestNav
        },
        watch: {
            recommendedFunds(val) {
                if (val.length) this.loading = false;
            }
        },
        data(){
            return {
                disclaimerTextFunds: '',
                showAllFunds: false,
                loading: true
            }
        },
        methods: {
            getTextDisclaimer() {
                axios.get('/reference/getsitetext', {
                    params: {
                        place: 'Funds',
                    }
                }).then(({data}) => {

                    this.disclaimerTextFunds = data.outText;

                });
            },
            toggleAllFunds() {
                this.showAllFunds = true;
            }
        },
        created() {
            this.getTextDisclaimer();
            if (this.recommendedFunds.length) this.loading = false;
        },
        computed: {

            disclaimerDate() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            },
            recommendedFunds() {
                if (!this.$store.state.funds.items.length) return [];

                return _.cloneDeep(this.$store.state.funds.items).slice(0, 3);
            },
            allFunds() {
                if (!this.$store.state.funds.items.length) return [];

                return _.cloneDeep(this.$store.state.funds.items).slice(3);
            }
        }
    }
</script>

