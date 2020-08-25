<template lang="pug">
    div(:class="fundClass").fund-short
        .fund-short__icon
            svg-inline(:src="getSrcFundIcon(fund.webSiteId)")
        .fund-short__name
            | УРАЛСИБ
            .fund-short__name-primary(v-html="fund.description")
</template>

<script>
    export default {
        props: {
            fund: {
                type: Object,
                required: true
            },
            selected: {
                required: false,
                default: false
            }
        },
        computed: {
            fundClass() {
                let classes = [`fund-short_${this.fund.webSiteId}`];
                if (this.selected) classes.push('active');

                return classes;
            }
        }
    }
</script>


