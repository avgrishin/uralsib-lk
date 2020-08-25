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
    },

    computed: {
        ...mapState('user', {
            userState: 'state',
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
