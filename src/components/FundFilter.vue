<template lang="pug">
    form.fundfilter
        fieldset
            .g-row
                .control
                    .g-col.g-col_md_a.g-col_lg_4
                    fieldset.g-col.g-col_xs_12.g-col_lg_8.g-col_md_6
                        .control__field
                            .radio-list_inline
                                .radio.radio_flat(v-for="(option, index) in ['Рубль РФ','Доллар США']")
                                    input(type="radio", v-model="filter" :value="index" name="CASE_FILTER_FUND", :id="`CASE_FILTER_FUND_${index}`")
                                    label(:for="`CASE_FILTER_PERIOD_${index}`" v-html="option")
</template>
<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                filter: '0'
            }
        },
        watch: {
            filter(val) {
                this.$emit('fundid', [val]);
            }
        },
        methods: {
            filterData(date) {
                if (!moment.utc(this[date], 'DD.MM.YYYY').isValid()) return;

                const time = moment.utc(this[date], 'DD.MM.YYYY').toISOString();
                this.$emit('filter_time', [date, time]);
            }
        }
    }
</script>
