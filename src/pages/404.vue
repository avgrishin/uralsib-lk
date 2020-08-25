<template lang="pug">
    .page.g-ta_c.typo
        .b-title-404
            h1.b-title-404__title
                | 4
                span.b-title-404__img 0
                | 4

        .g-fs_3.g-fw_3.g-mb_1.g-lh_1 Страница #[br.g-hidden.g-show_xs]не найдена
        p.g-mb_2 Извините, но запрашиваемой страницы не существет. #[br.g-hide_xs] Пожалуйста вернитесь на главную или попробуйте еще раз
        router-link(to="/",class="btn btn_primary") Перейти на главную страницу
</template>
<script>
    export default {
        
    }
</script>

<style lang="scss">
    .b-title-404{
        &__title{ font-size:21vh; color:#d2d9e4; line-height:1; margin-bottom:0; max-height:190px; }
        &__img{ background:url(/dist/img/us_logo_small2.svg) no-repeat center/contain; display:inline-block; vertical-align:middle; color:transparent; position:relative; top:-25px }
    }
</style>

