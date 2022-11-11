import DS from 'ember-data';
import ENV from "geotechnical-data-platform-new/config/environment";
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
    host: ENV.API_URL,
    //host: "http://" + document.location.host.split(':')[0] + ":8000",
    session: service(),
    buildURL: function(type, id, record) {
        //call the default buildURL and then append a slash
        return this._super(type, id, record) + '/';
    },
    headers: computed({
        get() {
            return {
                Accept: 'application/vnd.api+json',
                withCredentials: true,
                Authorization: 'Basic ' + this.get('session').data.authenticated['login']
            }
        }
        //Authorization: 'Basic ' + ENV.API_CREDENTIALS // base64encode yieldpoint:YPfuture
    })
});
