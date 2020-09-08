<template lang="pug">
    article.content
        h1 Фонды с наилучшей доходностью
        fund-list(:funds="recommendedFunds" :showBG="true")
        div(v-show="!showAllFunds")
            .g-row.g-row_narrow_md
                .g-col.g-col_md_4
                    a(href="#" @click.prevent="toggleAllFunds").btn.btn_block.btn_primary Все фонды
        .fund-list(v-show="showAllFunds")
            fund-list(:funds="allFunds" :showBG="true")
        p.g-mt_6.g-col_8
            ui-disclaimer.text-note(tag="small")

</template>

<script>
    import fundThumb from '../../../components/Fund-thumb.vue';
    import FundList from '../../invest/funds/FundList.vue';
    import moment from 'moment';
    import UiDisclaimer from '../../../components/ui/UiDisclaimer';
    export default {
        components: {
            UiDisclaimer,
            'fund-thumb': fundThumb,
            FundList
        },
        data(){
            return {
                showAllFunds: false
            }
        },
        methods: {
            toggleAllFunds() {
                this.showAllFunds = true;
            }
        },
        computed: {
            disclaimerDate() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            },
            recommendedFunds() {
                if (!this.$store.state.funds.items) return [];

                return this.$store.state.funds.items.slice(0, 3);
            },
            allFunds() {
                if (!this.$store.state.funds.items) return [];

                return this.$store.state.funds.items.slice(3);
            }
        }
    }
</script>

