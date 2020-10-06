<template lang="pug">
    div
        casenav
            section(v-show="selected_tab == 0")
                .g-row.g-mb_2.g-row_ib
                    .g-col.g-col_md_7.g-col_lg_6.g-mb_2_xs
                        .chart-structure(:class='{spinner:!loaded.case_structure}')
                            .chart-structure__caption Название активов #[br.g-hidden.g-show_xs] в портфеле:*
                            .chart-structure__content.js-scroll(ref="scrollbot")
                                .chart-structure-item(v-if="loaded.case_structure && !fundsList.length") В Вашем портфеле нет активов.
                                .chart-structure-item(v-for="(item, index) in fundsList" :key="index" v-show="loaded.case_structure")
                                    .chart-structure-item__name(v-if="item.pif!='ДУ'")
                                        span.g-hide_xs(v-html="'УРАЛСИБ '")
                                        span(v-html="item.name.replace('УРАЛСИБ ', '')")
                                    router-link(v-else, class="chart-structure-item__name", :to="iisDuOpen(item)")
                                        span.g-hide_xs(v-html="'Стратегия '")
                                        span(v-html="item.name.replace('Стратегия ', '')")
                                    .chart-structure-item__numb.g-ws_nw
                                        .chart-structure-item__indicator
                                            .chart-structure-item__indicator--val(:class="indicatorClass(item)",:style='`width:${item.share}%`')
                                        .chart-structure-item__val(v-html="formatCurrency(item.amountVal, false, item.Val)")
                    .g-col.g-col_md_4.g-mb_2_m_xs(:class='{spinner:!loaded.case_structure}')
                        #chart_2(style="position: relative")
                            doughnut-chart(:data="fundsList" :total="case_table.total" @segment="onSegmentClicked")
                            #chartjs-tooltip.case-structure-tooltip(style="position: absolute")
                .g-row.g-row_flex.g-mt_2_m_xs.g-mb_1_m_xs(ref="fund_case_options")
                    .fund-short-col.g-col.g-col_lg_3.g-col_md_6(v-for="fund in userFunds" @click="selectFund(fund)")
                        fund-short.g-col_xs_12(:fund="fund" :selected="fund == selected_fund")
                    section.g-col.fund-short-result(:data-order="selectedFundIndex" v-show="loaded.pif")
                        div.g-col_xs_12(:class="{ 'g-hidden': selected_fund_hidden }")
                            .g-row.g-pt_6
                                .g-col.g-col_lg_6
                                    ul.g-mb_5.page-section__nav.g-mb_3_xs.g-mt_0
                                        li.g-mr_4.g-ib
                                            a(href="#" @click.prevent="selected_tab_sub = 0" :class="{active: selected_tab_sub == 0}").nav__link.h2.g-ib.g-bbc_t.g-mb_0 Динамика стоимости пая
                                        li.g-mr_4.g-ib
                                            a(href="#" @click.prevent="selected_tab_sub = 1" :class="{active: selected_tab_sub == 1}").nav__link.h2.g-ib.g-bbc_t.g-mb_0 Динамика СЧА
                                    .g-mt_6.g-mt_4_xs.page-section.g-col_xs_12(ref="fund_case_structure")
                                        div(v-show="selected_tab_sub == 0")
                                            fund-chart(
                                                :dataProvider="selected_fund_price_graph"
                                                height="500px"
                                                v-show="loaded.fund_price_chart"
                                            )
                                            .spinner(v-show="!loaded.fund_price_chart")
                                        div(v-show="selected_tab_sub == 1")
                                            fund-chart(
                                                :dataProvider="selected_fund_scha_graph"
                                                :scha="true"
                                                height="500px"
                                                v-show="loaded.fund_scha_chart"
                                            )
                                            .spinner(v-show="!loaded.fund_scha_chart")
                                .g-col.g-col_lg_6
                                    ul.g-mb_5.page-section__nav.g-mb_3_xs.g-mt_0.g-mt_4_md
                                        li.g-mr_4.g-ib
                                            span().nav__link.h2.g-ib.g-bbc_t.g-mb_0.active Структура портфеля фонда
                                    div.chart-structure-case.g-mt_6(ref="pie_chart" v-show="loaded.fund_structure")
                                    .spinner(v-show="!loaded.fund_structure")
        p.ofbottom_1.oftop_1: small.text-note
            ui-disclaimer(tag="span")
