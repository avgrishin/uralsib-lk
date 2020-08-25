import { sellAppsApiService } from '../../api';

export const DEFERRED_APPS_STORE_KEY = 'deferredApps';
export const CHECK_DEFERRED_APPS_ACTION = 'checkDeferredApps';
export const CHECK_DEFERRED_APPS_RESULT = 'checkResult';

const CHECK_INTERVAL = 30000;

export default {
    namespaced: true,

    state: {
        [CHECK_DEFERRED_APPS_RESULT]: {},
        isLoading: false,
        timeoutId: null,
    },

    mutations: {
        saveCheckResult(state, payload) {
            state[CHECK_DEFERRED_APPS_RESULT] = payload;
        },

        toggleLoading(state, flag) {
            state.isLoading = flag;
        },

        saveTimeOutId(state, id) {
            state.timeoutId = id;
        },
    },

    actions: {
        async [CHECK_DEFERRED_APPS_ACTION]({ state, dispatch, commit }) {
            if (state.isLoading) {
                return;
            }

            try {
                commit('toggleLoading', true);
                const result = await sellAppsApiService.getActiveAppPepVerifications();

                if (state.timeoutId) {
                    clearInterval(state.timeoutId);
                    commit('saveTimeOutId', null);
                }

                if (result.isActual && !result.canBeSign) {
                    const timeoutId = setTimeout(() => {
                        dispatch(CHECK_DEFERRED_APPS_ACTION);
                    }, CHECK_INTERVAL);

                    commit('saveTimeOutId', timeoutId);
                }

                if (window.DEBUG_force_canBeSign) {
                    commit('saveCheckResult', {
                        ...result,
                        canBeSign: true,
                    });
                } else {
                    commit('saveCheckResult', result);
                }

                return result;
            } catch (e) {
                console.error(e.message);
            } finally {
                commit('toggleLoading', false);
            }
        },
    },
}
