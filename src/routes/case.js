import OperationsHistory from '../pages/case/History';
import Documents from '../pages/case/Documents';
import CaseBalance from '../pages/case/Balance';
import CaseChart from '../pages/case/Chart';


import {hookNoUserFundsCase,hookPifStateCase } from '../guards';


export default [
    {
        path: '/history',
        component: OperationsHistory,
        meta: {
            breadcrumb: 'История операций ПИФ',
            title: 'История операций ПИФ',
            auth: true
        },
        beforeEnter: hookPifStateCase
    },
    {
        path: '/documents',
        component: Documents,
        meta: {
            breadcrumb: 'Документы',
            title: 'Документы',
            auth: true
        }
    },
    {
        path: '/case/balance',
        component: CaseBalance,
        meta: {
            auth: true,
            breadcrumb: 'Портфель'
        },
        beforeEnter: hookNoUserFundsCase
    },
    {
        path: '/case/chart',
        component: CaseChart,
        meta: {
            auth: true,
            breadcrumb: 'Портфель'
        },
        beforeEnter: hookNoUserFundsCase
    }
]