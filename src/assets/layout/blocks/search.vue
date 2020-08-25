<template lang="pug">
    form.b-search(@submit.prevent="initSearch" :class="{'b-search_open': searchOpen }")
        fieldset.b-search__inner
            input(@click.prevent="funcSearchOpen()",type="text", v-model="q" name="q", id="F_SEARCH_QUERY",placeholder="Поиск...").b-search__query
            button(type="submit").b-search__btn
                span.icon.icon_search
                span.g-sr-only Найти
</template>

<script>
    export default {
        watch: {
            q(val) {
                this.$emit('search', this.q);
            }
        },
        data() {
            return {
                q: '',
                searchOpen: false
            }
        },
        mounted() {
            this.makeEvents();
        },
        methods: {
            funcSearchOpen() {
                this.searchOpen = true;
            },
            initSearch() {
                this.$emit('search', this.q);
            },
            makeEvents() {
                document.addEventListener('click', (event) => {
                    if (!event.target.matches('.b-search, .b-search *') && !this.q) this.searchOpen = false;
                });
            }
        }
    }
</script>


