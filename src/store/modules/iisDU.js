import Axios from 'axios';

const newList = [
    {
        'id': 1,
        'webSiteID': 's24',
        'strategyName': 'ИИС Государственные облигации',
        'sType': 'IIS',
        'sCode': 'S24',
        'ish': {
            'strategyShortDesc': 'Денежные средства инвестируются преимущественно в государственные облигации Российской Федерации и субъекты РФ.',
            'expectProfit': 8.00,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Низкий',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 4,
        'webSiteID': 's25',
        'strategyName': 'ИИС Российские облигацииrn',
        'sType': 'IIS',
        'sCode': 'S25',
        'ish': {
            'strategyShortDesc': 'Денежные средства инвестируются преимущественно в облигации крупных стабильных российских компаний с высоким кредитным рейтингом',
            'expectProfit': 10.00,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 6,
        'webSiteID': 's26',
        'strategyName': 'ИИС Российские акции',
        'sType': 'IIS',
        'sCode': 'S26',
        'ish': {
            'strategyShortDesc': 'Денежные средства инвестируются преимущественно в акции крупнейших российских компаний ',
            'expectProfit': 15.00,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Выше среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 9,
        'webSiteID': 's28',
        'strategyName': 'Консервативный портфель',
        'sType': 'DU',
        'sCode': 'S28',
        'ish': {
            'strategyShortDesc': 'Инвестирование в государственные и корпоративные облигации с целью получения дохода выше депозита.',
            'expectProfit': 10.00,
            'expectProfitText': 'умеренно-консервативная',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 10,
        'webSiteID': 's29',
        'strategyName': 'Дивидендная доходность',
        'sType': 'DU',
        'sCode': 'S29',
        'ish': {
            'strategyShortDesc': 'Инвестирование в акции крупнейших российских и иностранных компаний с целью получения дохода за счет курсовой стоимости акций и дивидендных выплат.',
            'expectProfit': 20.00,
            'expectProfitText': 'высокая',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Выше среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 11,
        'webSiteID': 's30',
        'strategyName': 'Купонные выплаты',
        'sType': 'DU',
        'sCode': 'S30',
        'ish': {
            'strategyShortDesc': 'Инвестирование в государственные, муниципальные и корпоративные облигации с регулярной выплатой купонного дохода.',
            'expectProfit': 10.00,
            'expectProfitText': 'умеренно-консервативная',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 12,
        'webSiteID': 's22',
        'strategyName': 'ИИС «Долларовые облигации»',
        'sType': 'IIS',
        'sCode': 'S22',
        'ish': {
            'strategyShortDesc': 'Инвестирование средств в государственные и корпоративные облигации с фиксированной доходностью.',
            'expectProfit': 8.00,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 13,
        'webSiteID': 's23',
        'strategyName': 'ИИС «Государственные облигации Плюс»',
        'sType': 'IIS',
        'sCode': 'S23',
        'ish': {
            'strategyShortDesc': 'Инвестирование средств в государственные и корпоративные облигации с фиксированной доходностью.',
            'expectProfit': 8.00,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Ожидаемая доходность – доходность от доверительного управления, на которую рассчитывает Клиент. Ожидаемая доходность не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 14,
        'webSiteID': 's32',
        'strategyName': 'Рантье. Рубли РФ',
        'sType': 'DU',
        'sCode': 'S32',
        'ish': {
            'strategyShortDesc': 'Среднесрочный прирост капитала за счет инвестирования в корпоративные облигации с ежемесячной выплатой купонного дохода',
            'expectProfit': 7.10,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Доходность – прогнозируемая доходность, которая не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента. Рассчитывается исходя из текущего совокупного состава портфеля и может быть скорректирована в дальнейшем.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 15,
        'webSiteID': 's33',
        'strategyName': 'Рантье. Доллары США',
        'sType': 'DU',
        'sCode': 'S33',
        'ish': {
            'strategyShortDesc': 'Среднесрочный прирост капитала за счет инвестирования в корпоративные облигации, номинированные в долларах США, с регулярной выплатой купонного дохода.',
            'expectProfit': 2.70,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Доходность – прогнозируемая доходность, которая не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента. Рассчитывается исходя из текущего совокупного состава портфеля и может быть скорректирована в дальнейшем.',
            'risk': 'Ниже среднего',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 16,
        'webSiteID': 's35',
        'strategyName': 'Рантье. Минфин Доллары США',
        'sType': 'DU',
        'sCode': 'S34',
        'ish': {
            'strategyShortDesc': 'Сохранение и прирост капитала на среднесрочном горизонте за счет инвестирования в государственные облигации, номинированные в долларах США, с регулярной выплатой купонного дохода.',
            'expectProfit': 2.40,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Доходность – прогнозируемая доходность, которая не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента. Рассчитывается исходя из текущего совокупного состава портфеля и может быть скорректирована в дальнейшем.',
            'risk': 'Низкий',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    },
    {
        'id': 17,
        'webSiteID': 's34',
        'strategyName': 'Рантье. Минфин Евро',
        'sType': 'DU',
        'sCode': 'S34',
        'ish': {
            'strategyShortDesc': 'Сохранение и прирост капитала в долгосрочной перспективе за счет инвестирования в в государственные облигации, номинированные в евро, с регулярной выплатой купонного дохода.',
            'expectProfit': 0.13,
            'expectProfitText': '+налоговый вычет',
            'expectProfitDisc': '*Доходность – прогнозируемая доходность, которая не накладывает на АО «УК УРАЛСИБ» обязанности по ее достижению и не является гарантией для Клиента. Рассчитывается исходя из текущего совокупного состава портфеля и может быть скорректирована в дальнейшем.',
            'risk': 'Низкий',
            'riskDisc': '**Допустимый риск – риск возможных убытков, связанных с доверительным управлением, который способен нести Клиент.'
        }
    }
];

export default {
    namespaced: true,
    state: {
        list: [],
        getDUAllContracts: []
    },

    mutations: {
        setIisDuList(state, getlist, getDUAllContracts) {
            state.list = getlist;
            state.getDUAllContracts = getDUAllContracts;
        }
    },

    actions: {
        iisDuGetList({ commit }) {
            return new Promise((resolve, reject) => {
                axios.all([
                    axios.get('/invest/getlist'),
                    axios.get('/AmContracts'),
                    axios.get('/amcontracts/getDUAllContracts')
                ]).then(
                    axios.spread(({data: getlist}, {data: listDUContract}, {data: getDUAllContracts}) => {
                        listDUContract = listDUContract.filter(contract => contract.number != null);
                        getDUAllContracts = getDUAllContracts.filter(contract => contract.number != null);

                        getlist.forEach(item => {
                            // item.contract = [...listDUContract].filter(contract => contract.pifStrategyCode == item.sCode);
                            // item.contractAll = [...getDUAllContracts].filter(contract => contract.stratID == item.id && !contract.closeDate);
                            const contracts = [...getDUAllContracts].filter(contract => contract.stratID == item.id);
                            contracts.map(contract => {
                                contract.pifNumber = contract.number;
                                contract.strategyCode = item.webSiteID;
                                contract.id = contract.portfolioID;
                                return contract;
                            });
                            item.contract = contracts;
                            item.contractAll = contracts;

                        });

                        commit('setIisDuList', getlist, getDUAllContracts);
                        resolve({ getlist, listDUContract, getDUAllContracts });
                    })
                );
            });
        }
    },

    getters: {
        iisByIdGetter: (state) => (id) => {
            let stateIIS = state.list;
            let strategyID = stateIIS.filter((item) => {
                return item.webSiteID == id;
            });
            return strategyID[0].id;
        }
    }
};