import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  session: Ember.inject.service(),
  host: "http://" + document.location.host.split(':')[0] + ":8000",
  headers: Ember.computed('session.authToken', {
    get() {
        let headers = {
            'Authorization': 'Basic ' + this.get('session').data.authenticated['login']
        }
        return headers;
    }
  })
});
