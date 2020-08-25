// const FormPersonal = () => import(/* webpackChunkName: "chunk-form" */ '../pages/profile/form/personal');
// const FormPassport = () => import(/* webpackChunkName: "chunk-form" */ '../pages/profile/form/passport');
// const FormAddress = () => import(/* webpackChunkName: "chunk-form" */ '../pages/profile/form/address');
// const FormBank = () => import(/* webpackChunkName: "chunk-form" */ '../pages/profile/form/bank');
// const FormFinish = () => import(/* webpackChunkName: "chunk-form" */ '../pages/profile/form/finish');
import FormPersonal from '../pages/profile/form/personal';
import FormPassport from '../pages/profile/form/passport';
import FormAddress from '../pages/profile/form/address';
import FormBank from '../pages/profile/form/bank';
import FormFinish from '../pages/profile/form/finish';
import ChangePassword from '../pages/recovery/ChangePassword';
import {authState} from "../guards";

export default [
    {
        path: '/user/personal',
        component: FormPersonal,
        meta: {
            breadcrumb: 'Анкета',
            title: 'Анкета - Персональные данные',
            auth: true
        },
    },
    {
        path: '/user/passport',
        component: FormPassport,
        meta: {
            breadcrumb: 'Анкета',
            title: 'Анкета - Паспортные данные',
            auth: true
        },
        beforeEnter: authState
    },
    {
        path: '/user/address',
        component: FormAddress,
        meta: {
            breadcrumb: 'Анкета',
            title: 'Анкета - Адрес регистрации',
            auth: true
        },
        beforeEnter: authState

    },
    {
        path: '/user/bank',
        component: FormBank,
        meta: {
            breadcrumb: 'Анкета',
            title: 'Анкета - Банковские реквизиты',
            auth: true
        },
        beforeEnter: authState
    },
    {
        path: '/user/finish',
        component: FormFinish,
        meta: {
            breadcrumb: 'Формирование анкеты',
            title: 'Формирование анкеты',
            auth: true
        },
        beforeEnter: authState
    },
    {
        path: '/user/change-password',
        component: ChangePassword,
        meta: {
            auth: true,
            title: 'Изменение пароля',
        }
    },
]