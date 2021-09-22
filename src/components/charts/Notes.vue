<template lang="pug">
    .chart-note-list
        div(v-for="item in list",:class="'chart-note chart-note_' + item.alias +' ' + (modificationclass || '') ")
            div(:class="'chart-note__value ' + (item.direction || '')" v-if="item.income" v-html="item.income")
            div(class="chart-note__value" v-if="!item.income" v-html="item.share + '%'")
            .chart-note__icon
                svg-inline(:src="getSrcFundIcon(item.alias)")
            .chart-note__name(v-html="'УРАЛСИБ' + item.name")

</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                required: true
            },
            modificationclass:{
                type: String
            }
        },
        methods:{
            getSrcFundIcon(src){
                return '/funds/'+src+'.svg';
            }
        },
    }
</script>

<style lang="scss">
    @import "../../assets/styles/vars";
    .chart-note {
        &-list {
            margin-top: 36px;
            &:first-child {
                margin-top: 0;
            }
        }
        @include clearfix;
        color:$clr_text;
        font-size: 16px;
        &+& {
            margin-top: 30px;
        }
        &__icon {
            float: left;
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 6px;
            background-color: #ccc;
            text-align: center;
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
                height: auto;
                width: auto;
            }
            path {
                fill: #fff;
            }
            .svginline {
                display: inline-block;
                vertical-align: middle;
                width: 22px;
                height: 22px;
                svg {
                    display: block;
                    margin: auto;
                    max-width: 100%;
                    height: auto;
                }
                path {
                    transition: .3s ease-in-out;
                }
            }

        }
        &__value {
            float: right;
            font-family: $font__family_book;
            line-height: 30px;
        }
        &__name {
            margin: 7px 50px 0 49px;
            font-weight: 300;
            color:$clr_text;
        }
        @each $i, $c in $fund_color {
            &_#{$i} {
                .chart-note__icon {
                    background-color: $c;
                }
            }
        }
        &_big {
            &+& {
                margin-top: 40px;
            }
            .chart-note {
                &__icon {
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    .svginline {
                        width: 30px;
                        height: 30px;
                    }
                }
                &__name {
                    margin: 18px 82px 0 101px;
                    font-weight: 500;
                    font-size: 18px;
                    line-height: 24px;
                    color:$clr_text;
                }
                &__value {
                    font-family: $font__family_main;
                    font-weight: 500;
                    font-size: 18px;
                    line-height: 24px;
                    color:$clr_text;
                    width: 79px;
                    margin-top: 18px;
                    text-align: right;
                    &.up,
                    &.down {
                        position: relative;
                        &:before {
                            content: '';
                            display: block;
                            position: absolute;
                            top: 4px;
                            left: 0;
                            width: 14px;
                            height: 18px;
                            background: $icon_bg -1000px 0;
                        }
                    }
                    &.up:before {
                        background-position: -950px 0;
                    }
                }
            }
        }
    }
</style>