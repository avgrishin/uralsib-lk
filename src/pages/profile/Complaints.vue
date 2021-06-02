<template lang="pug">
    article.g-mb_2
        h2 Обращения
        input(type="button" @click.prevent="newMessage" value='Написать сообщение в УК "Уралсиб"').btn.btn_primary
        template(v-if="msgs")
            template(v-if="msgs.length==0")
                div.g-mb_6.g-mt_2.g-pb_6.g-pt_6 У Вас еще нет сообщений.                
            div(v-for="(msg, index) in msgs" :key="index").g-mt_2.msg-card
                div
                    strong(v-html="msg.name")
                small(v-html="msg.inDateTime")
                div
                    strong(v-html="`${ msg.theme == 1 ? 'Получить консультацию' : msg.theme == 2 ? 'Запрос в техническую поддержку' : msg.theme == 3 ? 'Подать жалобу/обращение' : '' }`").black
                p
                    i(v-html="msg.text").g-mt_1
</template>
<script>
export default {
    data() {
        return {
            msgs: null
        }
    },
    mounted() { 
        axios.get(`/message`).then(({ data }) => { console.log(data); this.msgs = data; });
    },
    methods: {
        newMessage() {
            this.$router.push('/cmp');
        }
    }
}
</script>
<style lang="scss">
    .black { color:black; }
    .msg-card{ border: 1px solid #eaf1f8; padding: 1em; border-radius: 10px; background-color: #dcdcdc }
</style>