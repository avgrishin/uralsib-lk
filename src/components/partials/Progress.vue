<template>
    <div class="progress">

        <progress max="100" class="progress__tag g-hidden" :value="numb"></progress>
        <div class="progress__line" :style="text"></div>
    </div>
</template>
<script>
    export default {
        props: {
            percentage: {
                default: 0
            }
        },
        computed: {
            numb() {
                return this.percentage;
            },
            text() {
                return 'width:' + this.percentage + '%';
            }
        }
    }
</script>

