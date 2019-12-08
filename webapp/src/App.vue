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
                <b-col v-if="currentCustomerId">
                    <h4>{{ currentCustomer.name }} > Invoices</h4>
                    <ModelLoader
                            v-bind:model="customerInvoices"
                            v-on:retry="fetchCustomerInvoices"
                    >
                        <InvoicesList
                                v-bind:invoices="customerInvoices"
                                v-bind:products="products"
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
    import {
        createCustomer,
        createInvoice,
        fetchCustomers,
        fetchCustomerInvoices,
        fetchProducts,
    } from '@/rest-endpoints';
    import {AsyncModel} from '@/lib/AsyncModel';
    import InvoicesList from './components/InvoicesList.vue';

    interface Data {
        customers: Array<{ id: string, name: string, address: string }> | Symbol
        customerInvoices: Array<{ id: string, productId: string, quantity: number }> | Symbol
        products: Array<{ id: string, name: string }> | Symbol,
        currentCustomerId: string | null;
    }

    export default Vue.extend({
        name: 'app',
        components: {
            ModelLoader,
            CustomersList,
            InvoicesList
        },
        data(): Data {
            return {
                customers: AsyncModel.LOADING,
                currentCustomerId: null,
                customerInvoices: AsyncModel.LOADING,
                products: AsyncModel.LOADING,
            }
        },
        computed: {
            currentCustomer: function() {
                return (this as any).customers!.find((c: any) => c.id === this.currentCustomerId);
            }
        },
        methods: {
            fetchCustomers() {
                this.customers = AsyncModel.LOADING;
                fetchCustomers()
                    .then((data) => this.customers = data)
                    .catch((err) => this.customers = AsyncModel.FAILED)
            },
            fetchProducts() {
                this.products = AsyncModel.LOADING;
                fetchProducts()
                    .then((data) => this.products = data)
                    .catch((err) => this.products = AsyncModel.FAILED)
            },
            selectCustomer(id: string) {
                this.currentCustomerId = id;
                this.fetchInvoices();
            },
            addCustomer(name: string, address: string) {
                this.customers = AsyncModel.LOADING;
                createCustomer(name, address)
                    .then(() => this.fetchCustomers())
                    .catch(() => {
                        this.customers = AsyncModel.FAILED;
                    })
            },
            addInvoice(productId: string, quantity: number) {
                this.customerInvoices = AsyncModel.LOADING;
                createInvoice({productId, quantity, customerId: this.currentCustomerId!})
                    .then(() => this.fetchInvoices())
                    .catch((err) => {
                        this.customerInvoices = AsyncModel.FAILED;
                    })
            },
            fetchInvoices() {
                fetchCustomerInvoices(this.currentCustomerId!)
                    .then((data) => this.customerInvoices = data)
                    .catch(() => this.customerInvoices = AsyncModel.FAILED)
            }
        },
        created() {
            this.fetchCustomers();
            this.fetchProducts();
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
