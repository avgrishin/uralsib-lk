import store from './store/index';

export const authState = (to, from, next) => {
    const userEditPages = () => {
        const authState = store.state.user.state.authState;
        const percentageStepValid = {
	        '/user/personal': 'personalDataRate',
	        '/user/passport': 'passportRate',
	        '/user/address': 'addressesRate',
	        '/user/bank': 'bankingDetailsRate',
	        '/user/finish': ''
	    };
        const percentageStepPageName = {
	        '/user/personal': 'Персональные данные',
	        '/user/passport': 'Паспортные данные',
	        '/user/address': 'Адрес регистрации',
	        '/user/bank': 'Банковские реквизиты',
	        '/user/finish': ''
        };
        const paths = Object.keys({...percentageStepValid}).map((key) => percentageStepValid[key]);
	    const keys = Object.keys({...percentageStepValid}).map((key) => key);
	    const currentStep = percentageStepValid[Object.keys(percentageStepValid)[Object.keys(percentageStepValid).indexOf(to.path)]];
	    const beforeSteps = paths.slice(0, paths.indexOf(currentStep));

        if (authState == 2) {
            next();
        } else {
        	store.commit('buffering', true);
            store.dispatch('progress/A_GET_PROGRESS_PROFILE').then(() => {
                const beforeProgressValues = beforeSteps.map(step => store.state.progress.S_PROGRESS[step]).map((value, index) => {
	                if (value < 100) return index.toString();
                }).filter(noUndefined => noUndefined);
	            const firstFindNotProgressIndex = beforeProgressValues.length ? beforeProgressValues[0] : '';
                if (!firstFindNotProgressIndex) {
	                next();
                } else {
                	next(keys[firstFindNotProgressIndex]);
                	if (percentageStepPageName[keys[firstFindNotProgressIndex]]) {
                		flash([`Пожалуйста, заполните все обязательные поля на странице "${percentageStepPageName[keys[firstFindNotProgressIndex]]}"`], 'error');
                        store.commit('buffering', false);
	                } else {
                        store.commit('buffering', false);
                    }
                }
            }).catch(() => store.commit('buffering', false))

        }
    };

    axios.get('/ClientProfile/userinfo').then((userState) => {
        userEditPages();
    });
}


export const hookPifStateCase = (to, from, next) => {

    if (!store.state.user.authenticated) {
        return next();
    }

    if (!store.state.user.state_loaded) {

        store.watch(
            (state) => state.user.state_loaded,
            () => {

                if (store.state.user.state.pifState == 2) {
                    return next()
                } else {
                    if (!from.matched.length) next('/documents')
                    return next(false);
                }


            }
        )

    } else {

        if (store.state.user.state.pifState == 2) {
            return next()
        } else {
            if (!from.matched.length) next('/documents')
            return next(false);
        }


    }
}


export const hookHasOperations = (to, from, next) => {

    //store.state.user.state.pifState=2;
    if (!store.state.user.authenticated) {
        return next();
    } else if (!store.state.user.state_loaded) {

        //if (!from.matched.length) return next('/funds');

        store.watch(
            (state) => state.user.state_loaded,
            () => {

                //if (!from.matched.length) return next('/funds');
                if (store.state.user.totals.duTotal && store.state.user.totals.pifTotal) {
                    // Has operations
                    return next();
                } else if (store.state.user.totals.duTotal && store.state.user.totals.pifTotal == 0) {
                    // Has DU, no operations
                    if (to.path == '/case/chart' || to.path == '/history') return;
                    return next();
                } else if (store.state.user.totals.total == 0) {
                    // Has requests, no operations
                    return next('/documents');
                } else if (store.state.user.state.authState == 2 && store.state.user.state.pifState == 2) {
                    return next();
                }
                return next();
            }
        )
    } else if (store.state.user.totals.duTotal && store.state.user.totals.pifTotal) {
        // Has operations
        return next();

    } else if (store.state.user.totals.duTotal && store.state.user.totals.pifTotal == 0) {
        // Has DU, no operations
        if (to.path == '/case/chart' || to.path == '/history') return
        return next();
    } else if (store.state.user.totals.total == 0) {
        window.log(to, from);
        // Has requests, no operations
        return next('/documents');
    } else if (store.state.user.state.authState == 2 && store.state.user.state.pifState == 2) {
        return next();
    }

    return next();
};

export const confirmPersonalData = (to, from, next) => {


    if (!store.state.user.state_loaded) {
        store.watch(
            (state) => state.user.state_loaded,
            () => {
                if (store.state.user.state.authState == 2) {
                    return next();
                } else if (store.state.user.state.authState == 1) {
                    window.events.$emit('show_popup', 'confirm-personal-data');
                }
            }
        )
    } else if (store.state.user.state.authState == 2) {
        return next();
    } else if (store.state.user.state.authState == 1) {
        window.events.$emit('show_popup', 'confirm-personal-data');
    }
};

export const auth = (to, from, next) => {
    if (to.path != '/') document.getElementsByTagName('body')[0].classList.add("ym-hide-content");
    else {
        document.getElementsByTagName('body')[0].classList.remove("ym-hide-content");
    }

    const authRequired = to.matched.some((route) => route.meta.auth);
    const guest = to.matched.some((route) => route.meta.guest);
    const authed = store.state.user.authenticated;

    if (authRequired && !authed) next(`/?return=${to.fullPath}`);
    else if (authed && guest) next('/');
    else next();
};

