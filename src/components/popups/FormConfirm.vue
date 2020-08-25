<template lang="pug">
    form.popup__content.popup__content_sz_2(autocomplete="off")
        .popup__title.g-mb_3
            .h2.g-mb_0 Подтверждение
        .popup__text
            .popup__info
                .g-mr_4.g-hide_xs
                    svg-inline.popup__info-icon(src="/icons/info.svg")
                .h3.g-lh_15.g-mb_0 Для отправки заявки необходимо проверить сформированные документы на наличие ошибок. Нажмите на ссылку, чтобы скачать файл.

            ul.g-plain.g-mb_3
                li.g-mb_2
                    a(@click.prevent="downloadForm" href="#").btn.btn_file.btn_o.g-col_xs_12
                        | Анкета клиента #[span.g-fw_3(v-html="`(${fileSize}КБ)`")]
                        span(title="pdf" :class="{spinner: loading}").icon.icon_file_pdf.g-fr
            .h4.g-lh_15
                | Для подтверждения операции на Ваш телефон #[span(v-html="phone")] #[br] был отправлен SMS-код:
            .g-row
                .g-col.g-col_md_6
                    .control
                        .control__field.g-mb_1
                            input(type="text" v-model="sms_code").field_text.field_text_mtrl#CODE
                            label(for="CODE").control__label Введите код
                        .g-fs_05.g-clr_gray(v-show="countDownSeconds.status")
                            AppTimer(
                                ref="appTimer",
                                @onProgressEnd="handleCountdownProgress"
                            )

                        button.g-btn-txt.g-fs_05.g-clr_gray.g-clr_pr_h.g-fw_6(type="button" @click.prevent="requestCode") Запросить код повторно
                .g-col.g-col_md_6.g-mt_3_xs
                    input(type="submit" :disabled="!sms_code" value="Отправить" @click.prevent="submitCode").btn.btn_block.btn_primary.g-mb_2

</template>
<script>
    import FileSaver from 'file-saver';
    import {countDownMixin} from '../../mixins'
    import { buildAppsDictionary } from '../../helpers';
    export default {
        props: ['payload'],
        mixins: [countDownMixin],
        data() {
            return {
                sms_code: '',
                disabled: false,
                requesting: false,
                form: false,
                loading: true
            }
        },
        created() {
            this.requestCode();
        },
        mounted() {
            this.$onBlur();
        },
        methods: {
            submitCode() {
                this.disabled = true;
                window.log('submitCode');
                axios.post(`/ClientProfileApp/draft/otp/${this.sms_code}`)
                    .then(() => {
                        window.events.$emit('show_popup', 'form-signed');
                        this.$store.commit('user/formSigned');
                    }).catch(({response: error}) => {
                        this.disabled = false;
                        if (error) flash([error.data.message], 'error');
                    });
            },
            requestCode() {
                if (this.requesting) return;
                window.log('requestCode');
                axios.post(`/ClientProfileApp/otp`, {
                    appIds: buildAppsDictionary([this.payload])
                })
                    .then(({data}) => {
                        this.handleRequestSMScode(data);
                    }).catch((error) => {})
            },
            getForm() {
                if (this.form) return;

                axios.get('/ClientProfileApp/draft/pdf', {
                    responseType: 'arraybuffer'
                }).then(({data, headers}) => {
                    this.form =  this.arrayBufferToBlob(data, headers);
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
            downloadForm() {
                if (!this.form) return flash(['Форма еще не загружена']);

                if (this.isBlobSupported) FileSaver.saveAs(this.form, `Анкета ${this.payload.app_number}.pdf`);
                else flash(['Бразуер не поддерживает blob'], 'error');
            }
        },
        computed: {
            phone() {
                if (this.payload.phone) return this.payload.phone;

                return '';
            },
            fileSize() {
                if (this.form) return Math.round(this.form.size / 1024);
                return 0;
            }
        }
    }
</script>
