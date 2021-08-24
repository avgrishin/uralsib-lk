import Dashboard from '../pages/Dashboard';
import OperationsHistory from '../pages/case/HistoryNew';
import Documents from '../pages/case/Documents';
import CaseBalance from '../pages/case/Balance';
import CaseChart from '../pages/case/Chart';
import CaseStruct from '../pages/case/CaseOldClient';

import {hookNoUserFundsCase,hookPifStateCase } from '../guards';

export default [{
    path: '/',
    component: Dashboard,
    meta: {
        breadcrumb: 'Баланс'
    },
    beforeEnter: hookNoUserFundsCase
}, {
    path: '/history',
    component: OperationsHistory,
    meta: {
        breadcrumb: 'История операций ПИФ',
        title: 'История операций ПИФ',
        auth: true
    },
    beforeEnter: hookPifStateCase
}, {
    path: '/documents',
    component: Documents,
    meta: {
        breadcrumb: 'Документы',
        title: 'Документы',
        auth: true
    }
}, {
    path: '/case/balance',
    component: CaseStruct,
    meta: {
        auth: true,
        breadcrumb: 'Структура'
    },
    beforeEnter: hookNoUserFundsCase
}, {
    path: '/case/chart',
    component: CaseChart,
    meta: {
        auth: true,
        breadcrumb: 'Динамика'
    },
    beforeEnter: hookNoUserFundsCase
}]