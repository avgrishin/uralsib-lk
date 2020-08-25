<template lang="pug">
    table.case-table
        slot(name="caption")
        thead
            tr
                slot
        tbody.case-table__loaded(v-if="!loaded")
            tr.case-table__loaded-tr
                td.case-table__loaded_td(colspan="7")
                    .spinner
        tbody.case-table__loaded(v-if="loaded && rows.length==0")
            tr.case-table__loaded-tr
                td.case-table__loaded_td(colspan="7")
                    | Нет данных
        table-row(v-for="(row, index) in rows" v-if="loaded" :row="row" :key="index")
</template>
<script>
    import TableRow from './TableRow';
    export default {
        components: { TableRow },
        props: ['rows','loaded']
    }
</script>
