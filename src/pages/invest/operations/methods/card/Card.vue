<template lang="pug">
    casenav
        article.content
            .g-mb_6
                h1 Оплатить паи #[span.g-clr_gray (мои карты)]
                .h2 Выберите карту для оплаты
            form
                .g-row
                    .g-col.g-col_md_9
                        .control.card-pay-list.g-row
                            .g-col.g-col_md_4.card-pay-list__cell.g-mb_5(v-for="(card, index) in cards" :key="index" @click="selectCard(index)")
                                .card-pay-item.g-mb_3(:class="getCardClass(card, index)")
                                    div.card-pay-item__header
                                        div.card-pay-item__avatar
                                        div.card-pay-item__img-type(:class="[`card-pay-item__img-type_${card.type}`]")
                                    div.card-pay-item__body(v-html="card.number")
                                    div.card-pay-item__footer
                                        div.card-pay-item__name(v-html="card.name")
                                        div.card-pay-item__date(v-html="card.expiry")
                                .card-pay-item-control.g-lh_1
                                    a(href="#" @click.prevent="deleteCard(index)").card-pay-item-control__remove.btn-link.g-bbc_t
                                        span.icon.icon_cart.g-mr_1.g-va_m
                                        | Удалить
                                    a(href="#" @click.prevent="selectCart(card)").card-pay-item-control__select.btn-link.g-bbc_t  Выбрать
                        .control.g-mb_4
                            a.btn.btn_o(@click.prevent="addNewCard()")
                                span.g-icon.g-icon_plus.g-mr_1.g-va_m
                                | Добавить новую карту
                        .control.g-mb_4
                            .checkbox
                                input(type="checkbox", data-vv-as="условия" name="terms", v-model="terms" id="FPD_TERMS")
                                label(for="FPD_TERMS")
                                    | Настоящим я подтверждаю, что перечисляю денежные средства в доверительное управление с банковской карты, выпущенной на мое имя. Я проинформирован, что сумма фактически переданных в доверительное управление средств может отличаться от указанной на размер комиссии банка - эмитента банковской карты, взимаемой за перечисление средств в доверительное управление.
                        .control.control_nav.g-row
                            .g-col.g-col_md_3
                                input(type="submit", @click.prevent="pay()" value="Оплатить" :disabled="buttonDisabled").btn.btn_primary.btn_block
</template>
<script>
    import CaseNav from '../../../../case/CaseNav.vue'

    export default {
        components: { 'casenav': CaseNav },
        created() {
            this.$store.commit('updateCrumbs', [
                { link: '/', text: 'Портфель'},
                { link: '/operations', text: 'Операции с паями' },
                { link: '/operations', text: 'Купить Паи' }
            ]);
        },
        data() {
            return {
                cards: [
                    {
                        bank: 'uralsub',
                        type: 'master',
                        number: '4276 \xa0 1234 \xa0 5678 \xa0 9900',
                        name: 'Ivanov Ivan',
                        expiry: '01/20'
                    },
                    {
                        bank: 'alfa',
                        type: 'visa',
                        number: '4276 \xa0 1234 \xa0 5678 \xa0 9900',
                        name: 'Ivanov Ivan',
                        expiry: '01/20'
                    },
                    {
                        bank: 'tincof',
                        type: 'master',
                        number: '4276 \xa0 1234 \xa0 5678 \xa0 9900',
                        name: 'Ivanov Ivan',
                        expiry: '01/20'
                    },
                ],
                selected_card: -1,
                selected_cart_object: false,
                terms: false
            }
        },
        methods: {
            selectCard(index) {
                this.selected_card = index;
            },
            getCardClass(card, index) {
                let cardClass = {};

                let bank = `card-pay-item_${card.bank}`;
                let active = 'card-pay-item_active';

                cardClass[bank] = true;
                cardClass[active] = this.selected_card == index;

                return cardClass;
            },
            deleteCard(index) {
                this.cards.splice(index, 1);
                setTimeout(() => this.selected_card = -1, 10);
            },
            selectCart(card) {
                this.selected_cart_object = card;
                this.$store.state.funds.operations.card = card;
            },
            pay() {
                this.$router.push('/operations/buy/approve');
            },
            addNewCard() {
                window.events.$emit("show_popup", "add-new-card")
            }
        },
        computed: {
            buttonDisabled() {
                return (this.selected_card >= 0 && this.terms) == false;
            }
        }
    }
</script>
