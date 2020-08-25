<template lang="pug">
    form.popup__content.popup__content_sz_2(:class="{'hide_popup': hidePopup }" autocomplete="off")
        .popup__title.g-mb_3
            .h2.g-mb_0 Подтверждение изменений в анкете
        .popup__text
            .popup__info
                .g-mr_4.g-hide_xs
                    svg-inline.popup__info-icon(src="/icons/info.svg")
                .h3.g-lh_15.g-mb_0 После подписания Анкеты внесение любых  изменений будет недоступно до момента получения ответа Регистратора.
            p Для подтверждения изменений и подписания анкеты с новыми данными, нажмите на кнопку «Подписать».
            p.g-mb_3 Если вам необходимо внести изменения в остальные пункты анкеты нажмите «Перейти далее».
            .error-links__wrapper(v-if="!validateFieldOldUser.totalValid")
                .error-links__header Заполните обязательные поля на следующий страницах:
                ul.error-links
                    router-link(
                        tag="li"
                        v-for="(item, index) in validateFieldOldUser.routerLinks"
                        :key="index"
                        :to="{path: `${item.path}`}"
                        class="error-link"
                        v-if="!item.valid"
                        v-on:click.native="closeFormStepPopup(item.path)"
                    )
                        a(v-html="item.name")
            .g-row
                .g-col.g-col_md_6.g-mb_2_xs
                    a(href="#" @click.prevent="next").btn.btn_o.btn_block Перейти далее
                .g-col.g-col_md_6
                    a(href="#" @click.prevent="finish", :class="{ disabled: !validateFieldOldUser.totalValid }").btn.btn_primary.btn_block Подписать

</template>

<script>
    export default {
        data() {
            return {
                validateFieldOldUser: {
                    totalValid: true
                },
                currPath: this.$router.currentRoute.path,
                hidePopup: true,
            }
        },
        created() {
            this.setValidateFieldOldUser();
            this.$store.commit('questionaryDataUpdate', true);
            
        },
        methods: {
            setValidateFieldOldUser() {
                if (this.$store.state.user.state.authState == 2) {
                    axios.get('/ClientProfile/draft').then(({
                        data
                    }) => {
                        if (!data) return;
                        let draftValid = {
                            routerLinks: {
                                pesonal: {
                                    name: 'Персональные данные',
                                    path: '/user/personal',
                                    valid: data.personalData.isValid
                                },
                                passport: {
                                    name: 'Паспортные данные',
                                    path: '/user/passport',
                                    valid: data.passport.isValid
                                },
                                address: {
                                    name: 'Адрес регистрации',
                                    path: '/user/address',
                                    valid: data.addresses.isValid
                                },
                                bank: {
                                    name: 'Банковские реквизиты',
                                    path: '/user/bank',
                                    valid: data.bankingDetail.isValid
                                }
                            },
                            totalValid: data.isValid
                        }
                        
                        this.validateFieldOldUser = draftValid
                        setTimeout(() => {
                             this.hidePopup = false
                        }, 150);
                    });
                }
            },
            next() {
                const map = {
                    '/user/personal': '/user/passport',
                    '/user/passport': '/user/address',
                    '/user/address': '/user/bank',
                    '/user/bank': '/user/personal'
                };

                this.$store.commit('setFormStepStatus', true);
                let currPath = this.$router.currentRoute.path
                let stepPath = this.$store.state.formStep.path
                if (stepPath == '') {
                    this.$router.push(map[this.currPath]);
                } else {
                    this.$router.push(stepPath);
                }
            },
            finish() {
                this.$store.commit('setFormStepStatus', true);
                this.$router.push('/user/finish');
                this.$store.commit('setFormStepStatus', false);
            },
            closeFormStepPopup(link) {
                window.log(link)
                if (link == this.$router.currentRoute.path) {
                    window.events.$emit('close_popup')
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .popup__content_sz_2 {
        transition: all .3s ease;
    }
    .hide_popup {
        opacity: 0;
    }
</style>


