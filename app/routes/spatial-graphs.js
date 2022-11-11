import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class FrequencyGraphsRoute extends Route.extend({
    model(params) {
        return Ember.RSVP.hash({
            //licence: this.get('store').findAll('licence'),
            //instruments: this.get('store').query('instrument', {small: 'true', exclude: 15})
            //instruments: this.get('store').query('instrument', {exclude: 15})
            instrument: this.get('store').queryRecord('instrument', {instrument_id: params.instrument_id}),
        });
    },
    setupController: function(controller, model) {
        this.controllerFor('spatial-graphs').set("content",model);
        this.controllerFor('spatial-graphs').activate();
    }
}) {
    @service session;

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
