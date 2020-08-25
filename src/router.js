import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFound from './pages/404';

import main from './routes/main';
import analytics from './routes/analytics';
import funds from './routes/funds';
import help from './routes/help';
import operations from './routes/operations';
import recover from './routes/recover';
import register from './routes/register';
import user from './routes/user';
import strategies from './routes/strategies';
import userCase from './routes/case';
import technicalWorks from "./pages/technicalWorks";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'hash',
    routes: [
        ...main,
        ...analytics,
        ...funds,
        ...help,
        ...operations,
        ...recover,
         ...register,
        ...userCase,
        ...user,
        ...strategies,

        {
            path: '*',
            component: NotFound,
            meta: {
                title: '404',
            },
        }
        // , {
        //     path: '/technical-works',
        //     name: 'technicalWorks',
        //     component: technicalWorks,
        // }
    ]

});
