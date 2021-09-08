<template lang="pug">
    div(:style="{height: height}" style="border-bottom: 1px solid #123d77; border-top: 1px solid #123d77; padding-bottom: 1px;" ref="chart_container")
</template>
<script>
    import moment from 'moment';

    import { graphAbrv } from '../../mixins';
    
    export default {
        mixins: [graphAbrv],
        props: {
            dataProvider: {
                default: () => []
            },
            height: {
                default: ''
            },
            min: {
                default: 0
            },
            max: {
                default: 0
            },
            range: {
                default: -1
            },
            scha: {
                default: false
            }
        },
        data() {
            return {
                chart: null,
            }
        },
        watch: {
            dataProvider() {
                this.makeChart();
            },
            show(val) {
                if (val.length == 0) this.chart.series.forEach(item => item.show());
                else this.chart.series.forEach((item, index) => {
                    if (val.indexOf(index) >= 0 || index == this.chart.series.length - 1) item.show();
                    else item.hide();
                });
            },
            dateFilter(val) {
                let x = this.chart.xAxis[this.chart.xAxis.length - 1];

                if (val[0] && val[1] && val[0] >= x.min && val[0] <= x.max && val[1] >= x.min && val[1] <= x.max)
                    this.chart.xAxis[0].setExtremes(val[0], val[1]);
                else if (val[0] && !val[1] && val[0] >= x.min && val[0] <= x.max)
                    this.chart.xAxis[0].setExtremes(val[0], x.max);
                else if (!val[0] && val[1] && val[1] >= x.min && val[1] <= x.max)
                    this.chart.xAxis[0].setExtremes(x.min, val[1]);
                else if (!val[0] && !val[1]) this.chart.xAxis[0].setExtremes();
            },
            range(val) {
                if (val < 0 || val > 5) return;
                
                let y;
                let x = this.chart.xAxis[this.chart.xAxis.length - 1];

                if (val == 0) return this.chart.xAxis[0].setExtremes();
                else if (val == 1) y = moment(x.max).subtract(3, 'months');
                else if (val == 2) y = moment(x.max).subtract(6, 'months');
                else if (val == 3) y = moment(x.max).subtract(1, 'year');
                else if (val == 4) y = moment(x.max).subtract(3, 'years');
                else if (val == 5) y = moment(x.max).subtract(5, 'years');

                this.chart.xAxis[0].setExtremes(y.valueOf(), x.max);
            }
        },
        methods: {
            makeChart() {
                if (this.chart) this.updateChart();
                else this.generateChart();
            },
            updateChart() {
                this.chart.update({
                    series: _.cloneDeep(this.dataProvider).map(item => {
                        const colors = this.$store.state.colors;

                        if (colors[item.name] && !this.scha) item.color = colors[item.name];

                        return item;
                    })
                }, true, true);
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
                            borderColor: 'transparent',
                            width: 10,
                            height: 25
                        },
                        outlineWidth: 1,
                        outlineColor: '#123d77',
                        maskFill: 'rgba(18, 61, 119, 0.1)',
                        series: {
                            type: 'areaspline',
                            fillOpacity: 0.05,
                            dataGrouping: {
                                smoothed: false
                            },
                            lineWidth: 0,
                            marker: {
                                enabled: false
                            },
                            fillColor: '#eaf1f8'
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
                                return ''; //THIS.numberWithSpaces(this.value) +  ' ' + rubleSign;
                            },
                            x: 8,
                            align: 'left',
                            style: {
                                color: '#8a96ae',
                                fontSize: '12px'
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
                    scrollbar: {
                        enabled: false
                    },
                    connectNulls : true,

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

                        if (colors[item.name] && !this.scha) item.color = colors[item.name];

                        return item;
                    })
                });
            }
        },
        computed: {
            dateFilter() {
                return [this.min, this.max];
            }
        }
    }
</script>
