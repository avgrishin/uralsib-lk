export const API_TEST_URL = 'http://smev.test-it-studio.ru/api';
export const API_DEBUG_URL = 'http://localhost:48759';
export const API_PROD_URL = '/api';
export const API_FULL_PROD_URL = 'https://i.am-uralsib.ru/api';

export function detectEnv() {
    const isSandbox = window.location.hostname.indexOf('localhost') >= 0;
    console.log(`window.location.hostname=${window.location.hostname}`);
    const forceFullProd = Boolean(window.DEBUG_fullprod);
    if (isSandbox)
        return API_DEBUG_URL;
    if (forceFullProd) {
        return API_FULL_PROD_URL;
    }
    return API_PROD_URL;
//    if (isSandbox) {
//        return API_TEST_URL;
//    }

//    return process.env.NODE_ENV === 'development' ? API_TEST_URL : API_PROD_URL;
}
export const API_BASE_URL = detectEnv();

export const APP_CONFIGURATION = {
    disableESIA: false,
};
