<template>
    <nav class="breadcrumbs g-hide_xs" v-if="breadcrumbs.length && showBreadcrumbs">
        <ul class="g-plain">
            <li class="breadcrumbs__item" v-for="(crumb, key) in breadcrumbs" :key="key">
                <router-link 
                    class="breadcrumbs__link"
                    active-class="active"
                    :tag="itemTag(crumb)"
                    :to="linkProp(crumb)"
                >
                    {{ linkText(crumb) }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>
<script>
    export default {
        methods: {
            itemTag(crumb) {
                return this.breadcrumbs.indexOf(crumb) == (this.breadcrumbs.length - 1) ? 'span' : 'a';
            },
            linkProp(crumb) {
                if (crumb.path != undefined) return (crumb.path == '' ? '/' : crumb.path);

                return crumb.link;
            },
            linkText(crumb) {
                if (crumb.meta) return crumb.meta.breadcrumb;

                return crumb.text;
            }
        },
        computed: {
            breadcrumbs() {
                let breadcrumbs = [];

                if (this.$store.state.user.authenticated) {
                    breadcrumbs.push({ text: 'Личный кабинет', link: '/' });
                }
                return [
                    ...breadcrumbs,
                    ...this.$store.state.moreBreadcrumbds,
                    ...this.$breadcrumbs
                ];
            },
            showBreadcrumbs() {
                return this.$store.state.showBreadcrumbs;
            }
        }
    }
</script>
