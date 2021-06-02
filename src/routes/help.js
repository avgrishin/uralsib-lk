import Messages from '../pages/profile/Messages';
import PersonalHelp from '../pages/profile/Help';
import Complaint from '../pages/profile/Complaint'
import Complaints from '../pages/profile/Complaints'

export default [{
    path: '/help',
    component: PersonalHelp,
    meta: {
        breadcrumb: 'Помощь',
        title: 'Помощь',
    }
}, {
    path: '/messages',
    component: Messages,
    meta: {
        breadcrumb: 'Сообщения',
        title: 'Сообщения',
        auth: true
    }
}, {
    path: '/cmp',
    component: Complaint,
    meta: {
        breadcrumb: 'Обращение',
        title: 'Обращение',
        auth: true
    }
}, {
    path: '/msg',
    component: Complaints,
    meta: {
        breadcrumb: 'Обращения',
        title: 'Обращения',
        auth: true
    }
    }]