<template>
    <div id="app">
        <b-container class="bv-example-row">
            <b-row>
                <b-col cols="3">
                    <h4>Customers</h4>
                    <ModelLoader
                            v-bind:model="customers"
                            v-on:retry="fetchCustomers"
                    >
                        <CustomersList
                            v-bind:customers="customers"
                            v-bind:currentCustomerId="currentCustomerId"
                            v-on:select-customer="selectCustomer"
                            v-on:add-customer="addCustomer"
                        />

                    </ModelLoader>
                </b-col>
                <b-col>
                    <ModelLoader
                            v-bind:model="customerInvoices"
                            v-on:retry="fetchInvoices"
                    >
                        <InvoicesList
                                v-bind:invoices="customerInvoices"
                                v-on:add-order="addInvoice"
                        />
                    </ModelLoader>
                </b-col>
            </b-row>
        </b-container>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import CustomersList from './components/CustomersList.vue';
    import ModelLoader from './components/ModelLoader.vue';
    import {createCustomer, createInvoice, fetchCustomers, fetchInvoices, NewInvoice} from '@/rest-endpoints';
    import {AsyncModel} from '@/lib/AsyncModel';
    import InvoicesList from './components/InvoicesList.vue';

    export default Vue.extend({
        name: 'app',
        components: {
            ModelLoader,
            CustomersList,
            InvoicesList
        },
        data: () => ({
            customers: AsyncModel.LOADING,
            currentCustomerId: 'C1',
            customerInvoices: AsyncModel.LOADING,
            products: AsyncModel.LOADING,
        }),
        methods: {
            fetchCustomers() {
                this.customers = AsyncModel.LOADING;
                fetchCustomers()
                    .then((data) => this.customers = data)
                    .catch((err) => this.customers = AsyncModel.FAILED)
            },
            selectCustomer(id: string) {
                this.currentCustomerId = id;
            },
            addCustomer(name: string, address: string) {
                this.customers = AsyncModel.LOADING;
                createCustomer(name, address)
                    .then(() => this.fetchCustomers())
                    .catch((err) => {
                        console.log("FAILED", err);
                        this.customers = AsyncModel.FAILED;
                    })
            },
            addInvoice(newInvoice: NewInvoice) {
                this.products = AsyncModel.LOADING;
                createInvoice(newInvoice)
                    .then(() => this.fetchCustomers())
                    .catch((err) => {
                        console.log("FAILED", err);
                        this.products = AsyncModel.FAILED;
                    })
            },
            fetchInvoices() {
                fetchInvoices()
                    .then((data) => this.customerInvoices = data)
                    .catch((err) => this.customerInvoices = AsyncModel.FAILED)
            }
        },
        created() {
            this.fetchCustomers();
            this.fetchInvoices();
        }
    });

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
