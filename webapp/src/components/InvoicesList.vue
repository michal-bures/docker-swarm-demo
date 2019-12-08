<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <b-list-group>
            <b-list-group-item
                    v-for="invoice of invoices"
                    v-bind:key="invoice.id"
            >
                <div>{{ invoice.quantity }}x {{ getProductName(invoice.productId) }}</div>
            </b-list-group-item>
            <b-list-group-item key="add">
                <b-form-input v-model="newInvoice.quantity" type="number" placeholder="N"></b-form-input>
                <b-form-select
                        v-model="newInvoice.productId" :options="productOptions">
                    <template v-slot:first>
                        <option :value="null" disabled>-- Select product to order --</option>
                    </template>
                </b-form-select>
                <b-button
                        variant="success"
                        v-bind:disabled="newInvoice.quantity <= 0 || !newInvoice.productId"
                        v-on:click="$emit('add-order', newInvoice.productId, newInvoice.quantity)">+ Add Invoice</b-button>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {AsyncModel} from '../lib/AsyncModel';

    export default Vue.extend({
        name: 'InovicesList',
        props: ['invoices', 'products'],
        data: () => ({
            newInvoice: {
                productId: null,
                quantity: 1,
            },
        }),
        computed: {
            productOptions: function () {
                if (this.products === AsyncModel.LOADING) {
                    return [{text: 'Loading...', disabled: true}]
                } else if (this.products === AsyncModel.FAILED) {
                    return [{text: 'Oops! Failed to load available products', disabled: true}]
                }

                return this.products.map(p => ({ text: p.name, value: p.id }))
            }
        },
        methods: {
            getProductName(productId) {
                if (!Array.isArray(this.products)) {
                    return `[product #${productId}]`;
                }
                const product = this.products.find(p => p.id === productId);
                if (!product) return `[product #${productId}]`;

                return product.name;
            }
        }
    });
</script>

<style scoped>
    .address {
        font-size: small;
    }
</style>
