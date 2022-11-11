import Route from '@ember/routing/route';

export default class AlertRoute extends Route {
    @service session;

    beforeModel(transition) {
      this.session.requireAuthentication(transition, 'login');
      let perms = this.getPerms();
      if (!('alerts' in perms)) {
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
            let alert = _this.get('store').findRecord('alert', params.alert_id);
            let instType = _this.get('store').findAll('instrument-type');

            alert.then(function(alert){
                instType.then(function(instType){
                    resolve({
                        alert:alert,
                        instType:instType,
                    });    
                });
            });
        });
    }
}
