export default {
    namespaced: true,
    state: {
        S_PROGRESS: {
            addressesRate: '',
            bankingDetailsRate: '',
            passportRate: '',
            personalDataRate: '',
            totalRate: ''
        }
    },
    mutations: {
        M_PROGRESS_STATE(state, progress) {
            _.mapKeys(state.S_PROGRESS, (value, key) => {
               state.S_PROGRESS[key] = progress[key];
            });
        }
    },
    actions: {
        A_GET_PROGRESS_PROFILE({ commit }) {
            return axios.get(`/ClientProfile/profilerate`).then(({ data }) => {
                commit('M_PROGRESS_STATE', data);
            });
        },
    }
}
