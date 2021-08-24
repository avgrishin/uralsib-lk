<template>
    <span :is="tag" v-if="date">
        * Данные указаны на {{ date }}.
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
