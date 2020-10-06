<template lang="pug">
    article.content
        .g-d_f.g-jc_sb
            h1(style="line-height:1") Сообщения
            b-search.g-ml_6.g-flex_1.g-mt_1_m(@search="setFilter" v-if="0")
        .message-list
            a(v-if="0").message-thumb.g-row.g-row_table.g-btn-hover.g-row_b_xs
                .g-col.g-col_lg_2.g-col_md_2.message-thumb__date 14.08.2018
                .g-col.g-col_lg_8.g-col_md_7.message-thumb__name
                    |Уважаемые клиенты!
                    br
                    |Мы рады вам сообщить о доступности новой версии Личного кабинета с новыми возможностями для управления личными финансами.
                    |Старая версия Кабинета клиента будет доступна в течение месяца.
                .g-col.g-col_lg_2.g-col_md_3.g-hide_xs
                    span.btn.btn_secondary.btn_primary_h.btn_block.g-btn-hover__btn Подробнее
            div(v-if="1")
                a(v-for="message in filteredMessages" @click.prevent="openMessage(message)", :class="{'new': message.msgStatus == 0}").message-thumb.g-row.g-row_table.g-btn-hover.g-row_b_xs
                    .g-col.g-col_lg_2.g-col_md_2.message-thumb__date(v-html="message.date")
                    .g-col.g-col_lg_8.g-col_md_7.message-thumb__name
                        span(v-html="message.msgSubject")
                    .g-col.g-col_lg_2.g-col_md_3.g-hide_xs
                        span.btn.btn_secondary.btn_primary_h.btn_block.g-btn-hover__btn Подробнее
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                q: ''
            }
        },
        created() {
            this.readAllMessages();
        },
        methods: {

            setFilter(q) {
                this.q = q;
            },
            openMessage(message) {
                window.events.$emit('show_popup', ['message', message]);
                return axios.post('/messages/msgread', null, {
                    params: {
                        mid: message.id
                    }
                }).then((data) => {
                    this.$store.dispatch('user/getMessages');
                })
            },
            readAllMessages() {
                let messages = _.cloneDeep(this.$store.state.user.messages).filter(
                    item => item.msgStatus == 0
                ).map(item => {
                    return this.openMessage(item);
                });

                axios.all(messages).then(() => this.$store.dispatch('user/getMessages'));
            }
        },
        computed: {
            filteredMessages() {
                let data = _.cloneDeep(this.$store.state.user.messages);
                if (this.q) {
                    data = data.filter(item => {

                        let regex = new RegExp(this.q, 'i');

                        return regex.test(item.msgSubject);
                    });
                }

                return data;
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/styles/vars";

</style>