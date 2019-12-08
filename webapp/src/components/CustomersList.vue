<template>
    <div>
        <b-list-group>
            <b-list-group-item button
                    v-for="customer of customers"
                    v-bind:key="customer.id"
                    v-bind:active="customer.id === currentCustomerId"
                    v-on:click="$emit('select-customer', customer.id)"
            >
                <div>{{ customer.name }}</div>
                <div class="address">{{ customer.address }}</div>
            </b-list-group-item>
            <b-list-group-item key="add">
                <b-form-input v-model="newCustomerName" placeholder="Name"></b-form-input>
                <b-form-input v-model="newCustomerAddress" class="address" placeholder="Address"></b-form-input>
                <b-button
                        variant="success"
                        v-bind:disabled="!newCustomerName"
                        v-on:click="$emit('add-customer', newCustomerName, newCustomerAddress)">+ Add</b-button>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        name: 'CustomersList',
        props: ['customers', 'currentCustomerId'],
        data: () => ({
            newCustomerName:'',
            newCustomerAddress:'',
        })
    });
</script>

<style scoped>
    .address {
        font-size: small;
    }
</style>
