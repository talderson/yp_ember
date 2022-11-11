import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EditInstrumentRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  };

  model(params) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      let instrument = _this.get('store').findRecord('instrument', params.instrument_id),
      instrumentTypes = _this.store.findAll('instrument-type'),
      headAts = _this.store.findAll('head-at'),
      alerts = _this.store.findAll('alert', { 'search': params.instrument_id });
      let vwVendors = _this.store.findAll('vwvendor');
      let vwModels = _this.store.findAll('vwmodel');

      instrument.then(function(instrument){
        headAts.then(function(headAts){
          alerts.then(function(alerts){
            vwModels.then(function(vwModels){  
              vwVendors.then(function(vwVendors){
              instrumentTypes.then(function(instrumentTypes){
                  resolve({
                    instrument:instrument,
                    instrumentTypes:instrumentTypes,
                    headAts:headAts,
                    vwVendors:vwVendors,
                    vwModels:vwModels,
                    alerts:alerts,
                  });
                });
              });
            });
          });
        });
      });
    });
  }
}
