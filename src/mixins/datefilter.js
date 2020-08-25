// dateFilter
export default {
    data() {
        return {
            dateStart: undefined,
            dateEnd: undefined,
        }
    },
    methods: {
        customDate([type, date]) {
            this[type] = date;
            this.getData();
        },
        defaultDate([when]) {
            this.dateEnd = undefined;

            if (when === 0) this.dateStart = undefined;
            else this.dateStart = when;

            this.getData();
        }
    }
};