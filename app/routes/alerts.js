import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AlertsRoute extends Route.extend({
  queryParams: {
    page: {
        refreshModel: true
    },
    page_size: {
        refreshModel: true
    },
    ordering: {
        refreshModel: true
    },
    search: {
        refreshModel: true
    }
  },
  afterModel: function(resolvedModel) {
    let pageSize = resolvedModel.alerts.query.page_size,
        alertMeta = resolvedModel.alerts.meta,
        alertsController = this.controllerFor('alerts')
    ;

    alertsController.send('updateProperty', 'pageSize', pageSize);
    alertsController.send('updateProperty', 'alertMeta', alertMeta);
    //instrumentsController.send('updateTypeList',resolvedModel);
  },

}) {
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
      let alerts = _this.get('store').query('alert', params);
      let stats = _this.get('store').queryRecord('alert-stat',{});
      let types = _this.store.findAll('instrument-type');

      alerts.then(function(alerts){
        stats.then(function(stats){
          types.then(function(types){
            resolve({
              alerts:alerts,
              stats:stats,
              types:types,
          });    
        })
      })
  });
});
  }
}
