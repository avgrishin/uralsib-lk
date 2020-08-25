import Recovery from '../pages/recovery/Recovery';
import NewPassword from '../pages/recovery/NewPassword';

import { hashRequired } from '../guards';

export default [
    {
        path: '/recover',
        component: Recovery,
        meta: {
           /* guest: true,*/
            title: 'Восстановление пароля',
        },
    },
    {
        path: '/recover/password',
        component: NewPassword,
        meta: {
            guest: true,
            title: 'Восстановление пароля'
        },
        beforeEnter: hashRequired
    }
]