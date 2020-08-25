import Analitycs from '../pages/invest/Analitycs';

import { newUser, hookPifStateCase } from '../guards';

export default [
    {
        path: '/analytics',
        component: Analitycs,
        meta: {
            breadcrumb: 'Аналитика',
            title: 'Аналитика',
            auth: true
        },
        beforeEnter: hookPifStateCase,
    }
]