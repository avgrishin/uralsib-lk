<template>
    <svg class="step__svg" xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62">
        <circle cx="31" cy="31" r="30" :style="style"/>
    </svg>
</template>
<script>
    export default {
        props: {
            percentage: {
                default: 0
            }
        },
        computed: {
            style() {
                return {
                    'stroke-dashoffset': 188 * (1 - this.percentage / 100)
                };
            }
        }
    }
</script>
