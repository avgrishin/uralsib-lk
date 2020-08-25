import ExchnageConfirm from '../pages/invest/operations/ExchnageConfirm';
import RepayConfirm from '../pages/invest/operations/RepayConfirm';

// const Operations = () => import(/* webpackChunkName: "chunk-buy" */ '../pages/invest/Operations');
// const BuyPaiPayment = () => import(/* webpackChunkName: "chunk-buy" */ '../pages/invest/operations/PaymentMain');
// const PifBuyConfirm = () => import(/* webpackChunkName: "chunk-buy" */ '../pages/invest/operations/PifBuyConfirm');
import Operations from '../pages/invest/Operations';
import BuyPaiPayment from '../pages/invest/operations/PaymentMain';
import PifBuyConfirm from '../pages/invest/operations/PifBuyConfirm';
import DuBuyConfirm from '../pages/invest/operations/DuBuyConfirm';

import { fundOperations, duOperations,  newUser, newUserBuy, quantityFunds, operFunds } from '../guards';

export default [
    {
        path: '/operations',
        component: Operations,
        meta: {
            breadcrumb: 'Операции с паями',
            title: 'Операции с паями',
            auth: true
        }
    },
    {
        path: '/operations/buy',
        component: BuyPaiPayment,
        meta: {
            auth: true,
            title: 'Формирование документов',
        },
        beforeEnter: newUserBuy
    },
    {
        path: '/operations/change',
        component: ExchnageConfirm,
        meta: {
            auth: true,
            breadcrumb: 'Обменять паи',
            title: 'Обменять паи',
        },
        beforeEnter: operFunds
    },
    {
        path: '/operations/repay',
        component: RepayConfirm,
        meta: {
            auth: true,
            breadcrumb: 'Погасить паи',
            title: 'Погасить паи',
        },
        beforeEnter: operFunds
    },
    {
        path: '/operations/buy/approve',
        component: PifBuyConfirm,
        meta: {
            auth: true,
            breadcrumb: 'Оплатить',
            title: 'Оплатить'
        },
        beforeEnter: fundOperations
    }
    ,
    {
        path: '/strategies/operations/buy/approve',
        component: DuBuyConfirm,
        meta: {
            auth: true,
            breadcrumb: 'Оплатить',
            title: 'Оплатить'
        },
        beforeEnter: duOperations
    }
]
