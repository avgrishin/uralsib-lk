<template lang="pug">
    <component :is="activeComponent"></component>
</template>

<script>
    import Auth from './Auth';
    import CaseOld from './case/CaseOldClient';
    import CaseNew from './case/CaseNewClient';

    export default {
        components: {
            Auth,
            CaseOld,
            CaseNew
        },
        watch: {
            authState() {
                this.$nextTick(() => {
                    if (window && window.scrollTo) window.scrollTo(0, 0);
                });
            }
        },
        computed: {
            activeComponent() {
                if (!this.$store.state.user.authenticated || !this.$store.state.user.state_loaded) return 'auth';
                
                return 'case-old';
            },
            userFunds() {
                return this.$store.state.user.funds;
            },
            authState() {
                return this.$store.state.user.authenticated;
            }
        }
    }
</script>

