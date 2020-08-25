<template lang="pug">
    footer.footer
        .g-grid
            .g-row.g-pr
                p.g-col.g-col_md_5.g-col_pr_0
                    small.footer__addr.footer__text 129110, город Москва,#[br.g-hidden.g-show_xs] Проспект Мира, дом 69, строение 1, этаж 3, пом.3-07

                p.g-col.g-col_md_2.footer__text.footer__text_phone.g-mb_3_xs(v-if="$store.state.user.authenticated")
                    a(href="tel:84957237674").g-clr_wh.g-ws_nw 8 (495) 723 76 74
                    br
                    a(href="tel:88002009058").g-clr_wh.g-ws_nw 8 (800) 200 90 58 #[small (бесплатно)]
                p.g-col.g-col_md_3.footer__text.footer__text_phone.g-mb_3_xs.g-fw_5(v-else)
                    a(href="https://www.uralsib-am.ru/" target="_blank", class="g-clr_gray g-ws_nw") сайт УК УРАЛСИБ
                    br
                    a(href="https://i.uralsib.ru/", target="_blank", class="g-clr_gray g-ws_nw") сайт Интернет банка УРАЛСИБ
                p.g-col.g-col_md_2.footer__text.footer__text_pol.g-mb_3_xs.g-fw_5
                    a(href="/downloads/PD_approval.pdf", download="PD_approval.pdf" target="_blank", class="g-clr_gray g-ws_nw") Политика конфиденциальности
                .g-col.g-col_md_2.g-f_r.g-ps
                    .g-row
                        p.g-col.g-col_xs_6.footer__copy.footer__text.footer__text-xs.g-col_xs_pr_0
                            small.g-fs_1(v-html="'© 1996 – ' + new Date().getFullYear() + ', АО «УК УРАЛСИБ»'")
                        p.g-col.g-col_xs_6.g-col_md_12.footer__redsoft.footer__text.footer__text-xs.g-ta_r
                            small.g-ib.g-ta_l.g-fs_1
                                | Разработка &nbsp;
                                br.g-hide_xs
                                | #[a(target="_blank",href="http://redsoft.ru",title="Redsoft.ru") Redsoft]
</template>

<script>
    export default {
        data() {
            return {
                phones: ['8 800 200 90 58', '8 495 705 90 58']
            }
        },
        methods: {
            convertToPhoneLink(phone){
                return 'tel:' + phone.replace(/\s/g,'');
            }
        }
    }
</script>

<style lang="scss">


</style>
