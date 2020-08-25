export default {
    namespaced: true,
    state: {
        items: [],
        itemsOper: [],
        items_strategies:[],
        operations: {},
        loaded: false,
    },
    mutations: {
        save(state, { funds, userFunds , operFunds}) {

            let getUnique = (arr, comp) => {
                const unique = arr
                    .map(e => e[comp])
                    .map((e, i, final) => final.indexOf(e) === i && i)
                    .filter(e => arr[e]).map(e => arr[e]);
                return unique;
            }

            funds = _.merge(funds, getUnique(operFunds, 'id'));

            funds = funds.map(item => {
                // item.in_case = userFunds.find(fund => fund.id == item.instrumentId) ? true : false;
                item.in_case = item.allowExchange == true || item.allowSell == true ? true : false;
                return item;
            }).sort((a, b) => {
                if (a.profitability < b.profitability) return 1;
                else if (a.profitability > b.profitability) return -1;
                return 0;
            });

            state.items = funds;
            state.itemsOper = operFunds;
            if (!state.loaded) state.loaded = true;
            state.items_strategies = funds;

        },
        clearOperations(state) {
            state.operations = {};
        },
        setOperation(state, data) {

            state.operations = data;

        },
        updateOperation(state, { path, data }) {
            _.set(state.operations, path, data);
        },
        clearFunds(state) {
            state.loaded = false;
            state.items = [];
        }
    },
    actions: {
        getFunds({ commit }, userFunds) {
            axios.all([
                axios.get('/apps/allfunds'),
                axios.get('/apps/operfunds')
            ]).then(
                axios.spread(({ data: allfunds }, { data: operFunds }) => {
                    commit('save', {
                        funds: allfunds,
                        operFunds: operFunds,
                        userFunds
                    });
                })
            );
            // axios.get('/apps/allfunds').then(({data}) => {
            //     commit('save', {
            //         funds: data,
            //         userFunds
            //     });
            // });
        }
    },
    getters: {
        quantityFunds(state){ //в портфеле есть фонды с паями
            return state.items.filter(item => item.quantity > 0).length;
        },
        userFunds(state) {
            return state.items.filter(item => item.in_case);
        },
        buyFunds(state) {
            return state.itemsOper.filter(item => item.allowBuy);
        },
        sellFunds(state) {
            return state.itemsOper.filter(item => item.allowSell);
        },
        exchangeFunds(state) {
            return state.itemsOper.filter(item => item.allowExchange);
        }
    }
}
