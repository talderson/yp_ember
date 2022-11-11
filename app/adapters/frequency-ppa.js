import Ember from 'ember';
import { singularize, pluralize } from 'ember-inflector';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL: function(modelName, id, snapshot, requestType, query) {
        if (requestType === 'createRecord') {
            return this.host + '/instruments/bluvibe/instrument_id/' + pluralize(modelName) + '/';
        }
        if (requestType === 'updateRecord' || requestType === 'deleteRecord') {
            return this.host + '/instruments/bluvibe/instrument_id/' + pluralize(modelName) + '/' + snapshot.id + '/';
        }
        if (typeof query !== 'undefined') {
            return this.host + '/instruments/bluvibe/' + query.instrument_id + '/' + pluralize(modelName) + '/';
        }
    },
    createRecord(store, type, snapshot) {

        const data = {};
        const serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, {includeId: true});

        const id = snapshot.id;
        let url = this.buildURL(type.modelName, id, snapshot, 'createRecord');

        if (snapshot.adapterOptions) {
            url = url.replace("instrument_id", snapshot.adapterOptions);
        }

        return this.ajax(url, 'POST', {data: data});
    },
    updateRecord(store, type, snapshot) {

        const data = {};
        const serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, {includeId: true});

        const id = snapshot.id;
        let url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        if (snapshot.adapterOptions) {
            url = url.replace("instrument_id", snapshot.adapterOptions);
        }

        return this.ajax(url, 'PATCH', {data: data});
    },
    deleteRecord(store, type, snapshot) {

        const data = {};
        const serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, {includeId: true});

        const id = snapshot.id;
        let url = this.buildURL(type.modelName, id, snapshot, 'deleteRecord');

        if (snapshot.adapterOptions) {
            url = url.replace("instrument_id", snapshot.adapterOptions);
        }

        return this.ajax(url, 'DELETE', {data: data});
    },
});
