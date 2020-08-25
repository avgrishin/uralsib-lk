<template lang="pug">
        article.content
            h1.g-hide_xs Частичный вывод денежных средств
            form.form_approve
                fieldset.g-mb_4
                    legend.control-label-top-title_xs
                        .h2 Уведомление о намерении изъять из управления Активы
                    .control.g-col_md_4
                        .control__label-top
                            label(for="id-UK") Управляющая компания
                        .control__field
                            input(type="text", name="full_name" id="id-UK"  value="АО «УК УРАЛСИБ»",disabled).field_text
                    .control.g-col_md_4
                        .control__label-top
                            label(for="id-FIO1") Клиент
                        .control__field
                            input(type="text", name="full_name" id="id-FIO1" v-validate="'required'" :value="fullName",disabled).field_text
                    p.control
                        |В соответствии с Договором доверительного управления ценными бумагами
                        br
                        |от 15.12.2017 года № УН2017ДУИ-512 прошу вывести из управления Активы
                        br
                        |в виде денежных средств на сумму

                    .g-row
                        .control.g-col.g-col_md_3
                            .control__label-top
                                label(for="sum") Сумма
                            .control__field
                                .tooltip-wrap(:class="{active: tollTipShow}")
                                    .tooltip(v-html="`Минимальная сумма ${amount_min} ${rubleSign}`")
                                    input(type="text", id="sum" v-model="amount" v-money="money"  name="sum" v-validate="`required|mink:${amount_min}`" @input="changeInput()"  :class="{'show-currency' : styleHidden(amount), invalid_force: getError('sum') }").field_text
                                    span
                        .control.g-col.g-col_md_3
                            .control__label-top &nbsp;
                            small.text-note
                                | Вы не можете вывести более 50% денежных средств через личный кабинет. Уменьшите сумму или обратитесь к инвестиционному консультанту.
                fieldset
                    legend.h2.g-mb_3 Выше указанные средства прошу перечислить на банковский счёт:
                    bank-form


</template>

<script>

    import BankForm from './BankForm';


    import { amount} from '../../mixins';




    export default {
        mixins: [amount],
        components: {'bank-form':BankForm },
        data() {
            return {

            }
        },
        watch: {

        },
        created() {
            this.amount_min = 10000;
            this.amount = this.amount_min.toString();

        },
        computed:{
            fullName(){
                if(!Object.keys(this.$store.state.user.info).length) return;

                return this.$store.state.user.info.client.longName
            }
        }


    }
</script>

