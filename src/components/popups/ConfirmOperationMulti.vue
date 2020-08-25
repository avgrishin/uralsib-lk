<template lang="pug">
    form.popup__content.popup__content_sz_2(autocomplete="off")
        .popup__title.g-mb_3
            .h2.g-mb_0 Подтверждение
        .popup__text
            .popup__info
                .g-mr_4.g-hide_xs
                    svg-inline.popup__info-icon(src="/icons/info.svg")
                .h3.g-lh_15.g-mb_0 Для отправки заявок необходимо проверить сформированные документы на наличие ошибок. Нажмите на ссылку, чтобы скачать файл.
            .g-mb_3
                ul.g-plain(v-if="payload.operation == 'BuyApps'")
                    template(v-for="(item,index) in getApplications")
                        li.g-mb_2
                            a(href="#" @click.prevent="downloadFile(item)").btn.btn_file.btn_o.g-col_xs_12
                                | Заявка на приобретение {{ item.fund }} #[span.g-fw_3(v-html="`(${item.fileSize}КБ)`")]
                                span(title="pdf",:class="{spinner:item.loading}").icon.icon_file_pdf.g-fr
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
                    input(type="submit" :disabled="!sms_code" value="Отправить" @click.prevent="submitCode").btn.btn_block.btn_primary.g-mb_2

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
                this.app_id = val.applications[0].app_id;
                this.operation = val.operation;
                this.appIds = buildAppsDictionary(val.applications)

                this.requestCode();
            }
        },
        data() {
            return {
                appIds: buildAppsDictionary(this.payload.applications),
                applicationsReady:[],
                app_id: this.payload.applications[0].app_id,
                sms_code: '',
                operation: this.payload.operation,
                disabled: false,
                requesting: false,
                file: false,
                loading: true
            }
        },
        created() {
            this.requestCode();
            this.applications()

        },
        mounted() {
            this.$onBlur();
        },
        methods: {
            submitCode() {
                window.log('submitCode');
                this.disabled = true;
                window.log(this.appIds);
                axios.post(`/${this.operation}/otpvalidate`,{appIds:this.appIds,code:this.sms_code})
                    .then(() => {
                        window.events.$emit('subs_multi_after');
                        this.disabled = false;
                    }).catch(() => this.disabled = false);
            },
            requestCode() {
                if (this.requesting) return;

                this.requesting = true;
                window.log(this.appIds);
                axios.post(`/${this.operation}/otprequest`,{appIds:this.appIds})
                    .then(({data}) => {
                        this.handleRequestSMScode(data);
                    }).catch(({response}) => {
                        window.log(response);
                        window.log(response.data.message);
                        if(response.statusText=="rate_limit_exceeded") flash(['Не истекло время ожидания до следующей отправки СМС'], 'error');
                        this.requesting = false
                    });
            },
            downloadFile(item) {
                if (!item.file) return flash(['Файл еще не загружен']);

                let name = 'Заявка';
                if (item.app_number) name += ' ' + item.app_number;
                name += '.pdf';

                if (this.isBlobSupported) FileSaver.saveAs(item.file, name);
                else flash(['Бразуер не поддерживает blob'], 'error');
            },
            applications(){
                this.payload.applications.forEach((item,index)=>{
                    axios.get(`/${this.operation}/${item.app_id}/pdf`, {
                        responseType: 'arraybuffer'
                    }).then(({data, headers}) => {
                        this.payload.applications[index].file = this.arrayBufferToBlob(data, headers);
                        this.payload.applications[index].fileSize = Math.round(item.file.size / 1024);
                        this.payload.applications[index].loading = false;
                    }).catch(() => item.loading = false);

                })

            },
        },
        computed: {

            getApplications(){
                return this.payload.applications
            },
            phone() {
                if (!this.$store.state.user.info.phone) return;

                let m = this.$store.state.user.info.phone.match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

                if (m.length != 6) return '';

                return `+${m[1]} (${m[2]}) ${m[3]} ${m[4]} ${m[5]}`;
            },

        }
    }
</script>

