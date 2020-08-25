<template lang="pug">
    section.g-pt_6.g-mb_9
        h1 ukit
        h2 Все попапы
        div.g-mb_4
            a.btn.btn_primary(@click.prevent="showPopup_confirmPersonalData") Внимание необходимо подтвердить анкетные данные
            a.btn.btn_primary(@click.prevent="showPopup_notConfirmed") Ваши данные не подтверждены
            a.btn.btn_primary(@click.prevent="showPopup_auditDoc") Проверка
            a.btn.btn_primary(@click.prevent="showPopup_confirmOperationNew") Подтвердение
            a.btn.btn_primary(@click.prevent="showPopup_requestAccepted") Ваша заявка на погашение принята

            a.btn.btn_primary(@click.prevent="showPopup_addNewCart") AddNewCart
            a.btn.btn_primary(@click.prevent="showPopup_afterRegister") AfterRegister
            a.btn.btn_primary(@click.prevent="showPopup_confirmOperation") ConfirmOperation
            a.btn.btn_primary(@click.prevent="showPopup_feedback") Feedback
            a.btn.btn_primary(@click.prevent="showPopup_passwordSuccessfully") PasswordSuccessfully
            a.btn.btn_primary(@click.prevent="showPopup_regSuccessfully") RegSuccessfully
            a.btn.btn_primary(@click.prevent="showPopup_sms") Sms
            a.btn.btn_primary(@click.prevent="showPopup_exit") Exit


        h2 Элементы формы
        form
            button.btn.btn_primary(disabled) кнопка
            .control.g-mb_4
                label.control__field.g-d_b
                    input(type="text", name="sirname", id="FR_SIRNAME").field_text.field_text_mtrl
                    span.control__label Фамилия

            .control.g-mb_4
                label.control__field.g-d_b
                    input(type="text", name="sirname", id="FR_SIRNAME").field_text.field_text_mtrl.field_dropdown
                    span.control__label Фамилия
                    .dropdown.dropdown_field
                        .dropdown__content
                            .dropdown__item
                                a(href="#" @click.prevent="sort = 'Погашение'") Погашение
                            .dropdown__item
                                a(href="#" @click.prevent="sort = 'Приобретение'") Приобретение
                            .dropdown__item
                                a(href="#" @click.prevent="sort = 'Обмен'") Обмен
        select
            option текст
            option текст
            option текст
            option текст
            option текст
            option текст
            option текст
        a(href="#").btn.btn_framed.btn_light.sz_l .btn.btn_framed.btn_light.sz_l
            span.icon.icon_chart
        a(href="#").btn.btn_primary .btn.btn_primary
        a(href="#").btn.btn_primary.btn_m .btn.btn_primary.btn_m
        a(href="#").btn.btn_primary.btn_s .btn.btn_primary.btn_s
        a(href="#").btn.btn_primary.bg_1 .btn.btn_primary.bg_1
        a(href="#").btn.btn_secondary .btn.btn_secondary
        a(href="#").btn.btn_o .btn.btn_o
        a(href="#").btn.btn_submit .btn.btn_submit
        a(href="#").btn.btn_default .btn.btn_default

        a(href="#").btn.btn_framed .btn.btn_framed
        a(href="#").btn.btn_framed.btn_light .btn.btn_framed.btn_light
        a(href="#").btn.btn_preview .btn.btn_preview
        a(href="#").btn.btn_primary.btn_light .btn.btn_primary.btn_light
        a(href="#").btn.btn_basic  .btn.btn_basic
        a(href="#").btn.btn_trans .btn.btn_trans
        a(href="#").btn.btn_file .btn.btn_file
        a(href="#").btn-link .btn-link


        h1
            | 12345 тест
            a(href="#") привет
        .h1 h1
        .h2 h2
        .title_h4 h4
        .typo
            | .typo
            label label
            p pppp pppp pppp
            p pppp pppp pppp
        .typo.sz_s
            | .typo.sz_s
            p ppp pppp
            p ppp pppp
        dl.typo-dl
            | dl.typo-dl
            p pppp ppp pppp
            b bbbb
            dt.typo-dl__dt
                | qweqweqwe
            dd.typo-dl__dd
                | qweqweqwe
                p pppp p ppp p pp
                p pppp p ppp p pp
            dt.typo-dl__dt
                | qweqweqwe
            dd.typo-dl__dd
                | qweqweqwe
                p pppp p ppp p pp
                p pppp p ppp p pp

        nav.nav-pages
            .nav-pages__title Страница:
            ul.nav-pages__list
                li.nav-pages__item
                    a(href="#").nav-pages__link 1
                li.nav-pages__item
                    a(href="#").nav-pages__link 2
                li.nav-pages__item.nav-pages__item_active
                    a(href="#").nav-pages__link 3
                li.nav-pages__item
                    a(href="#").nav-pages__link ...
                li.nav-pages__item
                    a(href="#").nav-pages__link 54
                li.nav-pages__item.nav-pages__item_next
                    a(href="#").nav-pages__link Следующая
</template>

<script>
    export default {
        methods: {
            showPopup_confirmPersonalData() {
                window.events.$emit('show_popup', 'confirm-personal-data');
            },
            showPopup_notConfirmed() {
                window.events.$emit('show_popup', 'notConfirmed');
            },
            showPopup_auditDoc() {
                window.events.$emit('show_popup', 'auditDoc');
            },
            showPopup_confirmOperationNew() {
                window.events.$emit('show_popup', 'confirmOperationNew');
            },
            showPopup_requestAccepted() {
                window.events.$emit('show_popup', 'requestAccepted');
            },
            showPopup_addNewCart() {
                window.events.$emit('show_popup', 'AddNewCart');
            },
            showPopup_afterRegister() {
                window.events.$emit('show_popup', 'afterRegister');
            },
            showPopup_confirmOperation() {
                window.events.$emit('show_popup', 'confirmOperation');
            },
            showPopup_feedback() {
                window.events.$emit('show_popup', 'feedback');
            },
            showPopup_regSuccessfully() {
                window.events.$emit('show_popup', 'RegSuccessfully');
            },
            showPopup_passwordSuccessfully() {
                window.events.$emit('show_popup', 'passwordSuccessfully');
            },
            showPopup_sms() {
                window.events.$emit('show_popup', 'sms');
            },
            showPopup_exit() {
                window.events.$emit('show_popup', 'exit');
            }
        }
    }
</script>

