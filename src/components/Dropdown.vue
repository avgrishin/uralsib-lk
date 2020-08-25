<template lang="pug">
    form.dropdown(:class="{'dropdown_open': dropdownOpen }" ref="dropdown")
        fieldset
            a(href="#" @click.prevent="toggleDropdown").dropdown__name
                span.dropdown__arrow
                    span.g-icon-down.g-clr_wh(:class="{'g-icon-down_open': dropdownOpen }")
                span(v-html="name")
            .dropdown__content
                slot
</template>

<script>
    export default {
        props: ['name'],
        data() {
            return {
                dropdownOpen: false
            }
        },
        mounted() {
            window.addEventListener('click', this.clickEvents);
        },
        beforeDestroy() {
            window.removeEventListener('click', this.clickEvents);
        },
        methods: {
            clickEvents(event) {
                const el = this.$refs.dropdown;
                // if (el.classList.contains('dropdown_open') && el.contains(event.target)) {
                //     this.dropdownOpen = false
                // }
                if (!(el == event.target || el.contains(event.target))) {
                    this.dropdownOpen = false
                }
            },
            toggleDropdown(){
                this.dropdownOpen = !this.dropdownOpen;
            }
        }
    }
</script>

<style lang="scss">


</style>