<template lang="pug">
    article.content
        .g-d_f.g-jc_sb.g-ai_b.g-d_b_xs
            router-link(to="/operations/buy").btn.btn_o.btn_p_s.g-as_b.g-or_1.g-mb_6.g-d_b_xs.g-mb_4_xs Купить паи
            h1 Фонды с наилучшей доходностью
        .spinner(v-if="loading")
        fund-list(:funds="recommendedFunds" :showBG="true")

        .fund-list(v-show="showAllFunds")
            fund-list(:funds="allFunds" :showBG="true")
        div
            .g-row.g-row_narrow_md
                p.g-col.g-col_md_4(v-show="!showAllFunds")
                    a(href="#" @click.prevent="toggleAllFunds").btn.btn_block.btn_primary Все фонды
                p.g-col.g-col_md_4
                    router-link(to="/du",  class="btn btn_secondary btn_block g-mb_1_xs") Доверительное управление
                p.g-col.g-col_md_4
                    router-link(to="/du",  class="btn btn_secondary btn_block g-mb_1_xs") ИИС
</template>

<script>
    import fundThumb from '../../components/Fund-thumb.vue';
    import FundList from '../invest/funds/FundList.vue';

    export default {
        components: {
            'fund-thumb': fundThumb,
            FundList
        },
        watch: {
            recommendedFunds(val) {
                if (val.length) this.loading = false;
            }
        },
        data(){
            return {
                showAllFunds: false,
                loading: true
            }
        },
        methods: {
            toggleAllFunds() {
                this.showAllFunds = !this.showAllFunds;
            }
        },
        created() {
            if (this.recommendedFunds.length) this.loading = false;
        },
        computed: {
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

<style lang="scss">


</style>