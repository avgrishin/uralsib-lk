<template lang="pug">
        article.content
            h1 Актуальные фонды и портфели фондов
            .spinner(v-if="loading")
            fund-list(:funds="getFunds" :showBG="false")
            div(v-if="!showAllFunds")
                .g-row.g-row_narrow_md
                    .g-col.g-col_md_4
                        a(href="#" @click.prevent="toggleAllFunds").btn.btn_block.btn_primary Все фонды
            p.g-mt_6.g-col_8
                ui-disclaimer.text-note(tag="small")
                    span {{ disclaimerDate }}


</template>

<script>
    // import fundThumb from '../../../components/Fund-thumb.vue';
    import FundList from './FundList.vue';
    import moment from 'moment';
    import UiDisclaimer from '../../../components/ui/UiDisclaimer';
    export default {
        components: {
            UiDisclaimer,
            // 'fund-thumb': fundThumb,
            FundList
        },
        data(){
            return {
                showAllFunds: false,
                loading: true
            }
        },
        methods: {
            buyFunds() {
                // let amounts = [];
                // amounts.push({ webSiteId: 'ufk', amt: 2000 });
                // amounts.push({ webSiteId: 'usit', amt: 4000 });
                let amounts = {};
                amounts['ufk'] = 2000;
                amounts['usit'] = 4000;
                this.$store.commit('funds/setAmounts', amounts);
                this.$router.push('/operations');
            },
            toggleAllFunds() {
                this.showAllFunds = true;
            }
        },
        computed: {
            disclaimerDate() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            },
            getFunds() {
                let arr = [];
                // const ugold = this.$store.state.funds.items.find(item => item.name == "ПИФУЗ");
                // const ufp = this.$store.state.funds.items.find(item => item.name == "ПИФП");
                // const usit = this.$store.state.funds.items.find(item => item.name == "ПИФСИТ");
                // const pp1 = ugold && ufp ? (ugold.profitability*20+ufp.profitability*80)/100 : 0;
                // const pp2 = usit && ufp ? (usit.profitability*50+ufp.profitability*50)/100 : 0;

                // arr.push({ description: 'Для рационального инвестора', webSiteId: 'p1', profitability: pp1 });
                // arr.push({ description: 'Для решительного инвестора', webSiteId: 'p2', profitability: pp2 });
                if (this.$store.state.funds.items.length > 0) this.loading = false;
                if (!this.showAllFunds)
                    arr = [...this.$store.state.funds.portPif, ...this.$store.state.funds.items].slice(0, 3);
                else
                    arr = [...this.$store.state.funds.portPif, ...this.$store.state.funds.items];
                return  arr; //_.cloneDeep(this.$store.state.funds.items).slice(0, 3);
            }
        }
    }
</script>

