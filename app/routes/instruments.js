import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InstrumentsRoute extends Route.extend({
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
  
  afterModel: function(resolvedModel, transition) {
    let pageSize = resolvedModel.instruments.query.page_size,
        instrumentMeta = resolvedModel.instruments.meta,
        instrumentsController = this.controllerFor('instruments')
    ;

    this.session.store.refreshLicence();

    instrumentsController.send('updateProperty', 'pageSize', pageSize);
    instrumentsController.send('updateProperty', 'instrumentMeta', instrumentMeta);
    //instrumentsController.send('updateTypeList',resolvedModel);
},

}) {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  };

  model(params) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
        let instruments = _this.get('store').query('instrument', params);
        let instrumentStats = _this.get('store').queryRecord('instrument-stat',{});

        instruments.then(function(instruments){
          resolve({
            instruments:instruments,
            instrumentStats:instrumentStats,
          });
        });
    });
  };
}
