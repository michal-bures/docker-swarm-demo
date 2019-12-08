<template>
    <div>
        <span v-for="customer of customers" v-bind:key="customer">
            {{ customer }}
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        name: 'CustomersList',
        props: ['customers', 'currentCustomerId'],

    });
</script>

<style scoped>

</style>
