<template lang="pug">
    div(:style="{height: height}" ref="chart_container" style="border-bottom: 1px solid #123d77;")
</template>
<script>
    import moment from 'moment';

    import { graphAbrv } from '../../mixins';
    
    export default {
        mixins: [graphAbrv],
        props: {
            dataIndex:'',
            dataProvider: {
                default: () => []
            },
            show: {
                default: false
            },
            height: {
                default: ''
            },
            graphs: {
                default: () => []
            }
        },
        data() {
            return {
                chart: null
            }
        },
        watch: {
            dataProvider() {
                this.makeChart();
            },
            show() {
                this.filterCharts();
            }
        },
        methods: {
            filterCharts() {
                this.chart.series.forEach((item, index) => {
                    if (item.name.includes('УРАЛСИБ') && this.show.indexOf(item.name) >= 0) {
                        item.setVisible(true, false);
                    } else if (item.name.includes('УРАЛСИБ') && this.graphs.find(chart => chart.name == item.name)) {
                        item.setVisible(false, false);
                    } else {
                        item.setVisible(true, false);
                    }
                });

                this.chart.redraw();
                setTimeout(() => this.chart.hideLoading(), 100);
            },
            makeChart() {
                if (this.chart) this.updateChart();
                else this.generateChart();
            },
            updateChart() {
                let data = _.cloneDeep(this.dataProvider).map(item => {
                    const colors = this.$store.state.colors;

                    if (item.name.indexOf('УРАЛСИБ') != 0) item.color = '#8e979d';
                    if(this.dataIndex) {
                        if (item.name == this.dataIndex.longName) item.color = '#8e979d'
                    }
                    else if (colors[item.name]) item.color = colors[item.name];

                    return item;
                }).sort(item => {
                    if (this.graphs.find(graph => graph.name == item.name)) return 1;
                    
                    return -1;
                })

                this.chart.update({
                    series: data
                }, false, true);

                this.filterCharts();
            },
            generateChart() {
                let THIS = this
                const Highcharts = require('highcharts/highstock');
                const valueFormat = this.formatCurrency;
                const abbreviate = this.abbreviate;
                const rubleSign = this.rubleSign;

                Highcharts.setOptions({
                    lang: {
                        months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                        shortMonths: ['Янв','Фев','Мар','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Ноя','Дек'],
                        weekdays: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
                        shortWeekdays: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                        printChart: 'Печатать график',
                        rangeSelectorZoom: '',
                        rangeSelectorFrom: 'От',
                        rangeSelectorTo: 'до',
                    },
                    chart: {
                        style: {
                            fontFamily: 'Fira Sans',
                            fontWeight: 300
                        }
                    }
                });

                this.chart = Highcharts.stockChart({
                    chart: {
                        renderTo: this.$refs.chart_container,
                        spacingBottom: 0,
                        spacingLeft: 1,
                        spacingRight: 0,
                        spacingTop: 0
                    },

                    exporting : {enabled: false},

                    navigator: {
                        handles: {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent'
                        },
                        outlineWidth: 1,
                        outlineColor: '#123d77',
                        maskFill: 'rgba(18, 61, 119, 0.1)',
                        series: {
                            type: 'line',
                            dataGrouping: {
                                smoothed: true
                            },
                            lineWidth: 1,
                            marker: {
                                enabled: false
                            },
                            lineColor: '#123d77'
                        },
                        xAxis: {
                            labels: {
                                enabled: false
                            },
                            gridLineWidth: 0
                        },
                    },
                    
                    rangeSelector: {
                        inputDateFormat : '%d-%m-%Y',
                        inputEditDateFormat : '%d-%m-%Y',
                        inputDateParser(value) {
                            return moment(value, 'DD-MM-YYYY').valueOf();
                        },
                        inputEnabled: false,
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
                    },

                    yAxis: {
                        labels: {
                            formatter: function () {
                                return '';//THIS.numberWithSpaces(this.value) +  ' ' + rubleSign;
                            },
                            x: 8,
                            step: 1,
                            align: 'left',
                            style: {
                                color: '#8a96ae',
                                fontSize: '14px'
                            }
                        },
                        opposite: false,
                        gridLineDashStyle: 'Dash'
                    },
                    xAxis: {
                        ordinal: false,
                        labels: {
                            style: {
                                color: '#8a96ae'
                            },
                            y: 40
                        },
                        lineColor: '#123d77',
                        tickLength: 0
                    },
                    connectNulls : true,
                    scrollbar: {
                        enabled: false
                    },

                    plotOptions: {
                        series: {
                            dataGrouping: {
                                dateTimeLabelFormats: {
                                    week: ['%e %b %Y', '%e %b %Y', '%e %b %Y']
                                }
                            }
                        }
                    },

                    tooltip: {
                        pointFormatter: function () {
                            let val = valueFormat(this.y*(this.x <= 1622678400000 ? 100 : 1));

                            return `<div class="g-mb_1 g-mt_1"><span style="color:${this.series.color}">${this.series.name}</span>: <b>${val}</b></div>`;
                        },
                        valueDecimals: 2,
                        shared: true,
                        split: false,
                        backgroundColor: null,
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        style: {
                            padding: 0
                        }
                    },
                    series: _.cloneDeep(this.dataProvider).map(item => {

                        const colors = this.$store.state.colors;

                        if (item.name.indexOf('УРАЛСИБ') != 0) item.color = '#8e979d';
                        else if (colors[item.name]) item.color = colors[item.name];

                        return item;
                    })
                });
            },
        }
    }
</script>
