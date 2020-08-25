import Dashboard from '../pages/Dashboard';

import { hookNoUserFundsCase } from '../guards';

let helpers = process.env.NODE_ENV !== 'production'
    ? [
        {
            path: '/ukit',
            component: require('../pages/ukit'),
            meta: {
                auth: false
            }
        },
        {
            path: '/utext',
            component: require('../pages/utext'),
            meta: {
                auth: false
            }
        }
    ]
    : [];

export default [
    {
        path: '/',
        component: Dashboard,
        meta: {
            breadcrumb: 'Портфель'
        },
        beforeEnter: hookNoUserFundsCase
    },
    ...helpers
];