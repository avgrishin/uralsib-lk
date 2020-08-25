import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import register from './modules/register';
import funds from './modules/funds';
import form from './modules/form';
import iisDU from './modules/iisDU';
import progress from './modules/progress';
import colors from '../../ajax/colors.json';
import deferredApps from './modules/deferred-apps';
import applications from './modules/applications';
import { DEFERRED_APPS_STORE_KEY } from './modules/deferred-apps';
import { APPLICATIONS_STORE_KEY } from './modules/applications';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        register,
        funds,
        form,
        iisDU,
        progress,
        [DEFERRED_APPS_STORE_KEY]: deferredApps,
        [APPLICATIONS_STORE_KEY]: applications,
    },
    state: {
        buffering: false,
        flashErrorOn: true,
        mainClass: '',
        toDos: '',
        showBreadcrumbs: true,
        moreBreadcrumbds: [],
        questionary_data_update: false,
        fundsSection: false,
        caseSection: false,
        navPageOpen: false,
        popupConfirmOff: false,
        formStep: {
            status: false,
            path: ''
        },
        queryUtm: '',
        mapDu: {
            'Стабильный рублевый доход (ИИС)': { color: '#002e6c', id: "du" }
        },
        colors: colors.colorsFundsName
    },
    mutations: {
        setUtm(state, utm) {
            state.queryUtm = utm;
        },
        buffering(state, val) {

            state.buffering = val;
        },
        flashErrorOn(state, val) {
            state.flashErrorOn = val;
        },
        popupConfirmOff(state, val) {
            state.popupConfirmOff = val;
        },
        questionaryDataUpdate(state, val) { //
            state.questionary_data_update = val;
        },
        mainClass(state, value) {
            state.mainClass = value;
        },
        toDos(state, value) {
            state.todos = this.$store.state.todos2.map(todo => todo.done).length;
        },
        toggleNavPage(state) {
            state.navPageOpen = !state.navPageOpen;
        },
        toggleCrumbs(state, value) {
            state.showBreadcrumbs = value;
        },
        updateCrumbs(state, crumbs) {
            state.moreBreadcrumbds = crumbs;
        },
        setFormStepStatus(state, status) {
            state.formStep.status = status;
        },
        setFormStepPath(state, path) {
            state.formStep.path = path;
        }
    },
    actions: {
        confirm(context, payload) {
            return new Promise((resolve) => {



                const onClose = () => {
                    window.events.$off('confirm-exit');
                    window.events.$off('close_popup', onClose);

                    resolve(false);
                };

                window.events.$emit('show_popup', ['exit', {...payload }]);

                window.events.$on('confirm-exit', (answer) => {
                    window.events.$off('confirm-exit');
                    window.events.$off('close_popup', onClose);
                    resolve(answer);
                });

                window.events.$on('popup_closed', onClose);
            });
        }
    }
});
