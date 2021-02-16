export default {
    namespaced: true,
    state: {
        items: [],
        itemsOper: [],
        items_strategies:[],
        operations: {},
        amounts: [],
        loaded: false,
        portPif: []
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

            let arr = [];
            const ugold = state.items.find(i => i.name == "ПИФУЗ");
            const ufp = state.items.find(i => i.name == "ПИФП");
            const usit = state.items.find(i => i.name == "ПИФСИТ");

            let pp1 = 0;
            let pp2 = 0;
            const str1 = [];
            if (ugold && ufp)
            {
                str1.push({ id: ugold.webSiteId, fond: ugold.description, part:20, profitability: ugold.profitability });
                str1.push({ id: ufp.webSiteId, fond: ufp.description, part:80, profitability: ufp.profitability });
                pp1 = str1.reduce((acc, val) => acc + val.profitability*val.part, 0)/100;
            } 
            const str2 = [];
            if (usit && ufp)
            {
                str2.push({ id: usit.webSiteId, fond: usit.description, part: 50, profitability: usit.profitability });
                str2.push({ id: ufp.webSiteId, fond: ufp.description, part: 50, profitability: ufp.profitability });
                pp2 = str2.reduce((acc, val) => acc + val.profitability*val.part, 0)/100;
            } 
            arr.push({ description: 'Для рационального инвестора', webSiteId: 'p1', profitability: pp1, structure: str1, risk: 'выше среднего' });
            arr.push({ description: 'Для решительного инвестора', webSiteId: 'p2', profitability: pp2, structure: str2, risk: 'высокий' });
            state.portPif = arr

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
        },
        setAmounts(state, data) {
            state.amounts = data;
        },
        clearAmounts(state) {
            state.amounts = {};
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
