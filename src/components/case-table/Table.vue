<template lang="pug">
	table.case-table.g-tl_f
		caption.case-table__title.g-hide_md ПИФы
		thead
			tr
				th.case-table__th-name Наименование актива
				th Доля в портфеле
				th Стоимость активов #[br] на конец периода*
				th Доход*
				th Доходность*
				th
			tr.case-table__thead-line(v-if="table_data.total_pif")
				td ПИФы
				td(v-html="formatNumber(table_data.share_pif, {maximumFractionDigits: 2}) + '%'")
				td(v-html="formatCurrency(table_data.total_pif)")
				//- td(v-html="formatCurrency(table_data.profit_pif)")
				//- td(v-html="table_data.profit_2.toLocaleString('ru-RU') + '%'")
				td(v-html="")
				td(v-html="")
				td
		tbody.case-table__style-icon_xs(v-if="table_data.data && !table_data.data.length")
			tr.table__tr
				td.table__td(colspan="5") В Вашем порфтеле нет активов.
		tbody.case-table__thead-du.g-show_md(hidden)
			tr.case-table__thead-line
				td.g-ws_nw.g-hidden-b.g-hide_md
					span.h4 ПИФы
				td.g-hide_xs
				td.case-table__total-line-price(title="ПИФы")
					span(v-html="formatCurrency(table_data.total_pif)")
				td.g-hide_xs
				td.g-hide_xs
				td.g-hide_xs
		row(v-for="(row, index) in table_data.data" :key="index" :row="row" :row_index="index" v-if="row.type!='ДУ'")
		tbody.case-table__thead-du(v-if="table_data.total_du")
			tr.case-table__thead-line
				td.g-ws_nw.g-hidden-b.g-hide_md
					span.h4 Доверительное управление
				td.g-hide_xs(v-html="formatNumber(table_data.share_du, {maximumFractionDigits: 2}) + '%'")
				td.case-table__total-line-price(title="Доверительное управление")
					span(v-html="formatCurrency(table_data.total_du)")
				td.g-hide_xs
				td.g-hide_xs
				td.g-hide_xs
		row(v-for="(row, index) in table_data.data" :key="index" :row="row" :row_index="index" v-if="row.type=='ДУ'")
		tfoot
			tr.case-table__total-line
				td.g-ws_nw.g-hidden-b.g-hide_md
					span.h4 Итого по портфелю:
				td.g-hide_xs
				td.case-table__total-line-price(title="Итого по портфелю:")
					span.g-fw_5.g-fs_15(v-html="formatCurrency(table_data.total)")
				td.g-hide_xs
				td.g-hide_xs
				td.g-hide_xs
</template>
<script>
	import Row from './Row';

	export default {
		components: { Row },
		props: ['table', 'dates'],
		watch: {
			dates(val) {
				this.getData();
			}
		},
		data() {
			return {
				income: 0,
				profit: 0,

			}
		},
		created() {
			this.getData();
		},
		methods: {
			formatNumber(item, options) {
				return item ? item.toLocaleString('ru-RU', options) : '';
			},
			getData() {
				axios.all([
					axios.get('/reports/TotalIncomes'),
					axios.get('/reports/TotalProfits')
				]).then(axios.spread((income, profit) => {
					//this.income = income.data[0].income;
					this.profit = profit.data[0].fromOperBeg;
				}));
			}
		},
		computed: {
		/*    income_front(){
				let data = _.cloneDeep(this.table.data);
				let sum = data.map(item => {
					window.log(item.profit);
					this.income += item.profit
				});
				window.log(sum);
				return sum
			},*/
			table_data() {

				if (this.table) {
					return this.table;

				}
				return {};
			}
		}
	}
</script>
