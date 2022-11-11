import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EditAlertRoute extends Route {
  @service session;
  @service router;
  
  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    let perms = this.getPerms();
    if (!('alerts' in perms) || perms['alerts'] == false) {
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

  model(params) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      //let instrument = _this.get('store').findRecord('instrument', params.instrument_id),
      let instrumentTypes = _this.store.findAll('instrument-type');
      let alert = _this.get('store').findRecord('alert', params.alert_id, {
        include: 'instrument',
        reload: true,
      });
      

      alert.then(function(alert){
        instrumentTypes.then(function(instrumentTypes){
          resolve({
            alert:alert,
            instrumentTypes:instrumentTypes,
          });
        });
      });
    })
  }
}

