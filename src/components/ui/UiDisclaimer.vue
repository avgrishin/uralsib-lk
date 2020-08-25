<template>
    <span :is="tag" v-if="date">
        * Информация указана на {{ date }} исключительно в информационных целях (без учета комиссий, налога и прочих расходов) и может отличаться от итогового значения на момент совершения операции.
    </span>
</template>

<script>
export default {
    name: 'ui-disclaimer',

    props: {
        tag: {
            default: 'span',
        }
    },

    computed: {
        date() {
            try {
                return this.$store.state.user.state.portfolioDate;
            } catch (e) {
                return '';
            }
        },
    },
};
</script>
