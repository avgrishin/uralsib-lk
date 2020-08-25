<template lang="pug">
    label.control__field.g-d_b(:class="{'spinner spinner_autocomplete':loader}")
        input(
            type="text"
            v-model="q"
            :name="name"
            @input="search"
            @blur="closeDropdown"
            v-validate="validation"
            :data-vv-as="as"
            :id="id"
            :disabled="disabled",
            :autocomplete="autocomplete"
            ).field_text.field_text_mtrl.field_dropdown
        span.control__label(v-html="label")
        span.field_error(v-if="errors.has(name)" v-html="errors.first(name)")
        .dropdown.dropdown_field(v-show="showDropdown")
            .dropdown__content
                .dropdown__item(v-for="(item, index) in options" :key="index")
                    a(href="#" @click.prevent="selectItem(item)" v-html="item.title + ' ' + (item.parentName ? `(${item.parentName})` : '')") 
</template>
<script>
    export default {
        inject: ['$validator'],
        props: {
            label: {
                required: true
            },
            name: {
                required: true
            },
            id: {
                required: false,
                default: ''
            },
            validation: {
                required: false,
                default: ''
            },
            as: {
                required: false,
                default: ''
            },
            level: {
                required: true
            },
            value: {
                required: false,
                default: ''
            },
            disabled: {
                required: false,
                default: false
            },
            extraParameters: {
                required: false,
                default: false
            },
            autocomplete: {
                required: false,
                default: 'on'
            }
        },
        watch: {
            disabled(val){
                //if(val) this.q = '';

            },
            value(val) {
                this.q = val;
            },
            q(val) {
                this.search();
                this.$emit('selected', val);
            }
        },
        data() {
            return {
                loader:false,
                q: this.value,
                options: [],
                timeout: false,
                showDropdown: false
            }
        },
        methods: {
            search() {
                if (this.q == this.value || !this.q) return;

                clearTimeout(this.timeout);

                this.timeout = setTimeout(() => this.getData(), 1000);
            },
            getData() {
                let url = '/reference/addressbynamelevel';
                let lvl = parseInt(this.level) - 1;

                let params = {
                    level: this.level,
                    name: this.q,
                    count: 10
                }

                while (lvl > 0) {
                    let item = Object.values(this.extraParameters).find(item => item.level == lvl);
                    
                    if (item) {
                        params.kladrCode = item.key;
                        params.kladrLevel = item.level;

                        url = '/reference/addressbynamelevelkladr';

                        break;
                    }

                    lvl--;
                }

                if (this.level == 8) {
                    url = '/reference/buildingbynumkladr';

                    params.number = params.name;

                    delete params.level;
                    delete params.name;
                }

                if (this.level == 9) {
                    url = '/reference/buildingbynumid';

                    params.number = this.q;
                    params.numberHouse = (this.extraParameters && this.extraParameters.house) ? this.extraParameters.house.houseNumber : '';
                    params.AddressObjectGUID = (this.extraParameters && this.extraParameters.house) ? this.extraParameters.house.objectGUID : '';

                    delete params.level;
                    delete params.name;
                    delete params.kladrCode;
                    delete params.kladrLevel;
                }
                this.loader=true;
                axios.get(url, { params })
                    .then(({data}) => {
                        this.options = data;
                        this.loader=false;
                        if (data.length) this.showDropdown = true;
                        else this.showDropdown = false;
                    }).catch((error)=>{
                    this.loader=false;
                });
            },
            selectItem(item) {
                if (!item || !item.title) return;

                if (this.value == item.title) this.q = item.title;
                this.$emit('selected', item);
                this.closeDropdown();
            },
            closeDropdown() {
                setTimeout(() => this.showDropdown = false, 500);
            }

        }
    }
</script>

<style lang="scss">
    .spinner_autocomplete {
        &::before {
            left: auto;
            right: 0;
            width: 25px;
            height: 25px;
            margin-top: -12px;
            margin-left: 0px;
            margin-right: 1em;
        }

        .field_text {
            padding-right:3em;
        }
    }
</style>
