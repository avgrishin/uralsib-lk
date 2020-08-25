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
                    span( class="fund-cart__name-primary" v-html="name")
                //- .fund-cart__name-primary(v-html="name")
            router-link(:to="`/funds/${fund.webSiteId}`" class="fund-cart__link g-bbc_t") подробнее
            .fund-cart__options

                span.fund-cart__options-text Доходность за год*:
                strong.g-f_r.fund-cart__options-val(v-html="income")
            .fund-cart__nav.g-hide_xs
                button.btn.btn_primary.fund-cart__btn.g-hide_md(@click="toOperations()" type="button") Купить
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
            toOperations() {
                this.$router.push('/operations');
            }
        },
        computed: {
            name() {
                if (this.fund.name) return this.fund.name;
                return this.fund.description.replace('УРАЛСИБ ', '');
            },
            alias() {
                if (this.fund.alias) return this.fund.alias;
                return this.fund.webSiteId;
            },
            income() {
                if (this.fund.income) return this.fund.income;
                return Number(this.fund.profitability.toFixed(2)).toLocaleString('ru-RU') + '%';
            }
        }
    }
</script>

