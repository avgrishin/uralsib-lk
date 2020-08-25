<template lang="pug">
    dl(:class="'js-collapse ' + getClassCurrent(item.isActive)" @click="toggleView($event)")
        dt.b-collapse__head
            .b-collapse__name
                | {{item.id}}.
                span(v-html="item.name")
            .b-collapse__toggler
        dd.b-collapse__content(@click="clickHandler" v-html="item.content")
</template>

<script>
    import { checkAndFireEvent } from '../../../helpers';

    export default {
        props: {
            fireGTMEvents: {
                type: Boolean,
                default: false
            },

            item: {
                type: Object,
                required: true
            }
        },
        methods:{
            clickHandler() {
                if (!this.fireGTMEvents) {
                    return;
                }

                checkAndFireEvent({
                    action: 'downloadPDF',
                    label: this.item.name
                })
            },

            getClassCurrent(isActive){
                return 'b-collapse' + (isActive ? ' active' : '');
            },

            toggleView(event){
                event.target.closest('.js-collapse').classList.toggle('active');

            }
        },
    }
</script>



