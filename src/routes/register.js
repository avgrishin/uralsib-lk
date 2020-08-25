import RegStep1 from '../pages/register/RegStep1';
import RegStep2 from '../pages/register/RegStep2';
import RegOptions from '../pages/register/RegOptions';
import RegNrk from '../pages/register/RegNrk';

import {register} from '../guards';

export default [
    {
        path: '/register',
        component: RegOptions,
        meta: {
            guest: true,
            title: 'Способы регистрации',
        },
        //redirect: { name: 'technicalWorks' }
    },
    {
        path: '/register/contact',
        component: RegStep1,
        meta: {
            guest: true,
            title: 'Регистрация',
        },
        //redirect: { name: 'technicalWorks' }
    },
    {
        path: '/register/passport',
        component: RegStep2,
        meta: {
            guest: true,
            title: 'Регистрация',
        },
        beforeEnter: register,
        //redirect: { name: 'technicalWorks' }
    }
    ,{
        path: '/register/nrk',
        component: RegNrk,
        meta: {
            //guest: true,
            title: 'Регистрация',
        },
        //redirect: { name: 'technicalWorks' }
    }
    // ,{
    //     path: '/register/nrk',
    //     component: RegNrk,
    //     meta: {
    //         //guest: true,
    //         title: 'Регистрация',
    //     }
    // }

]
