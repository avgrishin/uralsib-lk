<template lang="pug">
    .g-col.g-col_lg_4.g-mb_4_md.step-questionnaire
        nav.step.g-pt_0_md
            router-link(
                to="/user/personal"
                tag="a"
                class="step__item"
                :class="{complete: S_PROGRESS.personalDataRate == 100}"
                active-class="active"
            )
                .step__progress
                    smallProgress(:percentage="S_PROGRESS.personalDataRate")
                    .step__checkstep.g-hidden.g-show_xs
                        svg-inline(src="/icons/checkstep.svg")
                span.icon.icon_person.sz_l
                .h2.g-mb_0 Персональные данные
            router-link(
                to="/user/passport" 
                tag="a"
                class="step__item" 
                :class="{complete: S_PROGRESS.passportRate == 100}"
                active-class="active"
            )
                .step__progress
                    smallProgress(:percentage="S_PROGRESS.passportRate")
                    .step__checkstep.g-hidden.g-show_xs
                        svg-inline(src="/icons/checkstep.svg")
                span.icon.icon_passport.sz_l
                .h2.g-mb_0 Паспортные данные
            router-link(
                to="/user/address" 
                tag="a" 
                class="step__item" 
                :class="{complete: S_PROGRESS.addressesRate == 100}"
                active-class="active"
            )
                .step__progress
                    smallProgress(:percentage="S_PROGRESS.addressesRate")
                    .step__checkstep.g-hidden.g-show_xs
                        svg-inline(src="/icons/checkstep.svg")
                span.icon.icon_address.sz_l
                .h2.g-mb_0 Адрес регистрации
            router-link(
                to="/user/bank" 
                tag="a" 
                class="step__item" 
                :class="{complete: S_PROGRESS.bankingDetailsRate == 100}"
                active-class="active"
            )
                .step__progress
                    smallProgress(:percentage="S_PROGRESS.bankingDetailsRate")
                    .step__checkstep.g-hidden.g-show_xs
                        svg-inline(src="/icons/checkstep.svg")
                span.icon.icon_bank.sz_l
                .h2.g-mb_0 Банковские реквизиты
</template>
<script>
    import SmallProgress from '../../../components/partials/SmallProgress';
	import { mapState } from 'vuex';
    export default {
        components: {SmallProgress},
        data() {
            return {
                formData: {}
            }
        },
        computed: {
        	...mapState('progress', [
        		'S_PROGRESS'
	        ])
        },
        methods: {
          
        }
       
    }
</script>
