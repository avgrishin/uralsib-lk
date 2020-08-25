<template lang="pug">
    div(:class="'fund-thumb fund-thumb_'+alias")
        .fund-thumb__icon
            svg-inline(:src="getSrcFundIcon(alias)")
        .fund-thumb__name(v-html="name")
</template>

<script>
    export default {
        props: {
            fund: {
                type: Object,
                required: true
            }
        },
        computed: {
            name() {
                if (this.fund.name) return this.fund.name;
                return this.fund.description.replace('УРАЛСИБ ', '');
            },
            alias() {
                if (this.fund.alias) return this.fund.alias;
                return this.fund.webSiteId;
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/styles/vars";
    .fund-thumb {
        text-align: center;
        padding-top: 15px;
        &__icon {
            background-color: #fff;
            width: 158px;
            height: 158px;
            margin-bottom: 22px;
            border: 1px solid #eaf1f8;
            line-height: 158px;
            border-radius: 10px;
            text-align: center;
            transition: .3s ease-in-out;
            .svginline {
                display: inline-block;
                vertical-align: middle;
                height: 82px;
                width: 82px;
                svg {
                    display: block;
                    max-width: 100%;
                    height: auto;
                    margin: auto;
                    transition:$trans;
                }

            }
        }
        &__name {
            font-size: 16px;
            line-height: 24px;
            font-weight: 500;
            color: #7382a0;
        }
        &:not(:hover) .fund-thumb__icon svg{ fill:$clr_primary }
        &:hover {
            .fund-thumb {
                &__name {
                    color:$clr_primary;
                }
                &__icon {
                    border-color: #fff;
                    box-shadow: 0px 7px 28px 0 rgba(211, 218, 228, 0.4);
                }
            }
            @each $i, $c in $fund_color {
                &.fund-thumb_#{$i} {
                    .fund-thumb__icon {
                        svg{
                            fill: $c;
                        }
                    }

                }
            }
        }
    }
</style>