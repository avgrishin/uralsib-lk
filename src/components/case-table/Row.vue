<template lang="pug">
        tbody.case-table__style-icon_xs(:class="{ open: isShowChild, tbody_parent: hasChildren, 'tbody_parent_children-mod': hasChildren,'case-table__style-icon_open': toggleCaseTable }" @click="toggleCaseChild")
            template(v-if="row.type!='ДУ'")
                tr.case-table__tr-md(:class="{'case-table__tr-md_open': toggleCaseTable }" @click.prevent="jsToggleCaseTable()")
                    td.case-table__td-md-name.case-table__td-icon.g-hide-b_xs(title="Наименование актива")
                        .case-table__bg-td(hidden).g-show_xs
                            svg-inline(:src="getSrcFundIcon(row.id)")
                        .td__name(:class="'td__name_'+row.id")
                            .case-table__icon-wrap
                                .case-table__icon(hidden).g-show_xs
                                    svg-inline(:src="getSrcFundIcon(row.id)")
                                .case-table__name-wrapper
                                    span.g-hide_xs УРАЛСИБ
                                    br
                                    span(v-html="row.name.replace('УРАЛСИБ ', ' ')")
                                    span.case-table__name-count {{row.quantity}} шт.
                                    .icon.icon_arrow_dn.sz_s.td__name-more(v-if="hasChildren")
                        .case-table__toggle.g-hidden.g-show_md
                            .g-icon-down(:class="{'g-icon-down_open': toggleCaseTable }")
                    td.case-table__td-md(title="Доля в портфеле" v-html="formatNumber(row.share, {maximumFractionDigits: 2}) + '%'")
                    td.case-table__td-md(title="Стоимость активов на конец периода*" v-html="formatCurrency(row.amount)")
                    td.case-table__td-md(title="Доход*" v-html="row.profit")
                    td.case-table__td-promo(title="Доходность*" v-html="(row.profit_per=='-0')?'0':row.profit_per + '%'")
                    td.case-table__td-md.g-hidden-b
                        form.dropdown(:class="{'dropdown_open': toggleDrop }")
                            fieldset
                                a(href="#" @click.prevent="toggleDropdown(),jsToggleCaseTable()").dropdown__name Операция
                                    span.dropdown__arrow
                                        span.g-icon-down.g-clr_inh(:class="{'g-icon-down_open': toggleDrop }")
                                .dropdown__content()
                                    .dropdown__item
                                        button.g-btn-txt(@click.prevent="fundOperation('buy', row.id)") Докупить
                                    .dropdown__item(v-if="row.quantity")
                                        button.g-btn-txt(@click.prevent="fundOperation('change', row.id)") Обменять
                                    .dropdown__item(v-if="row.quantity")
                                        button.g-btn-txt(@click.prevent="fundOperation('repay', row.id)") Погасить

                //- tr.case-table__tr-md.tr_child(v-show="isShowChild" v-for="(child, child_index) in row.children"  v-if="hasChildren")
                //-     td.case-table__td-md(v-html="child.name")
                //-     td.case-table__td-md(v-html="formatNumber(child.share, {maximumFractionDigits: 2}) + '%'")
                //-     td.case-table__td-md(v-html="formatCurrency(child.amount)")
                //-     td(v-html="child.profit")
                //-     td.case-table__td-md(v-html="child.profit_per + '%'")
                //-     td: button.btn.btn_secondary.btn_block.g-col_md_3(@click="fundOperation(row.id)") Купить
            template(v-else)
                tr.case-table__tr-md(:class="{'case-table__tr-md_open': toggleCaseTable }" @click.prevent="jsToggleCaseTable()")
                    td.case-table__td-md-name.case-table__td-icon.g-hide-b_xs(title="Наименование стратегии")
                        .case-table__bg-td(hidden).g-show_xs
                            svg-inline(:src="getSrcFundIcon(row.id)")
                        .td__name(:class="'td__name_'+row.id")
                            .case-table__icon-wrap
                                .case-table__icon(hidden).g-show_xs
                                    svg-inline(:src="getSrcFundIcon(row.id)")
                                router-link(:to="iisDuOpen(row)")
                                    span.g-hide_md Стратегия
                                    br
                                    span(v-html="row.name.replace('Стратегия ', ' ')")
                                    .icon.icon_arrow_dn.sz_s.td__name-more(v-if="hasChildren")
                        .case-table__toggle.g-hidden.g-show_md
                            .g-icon-down(:class="{'g-icon-down_open': toggleCaseTable }")
                    td.case-table__td-md(title="Доля в портфеле" v-html="formatNumber(row.share, {maximumFractionDigits: 2}) + '%'")
                    td.case-table__td-md(title="Стоимость активов на конец периода*" v-html="formatCurrency(row.amountVal, false, row.Val)")
                    td.case-table__td-md(title="Доход*" v-html="row.profit")
                    td.case-table__td-md(title="Доходность*" v-html="(row.profit_per=='-0')?'0':row.profit_per + '%'")
                    td.case-table__td-md.g-hidden-b: button.btn.btn_primary.g-d_b.g-col_xs_12.g-col_md_3.g-col_lg_12(@click="strategyOperation(row.sCode.toLowerCase())") Пополнить
</template>
<script>
import {iisDU} from '../../mixins';
export default {
        mixins: [ iisDU ],
        props: ['row', 'row_index'],
        data() {
            return {
                isShowChild: false,
                toggleCaseTable: false,
	            rStrategyType: this.row.sCodeType ? this.row.sCodeType.toLowerCase() : '',
                toggleDrop: false
            }
        },
        methods:{
            toggleDropdown(){
                this.toggleDrop = !this.toggleDrop;
            },
            jsToggleCaseTable() {
                this.toggleCaseTable = !this.toggleCaseTable;
            },
            toggleCaseChild(){
                this.isShowChild = !this.isShowChild;
            },
            fundOperation_old(id) {
                let data = { funds: [] };
                let fund = JSON.parse(JSON.stringify(this.$store.state.funds.items.find(item => item.webSiteId == id)));

                if (!fund) return;

                data.funds.push(fund);

                this.$store.commit('funds/setOperation', data);
                if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_BALANCE_TABLE_ROW');}//яндекс цель купить
                this.$router.push('/operations/buy');
            },
            fundOperation(type, id) {
                let data = { funds: [] };
                let fund = JSON.parse(JSON.stringify(this.$store.state.funds.items.find(item => item.webSiteId == id)));

                if (!fund) return;

                data.funds.push(fund);

                this.$store.commit('funds/setOperation', data);

                if (type == 'buy')  {
                    if(typeof yaCounter50062190 !== "undefined") {yaCounter50062190.reachGoal('BTN_BUY_ANALITYCS_TABLE_DROP');}//яндекс цель купить
                    this.$router.push('/operations/buy');
                }
                else if (type == 'change') {
                    this.$router.push({ path: '/operations/change', query: { fund: id } })
                }
                else if (type == 'repay') {
                    this.openSellAlertModal({ fund: id });
                }
            },

            openSellAlertModal(query) {
                window.events.$emit('show_popup', ['sell-alert-confirm', query]);
            },

            formatNumber(item, options) {
                return (item !== undefined) ? item.toLocaleString('ru-RU', options) : '';
            },
        },
        computed: {
            hasChildren() {
                return this.row.children.length > 1;
            }
        }
    }
</script>
