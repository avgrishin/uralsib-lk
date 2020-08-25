// doughnut
export default {
    methods: {
        getShare(data) {
            data.forEach(item => this.total += item.value);
            data.map(item => {
                item['share'] = Number(Math.round((item.value / this.total * 100) + 'e1') + 'e-1');
                return item;
            });

            data.sort((a, b) => b.value - a.value);

            return data;
        }
    }
};