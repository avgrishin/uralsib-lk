// caseStructure

export default {
    data() {
        return {
            google_pie_chart: null,
            destroy: false
        }
    },
    mounted() {
        window.addEventListener('resize', this.initPieChart);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.initPieChart);
        this.destroy = true;
    },
    methods: {
        initPieChart() {
            this.loaded.fund_structure = true;
            this.$nextTick(() => this.drawChart());
        },
        drawChart() {
            let data = [
                ['Task', 'Struct']
            ];
            let colors = []

            let options = {
                pieHole: window.innerWidth > 768 ? 0.6 : 0.4,
                height: 400,
                pieSliceBorderColor: 'transparent',
                colors: [],
                chartArea: { 
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    width: '100%',
                    height: '100%'
                },
                legend: {
                    position: 'right',
                    alignment: 'center',
                    textStyle: {
                        fontSize: 14
                    }
                },
                fontName: 'Fira Sans',
                tooltip: {
                    isHtml: true,
                    text: 'percentage',
                    textStyle: {
                        fontSize: 14,
                        bold: false,
                        color: '#303030',
                        fontName: 'Fira Sans'
                    }
                },
            };

            if (this.pie_chart_height) options.height = this.pie_chart_height;

            _.cloneDeep(this.selected_fund_pie_chart)
                .forEach(item => {
                    data.push([item.NAME, _.round(parseFloat(item.VAL),2)])
                    //data.push([item.NAME, Number(item.VAL)])
                    switch (item.NAME.toLowerCase()) {
                        case "деньги":
                        case "денежные средства":
                        case "cash":
                        case "рубль":
                            colors.push('#cf2200');
                            break;
                        case "финансы":
                            colors.push('#28BD5F');
                            break;
                        case "акции":
                        case "акция":
                            colors.push('#93B5E2');
                            break;
                        case "машиностроение":
                            colors.push('#fded42');
                            break;
                        case "нефтегазовая":
                        case "нефтегаз":
                        case "нефть и газ":
                        case "нефтегазовый сектор":
                            colors.push('#4c9591');
                            break;
                        case "телекоммуникации":
                        case "коммуникационные сервисы":
                            colors.push('#0164a1');
                            break;
                        case "электроэнергетика":
                            colors.push('#265d41');
                            break;
                        case "потребительский сектор":
                            colors.push('#FE8039');
                            break;
                        case "транспорт":
                            colors.push('#0c36aa');
                            break;
                        case "девелоперы строители":
                        case "девелоперы+строители":
                        case "девелопмент":
                            colors.push('#66a7ff');
                            break;
                        case "драгоценные металлы":
                        case "драг. металлы":
                            colors.push('#6c4c95');
                            break;
                        case "global financials":
                        case "индексные etf":
                            colors.push('#ff9b00');
                            break;
                        case "металлургия":
                        case "металлургия и горнодобывающая":
                        case "металлургия и добыча":
                            colors.push('#5DC488');
                            break;
                        case "структурные":
                            colors.push('#920035');
                            break;
                        case "химия":
                            colors.push('#820300');
                            break;
                        case "государственные":
                        case "гос. облигации":
                            colors.push('#bb8eb2');
                            break;
                        case "субфедеральные":
                        case "субфед. облигации":
                            colors.push('#ff5f1f');
                            break;
                        case "облигации":
                        case "облигация":
                            colors.push('#2C6BC1');
                            break;
                        case "высокие технологии":
                        case "информационные технологии":
                            colors.push('#423D5F');
                            break;
                        case "здравоохранение":
                            colors.push('#ECC1CF');
                            break;
                        default:
                            colors.push('black');
                            break;
                    }
                });
            options.colors = colors;

            data = google.visualization.arrayToDataTable(data);

            if (!this.$refs.pie_chart && !this.destroy) {
                this.initPieChart();
                return;
            } else if (this.destroy) return;

            if (!this.google_pie_chart) {
                this.google_pie_chart = new google.visualization.PieChart(this.$refs.pie_chart);
            }

            this.google_pie_chart.draw(data, options);
        }
    }
};