<template lang="pug">
    form.popup__content.popup__content_sz_2(autocomplete="off")
        .popup__title.g-mb_3
            .h2.g-mb_0 Подтверждение
        .popup__text
            .popup__info
                .g-mr_4.g-hide_xs
                    svg-inline.popup__info-icon(src="/icons/info.svg")
                .h3.g-lh_15.g-mb_0 Для отправки заявки необходимо проверить сформированные документы на наличие ошибок. Нажмите на ссылку, чтобы скачать файл.
            .g-mb_3
                ul.g-plain(v-if="payload.operation == 'BuyApps'")
                    li.g-mb_2
                        a(href="#" @click.prevent="downloadFile").btn.btn_file.btn_o.g-col_xs_12
                            | Заявка на приобретение {{ payload.fund }} #[span.g-fw_3(v-html="`(${applicationFileSize}КБ)`")]
                            span(title="pdf",:class="{spinner:loading}").icon.icon_file_pdf.g-fr
                ul.g-plain(v-else-if="payload.operation == 'ExchApps'")
                    li.g-mb_2
                        a(href="#" @click.prevent="downloadFile").btn.btn_file.btn_o.g-col_xs_12
                            | Заявка на обмен {{ payload.fund }} #[span.g-fw_3(v-html="`(${applicationFileSize}КБ)`")]
                            span(title="pdf" ,:class="{spinner:loading}").icon.icon_file_pdf.g-fr

                ul.g-plain(v-else-if="payload.operation == 'SellApps'")
                    li.g-mb_2
                        a(href="#" @click.prevent="downloadFile").btn.btn_file.btn_o.g-col_xs_12
                            | Заявка на погашение {{ payload.fund }} #[span.g-fw_3(v-html="`(${applicationFileSize}КБ)`")]
                            span(title="pdf",:class="{spinner:loading}").icon.icon_file_pdf.g-fr

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
                    button(type="submit" :disabled="!sms_code" value="Отправить" :class="{'spinner_bg': disabled}" @click.prevent="submitCode").btn.btn_block.btn_primary.g-mb_2 Отправить

</template>

<script>
    import FileSaver from 'file-saver';
    import {countDownMixin} from '../../mixins'
    import { buildAppsDictionary } from '../../helpers';
    export default {
        props: ['payload'],
        mixins: [countDownMixin],
        watch: {
            payload(val) {
                this.sms_code = '';
                this.appIds = buildAppsDictionary([val]);
                this.operation = val.operation;

                this.requestCode();
            }
        },
        data() {
            return {
                money: {
                    decimal: ',',
                    thousands: ' ',
                    prefix: '',
                    suffix: '\u20BD',
                    precision: 0,
                    masked: false
                },
                appIds: buildAppsDictionary([this.payload]),
                sms_code: '',
                operation: this.payload.operation,
                disabled: false,
                requesting: false,
                file: false,
                loading: true
            }
        },
        created() {
            if (!this.payload.disableRequestCode) {
                this.requestCode();
            }

            this.applicationPDF();
        },
        mounted() {
            this.$onBlur();
        },
        methods: {
            submitCode() {
                window.log('submitCode');
                if (this.disabled) return;
                this.disabled = true;
                axios.post(`/${this.operation}/otp/${this.sms_code}`, {
                    appIds: this.appIds
                })
                    .then(() => {
                        window.events.$emit('code_confirmed');
                        this.disabled = false;
                    }).catch(({response}) => {
                        this.disabled = false;
                        if (response.data.message) {
                            flash([response.data.message], 'error');
                        } else {
                            flash(['Неизвестная ошибка'], 'error');
                        }
                    });
            },

            requestCode() {
                if (this.requesting) return;

                this.requesting = true;
                window.log('requestCode');

                axios.post(`/${this.operation}/otp`, {
                    appIds: this.appIds
                })
                    .then(({data}) => {
                        this.handleRequestSMScode(data, 'sms');
                    }).catch((error) => {
						window.log('TCL: requestCode -> error', error);
                    })
            },

            downloadFile() {
                if (!this.file) return flash(['Файл еще не загружен']);

                let name = 'Заявка';
                if (this.payload.app_number) name += ' ' + this.payload.app_number;
                name += '.pdf';

                if (this.isBlobSupported) FileSaver.saveAs(this.file, name);
                else flash(['Бразуер не поддерживает blob'], 'error');
            },
            applicationPDF() {
                axios.get(`/${this.payload.operation}/${this.payload.app_id}/pdf`, {
                    responseType: 'arraybuffer'
                }).then(({data, headers}) => {
                    this.file = this.arrayBufferToBlob(data, headers);
                    this.loading = false;
                }).catch(() => this.loading = false);
            }
        },
        computed: {
            phone() {
                if (!this.$store.state.user.info.phone) return;

                let m = this.$store.state.user.info.phone.match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

                if (m.length != 6) return '';

                return `+${m[1]} (${m[2]}) ${m[3]} ${m[4]} ${m[5]}`;
            },
            applicationFileSize() {
                if (this.file) return Math.round(this.file.size / 1024);
                return 0;
            }
        }
    }
</script>

