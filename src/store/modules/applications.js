import { AppsApiService } from '../../api/apps-service';

export const APPLICATIONS_STORE_KEY = 'applications';

export const APPLICATIONS_LIST_KEY = 'allApplications';
export const APPLICATIONS_BUY_LIST_KEY = 'buyApplications';
export const APPLICATIONS_LIST_LOADING_KEY = 'applicationsLoading';

export const APPLICATIONS_SET_LOADING = 'setLoading';
export const APPLICATIONS_SET_LIST = 'setList';
export const APPLICATIONS_SET_BUY_LIST = 'setBuyList';

export const APPLICATIONS_GET_LIST_ACTION = 'getAllApplications';
export const APPLICATIONS_GET_BUY_LIST_ACTION = 'getBuyApplications';

const appsApiService = new AppsApiService();

export default {
    namespaced: true,

    state: {
        [APPLICATIONS_LIST_KEY]: [],
        [APPLICATIONS_BUY_LIST_KEY]: [],
        [APPLICATIONS_LIST_LOADING_KEY]: false,
    },

    mutations: {
        [APPLICATIONS_SET_LOADING](state, flag) {
            state[APPLICATIONS_LIST_LOADING_KEY] = flag;
        },

        [APPLICATIONS_SET_LIST](state, list) {
            state[APPLICATIONS_LIST_KEY] = list;
        },

        [APPLICATIONS_SET_BUY_LIST](state, list) {
            state[APPLICATIONS_BUY_LIST_KEY] = list;
        }
    },

    actions: {
        async [APPLICATIONS_GET_LIST_ACTION]({ commit }) {
            try {
                commit(APPLICATIONS_SET_LOADING, true);
                const list = await appsApiService.allApps();

                commit(APPLICATIONS_SET_LIST, list);
            } catch (e) {
                window.flash([e.message], 'error');
                window.flash(['Ошибка при загрузке из apps/allapps'], 'error');
            } finally {
                commit(APPLICATIONS_SET_LOADING, false);
            }
        },

        async [APPLICATIONS_GET_BUY_LIST_ACTION]({ commit }) {
            try {
                commit(APPLICATIONS_SET_LOADING, true);
                const list = await appsApiService.buyApps();

                commit(APPLICATIONS_SET_BUY_LIST, list);
            } catch (e) {
                window.flash([e.message], 'error');
                window.flash(['Ошибка при загрузке из /BuyApps'], 'error');
            } finally {
                commit(APPLICATIONS_SET_LOADING, false);
            }
        }
    }
}
