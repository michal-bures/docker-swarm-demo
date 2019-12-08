<template>
    <div>
        <div  v-if="isLoading" >
            <b-spinner label="Loading"></b-spinner>
            Loading data...

        </div>
        <div v-else-if="hasFailed">
            <b-jumbotron lead="Oops!">
                <p>That didn't work :(</p>
                <b-button href="#" v-on:click="$emit('retry')">Retry</b-button>
            </b-jumbotron>
        </div>
        <slot v-else></slot>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {AsyncModel} from '../lib/AsyncModel';

    export default Vue.extend({
        name: 'ModelLoader',
        props: ['model'],
        computed: {
            isLoading() { return this.model === AsyncModel.LOADING; },
            hasFailed() { return this.model === AsyncModel.FAILED; },
        }
    });
</script>

<style scoped>

</style>
