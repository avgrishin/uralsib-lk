<template>
    <div class="svginline" v-html="svg"></div>
</template>

<script>
    export default {
        props: [ 'src' ],
        watch: {
            src() {
                this.getSVG();
            }
        },
        data() {
            return {
                svg: ''
            }
        },
        created() {
            this.getSVG();
        },
        methods: {
            getSVG() {
                axios.get(`/dist/img${this.src}`, {
                    baseURL: ''
                }).then(({
                    data
                }) => this.svg = data).catch((error) => {
                    if (this.src.indexOf('/funds/') !== -1) {
                        axios.get(`/dist/img/funds/null.svg`, {
                            baseURL: ''
                        }).then(({
                            data
                        }) => this.svg = data)
                    }
                })
            }
        }
  }
</script>
