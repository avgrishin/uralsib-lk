<template lang="pug">
    article(:class="'fund-cart fund-cart_strategy fund-cart_'+alias")
        .fund-cart__bg(v-if="showBG" hidden)
            svg-inline(:src="getSrcStrategiesIcon(alias)")
        .fund-cart__inner
            header.fund-cart__name
                .fund-cart__icon(hidden)
                    svg-inline(:src="getSrcStrategiesIcon(alias)")
                h4.fund-cart__title(@click="goToStrategy(fund.webSiteID)")
                    span( class="fund-cart__name-primary" v-html="name")
            router-link(
                :to="{ name: 'iisDuStrategyPage', params: { strategyPrefix: fund.webSiteID }}",
                class="fund-cart__link g-bbc_t g-hidden g-show_xs"
            ) Подробнее
            ul.fund-cart__list.fund-cart__options(v-if="rStrategyType == 'iis'")
                li.fund-cart__item
                    small.fund-cart__item-name  Доходность#[sup 1], % годовых:
                    strong.fund-cart__item-text до {{expectProfit}}%{{ fund.strategyName.indexOf('Доллар') !== -1 ? '*' : '' }} {{rStrategyType == 'du' ? expectProfitText : ''}}
                li.fund-cart__item
                    small.fund-cart__item-name Допустимый риск#[sup 2]:
                    strong.fund-cart__item-text {{risk}}
                li.fund-cart__item
                    small.fund-cart__item-name(v-if="false") Краткое описание
                    strong.fund-cart__item-text  {{strategyShortDesc}}

            ul.fund-cart__list.fund-cart__options(v-if="rStrategyType == 'du'")
                li.fund-cart__item
                    small.fund-cart__item-name  Доходность#[sup 1], % годовых:
                    strong.fund-cart__item-text {{fund.sfp.expectProfit}}%{{ fund.sfp.currency !== 'Рубли РФ' ? '*' : '' }}
                li.fund-cart__item
                    small.fund-cart__item-name Допустимый риск#[sup 2]:
                    strong.fund-cart__item-text {{fund.sfp.risk}}
                li.fund-cart__item
                    small.fund-cart__item-name(v-if="false") Краткое описание
                    strong.fund-cart__item-text  {{duStrategyShortDesc}}

            .fund-cart__nav

                button.btn.fund-cart__btn.btn_primary(
                    @click.prevent="strategyOperation(fund.webSiteID)",
                    :class="{btn_disabled: buttonDisabledIIS.val && rStrategyType == 'iis'}"
                    type="button",
                    v-html="buttonDisabledIIS.text"
                )
                //- .g-show_md(hidden)
                //-     router-link(:to="{ name: 'iisDuStrategyPage', params: { strategyPrefix: fund.webSiteID }}") Подробнее


</template>

<script>
import { iisDU } from '../mixins';

export default {
    mixins: [iisDU],

    props: {
        fund: {
            type: Object,
            required: true,
            default() {
                return [];
            }
        },
        showBG: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        fundOperation(id) {
            this.$router.push('/du/strategies/sber/contract/');
        },

        goToStrategy(id) {
            this.$router.push({ name: 'iisDuStrategyPage', params: { strategyPrefix: id } });
        },

        showPopup(type) {
            window.events.$emit('show_popup', ['contact', { type: 'oldStrategy' }]);
        }
    },

    computed: {

        alias() {
            return this.fund.webSiteID;
            if (this.fund.sType == 'DU') {
                return 'du';
            } else {
                return this.fund.webSiteID;
            }
        },

        currency() {
            return this.fund.sfp && this.fund.sfp.currency == 'Рубли РФ' ? this.rubleSign : '&#36;';
        },

        duStrategyShortDesc() {
            return this.$store.state.iisDU.list.find(str => this.fund.webSiteID == str.webSiteID).ish.strategyShortDesc;
        },

        expectProfit() {
            return this.fund.ish ? this.fund.ish.expectProfit : '';
        },

        expectProfitText() {
            return this.fund.ish ? this.fund.ish.expectProfitText.replace('+', '+ ') : '';
        },

        income() {
            return this.currencyFormat.format(this.fund.profitability) + '%';
        },

        name() {
            return this.fund.strategyName;
        },

        risk() {
            return this.fund.ish ? this.fund.ish.risk : '';
        },

        strategyShortDesc() {
            return this.fund.ish ? this.fund.ish.strategyShortDesc : '';
        },

        summ() {
            return this.fund.sfp ? `от ${this.formatMillion(this.fund.sfp.minSumm)} ${this.currency}` : 'Нет данных';
        },
    }
};
</script>

