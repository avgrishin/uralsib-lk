<template lang="pug">
    .popup(:class="{popup_show: popup_active}" ref="popup")
        .popup__overlay(@click="overlayClickHandler")
        .popup__wrap
            .popup__inner
                .popup__close.g-ib.icon.icon_trash.g-cr_p(@click="closePopup" v-if="closable")
                component(:is="activeComponent", @onLoading="onLoading", :payload="payload")
</template>

<script>
    export default {

        components: {
            'message': require('./popups/Message.vue'),
            'outdated-password': require('./popups/OutdatedPassword.vue'),
            'user_is_lockedout': require('./popups/UserLockedOut.vue'),
            'password_expired': require('./popups/PasswordExpired.vue'),
            'confirm-personal-data': require('./popups/ConfirmPersonalData.vue'),
            'preview-operation': require('./popups/PreviewOperationNew.vue'),
            'preview-docs': require('./popups/PreviewDocs.vue'),
            'confirm-operation': require('./popups/ConfirmOperation'),
            'confirm-operation-multi': require('./popups/ConfirmOperationMulti'),
            'confirm-operation-du-contract': require('./popups/ConfirmOperationDuContract'),
            'request-accepted': require('./popups/RequestAccepted'),
            'password-successfully': require('./popups/PasswordSuccessfully'),
            'password-scc': require('./popups/PasswordSuccessfullyCurrentClient'),
            'after-register-auto-auth': require('./popups/AfterRegisterAutoAuth'),
            'after-register': require('./popups/AfterRegister'),
            'form-confirm': require('./popups/FormConfirm'),
            'form-signed': require('./popups/FormSigned'),
            'contact': require('./popups/Contact'),
            'exit': require('./popups/Exit.vue'),
            'after-help': require('./popups/AfterHelp.vue'),
            'after-help-repay': require('./popups/AfterHelpRepay.vue'),
            'add-new-card': require('./popups/AddNewCard'),
            'sms': require('./popups/Sms'),
            'not-confirmed': require('./popups/NotConfirmed'),
            'invoice': require('./popups/Invoice'),
            'session-reminder': require('./popups/SessionReminder'),
            'form-step': require('./popups/FormStep'),
            'check-register-state': require('./popups/CheckRegisterState'),
	        'popup-technical-works': require('./popups/PopupTechnicalWorks'),
	        'temp-password': require('./popups/TempPassword'),
	        'sell-alert-confirm': require('./popups/SellAlertConfirm'),
            'sell-alert-final': require('./popups/SellAlertFinal'),
            'survey': require('./popups/Survey'),
            'preview-payms': require('./popups/Payments')
        },
        watch: {
            '$route' (to, from) {
                if (to.fullPath === from.fullPath) {
                    return;
                }


                this.closable = true;
                //if(this.getClosePopupYes)  { window.log('watch closePopup',this.getClosePopupYes);this.closePopup();}
                this.closePopup();



            },
            activeComponent(val) {
                this.bugIE();
            }
        },
        data() {
            return {
                activeComponent: false,
                popup_active: false,
                payload: false,
                closable: true,
                loading: false
            }
        },
        created() {
            let This = this

            window.events.$on('show_popup', (component) => {
                let activeComponent = '', payload = false;

                if (typeof component == 'string') activeComponent = component;
                else {
                    activeComponent = component[0];
                    payload = component[1];
                }

                this.activeComponent = activeComponent;
                this.payload = payload;
                this.popup_active = true;
                if (payload && 'closable' in payload) this.closable = payload.closable;

            });


            window.events.$on('close_popup', () => {
                this.closable = true;
                this.closePopup();
            });


            window.events.$on('check_popup', function (component, promise) {
                let activeComponent = This.activeComponent
                if (typeof component == 'object') {
                    component.map((el) => {
                        if (el == activeComponent) {
                            promise.resolve(el == activeComponent)
                            return
                        }
                    });
                } else {
                    promise.resolve(component == activeComponent)
                }
            });
        },
        methods: {
            onLoading(data) {
                this.loading = data;
            },

            overlayClickHandler() {
                if (this.payload.disableOverlayClick) {
                    return;
                }

                this.closePopup();
            },

            closePopup() {
                if (this.loading) return;
                this.closePopupYes=true;
                if (!this.closable) return;
                this.popup_active = false;
                window.events.$emit('popup_closed', {
                    component: this.activeComponent,
                    payload: this.payload
                });

                let oldActiveComponent = this.activeComponent;

                setTimeout(() => {
                    if (oldActiveComponent == this.activeComponent) {
                        this.activeComponent = false;
                        this.payload = false;
                    }

                    if (oldActiveComponent == 'check-register-state') {
                        setTimeout(() => {
                            if(this.$store.state.user.state.authState == 1) {
                                if(oldActiveComponent !== 'confirm-personal-data') window.events.$emit('show_popup', 'confirm-personal-data');
                            }
                        }, 1000);
                    }
                }, 301);

                if ( this.$store.state.formStep.path !== '' ) {
                    this.$store.commit('setFormStepPath', '')
                }

                if (this.activeComponent == 'invoice') {
                    this.$store.commit('popupConfirmOff', false);
                }
            },
            bugIE() {
                let div = document.querySelector('.popup .bug-ie');

                if (div) this.$refs.popup.removeChild(div);

                setTimeout(() => {
                    if (this.activeComponent) {
                        let bug = document.createElement('div');
                        bug.className = 'bug-ie';

                        this.$refs.popup.prepend(bug);
                    }
                }, 100);
            }
        },
        computed: {
        }
    }
</script>
