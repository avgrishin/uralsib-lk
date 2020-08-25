import CaseAll from '../pages/invest/funds/AllFunds.vue';
import NewClientAllFunds from '../pages/invest/funds/NewClientAllFunds.vue';

// const Fund = () => import(/* webpackChunkName: "chunk-fund" */ '../pages/Fund.vue');
import Fund from '../pages/Fund.vue';

export default [
    {
        path: '/funds',
        component: CaseAll,
        meta: {
            auth: true,
            title: 'Паевые инвестиционные фонды',
            breadcrumb: 'Паевые инвестиционные фонды',
        }
    },
    {
        path: '/newclientallfunds',
        component: NewClientAllFunds,
        meta: {
            auth: true,
            title: 'Паевые инвестиционные фонды_',
            breadcrumb: 'Паевые инвестиционные фонды',
        }
    },
    {
        path: '/funds/:fund_name',
        component: Fund,
        meta: {
            auth: true
        }
    },
]