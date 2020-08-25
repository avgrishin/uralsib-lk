<script>
import { mapActions, mapState } from 'vuex';
import { CHECK_DEFERRED_APPS_ACTION, CHECK_DEFERRED_APPS_RESULT, DEFERRED_APPS_STORE_KEY } from '../../store/modules/deferred-apps';
import { sellAppsApiService } from '../../api';

export default {
    name: 'DeferredAppsObserver',

    methods: {
        ...mapActions(DEFERRED_APPS_STORE_KEY, [CHECK_DEFERRED_APPS_ACTION]),

        closeAllModals() {
            return new Promise((resolve) => {
                window.events.$emit('close_popup');

                setTimeout(() => {
                    resolve();
                }, 700);
            });
        },

        /**
         * @param {DeferredAppsStatus} result
         */
        async changeResultHandler(result) {

            if (!Object.keys(result).length) {
                return;
            }

            if (!result.applicationId) {
                return;
            }

            if (result.canBeSign) {
                const confirmOperationModalData = await this.getApplicationForOpenModal(result.applicationId);
                // await this.closeAllModals();

                window.events.$emit('show_popup', ['confirm-operation', confirmOperationModalData]);
            }
        },

        async getApplicationForOpenModal(applicationId) {
            try {
                const application = await sellAppsApiService.getApplicationById(applicationId);
                const result = {
                    app_number: application.number,
                    app_id: applicationId,
                    operation: 'SellApps',
                    fund: application.account.portfolio.description,
                    disableRequestCode: true,
                }

                return result;
            } catch (e) {
                window.flash([e.message], 'error');
            }
        },

        async cancelApplication(applicationId) {
            await sellAppsApiService.cancelAppPepVerification(applicationId);
        },

        checkAuthAndStartPolling() {
            if (!this.authenticated) {
                return;
            }

            this[CHECK_DEFERRED_APPS_ACTION]();
        },

        initExternalEventHandlers() {
            window.events.$on('code_confirmed', () => {
                if (!this[CHECK_DEFERRED_APPS_RESULT] || !this[CHECK_DEFERRED_APPS_RESULT].canBeSign) {
                    return;
                }

                window.events.$emit('show_popup', ['request-accepted', {
                    operation: 'repay',
                    closable: false
                }]);
            });
        },

        initOnClosePopupHandler() {
            window.events.$on('popup_closed', ({ component, payload }) => {
                if (component !== 'confirm-operation') {
                    return;
                }

                if (!this[CHECK_DEFERRED_APPS_RESULT] || !this[CHECK_DEFERRED_APPS_RESULT].canBeSign) {
                    return;
                }

                this.cancelApplication(payload.app_id)
                    .then(() => {})
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
        },
    },

    computed: {
        ...mapState(DEFERRED_APPS_STORE_KEY, [CHECK_DEFERRED_APPS_RESULT]),

        ...mapState('user', ['authenticated']),
    },

    watch: {
        [CHECK_DEFERRED_APPS_RESULT]: 'changeResultHandler',

        authenticated: {
            immediate: true,
            handler(isAuth) {
                if (isAuth) {
                    setTimeout(() => {
                        this[CHECK_DEFERRED_APPS_ACTION]();
                    }, 8000);
                }
            }
        },
    },

    mounted() {
        this.initOnClosePopupHandler();
        this.initExternalEventHandlers();
    },

    render() {
        return null;
    },
};
</script>
