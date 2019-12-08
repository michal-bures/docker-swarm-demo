<template>
    <div>
        <b-list-group>
            <b-list-group-item button
                    v-for="invoice of invoices"
                    v-bind:key="invoice.id"
            >
                <div>{{ invoice.quantity }}x {{ invoice.productId }}</div>
            </b-list-group-item>
            <b-list-group-item key="add">
                <b-form-input v-model="newInvoice.quantity" placeholder="N"></b-form-input>
                <b-form-input v-model="newInvoice.productId" placeholder="Product"></b-form-input>
                <b-button
                        variant="success"
                        v-bind:disabled="newInvoice.quantity <= 0 || !newInvoice.productId"
                        v-on:click="$emit('add-order', newInvoice)">+ Add invoice</b-button>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        name: 'InovicesList',
        props: ['invoices', 'productsById'],
        data: () => ({
            newInvoice: {
                productId: null,
                quantity: 1,
            },
        })
    });
</script>

<style scoped>
    .address {
        font-size: small;
    }
</style>
