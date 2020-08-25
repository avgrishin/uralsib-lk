<template lang="pug">
    .g-row.fund-cart-list.g-row_narrow_md
        .g-col.g-col_lg_4.g-col_md_4(v-for="fund in funds",:key="`${fund.id}-${Math.random()}-fundcart`")
            fund-cart(:fund="fund" :showBG="showBG")
</template>
<script>
    import fundCart from '../../../components/Fund-cart.vue';

    export default {
        props: {
            funds: {
                required: true
            },
            showBG: {
                required: false,
                default: false
            }
        },
        components: {
            'fund-cart': fundCart
        }
    }
</script>

