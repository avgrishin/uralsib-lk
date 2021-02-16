<template lang="pug">
    article.content.fond-detail
        .g-hidden.g-show_md
            .fond-detail__title.g-mb_4
                h1.g-mb_0(v-html="portfolio.description")
                .fond-detail__title-img.g-hidden.g-show_xs
                    svg-inline(:src="`/funds/${portfolio.webSiteId}.svg`")
        section.page-section.g-row.g-row_flex.g-mb_9.g-mb_7_xs
            .g-col.g-col_lg_2.g-col_md_3.g-or_1_xs
                .g-col_xs_12
                    .fond-detail__avatar.g-mb_4.g-hide_xs
                        svg-inline(:src="`/funds/${portfolio.webSiteId}.svg`")                    
            .g-col.g-col_lg_5.g-col_md_12.g-pt_4_md.g-or_1_md.g-or_0_xs.g-pt_0_xs
                .g-col_xs_12
                    .g-mb_2.g-d_b.g-hide_md(hidden)
                        .h1.g-mb_0 ПОРТФЕЛЬ#[br]{{ portfolio.description }}
                    .g-mb_1.h4 Минимальная сумма инвестирования: #[span.g-ws_nw(v-html="`10 000 ${rubleSign}`")]
                    .g-mb_2.h4 Рекомендуемый срок инвестирования: #[span.g-ws_nw от 1 года]
                    p.g-mb_1(v-text="fundText")
                    //- a(:href="`https://www.uralsib-am.ru/funds/`" target="_blank").g-fw_5 Полное описание портфеля
            .g-col.g-col_lg_5.g-col_md_a
                .fond-detail__info.g-lh_1
                    .g-mb_2
                        .h3.g-mb_0(v-html="`Доходность портфеля за год*: ${portfolio.profitability}`")
                    .g-mb_1.g-fw_5.g-mb_2(v-html="`Риск - ${portfolio.risk || ''}`")
                    div.g-d_f.g-d_b_xs
                        div.g-mr_2.g-mb_2_xs.g-mr_0_xs
                            .control__label-top
                                label(for="amount") Введите сумму
                            .tooltip-wrap(:class="{active: tollTipShow}")
                                .tooltip(v-html="`Минимальная сумма 10000 ${rubleSign}`")
                                input(type="text" name="amount" v-model="amount" v-validate="'required|mink:10000'" :class="{'show-currency' : styleHidden(amount), invalid_force: errors.has('qty') }" @input="changeInput(amount)" v-money="money" placeholder="Введите сумму" ref="amount").field_text
                                span
                        div
                            a(class="btn btn_primary g-pl_4 g-pr_4 g-mt_2" href="#" @click.prevent="buy") Купить
        section.page-section
            h2.page-section__caption Структура портфеля фонда
        table.case-table.g-mb_9.g-mb_7_xs(v-if="portfolio.structure")
            caption.case-table__title Структура портфеля фонда
            thead
                tr
                    th Наименование фонда
                    th Доля
                    th Доходность за год
            tr(v-for="(row, index) in portfolio.structure" :key="index")
                td
                    router-link(:to="`/funds/${row.id}`") {{ row.fond }}
                td {{ row.part }}%
                td {{ row.profitability.toLocaleString('ru-RU', {maximumFractionDigits: 2}) }}%
        p.g-mt_6.g-col_8
            ui-disclaimer.text-note(tag="small")
</template>
<script>
    import moment from 'moment';
    import {Money, VMoney} from 'v-money'

    import UiDisclaimer from '../components/ui/UiDisclaimer';

    export default {
        props: ['id'],
        components: { UiDisclaimer, Money },
        directives: { money: VMoney },
        data() {
            return {
                // id: "p1",
                amount: '',
                amountT: '',
                fundDescDate: '',
                fundText: '',
                money: {
                    decimal: ',',
                    thousands: ' ',
                    prefix: '',
                    suffix: '\u20BD',
                    precision: 0,
                    masked: false
                }
            }
        },
        watch: {
            portfolio(val) { this.$store.commit('updateCrumbs', [{ link: '/funds', text: 'Паевые инвестиционные фонды' }, { link: '', text: val.description }]); }
        },
        created() {
            this.getTextDisclaimer();
            this.getFundText();
        },
        mounted() {
            this.$refs.amount.focus();
        },
        methods: {
            getTextDisclaimer() {
                axios.get('/reference/getsitetext', { params: { place: 'FundDescDate' }}).then(({data}) => { this.fundDescDate = data.outText; });
            },
            getFundText() {
                axios.get('/reference/getsitetext', { params: { place: this.id }}).then(({data}) => { this.fundText = data.outText; });
            },
            styleHidden(value) {
                if (value) return value.replace(/\D/g, "") == 0;
            },
            changeInput(value) {
                let valueL = value.replace(/\D/g, "")
                if(valueL.length == 16) {
                   this.amountT = this.amount
                } else if (valueL.length >= 17) {
                    this.amount = this.amountT
                }
            },
            buy() {
                let amounts = {};
                if (this.amount.toNumber() >= 10000) {
                    this.$store.state.funds.portPif.find(i => i.webSiteId === this.id).structure.forEach(el => {
                        amounts[el.id] = Math.floor(this.amount.toNumber()*el.part/100);
                    });
                    this.$store.commit('funds/setAmounts', amounts);
                    this.$router.push('/operations');
                }
                else
                {
                    this.$refs.amount.focus();
                }
            },
        },
        computed: {

            portfolio() {
                let pp = _.cloneDeep(this.$store.state.funds.portPif.find(i => i.webSiteId === this.id));
                if (!pp) return {};
                pp.profitability = pp.profitability.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + '%';
                return pp;
            },
            tollTipShow() {
                let value = this.amount
                value = value.replace(/\D/g, "")
                return (value > 0 && value < 10000)
            },
            disclaimerDate() {
                return moment().subtract(2, 'days').format('DD.MM.YYYY');
            }
        }
    }
</script>

// <style lang="scss">
    @import "../../src/assets/styles/vars";
    .fond-detail {
        &__title{
            @include media($width_xs){
                display:flex;
                align-items:center;
                &-img{
                    order:-1;
                    width:67px;
                    margin-right:10px;
                }
                .svginline{
                    width:100%;
                    height:100%;
                }
            }
        }
//         &__date{
//             margin-bottom:nth($m_em, 2);
//         }
        &__info{
            background-color:$clr_blue;
            padding:nth($m_em, 4);
            border-radius:$br_1;

            @include media($width_xs){
                padding:nth($m_em, 2);
                margin:nth($m_em, 4) 0;
                font-size:.8em;
                width:100%;
            }

//             &-decor{
//                 height:1px;
//                 background:$clr_gray_1;
//                 margin:1em 0;
//                 opacity:.2;
//             }
        }

//         &__results {
//             display: inline-block;
//             margin-top: 0.5em;
//             color: $clr_highlight;
//         }
    }
    .fond-detail__avatar{
        position:relative;
        @include box-decor(1, 0, 1);


        height:160px;
        padding:2em;
        svg{
            display:block;
            max-width:100%;
            width:auto;
            height:65%;
            position:absolute;
            left:0;
            right:0;
            top:0;
            bottom:0;
            margin:auto;
        }

        @include media($width_xs){
            @include box-decor(0, 0, 0);
        }
    }
</style>
