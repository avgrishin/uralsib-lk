import 'core-js';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueCarousel from 'vue-carousel'; // https://ssense.github.io/vue-carousel/api/
import VueBreadcrumbs from 'vue-breadcrumbs'; // https://github.com/samturrell/vue-breadcrumbs
import VeeValidate, { Validator } from 'vee-validate';
import moment from 'moment';
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js'; //https://developers.google.com/chart/interactive/docs/gallery/piechart
import './assets/js/vendor/scrollbot.min.js'; // https://github.com/akzhy/scrollbot
import './assets/js/vendor/DatePickerX'; // https://github.com/AvroraTeam/DatePickerX
import vSelect from 'vue-select'; // https://github.com/sagalbot/vue-select
import Breadcrumbs from './components/Breadcrumbs';
import VueAnalytics from 'vue-analytics' // https://github.com/MatteoGabriele/vue-analytics
import vueSlider from 'vue-slider-component'; //https://github.com/NightCatSama/vue-slider-component
import AppTimer from './components/AppTimer';
import { initDataLayerHelpers } from './helpers';

import { auth, cleanUp } from './guards';

initDataLayerHelpers();
window.events = new Vue();

Vue.config.devtools = true;

import Validators from './validation';
import { global } from './mixins';
import store from './store/index';
import messagesRu from 'vee-validate/dist/locale/ru';
import {API_BASE_URL} from "./app-utils";

Vue.component('svg-inline', require('./assets/layout/blocks/SvgIconInline.vue'));
Vue.component('b-collapse', require('./assets/layout/blocks/collapse.vue'));
Vue.component('b-search', require('./assets/layout/blocks/search.vue'));
Vue.component('date-filter', require('./components/DateFilter'));
Vue.component('v-select', vSelect);
Vue.component('v-range', vueSlider);
Vue.component('AppTimer', AppTimer);
Vue.use(VueAnalytics, {
    id: ['UA-37865931-2']
});

Vue.mixin(global);

messagesRu.messages = {
    ...messagesRu.messages,
    required: 'Поле обязательно для заполнения',
    is: 'Пароли не совпадают',
    is_not: 'Старый и новый пароль не должен совпадать'
};

messagesRu.custom = {
    login: {
        email: 'В поле ЛОГИН укажите действующий электронный адрес'
    }
};

Validator.localize('ru', messagesRu);

Validator.extend('fulsd_ru', Validators.first_uppercase_letters_spaces_dashes_RU);
Validator.extend('osbw', Validators.one_space_between_words);
Validator.extend('lsndd_ru', Validators.letters_spaces_numbers_dashes_dots_RU);
Validator.extend('df', Validators.date_format);
Validator.extend('pf', Validators.passport_format);
Validator.extend('lcnds', Validators.latin_cyrilic_numbers_dashes_spaces);
Validator.extend('intpf', Validators.international_passport_format);
Validator.extend('mlid', Validators.military_id);
Validator.extend('snils', Validators.snils);
Validator.extend('mp', Validators.mobile_phone);
Validator.extend('hm', Validators.home_phone);
Validator.extend('vd', Validators.valid_date);
Validator.extend('pdv', Validators.passport_date_valid);
Validator.extend('asc', Validators.all_same_characters);
Validator.extend('age', Validators.age);
Validator.extend('poi', Validators.place_of_issue);
Validator.extend('rs', Validators.rs);
Validator.extend('an', Validators.account_number);
Validator.extend('pif', Validators.pif_amount);
Validator.extend('pi', Validators.passport_issuer);
Validator.extend('mink', Validators.min_thousand);
Validator.extend('spass', Validators.strong_password);
Validator.extend('card', Validators.card_number);
Validator.extend('index', Validators.address_index);
Validator.extend('inn', Validators.inn);
Validator.extend('sms', Validators.sms);
Validator.extend('amountMinMax', Validators.amountMinMax);

Vue.use(VeeValidate, { classes: true });
Vue.use(VueCarousel);
Vue.use(VueBreadcrumbs, Breadcrumbs);

String.prototype.toNumber = function() {
    return parseFloat(this.replace(/[^0-9,\.]/g, '').replace(',', '.'));
};

Vue.prototype.$emit_p = function (topic, varargs) {
    return new Promise((resolve, reject) => {
        const arr = Array.from(arguments)
        let invoked = false
        const promiseLike = {
            resolve: val => {
                if (!invoked) {
                    invoked = true
                    resolve(val)
                }
            },
            reject: val => {
                if (!invoked) {
                    invoked = true
                    reject(val)
                }
            }
        }
        arr.push(promiseLike)
        this.$emit.apply(this, arr)
    });
};

window.log = ((val)=>{if(localStorage.getItem('debug')) return console.log(val)})



window._ = require('lodash');

window.axios = require('axios');
window.axios.defaults.baseURL = API_BASE_URL;

router.beforeEach(auth);
router.afterEach(cleanUp);

const user = JSON.parse(localStorage.getItem('user'));
if (
    user &&
    user.access_token &&
    moment.utc().isSameOrBefore(moment.utc(user.expires))
) {
    store.dispatch('user/login', user);
} else if (user) store.dispatch('user/logout', user);


window.jsonParse = (obj) => {
    obj = JSON.stringify(obj);
    return JSON.parse(obj);
}

window.flash = (messages, type = '') => window.events.$emit('flash', [messages, type]);
window.jsonParse = (json) => {
    json = JSON.stringify(json);
    json = JSON.parse(json);
    return json;
};

Chart.pluginService.register({
    beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
            var ctx = chart.chart.ctx;

            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
            ctx.font = '30px ' + fontStyle;

            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + 'px ' + fontStyle;
            ctx.fillStyle = color;

            ctx.fillText(txt, centerX, centerY);
        }
    }
});

axios.interceptors.request.use((config) => {
    if (config.url.includes('svg')) return config;
    if (config.url.includes('funds/doc')) return config;
    if (config.params) config.params.version = Math.random().toString(36).substr(2, 9);
    else config.params = { version: Math.random().toString(36).substr(2, 9) };

    return config;
});

axios.interceptors.response.use(null, function(error) {
    if (store.state.flashErrorOn && error.response.status == 500) {
        // console.log(error);
        flash(['Неизвестная ошибка!'], 'error');
    }
    //if (store.state.flashErrorOn && error.response.status == 400) flash(['Не истекло время ожидания до следующей отправки СМС'], 'error');
    else if (error.response.status == 403) {
        store.dispatch('user/logout');
        if(window.location.href.indexOf("registrarValidation") > -1) {

        } else {
            router.push('/');
        }

    }

    if (error.response.data.message == 'Incorrect code') flash(['Некорректный код'], 'error');
    return Promise.reject(error);
});



new Vue({
    router,
    store,
    render: h => h(App),
    components: {
        ChartJsPluginDataLabels,
    }
}).$mount('#app');
