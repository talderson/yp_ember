import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL: function(modelName, id, snapshot, requestType, query) {
        if (requestType === 'createRecord') {
            return this.host + '/instruments/';
        }
        if (requestType === 'updateRecord' || requestType === 'deleteRecord') {
            return this.host + '/instruments/instrument_id/';
        }
        if (typeof id !== 'undefined' && id !== null) {
            return this.host + '/instruments/' + id + '/';
        }
        if (typeof query === 'undefined') {
            return this.host + '/instruments/';
        }
        if (typeof query.instrument_id === 'undefined') {
            return this.host + '/instruments/';
        } else {
            return this.host + '/instruments/' + query.instrument_id + '/';
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

        if (id) {
            url = url.replace("instrument_id", id);
        }

        return this.ajax(url, 'PATCH', {data: data});
    },
    deleteRecord(store, type, snapshot) {

        const data = {};
        const serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, {includeId: true});

        const id = snapshot.id;
        let url = this.buildURL(type.modelName, id, snapshot, 'deleteRecord');

        if (id) {
            url = url.replace("instrument_id", id);
        }

        return this.ajax(url, 'DELETE', {data: data});
    },
});