</template>
<script>
	import moment from 'moment';

	import Doughnut from '../../components/charts/Doughnut';
	import FundChart from '../../components/charts/FundChart';
	import FundShort from '../../components/Fund-short';
	import CaseNav from './CaseNav';
	import colorsFunds from '../../../ajax/colors.json';

	import { caseStructure } from '../../mixins';
    import UiDisclaimer from '../../components/ui/UiDisclaimer';

	export default {
		components: {
            UiDisclaimer,
			'doughnut-chart': Doughnut,
			'fund-short': FundShort,
			'casenav': CaseNav,
			FundChart
		},
		mixins: [caseStructure],
		watch: {
			selected_fund(val, oldVal) {
				if (oldVal && val.id == oldVal.id) return;

				this.getFundData();
			},
			userFunds(val) {
				if (val.length && window.innerWidth > 768) {
					this.selected_fund = val[0];
					this.selected_fund_hidden = false;
				}
			},
			fundsList(val, oldVal) {
				if (oldVal.length) return;

				setTimeout(() => {
					if (this.scrollbot && typeof this.scrollbot.refresh == 'function') this.scrollbot.refresh();
					else this.initScroller();
				}, 100);
			}
		},
		data(){
			return {
				case_table: {},

				total: 0,
				selected_tab: 0,
				selected_tab_sub: 0,
				selected_fund_hidden: true,
				selected_fund: false,
				selected_fund_pie_chart: [],
				selected_fund_price_graph: [],
				selected_fund_scha_graph: [],

				loaded: {
					case_structure: false,
					fund_price_chart: false,
					fund_scha_chart: false,
					fund_structure: false,
					pif:false,
				},

				scrollbot: null
			}
		},
		created() {
			this.$store.commit('toggleCrumbs', true);
			if (window.innerWidth > 768) this.selected_fund_hidden = false;

			if (this.userFunds.length && !this.selected_fund) this.selectFund(this.userFunds[0]);

			this.getCaseTableData();
		},
		methods:{
		    scrollToCharts() {
		        if (!this.$refs.fund_case_options) {
		            return;
                }

                this.$refs.fund_case_options.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth'});
            },
			indicatorClass(item) {
				if (item.pif == 'ДУ') {
					let scodeL = item.sCode.toLowerCase();
					let getColor = colorsFunds.colorsStrategies[scodeL];
					if (!getColor) {
						return 's-def';
					} else {
						return item.id;
					}
				} else {
					return item.id;
				}
			},
			getCaseTableData() {
				axios.get('/reports/AssetsStruct').then(({data}) => { //AssetsEstimateDU
					let table_data = {
						total: 0,
						data: []
					};

					if (!data.length) {
						this.loaded.balance = true;
						this.loaded.case_structure = true;
						return this.case_table = table_data;
					}
					//data = data.filter((item)=>item.outqnt > 0);
					data.forEach(elem=>{

						if(elem.pif=="ДУ") {
							elem.sCode = elem.smallIcon
							elem.smallIcon='Styles/Images/PrtfIcons/du-s.jpg';
						} else  {

							this.loaded.pif=true;
						}
					});
					let funds = _.groupBy(data, 'prtf');

					for (let name in funds) {
						let items = funds[name];

						let item = this.formatTableData(items);

						table_data.total += item.amount;
						table_data.data.push(item)
					}
					let index=0;
					table_data.data = table_data.data.map(item => {

						item.share = item.amount * 100 / table_data.total;
						item.children = item.children.map(child => {
							child.share = child.amount * 100 / table_data.total;
							return child;
						});

						return item;
					})


					this.loaded.balance = true;
					this.loaded.case_structure = true;

					this.case_table = table_data;
					this.case_table.data = this.case_table.data.filter(item => item.id && item.share);
				})
			},
			formatTableData(items) {
				let data = {
					id: 'unknown',
					name: '',
					amount: 0,
					amountVal: 0,
					Val: '',
					profit: 0,
					profit_per: 0,
					pif:'',
					children: [],
					sCode: ''
				}

				let colors = colorsFunds.colors;


				items.forEach(item => {
					//if (item.outqnt != 0) {
						let matches = [];
						if (item.smallIcon) matches = item.smallIcon.match(/\/([a-z0-9]*)-s.jpg$/);
						if (matches[1]) data.color = colors[matches[1]];

						data.id = matches ? matches[1] : 'unknown';
						data.name = item.prtf;
						data.pif = item.pif;
						data.amount += item.outamnt;
						data.amountVal += item.outamntusd > 0 ? item.outamntusd : item.outamnt;
						data.Val = item.outamntusd > 0 ? 'Доллары США' : 'Рубли РФ';
						data.profit += item.prlosT_NR;
						data.profit_per += item.profiT_2;
						data.sCode = item.sCode;
						data.children.push({
							name: item.opeR_ACC,
							amount: item.outamnt,
							profit: this.formatCurrency(item.prlosT_NR),
							profit_per: item.profiT_2.toLocaleString('ru-RU', {maximumFractionDigits: 2})
						})

						if (item.pif == 'ДУ') {
							let scodeL = item.sCode.toLowerCase();
							let getColor = colorsFunds.colorsStrategies[scodeL];
							if (!getColor) getColor = colorsFunds.colorsStrategies['s-def']
							data.color = getColor && getColor[0];
							data.id = scodeL || 'unknown';
						}
					//}
				});

				data.amount = data.amount;
				data.profit = this.formatCurrency(data.profit);
				data.profit_per = data.profit_per.toLocaleString('ru-RU', {maximumFractionDigits: 2});

				return data;
			},
			getFundData() {
				this.loaded.fund_chart = false;
				this.loaded.fund_price_chart = false;
				this.loaded.fund_scha_chart = false;

				axios.get('/ajax-lk/getProfitChart.php', {
					params: {
						fund_id: [this.selected_fund.id]
					},
					baseURL: 'https://www.uralsib-am.ru/'
				}).then(({data}) => {

					this.selected_fund_price_graph = data.data;

					this.loaded.fund_price_chart = true;
				});

				axios.get('/ajax-lk/getSCHAChart.php', {
					params: {
						fund_id: [this.selected_fund.id]
					},
					baseURL: 'https://www.uralsib-am.ru/'
				}).then(({data}) => {
					this.selected_fund_scha_graph = data.data;

					this.loaded.fund_scha_chart = true;
				});

				axios.get('/ajax-lk/getFundStructure.php', {
					params: {
						fund: this.selected_fund.id
					},
					baseURL: 'https://www.uralsib-am.ru/'
				}).then(({data}) => {
					this.selected_fund_pie_chart = data;

					this.initPieChart();
				});
			},
			selectFund(fund) {
			    this.scrollToCharts();
				if (this.selected_fund == fund && window.innerWidth <= 768) {
					this.selected_fund_hidden = !this.selected_fund_hidden;
					this.selected_fund = false;
				} else if (this.selected_fund != fund) {
					this.selected_fund = fund;
					this.selected_fund_hidden = false;
				}
			},
			onSegmentClicked(id) {
				let fund = this.userFunds.find(item => item.webSiteId == id);

				if (fund) this.selectFund(fund);
			},
			initScroller() {
				if (this.$refs.scrollbot) {
					this.scrollbot = new scrollbot('.js-scroll', 12);

					if (!this.scrollbot || typeof this.scrollbot.setStyle != 'function') return;

					this.scrollbot.setStyle({
						background: '#fff',
						'z-index': '2',
						'border-radius': '50%',
						'height': '12px'
					}, {
						background: '#fff'
					});

					window.onresize = () => this.scrollbot.refresh();
				}
			}
		},
		computed: {
			userFunds() {
				if (!this.$store.getters['funds/userFunds']) return [];
				else if (!this.case_table.data) return [];

				return _.cloneDeep(this.$store.getters['funds/userFunds']).filter(item => {
					return this.case_table.data.find(fund => fund.id == item.webSiteId);
				}).map(item => {
					item.description = item.description.replace('УРАЛСИБ ', '');
					return item;
				}).sort((a, b) => {
					let textA = a.description.toUpperCase();
					let textB = b.description.toUpperCase();
					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
			},
			fundsList() {
				if (!this.case_table.data) return [];

				let data = _.cloneDeep(this.case_table.data).filter(item => item.id && item.share);
				/*let duIndex=0
					data = data.map((item,index)=>{
						duIndex++;
						item.share=item.share-2;
						return item
					})
				let duObj = {
					amount: 35672.5,
					children: {name: "0231730832", amount: 35672.5, profit: "-148,44 ₽", profit_per: "-0,01", share: 28.239991279227866},
					color: "#002e6c",
					id: "du",
					name: "ДУ Сбалансированная NEW",
					profit: "-148,44 ₽",
					profit_per: "-0,01",
					share: duIndex*2
				}
				data.push(duObj)*/
				data = data.map(item => {
					item.share = Number(Math.round((item.share) + 'e1') + 'e-1');
					return item;
				});

				data = _.sortBy(data, ['name']);

				return data;
			},
			selectedFundIndex() {
				if (!this.selected_fund) return -1;

				return this.userFunds.indexOf(this.selected_fund);
			},
			dateDisclaimer() {
				return moment().subtract(2, 'days').format('DD.MM.YYYY');
			}
		}
	}
</script>
