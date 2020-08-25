<template lang="pug">
    .step
        .step__item(:class="{ step__item_disable: (step == 2) }") Контактные данные
        .step__item(:class="{ step__item_disable: (step == 1) }") Паспортные данные
</template>

<script>
    export default {
        props: ['step']
    }
</script>


