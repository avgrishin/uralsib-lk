// global
import Inputmask from "inputmask";
import moment from 'moment';
import FileSaver from 'file-saver';
import store from "../store";
import {API_PROD_URL} from "../app-utils";

export default {
    data() {
        return {
            currencyFormat: new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: '2',
                maximumFractionDigits: '2'
            }),
            disclaimerText: '',
            isIE: false,
            isMobile: false,
            mobileOS: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            isBlobSupported: false,
            loaded_esia: false,
            buffering: false,
        }
    },
    watch: {
        disclaimerText(val) {
            return val
        },
        buffering(val) {
            // window.log('watch buffering', val);
            this.$store.commit('buffering', val)
        },
        getBuffering(val) {
            // window.log('getBuffering', val);
            if (val) {
                this.$store.commit('mainClass', 'spinner')
            } else this.$store.commit('mainClass', '');
        }
    },
    created() {
        this.loaded_esia = false;
        try {
            this.isBlobSupported = !!new Blob;
        } catch (e) {
            this.isBlobSupported = false;
        }
    },
    mounted() {
        this.disableSearchInputs();

        this.checkIE();
        this.checkMobile();
        this.checkMobileOS();
    },
    methods: {
        iisDuOpen(row) {
            if (row.sCode) {
                return `/strategies/${_.includes(row.name,'ДУ') ? 'du' : 'iis'}/${row.sCode.toLowerCase()}`;
            } else {
                return '/'
            }
        },
        getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },
        formatDate(date) {
            return moment(date).format('DD.MM.YYYY');
        },
        formatMillion(val) {
            // Nine Zeroes for Billions
            return Math.abs(Number(val)) >= 1.0e+9

            ? Math.abs(Number(val)) / 1.0e+9 + " млрд."
            // Six Zeroes for Millions
            : Math.abs(Number(val)) >= 1.0e+6

            ? Math.abs(Number(val)) / 1.0e+6 + " млн."
            // Three Zeroes for Thousands
            : Math.abs(Number(val)) >= 1.0e+3

            ? Math.abs(Number(val)) / 1.0e+3 + " тыс."

            : Math.abs(Number(val));
        },
        formatCurrency(val, replaceAfterComma, currency = 'Рубли РФ') {
            this.currencyFormat.minimumFractionDigits = '0'
            if (typeof val == 'string') val = val.toNumber();
            val = this.currencyFormat.format(val);

            const getCurrencySymbol = (currency) => {
                switch (currency) {
                    case 'Доллары США': {
                        return ' $';
                    }

                    case 'ЕВРО': {
                        return ' €';
                    }

                    default:
                        return this.isIE ? ' Р' : " \u20BD";
                }
            }

            if (replaceAfterComma == true) {
                return val.substr(0, val.indexOf(',')) + (getCurrencySymbol(currency))
            } else {
                return val + (getCurrencySymbol(currency))
            }
        },
        getSrcFundIcon(src) {
            return `/funds/${src}.svg`;
        },
        getSrcStrategiesIcon(src, type) {
            // if (type == 'du') src = 'du';
            return `/strategies/${src}.svg`;
        },
        esia() {
	        // this.$router.push({name: 'technicalWorks'});
	        // return; // TODO убрать после завершения тех. работ;

            this.loaded_esia = true;
            axios.get('/Account/ExternalLogins', {
                params: {
                    returnUrl: `${window.location.origin}/scripts/esia/`,
                    generateState: false
                }
            }).then(({ data }) => {

                window.log(data[0].url);
                if (window.axios.defaults.baseURL == API_PROD_URL) window.location = window.location.origin + data[0].url
                else window.location = window.axios.defaults.baseURL + data[0].url

            });
        },
        applyNumericMask() {
            let isIE = this.isIE;
            let isMobile = this.isMobile;

            let mask = Inputmask({
                alias: 'numeric',
                radixPoint: ',',
                groupSeparator: ' ',
                autoGroup: true,
                digits: 2,
                digitsOptional: true,
                rightAlign: false,
                allowMinus: false,
                suffix: isMobile ? '\u20BD' : isIE ? 'Р' : "\u20BD",
                autoUnmask: true,
            });


            let elements = document.querySelectorAll('.numeric-mask');
            for (let i = 0; i < elements.length; i++) {
                mask.mask(elements[i]);
                this.listenToMultiple(elements[i], 'input change', (event) => {
                    setTimeout(function() {
                        if (event.target.value == '') event.target.value = '';
                    }, 0)
                });

            }
        },
        onlyLetters(event) {
            let regex = /^[0-9a-z]$/i;

            if (regex.test(event.key)) {
                event.preventDefault();
                this.errors.add({
                    field: event.target.name,
                    msg: 'Поле может содержать только русские буквы',
                    id: `${event.target.name}:rusonly`
                });
            } else this.errors.removeById(`${event.target.name}:rusonly`);
        },
        onlyRus(event) {
            let regex = /^[a-z]$/i;
            if (regex.test(event.key)) {
                event.preventDefault();
                this.errors.add({
                    field: event.target.name,
                    msg: 'Поле может содержать только русские буквы',
                    id: `${event.target.name}:rusonly`
                });
            } else this.errors.removeById(`${event.target.name}:rusonly`);
        },
        capitalizeFirst(event) {
            let val = event.target.value;

            if (!val) return;

            event.target.value = val.charAt(0).toUpperCase() + val.slice(1);
        },
        disableSearchInputs() {
            let elements = document.querySelectorAll("input[type='search']");

            for (let i = 0; i < elements.length; i++) elements[i].readOnly = true;
        },
        checkVisible(elm) {
            let rect = elm.getBoundingClientRect();
            let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        },
        listenToMultiple(element, events, callback) {
            events.split(' ').forEach(e => element.addEventListener(e, callback, false));
        },
        getOrientation() {
            return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        },
        array_move(arr, old_index, new_index) {
            while (old_index < 0) old_index += arr.length;
            while (new_index < 0) new_index += arr.length;

            if (new_index >= arr.length) {
                let k = new_index - arr.length + 1;
                while (k--) arr.push(undefined);
            }

            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
        },
        checkIE() {
            this.isIE = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1;
        },
        checkMobile() {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                this.isMobile = true;
            }
        },
        checkMobileOS() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/windows phone/i.test(userAgent)) this.mobileOS = 'Windows Phone';
            if (/android/i.test(userAgent)) this.mobileOS = 'Android';
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) this.mobileOS = 'iOS';
        },
        setDatePicker(id, field, event = null, ref = null) {
            const selectedElement = document.querySelector(`#${id}`);
            if (event) {
                this[field] = event.target.value;
                this.$checkInputs();
                return;
            }

            if (!selectedElement || selectedElement.DatePickerX) {
                return;
            }

            let picker;

            if (id) picker = selectedElement.DatePickerX;
            else if (ref) picker = this.$refs[ref].DatePickerX;

            if (!this[field]) return picker.setValue(null);

            let date = moment(this[field], 'DD.MM.YYYY');
            let regex_test = /[0-9]{2}\.[0-9]{2}\.[0-9]{4}/.test(this[field]);

            if (!date.isValid() || !regex_test) return;

            picker.setValue(moment(this[field], 'DD.MM.YYYY').toDate());
        },
        closeDatePicker(event) {
            if (event.keyCode == 9) {
                setTimeout(() => {
                    if (event.target.nextSibling.classList.contains('active')) event.target.click();
                }, 200);
            }
        },
        openDatePicker(event) {
            setTimeout(() => {
                if (!event.target.nextSibling.classList.contains('active')) event.target.click();
            }, 200);
        },
        $onBlur() {
            let inputs = document.querySelectorAll('.field_text_mtrl');
            inputs = Array.from(inputs);

            inputs.forEach(item => {
                item.addEventListener('blur', this.inputBlurEventHandler);
            });
        },
        $removeOnBlurEvents() {
            let inputs = document.querySelectorAll('.field_text_mtrl');
            inputs = Array.from(inputs);

            inputs.forEach(item => {
                item.removeEventListener('blur', this.inputBlurEventHandler);
            });
        },
        inputBlurEventHandler(event) {
            if (event.target.value) event.target.classList.add('hasvalue');
            else event.target.classList.remove('hasvalue');
        },
        $checkInputs() {
            this.$nextTick(() => {
                let inputs = document.querySelectorAll('.field_text_mtrl');
                inputs = Array.from(inputs);

                inputs.forEach(item => {
                    if (item.value) item.classList.add('hasvalue');
                    else item.classList.remove('hasvalue');
                })
            });
        },
        downloadFile(url, name,event) {
            let api = axios
            if (typeof url == 'object') {
                api = axios;
                url = url.duUrl;
            }
            if (event) {

                event.target.classList.add('spinner')
            }

            window.log(url);
            api.get(url, { responseType: 'arraybuffer' }).then(({ data, headers }) => {
                window.log('arraybuffer', data);
                let file = this.arrayBufferToBlob(data, headers);

                if (file && !isAndroidWebview) FileSaver.saveAs(file, name);
                else if (file && isAndroidWebview) {
                    let url = URL.createObjectURL(file);

                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onloadend = () => {
                    //     window.location = reader.result;
                    // }

                    document.location = url;

                    // this.$nextTick(() => URL.revokeObjectURL(url));
                } else flash(['Старый браузер'], 'error');

                this.disableDownload = false;
                if (event) {event.target.classList.remove('spinner')}
            }).catch(({ response }) => {
                if (response) {
                    flash(['Неизвестная ошибка'], 'error');
                }
                window.log(response);
                this.disableDownload = false;
                if (event) {event.target.classList.remove('spinner')}
            });
        },
        arrayBufferToBlob(data, headers) {
            const array = new Uint8Array(data);

            try {
                return new Blob([array], { type: headers['content-type'] });
            } catch (e) {
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

                if (e.name == 'TypeError' && window.BlobBuilder) {
                    const builder = new BlobBuilder();
                    builder.append(array.buffer);
                    return builder.getBlob(headers['content-type']);
                } else if (e.name == 'InvalidStateError') {
                    return new Blob([array.buffer], { type: headers['content-type'] });
                } else {
                    return false;
                }
            }
        }
    },
    computed: {
        getBuffering() {
            //window.log('this.$store.buffering',this.$store.state.buffering);
            if (this.$store) return this.$store.state.buffering;
            else return false

        },
        rubleSign() {
            return this.isIE ? 'р.' : "\u20BD";
        }
    }
}
