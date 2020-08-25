<template lang="pug">
    .g-row.fund-cart-list.fund-cart__wrapper.g-row_narrow_md.g-mb_0_xs
        //- isotope(:options='options', :list="funds", v-if="type == 'du'")
        p.fund-cart__empty(v-if="funds.length == 0") По заданным параметрам не найдено стратегий!
        div(v-if="type == 'du'")
            transition-group(name="fade-scale" class="isotope__card-wrapper")
                .g-col.g-col_lg_4.g-col_md_6(
                    :style="`${maxHeight}`",
                    v-for="fund, index in funds",
                    :ref="`card_${index}`",
                    :key="`card_${index}`"
                )
                    .isotope__card
                        strategyCart(:fund="fund" :showBG="showBG")
        .g-col.g-col_lg_4.g-col_md_6(v-for="fund, index in funds", :key="index", v-else)
            .isotope__card
                strategyCart(:fund="fund" :showBG="showBG")
</template>
<script>
    import strategyCart from '../../components/StrategyCart.vue';
    // import isotope from 'vueisotope';

    export default {
        data() {
            return {
                maxHeight: '',
                checkIsotope: true,
                options: {
                    layoutMode : 'fitRows'
                }
            }
        },
        props: {
            iisList: {
                default: 0,
                type: Number
            },
            funds: {
                required: true
            },
            showBG: {
                required: false,
                default: false
            },
            type: {
                required: false,
                default: 'iis'
            }
        },
        components: {
            strategyCart,
            // isotope
        },
        computed: {
        },
        watch: {
            funds: function(newVal, oldVal){
                if (newVal) {
                    setTimeout(() => {
                        if (this.checkIsotope && this.iisList == newVal.length) {
                            this.getMaxH(newVal, true);
                            this.checkIsotope = false;
                        }
                    }, 3500);
                }
            }
        },
        mounted() {

        },
        created() {
            this.resizeIsotope();
            // axios('/amcontracts/16/otp/40771')
        },
        methods: {
            getMaxH(arr, firstLoad = false) {
                this.maxHeight = '';
                arr.forEach((element, index) => {
                    this.$nextTick(()=> {
                        let card = this.$refs[`card_${index}`];
                        if (card && card[0]) {
                            let thisH = card[0].offsetHeight;
                            if (thisH > this.maxHeight) {
                                // this.maxHeight = `max-height: ${thisH + 0}px;`;
                            }
                        }
                    });
                })
            },
            resizeIsotope() {
                window.addEventListener('resize', () => this.getMaxH(this.funds, true));
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', () => this.getMaxH(this.funds, true));
        },
    }
</script>

<style lang="scss">
    .isotope__card-wrapper {
        display: flex;
        flex-wrap: wrap;
    }
    
    .fade-scale {
        &-enter-active,
        &-leave-active {
            transition: all .5s;
            max-height: 650px;
        }
        &-enter,
        &-leave-to {
            transform: scale(.55);
            max-height: 0;
            opacity: 0;
        }
    }
</style>


