<template lang="pug">
    tbody.case-table__style-icon_xs(:class="{ open: isShowChild, tbody_parent: hasChildren, 'tbody_parent_children-mod': hasChildren,'case-table__style-icon_open': toggleCaseTable }" @click="toggleCaseChild")
        tr.case-table__tr-md(:class="{'case-table__tr-md_open': toggleCaseTable }" @click.prevent="jsToggleCaseTable()")
            td.case-table__td-md-name.case-table__td-icon.g-hide-b_xs(title="Наименование фонда")
                .case-table__bg-td(hidden).g-show_xs
                    svg-inline(:src="getSrcFundIcon(row.id)")
                .td__name(:class="'td__name_'+row.id")
                    .case-table__icon-wrap
                        .case-table__icon(hidden).g-show_xs
                            svg-inline(:src="getSrcFundIcon(row.id)")
                        div
                            span.g-hide_xs УРАЛСИБ
                            br
                            span(v-html="row.name.replace('УРАЛСИБ ', ' ')")
                            .icon.icon_arrow_dn.sz_s.td__name-more(v-if="hasChildren")
                .case-table__toggle.g-hidden.g-show_md
                    .g-icon-down(:class="{'g-icon-down_open': toggleCaseTable }")
            td.case-table__td-md.td_right(title="Цена пая на конец периода*" v-html="row.price").g-ws_nw
            td.case-table__td-md.td_right(title="Количество паев" v-html="row.quantity").g-ws_nw
            td.case-table__td-md.td_right(title="Стоимость активов на конец периода*" v-html="row.amount").g-ws_nw
            td.case-table__td-md.td_right(title="Доход за период*" v-html="row.profit").g-ws_nw
            td.case-table__td-promo.td_right(title="Доходность за период*" v-html="(row.profit_per || '0') + ' %'").g-ws_nw: .g-ta_r.g-ta_l_md
            td.case-table__td-md.g-hidden-b
                form.dropdown.dropdown_case(:class="{'dropdown_open': toggleDrop }" v-if="!row.history && !row.du")
                    fieldset
                        a(href="#" @click.prevent="toggleDropdown(),jsToggleCaseTable()").dropdown__name Выберите операцию
                            span.dropdown__arrow
                                span.g-icon-down.g-clr_inh(:class="{'g-icon-down_open': toggleDrop }")
                        .dropdown__content()
                            .dropdown__item
                                button.g-btn-txt(@click.prevent="fundOperation('buy', row.id)") Докупить паи
                            .dropdown__item(v-if="row.quantity")
                                button.g-btn-txt(@click.prevent="fundOperation('change', row.id)") Обменять паи
                            .dropdown__item(v-if="row.quantity")
                                button.g-btn-txt(@click.prevent="fundOperation('repay', row.id)") Погасить паи
        //0 && hasChildren добавил 0 что бы отключить
        tr.tr_child(v-show="isShowChild" v-for="(child, child_index) in row.children" v-if="hasChildren")
            td.g-ws_nw(v-html="child.name")
            td.g-ws_nw.td_right(v-html="child.price")
            td.g-ws_nw.td_right(v-html="child.quantity")
            td.g-ws_nw.td_right(v-html="child.amount")
            td.g-ws_nw.td_right(v-html="child.profit")
            td.g-ws_nw.td_right(v-html="child.profit_per + ' %'")
            td()
                form.dropdown.dropdown_case(:class="{'dropdown_open': toggleDrop }")
                    fieldset
                        a(href="#" @click.prevent="toggleDropdown").dropdown__name Выберите операцию
                            span.dropdown__arrow
                                span.g-icon-down.g-clr_inh
                        .dropdown__content()
                            .dropdown__item
                                button.g-btn-txt(@click.prevent="fundOperation('buy', row.id)") Докупить паи
                            .dropdown__item
                                button.g-btn-txt(@click.prevent="fundOperation('change', row.id)") Обменять паи
                            .dropdown__item
                                button.g-btn-txt(@click.prevent="fundOperation('repay', row.id)") Погасить паи
</template>
<script>
    export default {
        props: ['row'],
        data() {
            return {
                isShowChild: false,
                selected: false,
                toggleCaseTable: false,
                toggleDrop: false
            }
        },
        mounted() {
            window.addEventListener('click', this.clickEvents);
        },
        beforeDestroy() {
            window.removeEventListener('click', this.clickEvents);
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
            clickEvents(event) {
                if (!event.target.matches('.dropdown, .dropdown *')) this.toggleDrop = false;
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
                else if (type == 'change')this.$router.push({ path: '/operations/change', query: { fund: id } });
                else if (type == 'repay') {
                    this.openSellAlertModal({ fund: id });
                }
            },

            openSellAlertModal(query) {
                window.events.$emit('show_popup', ['sell-alert-confirm', query]);
            },
        },
        computed: {
            hasChildren() {
                return false; //скрыл
                return this.row.children.length > 1;
            }
        }
    }
</script>
