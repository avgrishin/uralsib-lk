<template lang="pug">
    div.popup__content.popup__content_sz_2
        .popup__title.g-mb_3
            .h2.g-mb_0 Опрос

        .popup__text
            .g-fw_7.g-mb_1
                    | ВСЕГО ПЯТЬ МИНУТ ВАШЕГО ВРЕМЕНИ#[br]#[br]
                    | МЫ ХОТИМ ЗНАТЬ, ЧТО ВЫ ДУМАЕТЕ О НАС#[br]#[br]
                    | ПОЖАЛУЙСТА, ОТВЕТЬТЕ НА НЕСКОЛЬКО ВОПРОСОВ, КОТОРЫЕ ПОЗВОЛЯТ НАМ СТАТЬ ЛУЧШЕ#[br]
        .g-row
            .g-col.g-col_md_6
            .g-col.g-col_md_6
                a(:href="formLink" @click="toSurvey" target="_blank" rel="noreferrer nofollow").btn.btn_primary.btn_block ПРОЙТИ ОПРОС
</template>
<script>
export default {
    name: 'survey',
    props: ['payload'],
    computed: {
        formLink() {
            return 'https://ru.surveymonkey.com/r/YSP7YL3?hash='+this.payload.userId;
            // return 'https://ru.surveymonkey.com/r/D2MWRD5?master_id='+this.payload.userId;
            //return 'https://ru.research.net/r/UralsibCSI_4Q2020?master_id='+this.payload.clientId;
        }
    },
	methods: {
		toSurvey() {
            this.setCookie('opros3', '1', { 'expires ': new Date(2021, 10, 16) });
			window.events.$emit('close_popup');
        },

        setCookie(name, value, options = {}) {
            options = {
                path: '/',
                // при необходимости добавьте другие значения по умолчанию
                ...options
            };

            if (options.expires instanceof Date) {
                options.expires = options.expires.toUTCString();
            }

            let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

            for (let optionKey in options) {
                updatedCookie += "; " + optionKey;
                let optionValue = options[optionKey];
                if (optionValue !== true) {
                    updatedCookie += "=" + optionValue;
                }
            }   

            document.cookie = updatedCookie;
        }
    }
}
</script>