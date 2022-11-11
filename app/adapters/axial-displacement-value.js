import Ember from 'ember';
import { singularize, pluralize } from 'ember-inflector';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL: function(modelName, id, snapshot, requestType, query) {
        if (requestType === 'createRecord') {
            return this.host + '/instruments/instrument_id/' + pluralize(modelName) + '/';
        }
        if (requestType === 'updateRecord' || requestType === 'deleteRecord') {
            return this.host + '/instruments/instrument_id/' + pluralize(modelName) + '/' + snapshot.id + '/';
        }
        if (typeof query !== 'undefined') {
            return this.host + '/instruments/' + query.instrument_id + '/' + pluralize(modelName) + '/';
        }
    }
});
