<template lang="pug">
    form.filter
        fieldset
            .g-row
                .control
                    .g-col.g-mb_1
                        label.h4.g-fw_3.filter__title(for="FILTER_DATE_FROM" v-html="(text ? text : 'Укажите произвольный период') + ':'")
                .control
                    .g-col.g-col_md_a.g-col_lg_4
                        .g-row.control__field.filter__control
                            .control.control_date.g-col.g-col_xs_6.g-mb_0
                                .control__field
                                    input(
                                        type="text"
                                        @change="setTGDate($event, 'dateStart')"
                                        @input="setDatePicker(null, 'dateStart', null, 'filter_date_from')"
                                        @focus="openDatePicker"
                                        @keydown="closeDatePicker"
                                        v-model="dateStart"
                                        name="date_from"
                                        placeholder="дд.мм.гггг"
                                        :id="`FILTER_DATE_FROM_${id}`"
                                        ref="filter_date_from"
                                        autocomplete="false"
                                    ).field_text
                                    label(:for="`FILTER_DATE_FROM_${id}`").control__icon.icon.icon_calendar
                            .control.control_date.g-col.g-col_xs_6
                                .control__field
                                    input(
                                        type="text"
                                        @change="setTGDate($event, 'dateEnd')"
                                        @input="setDatePicker(null, 'dateEnd', null, 'filter_date_to')"
                                        @focus="openDatePicker"
                                        @keydown="closeDatePicker"
                                        v-model="dateEnd"
                                        name="date_to"
                                        placeholder="дд.мм.гггг"
                                        :id="`FILTER_DATE_TO_${id}`"
                                        ref="filter_date_to"
                                        autocomplete="false"
                                    ).field_text
                                    label(:for="`FILTER_DATE_TO_${id}`").control__icon.icon.icon_calendar
                    fieldset.g-col.g-col_xs_12(:class="{'g-col_lg_8 g-col_md_6': !button, 'g-col_lg_5': button}")
                        .control__field
                            .radio-list_inline
                                .radio.radio_flat(v-for="(option, index) in options")
                                    input(type="radio", v-model="filter" :value="index" name="CASE_FILTER_PERIOD", :id="`CASE_FILTER_PERIOD_${index}_${id}`")
                                    label(:data-name-md="option.title_md" :for="`CASE_FILTER_PERIOD_${index}_${id}`" v-html="option.title")
                    .g-col.g-col_md_3.g-ta_r(v-if="button")
                        a(href="#").btn.btn_secondary Развернутый вариант
</template>
<script>
    import moment from 'moment';

    export default {
        props: ['text', 'button'],
        data() {
            return {
                dateStart: '',
                dateEnd: '',
                filter: '0',
                temp: false,

                id: Math.random().toString(36).substr(2, 9),
                options: [{
                    title: 'С начала управления',
                    title_md: 'Все'
                }, {
                    title: '3 месяца',
                    title_md: '3 мес.'
                }, {
                    title: '6 месяцев',
                    title_md: '6 мес.'
                }, {
                    title: '1 год',
                    title_md: '1 год'
                }, {
                    title: '3 года',
                    title_md: '3 года'
                }, {
                    title: '5 лет',
                    title_md: '5 лет'
                }]
            }
        },
        mounted(){
            this.$refs.filter_date_from.DatePickerX.init()
            this.$refs.filter_date_to.DatePickerX.init()
        },
        watch: {
            filter(val) {
                let start = 0;

                if (val == '0') start = 0;
                else if (val == '1') start = this.getStartOf(3, 'month');
                else if (val == '2') start = this.getStartOf(6, 'month');
                else if (val == '3') start = this.getStartOf(1, 'year');
                else if (val == '4') start = this.getStartOf(3, 'year');
                else if (val == '5') start = this.getStartOf(5, 'year');

                if (val != '-1') {
                    this.dateStart = '';
                    this.dateEnd = '';

                    this.$emit('start_of', [start, val]);
                }
            },
            dates(val) {

                //if (!val) this.filter = '0';
            }
        },
        methods: {
            setTGDate(event, direction) {
                const id = (direction == 'dateStart') ? 'filter_date_to' : 'filter_date_from';
                const picker = event.target.DatePickerX;
                const op_picker = this.$refs[id].DatePickerX;
                this.temp = op_picker;
                
                let date = picker.getValue();
                this[direction] = date;
                date = moment.utc(date, 'DD.MM.YYYY').toDate();
                
                if (id == 'filter_date_to') op_picker.setMinDate(date);
                else if (id == 'filter_date_from') op_picker.setMaxDate(date);

                if (this.dates) this.filter = '-1';

                this.filterData(direction);
            },
            getStartOf(amount, type) {
                return moment.utc().subtract(amount, type).toISOString();
            },
            filterData(date) {
                if (!moment.utc(this[date], 'DD.MM.YYYY').isValid()) return;

                const time = moment.utc(this[date], 'DD.MM.YYYY').toISOString();
                this.$emit('filter_time', [date, time]);
            }
        },
        computed: {
            dates() {
                return this.dateStart || this.dateEnd;
            }
        }
    }
</script>
