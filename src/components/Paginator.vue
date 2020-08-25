<template lang="pug">
    form(v-if="max_page > 1")
        fieldset
            .nav-pages
                legend.nav-pages__text Страница:
                ul.nav-pages__list.g-plain
                    li.nav-pages__item(
                    v-for="(n, index) in pagination()"
                        :key="index"
                            :class="{ 'nav-pages__item_active': n == page }"
                    )
                        button(@click.prevent="selectPage(n)" v-html="n").nav-pages__link.g-btn-txt
                    li.nav-pages__item.nav-pages__item_nex(v-if="page != max_page")
                        button(@click.prevent="navigate('up')").nav-pages__link.g-btn-txt Следующая
</template>
<script>
    export default {
        props: ['settings'],
        data() {
            return {
                page: 1,
                max_page: false
            }
        },
        watch: {
            settings(val) {
                if (val == null) return;
                
                this.page = parseInt(val.page);
                this.max_page = Math.ceil(val.max_page);

                this.pagination();
            },
            page() {
                this.$emit('paginate', this.page);
            }
        },
        methods: {
            selectPage(page) {
                let elem = document.getElementById('js-paginator-scroll-top');
                if (elem) elem.scrollIntoView();


                if (page === '...') return;

			    this.page = page;
            },
            navigate(where) {
                if (where == 'up' && (this.page != this.max_page)) this.page++;
                else if (where == 'down' && (this.page != 1)) this.page--;
                
                return;
            },
            pagination() {
                let current = this.page,
                    last = this.max_page,
                    delta = 3,
                    left = current - delta,
                    right = current + delta + 1,
                    range = [],
                    rangeWithDots = [],
                    l;

                for (let i = 1; i <= last; i++) {
                    if (i == 1 || i == last || i >= left && i < right) range.push(i);
                }

                if (!this.isIterable(range)) return [];

                for (let i of range) {
                    if (l) {
                        if (i - l === 2) rangeWithDots.push(l + 1);
                        else if (i - l !== 1) rangeWithDots.push('...');
                    }
                    rangeWithDots.push(i);
                    l = i;
                }

                return rangeWithDots;
            },
            isIterable(obj) {
                if (obj == null) return false;

                return typeof obj[Symbol.iterator] === 'function';
            }
        }
    }
</script>
