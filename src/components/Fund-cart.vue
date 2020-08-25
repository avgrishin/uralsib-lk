<template lang="pug">
    article(:class="'fund-cart fund-cart_'+alias")
        .fund-cart__bg(v-if="showBG" hidden)
            svg-inline(:src="getSrcFundIcon(alias)")
        .fund-cart__inner
            header.fund-cart__name
                .fund-cart__icon(hidden)
                    svg-inline(:src="getSrcFundIcon(alias)")
                h4.fund-cart__title
                    span.fund-cart__label Фонд УРАЛСИБ
                    span(class="fund-cart__name-primary" v-html="name")
                //- span.fund-cart__count {{fund.quantity}} шт.
            router-link(:to="`/funds/${fund.webSiteId}`" class="fund-cart__link g-bbc_t") подробнее
            .fund-cart__options
                span.fund-cart__options-text Доходность за год*:
                strong.g-f_r.g-d_f_xs.fund-cart__options-val {{income}} 
                    //- span.g-hide_ld.j-show_xs {{fund.quantity}} шт. 
            .fund-cart__nav.g-hide_xs
                button.btn.btn_primary.fund-cart__btn.g-hide_md(@click="fundOperation(alias)" type="button") Купить
                .g-show_md(hidden)
                    router-link(:to="`/funds/${fund.webSiteId}`" class="btn btn_primary fund-cart__btn") Подробнее

</template>

<script>
    export default {
        props: {
            fund: {
                type: Object,
                required: true
            },
            showBG: {
                required: false,
                default: false
            }
        },
        methods: {
            fundOperation(id) {
                let data = { funds: [] };
                let fund = JSON.parse(JSON.stringify(this.$store.state.funds.items.find(item => item.webSiteId == id)));

                if (!fund) return;

                data.funds.push(fund);

                this.$store.commit('funds/setOperation', data);


                if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_FUND_CART');}//яндекс цель купить

                 this.$router.push('/operations/buy');

            },
        },
        computed: {
            name() {
                return this.fund.description.replace('УРАЛСИБ ', '');
            },
            alias() {
                return this.fund.webSiteId;
            },
            income() {
                return this.currencyFormat.format(this.fund.profitability) + '%';
            }
        }
    }
</script>

