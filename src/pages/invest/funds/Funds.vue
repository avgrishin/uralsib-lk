<template lang="pug">
    invest-nav
        .page.page_
            .page__head
                .page__head-controls
                    //- a(href="#",title="Конструктор портфеля").btn.btn_framed.btn_light.btn_s
                        span.icon.icon_puzzle
                .h1 Вам могут подойти
            .page__entry
                .page-section
                    .fund-list
                        fund-list(:funds="funds")
                .page-section
                    .page-section__caption Все фонды
                    .carousel.carousel_fund-thumb
                        carousel(:paginationEnabled="false",:navigationEnabled="true",:perPage="6")
                            slide(v-for="fund in funds",:key="fund.applicationId")
                                fund-thumb(:fund="fund")

</template>

<script>
    import fundThumb from '../../../components/Fund-thumb.vue';
    import FundList from './FundList.vue';
    import InvestNav from '../InvestNav';

    export default {
        components: {
            'fund-thumb': fundThumb,
            FundList,
            InvestNav
        },
        computed: {
            funds() {
                return this.$store.state.funds.items;
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/styles/vars";

    .fund {
        &-list {
            &__head {
                margin-bottom: 47px;
                @include clearfix;
            }
            &__caption {
                font-size: 24px;
                line-height: 40px;
                color:$clr_primary;
                display: inline-block;
            }
            &__controls {
                float: right;
                .btn {
                    margin-left: 21px;
                }
            }
            &__container {
                .g-col_md_4:nth-child(3) ~ .g-col_md_4{
                    margin-top: $grid-gutter;
                }
            }
        }
    }

</style>