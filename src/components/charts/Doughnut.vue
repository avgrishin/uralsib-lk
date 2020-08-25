<script>
    import { Doughnut, mixins } from 'vue-chartjs'

    export default {
        extends: Doughnut,
        props: ['data', 'total'],
        watch: {
            data(val, oldVal) {
                // window.log(oldVal)
                // window.log(val)
                if (!oldVal.length && !this.initialized) {
                    this.initialized = true;
                    if (this.$data._chart) this.$data._chart.destroy();
                    
                    setTimeout(() => {
                        this.$nextTick(() => this.makeChart());
                    }, 50);
                }
            }
        },
        data() {
            return {
                initialized: false
            }
        },
        methods: {
            makeChart() {
                this.renderChart({
                    labels: this.labels,
                    datasets: [
                        {
                            backgroundColor: this.colors,
                            data: this.series
                        }
                    ]
                },
                {
                    responsive: true, 
                    maintainAspectRatio: false,
                    cutoutPercentage: 60,
                    legend: { display: false },
                    tooltips: {
                        enabled: false,
                        custom(tooltipModel) {
                            let tooltipEl = document.querySelector('#chartjs-tooltip');

                            if (tooltipModel.opacity === 0) return tooltipEl.style.opacity = 0;

                            tooltipEl.classList.remove('above', 'below', 'no-transform');

                            if (tooltipModel.yAlign) tooltipEl.classList.add(tooltipModel.yAlign);
                            else tooltipEl.classList.add('no-transform');

                            if (tooltipModel.body) {
                                let tooltip = JSON.parse(tooltipModel.body[0].lines[0].replace(/: [\d]*.[\d]*$/, ''));
                                let html = `
                                <div class="tooltip-body">
                                    <div class="tooltip-icon">${tooltip.icon}</div>
                                    <div class="tooltip-name">
                                        <p>${(tooltip.id=="du")?'Стратегия ':''}  ${tooltip.name.replace('Стратегия ', '')}</p>
                                    </div>
                                    <div class="tooltip-value">
                                        <span>${tooltip.value}</span>
                                    </div>
                                </div>
                                `;

                                tooltipEl.innerHTML = html;
                            }

                            let position = this._chart.canvas.getBoundingClientRect();
                            tooltipEl.style.opacity = 1;
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.left = tooltipModel.caretX + 'px';
                            tooltipEl.style.top = tooltipModel.caretY + 'px';
                        }
                    },
                    plugins: {
                        datalabels: {
                            color: 'white',
                            formatter: function(value, context) {
                                return value + '%';
                            },
                            display: function(context) {
                                let dataset = context.dataset;
                                let count = dataset.data.length;
                                let value = dataset.data[context.dataIndex];

                                return  value > count * .5;
                            },
                        }
                    },
                    elements: {
                        center: {
                            text: this.total ? this.formatCurrency(this.total) : '',
                            color: '#22497F',
                            fontStyle: 'Fira Sans',
                            sidePadding: 20
                        },
                        arc: {
                            borderWidth: 0
                        }
                    },
                    onClick: (event, elements) => {
                        let chartData = elements[0]['_chart'].config.data;
                        let idx = elements[0]['_index'];

                        let label = JSON.parse(chartData.labels[idx]);
                        this.$emit('segment', label.id)
                    }
                });
            }
        },
        computed: {
            labels() {
                let tooltips = [];
                let toolTipsClone = [];
                if (!this.data) return tooltips;

                let getLabels = () => {
                    this.data.filter(item => item.id && item.share).forEach((item, index) => {
                        let tooltip = {};

                        tooltip.id = item.id;
                        tooltip.name = item.name;
                        tooltip.value = this.formatCurrency(item.amountVal, false, item.Val);
                        let url = item.pif == 'ДУ' ? `dist/img/strategies/${tooltip.id}.svg` : `dist/img/funds/${tooltip.id}.svg`;
                        axios({
                            method: 'get',
                            url: url,
                            baseURL: '',
                        }).then(({data}) => {
                            tooltip.icon = data;
                            tooltips.push(tooltip);
                           
                            if (index == this.data.length -1) {
                                setTimeout(() => {
                                    tooltips = _.sortBy(tooltips, ['name']);
                                    tooltips.forEach((item, index) => {
                                        toolTipsClone.push(JSON.stringify(item));
                                    });
                                }, 100);
                            }
                        }).catch(() => {
                            if (item.pif == 'ДУ') {
                                axios({
                                    method: 'get',
                                    url: `dist/img/funds/null.svg`,
                                    baseURL: '',
                                }).then(({data}) => {
                                    tooltip.icon = data.replace(/fill=".*?"/,`fill="${item.color || this.$store.state.colors.colorsStrategies['s-def'][0]}"`);
                                    tooltips.push(tooltip);
                                    if (index == this.data.length -1) {
                                        setTimeout(() => {
                                            tooltips = _.sortBy(tooltips, ['name']);
                                            tooltips.forEach((item, index) => {
                                                toolTipsClone.push(JSON.stringify(item));
                                            });
                                        }, 100);
                                    }
                                });
                            }
                            
                        })
                    });

                };

                getLabels();
                return toolTipsClone;

            },
            colors() {
                if (!this.data) return [];

                let data = JSON.parse(JSON.stringify(this.data)).filter(item => item.id && item.share);
                data = data.map(item => item.color);
                return data;
            },
            series() {
                if (!this.data) return [];

                let data = JSON.parse(JSON.stringify(this.data)).filter(item => item.id && item.share);
                data = data.map(item => item.share);
                return data;
            }
        }
    }
</script>
