<template>
<div>
    <div class="h3 g-mb_2">Ваше сообщение отправлено. <button type="button" class="g-btn-txt g-fs_05 g-clr_gray g-clr_pr_h g-fw_6" v-on:click="$emit('new-message')">Отправить новое сообщение.</button></div>
    <div class="g-row">
        <div class="g-col g-col_md_6">
            <button type="button" class="btn btn_block btn_primary" @click.prevent="returnToMain">На главную</button>
        </div>
    </div>
    <div class="h4 g-lh_15" />
</div>
</template>>

<script>
export default {
    props: {},
    
    methods: {
        returnToMain() {
            this.$router.push('/')
        },

        newMessage() {
            this.$router.push('/cmp')
        }
    }
}
</script>