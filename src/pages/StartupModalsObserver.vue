<script>
import { mapState } from 'vuex';

/**
 * Служебный renderless-компонент для вызова свяких модалок при старте приложения
 * Постепенно планирую рефакторинг с переносом сюда всей этой логики
 * @author Gruzdkov Alexander
 */
export default {
    name: 'startup-modals-observer',

    methods: {
        openTempPasswordModal() {
            window.events.$emit('show_popup', ['temp-password', { disableOverlayClick: true }]);
        },
        openSurveyModal() {
            window.events.$emit('show_popup', ['survey', { userId: this.userState.userId }]);
        },
        getCookie(name) {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
    },

    watch: {
        fundsLoaded: {
            immediate: true,
            handler(value) {
                if (this.userState.hasTempPassword) {
                    setTimeout(this.openTempPasswordModal, 1000);
                }
            }
        },
        userStateLoaded: {
            immediate: true,
            handler(value) {
                // if (this.userState.clientId && this.getCookie('opros2') != '1') {
                //     setTimeout(this.openSurveyModal, 1000);
                // }
            }
        },
    },

    computed: {
        ...mapState('user', {
            userState: 'state',
            userStateLoaded: 'state_loaded'
        }),

        ...mapState('funds', {
            fundsLoaded: 'loaded',
        }),
    },

    render() {
        return null;
    },
};
</script>
