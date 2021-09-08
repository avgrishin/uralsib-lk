<template lang="pug">
    #chartdivusd.chartdiv(style="border-bottom: 1px solid #123d77; border-top: 1px solid #123d77; padding-bottom: 1px;" ref="chartdivusd")
</template>
<script>
    import moment from 'moment';

    import { graphAbrv } from '../../mixins';
    const Highcharts = require('highcharts/highstock');
    export default {
        mixins: [graphAbrv],
        props: ['profitChart', 'min', 'max', 'range'],
        data() {
            return {
                chart: null,
            }
        },
        watch: {
            profitChart(val, oldVal) {
                if (this.chart && val.length > 0) {
                    this.updateChart();
                }
            },
            dateFilter(val) {
                let x = this.chart.xAxis[this.chart.xAxis.length - 1];

                if (val[0] && val[1] && val[0] >= x.min && val[0] <= x.max && val[1] >= x.min && val[1] <= x.max) {
                    this.chart.xAxis[0].setExtremes(val[0], val[1]);
                } else if (val[0] && !val[1] && val[0] >= x.min && val[0] <= x.max) {
                    this.chart.xAxis[0].setExtremes(val[0], x.max);
                } else if (!val[0] && val[1] && val[1] >= x.min && val[1] <= x.max) {
                    this.chart.xAxis[0].setExtremes(x.min, val[1]);
                } else if (!val[0] && !val[1]) {
                    this.chart.xAxis[0].setExtremes();
                } else {
                    flash(['Дата вне допустимого диапазона'], 'error');
                }
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
            },
            tab_data(val) {
                if (!this.chart && val) this.generateChart();
            }
        },
        methods: {
            updateChart() {
                this.chart.update({
                    series: [{
                        name: this.profitChart[0].name,
                        type: 'area',
                        data: this.profitChart[0].data,
                        color: '#123d77',
                        gapSize: 0,
                        lineWidth: 1,
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.Color('#eaf1f8').setOpacity(0.8).get('rgba')],
                                [1, Highcharts.Color('#eaf1f8').setOpacity(0).get('rgba')]
                            ]
                        },
                        threshold: null
                    }]
                }, true, true);
            },
            generateChart() {
                let THIS = this
                const valueFormat = this.formatCurrency;
                const abbreviate = this.abbreviate;

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

                this.chart = Highcharts.stockChart('chartdivusd', {
                    exporting: {enabled: false},

                    chart: {
                        spacingBottom: 0,
                        spacingLeft: 1,
                        // spacingRight: 0,
                        spacingTop: 0
                    },

                    navigator: {
                        handles: {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent'
                        },
                        outlineWidth: 1,
                        outlineColor: '#123d77',
                        maskFill: 'rgba(18, 61, 119, 0.1)',
                        series: {
                            type: 'areaspline',
                            fillOpacity: 0.05,
                            dataGrouping: {
                                smoothed: true
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
                                return THIS.numberWithSpaces(this.value) +  ' $';
                            },
                            x: 8,
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
                                color: '#8a96ae',
                                fontSize: '13px'
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
                                enabled: false,
                                dateTimeLabelFormats: {
                                    week: ['%e %b %Y', '%e %b %Y', '%e %b %Y']
                                }
                            }
                        }
                    },

                    tooltip: {
                        pointFormatter: function () {
                            let val = valueFormat(this.y, false, 'Доллары США');

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

                    series: [{
                        name: this.profitChart[0].name,
                        type: 'area',
                        data: this.profitChart[0].data,
                        color: '#123d77',
                        gapSize: 0,
                        lineWidth: 1,
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.Color('#eaf1f8').setOpacity(0.8).get('rgba')],
                                [1, Highcharts.Color('#eaf1f8').setOpacity(0).get('rgba')]
                            ]
                        },
                        threshold: null
                    }]
                });
            }
        },
        computed: {
            dateFilter() {
                return [this.min, this.max];
            },
            tab_data() {
                return this.profitChart.length;
            }
        }
    }
</script>