export const cleanUp = (to) => {
    let title = to.matched[to.matched.length - 1].meta.title;
    let profileRoutes = ['/case/balance', '/case/chart', '/history', '/case/balance', '/documents', '/']
    if (title) window.document.title = title;
    else window.document.title = 'Кабинет УК УРАЛСИБ';

    if (_.includes(profileRoutes, to.path)) {
        store.state.caseSection = true;
    } else {
        store.state.caseSection = false;
    }

    store.commit('toggleCrumbs', true);
    store.commit('updateCrumbs', []);
    store.commit('mainClass', '');
    store.commit('popupConfirmOff', true);
    store.state.fundsSection = false;
    store.state.flashErrorOn = true;

    // window.log('cleanUp');

    setTimeout(() => {
        document.getElementById('app').scrollTop = 0;
    }, 500);
};

export const register = (to, from, next) => {
    if (!store.state.register.form_id && !localStorage.getItem('form_id')) next('/register/contact');
    else next();
}

export const fundOperations = (to, from, next) => {

    if (localStorage.getItem('fundData')) {
        store.state.funds.operations = JSON.parse(localStorage.getItem('fundData'));
        localStorage.removeItem('fundData');

        if (store.state.funds.operations.funds) {
            let index = store.state.funds.operations.funds.findIndex(item => item.id == store.state.funds.operations.fund.id);

            store.state.funds.operations.funds[index].paid = true;
            window.log(store.state.funds.operations.funds[index])

            let not_paid = store.state.funds.operations.funds.filter(item => !item.paid);

            if (not_paid.length) delete store.state.funds.operations.fund;
            else {
                delete store.state.funds.operations.funds;
                return next();
            }

            if (to.query.success) {

                return next('/operations/buy?multisuccess=' + to.query.success)
            } else {
                return next('/operations/buy');
            }
        }

        return next();
    } else if (store.state.funds.operations.fund) return next();

    return next('/operations/buy');
};

export const duOperations = (to, from, next) => {
    if (localStorage.getItem('fundData')) {
        store.state.funds.operations = JSON.parse(localStorage.getItem('fundData'));
        localStorage.removeItem('fundData');

        if (store.state.funds.operations.funds) {
            let index = store.state.funds.operations.funds.findIndex(item => item.id == store.state.funds.operations.fund.id);
            store.state.funds.operations.funds[index].paid = true;
            window.log(store.state.funds.operations.funds[index])

            let not_paid = store.state.funds.operations.funds.filter(item => !item.paid);

            if (not_paid.length) delete store.state.funds.operations.fund;
            else {
                delete store.state.funds.operations.funds;
                return next();
            }
            if (to.query.success) {

                return next('/strategies/iis?multisuccess=' + to.query.success)
            } else {
                return next('/strategies/iis');
            }

        }

        return next();
    } else if (store.state.funds.operations.fund) {
        return next();
    }

    return next('/strategies/iis');
};


export const hookNoUserFundsCase = (to, from, next) => {

    if (!store.state.user.authenticated) {
        return next();
    }

    if (!store.state.funds.loaded) {
        store.watch(
            (state) => state.funds.loaded,
            (value) => {
                setTimeout(() => {

                    if (store.state.user.state.duState == 1 || store.getters['funds/quantityFunds']) return next();
                    else {
                        return next('/documents')
                    }
                }, 100);
            }
        )
    } else {

        if (store.state.user.state.duState == 1 || store.getters['funds/quantityFunds']) {
            return next()
        } else if (store.state.user.state.duState == 0 && store.state.user.state.pifState == 2) {
            switch (to.path) {
                case '/':
                    next('/documents')
                    break
                case '/case/balance':
                    break
                default:
                    return next()
            }
        } else {
            return next('/documents')
        }
    }
};


export const quantityFunds = (to, from, next) => {
    if (!store.state.funds.loaded) {
        store.watch(
            (state) => state.funds.loaded,
            (value) => {
                setTimeout(() => {
                    if (store.getters['funds/quantityFunds']) return next();
                }, 100);
            }
        )
    } else if (store.getters['funds/quantityFunds']) {
        return next();
    }
};

export const operFunds = (to, from, next) => {

    let operPath = {
        '/operations/repay': 'sellFunds',
        '/operations/change': 'exchangeFunds'
    }

    if (!store.state.funds.loaded) {
        store.watch(
            (state) => state.funds.loaded,
            (value) => {
                setTimeout(() => {
                    if (store.getters[`funds/${operPath[to.path]}`].length > 0) return next();
                }, 100);
            }
        )
    } else if (store.getters[`funds/${operPath[to.path]}`].length > 0) {
        return next();
    }
};

export const newUser = (to, from, next) => {
    if (
        store.state.user.state_loaded &&
        store.state.user.state &&
        store.state.user.state.authState === 2
    ) return next();
    else if (store.state.user.state_loaded) {
        if (from.matched.length) return next(from.matched[0].fullPath);
        return next('/');
    }

    if (!store.state.user.state_loaded) {
        store.watch(
            (state) => state.user.state_loaded,
            (value) => {
                if (!value) return;

                if (store.state.user.state && store.state.user.state.authState === 2) return next();
                else {
                    if (from.matched.length) return next(from.matched[0].fullPath);
                    return next('/');
                }
            }
        )
    }
};

export const newUserBuy = (to, from, next) => {
    if (
        store.state.user.state_loaded &&
        Object.values(store.state.user.state).length &&
        store.state.user.state.authState >= 1
    ) return next();
    else if (store.state.user.state_loaded) {
        if (from.matched.length) return next(from.matched[0].fullPath);
        return next('/');
    }

    if (!store.state.user.state_loaded) {
        store.watch(
            (state) => state.user.state_loaded,
            (value) => {
                if (!value) return;

                if (Object.values(store.state.user.state).length && store.state.user.state.authState >= 1) return next();
                else {
                    if (from.matched.length) return next(from.matched[0].fullPath);
                    return next('/');
                }
            }
        )
    }
};

export const hashRequired = (to, from, next) => {
    if (to.query.hash) return next();

    return next('/recover');
};
