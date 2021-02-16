import moment from 'moment';

export default {
    namespaced: true,
    state: {
        authenticated: false,
        state_loaded: false,

        info: {},
        state: {},
        funds: [],
        messages: [],

        userProfileStepValid: {
            'personalData': false,
            'passport': false,
            'addresses': false,
            'bankingDetail': false,
        },

        bankingDetails: false
    },
    mutations: {
        login(state) {
            state.authenticated = true;
        },
        // clear any user info and delete auth header
        logout(state) {
            window.log('logout');
            localStorage.removeItem('user');
            localStorage.removeItem('form_changed');
            localStorage.removeItem('questionaryStep')

            delete axios.defaults.headers.common['Authorization'];

            state.buffering = false;
            state.info = {};
            state.state = {};
            state.funds = [];
            state.bankingDetails = [];
            state.messages = [];
            state.state_loaded = false;
            state.form_changed = false;
            state.authenticated = false;
        },
        save(state, { profile, userState, bankingDetails, messages, funds, totals }) {
            userState.pifState = 2;
         /*
            totals={
                duTotal:1000,
                pifTotal:0,
                total:1000,
            }*/
            userState.portfolioDate = moment(userState.portfolioDate).format('DD.MM.YYYY');
            state.info = profile;
            state.state = userState;

            state.totals = totals;
            //state.state.allowEditClientProfile=false;
            state.bankingDetails = bankingDetails;
            state.messages = messages.map(item => {
                item.date = moment(item.msgDate).format('DD.MM.YYYY');
                return item;
            });
            state.funds = funds;

            if (!state.state_loaded) state.state_loaded = true;


        },
        updateProfile(state, { profile, info, bank }) {
            state.info = profile;
            state.state = info;
            state.bankingDetails = bank;
        },
        formSigned(state) {
            state.form_changed = false;
            localStorage.removeItem('form_changed');
        },
        saveMessages(state, messages) {
            messages=messages.map(item => {
                item.date = moment(item.msgDate).format('DD.MM.YYYY');
                return item;
            });
            state.messages = messages;
        },
        imitate(state, type) {
            if (type == 1) {
                state.state.pifState = 2;
                state.state.duState = 1;
            } else if (type == 2) {
                state.state.pifState = 1;
                state.state.duState = 1;
            } else if (type == 3) {
                state.state.pifState = 0;
                state.state.duState = 0;
            } else if (type == 4) {
                state.state.pifState = 1;
                state.state.duState = 1;
            } else {
                state.state.pifState = 2;
                state.state.duState = 1;
            }
        }
    },
    actions: {
        // Log user in
        login({ commit, dispatch }, user) {
            return new Promise((resolve) => {
                // calculate when token expires
                commit('buffering', true, { root: true });
                user.expires = moment.utc().add(user.expires_in, 'seconds');

                // save toke to local storage
                localStorage.setItem('user', JSON.stringify(user));

                // remove items from localstorage related to register
                localStorage.removeItem('form_id');
                localStorage.removeItem('phone');
                if (user.token) user.access_token = user.token;

                // set default auth header, needed for API authorization
                axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;

                dispatch('getProfile').then(() => {
                    commit('buffering', false, { root: true });
                    resolve();
                });
                commit('login');

                commit('register/clear', null, { root: true });
                dispatch('form/checkCompletness', null, { root: true });
            });
        },
        // log user out
        logout({ commit }) {
            commit('logout');
            commit('funds/clearFunds', null, { root: true });
            commit('funds/clearOperations', null, { root: true });
            commit('form/clearCompleted', null, { root: true });

            axios.post('/Account/Logout');
        },
        formChanged({ dispatch }) {
            return dispatch('getForm').then(data => {
                dispatch('form/checkCompletness', null, { root: true });
            });
        },
        getProfile({ commit, dispatch }) {
            return axios.all([
                axios.get('/ClientProfile'),
                axios.get('/ClientProfile/userinfo'),
                axios.get('/ClientProfile/BankingDetails'),
                axios.get('/messages/messages'),
                axios.get('/analytics/Instruments'),
                axios.get('/reports/PortfolioTotalCost')

            ]).then(
                axios.spread((profile, userState, bankingDetails, messages, funds, totals) => {
                    commit('save', {
                        profile: profile.data,
                        userState: { ...userState.data, },
                        bankingDetails: bankingDetails.data,
                        messages: messages.data,
                        funds: funds.data,
                        totals: totals.data
                    });

                    dispatch('funds/getFunds', funds.data, { root: true })
                })
            ).catch((error)=> {

            })
        },
        getMessages({ commit }) {
            axios.get('/messages/messages').then(({ data }) => commit('saveMessages', data))
        },
        getForm({ commit, dispatch }) {
            return axios.all([
                axios.get('/ClientProfile'),
                axios.get('/ClientProfile/userinfo'),
                axios.get('/ClientProfile/BankingDetails')
            ]).then(
                axios.spread(({ data: profile }, { data: info }, { data: bank }) => {
                    commit('updateProfile', {
                        profile,
                        info,
                        bank
                    });
                })

            );
        }
    },
    getters: {
        unreadMessages(state) {
            return state.messages.filter(item => item.msgStatus == 0).length;
        },
        fundsCount(state) {
            state.funds.filter((item)=>{

            })
            return state.funds.length;
        }
    }
}
