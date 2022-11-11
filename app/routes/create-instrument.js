import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CreateInstrumentRoute extends Route {
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    let perms = this.getPerms();
    if (!('alerts' in perms) || perms['alerts'] == false) {
      this.get('router').transitionTo('instruments');
    }
  };
  afterModel(model) {
    let types = model.instrumentTypes;
    types.content.sort(compare);
    console.log(types);
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
      let instrument = {};
      let instrumentTypes = _this.store.findAll('instrument-type');
      let vwVendors = _this.store.findAll('vwvendor');
      let vwModels = _this.store.findAll('vwmodel');
      let headAts = _this.store.findAll('head-at');

      instrumentTypes.then(function(instrumentTypes){
        headAts.then(function(headAts){
          vwVendors.then(function(vwVendors){
            vwModels.then(function(vwModels){
              resolve({
                instrumentTypes:instrumentTypes,
                headAts:headAts,
                vwVendors:vwVendors,
                vwModels:vwModels,
              });    
            })
          })
        });
      });
    });
  }
}

function compare( a, b ) {
  if (parseInt(a.id) < parseInt(b.id) ) {
    return -1;
  }
  if (parseInt(a.id) > parseInt(b.id) ) {
    return 1;
  }
  return 0;
}