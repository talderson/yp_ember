import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TemporalGraphsRoute extends Route.extend({
    model(params) {
        let a = this.get('store');

        return Ember.RSVP.hash({
            instrument: this.get('store').queryRecord('instrument', {instrument_id: params.instrument_id}),
            vibes: this.get('store').query('instrument', {small: 'true', search: "BluVibe"})
        });
    },
    setupController: function(controller, model) {
        this.controllerFor('temporal-graphs').set("content",model);
        this.controllerFor('temporal-graphs').activate();
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
