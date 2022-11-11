import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class FrequencyGraphsRoute extends Route.extend({
    model(params) {
        let a = this.get('store');

        return Ember.RSVP.hash({
            instrument: this.get('store').queryRecord('instrument', {instrument_id: params.instrument_id}),
        });
    },
    setupController: function(controller, model) {
        this.controllerFor('frequency-graphs').set("content",model);
        this.controllerFor('frequency-graphs').activate();
    }
}) {
    @service session;
    @service router;

    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'login');
        let perms = this.getPerms();
        if (!('graphing' in perms) || perms['graphing']==false) {
          this.get('router').transitionTo('instruments');
        }
      };
    
      getPerms = function() {
        let perms = null;
        try{
          perms = this.session.data.authenticated.modules;
        } catch {}
        return perms;
      };
  }
