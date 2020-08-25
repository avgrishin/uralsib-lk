import Messages from '../pages/profile/Messages';
import PersonalHelp from '../pages/profile/Help';

export default [
    {
        path: '/help',
        component: PersonalHelp,
        meta: {
            breadcrumb: 'Помощь',
            title: 'Помощь',

        },
    },
    {
        path: '/messages',
        component: Messages,
        meta: {
            breadcrumb: 'Сообщения',
            title: 'Сообщения',
            auth: true
        },
    },
]