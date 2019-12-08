<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <CustomersList
                v-bind:customers="customers"
                v-bind:currentCustomerId="currentCustomerId"
        />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import CustomersList from './components/CustomersList.vue';

    const loading = Symbol();

    export default Vue.extend({
        name: 'app',
        components: {
            CustomersList,
        },
        data: () => ({
            customers: ['C1', 'C2'],
            currentCustomerId: 'C1',
            customerOrders: loading,
            products: loading,
        })
    });
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
