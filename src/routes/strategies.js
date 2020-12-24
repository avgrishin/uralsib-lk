import Du from '../pages/strategies/Du';
import iisDuTermination from '../pages/strategies/iisDuTermination';
import iisDuCancel from '../pages/strategies/iisDuCancel'
import duWithdrawalTemp from '../pages/strategies/DuWithdrawalTemp';
import duWithdrawal from '../pages/strategies/DuWithdrawal';
import DuIis from '../pages/strategies/DuIis';
import DuQuestionary from '../pages/strategies/DuQuestionary';
import iisDuStrategies from '../pages/strategies/iisDuStrategies';
import iisDuStrategyPage from '../pages/strategies/iisDuStrategyPage';
import iisDuStrategyСontract from '../pages/strategies/iisDuStrategyContract';
import iisDuStrategyBuy from '../pages/strategies/iisDuStrategyBuy';
import {fundOperations, newUserBuy} from "../guards";
import PifBuyConfirm from '../pages/invest/operations/PifBuyConfirm';

let helpers = [
        {
            path: '/du/iis',
            component: DuIis,
            name:'duIis',
            meta: {
                breadcrumb: 'Индивидуальный инвестиционный счёт',
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy',
            name: 'strategies',
            component: iisDuStrategies,
            meta: {
                breadcrumb: 'ИИС и Доверительное управление',
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy/:strategyPrefix/:portfolioId',
            name: 'iisDuStrategyPage',
            component: iisDuStrategyPage,
            meta: {
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy/:strategyPrefix/contract',
            name: 'iisDuStrategyСontract',
            component: iisDuStrategyСontract,
            meta: {
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy/:strategyPrefix/buy',
            component: iisDuStrategyBuy,
            name: 'iisDuStrategyBuy',
            meta: {
                auth: true
            },
            beforeEnter: newUserBuy
        },
        {
            path: '/du/strategies/:strategyPrefix/buy/approve',
            component: PifBuyConfirm,
            meta: {
                breadcrumb: 'Оплатить',
                title: 'Оплатить',
                auth: true
            },
            beforeEnter: fundOperations
        },
        {
            path: '/du/iis/questionary',
            name:'duQuestionary',
            component: DuQuestionary,
            meta: {
                breadcrumb: 'Анкета для определения инвестиционного портфеля Клиента',
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy/:strategyPrefix/withdrawal',
            name:'duWithdrawal',
            component: duWithdrawalTemp,
            meta: {
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy/:portfolioId/termination',
            name:'iisDuTermination',
            component: iisDuTermination,
            meta: {
                auth: true
            }
        },
        {
            path: '/strategies/:selectedStrategy/:strategyPrefix/:portfolioId/cancel',
            name:'iisDuCancel',
            component: iisDuCancel,
            meta: {
                auth: true
            }
        },
    ];

export default [
    {
        path: '/du',
        component: Du,
        meta: {
            breadcrumb: 'Доверительное управление',
            auth: true
        }
    },
    ...helpers

]
