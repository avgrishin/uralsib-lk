
import {Money, VMoney} from 'v-money'
export default {
    directives: {money: VMoney},
    data() {
        return {
            money: {
                decimal: ',',
                thousands: ' ',
                prefix: '',
                suffix: '\u20BD',
                precision: 0,
                masked: false
            },
            amount: '',
            amount_min: '',

        }
    },
    methods: {
        getError(field) {
            return this.errors.items.find(item => item.field == field);
        },
        changeInput() {
            let value = this.amount;
            value = value.replace(/\D/g, "")
            let valueP = '0'

            if (value.length == 16) {
                this.amountT = this.amount
            } else if (value.length >= 17) {
                this.amount = this.amountT
            }
        },
        styleHidden(value) {
            if (value) {
                value = value.replace(/\D/g, "")
                return value == 0
            }
        },
    },
    computed: {
        tollTipShow() {
            let value = this.amount
            value = value.replace(/\D/g, "")
            return (value >= 0 && value < this.amount_min)
        },

    },
}