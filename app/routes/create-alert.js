import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CreateAlertRoute extends Route.extend({
  queryParams: {
    inst_id: {
        refreshModel: false
    },
  },
  session: service(),
  router: service(),
  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    let perms = this.getPerms();
    if (!('alerts' in perms) || perms['alerts'] == false) {
      this.get('router').transitionTo('instruments');
    }
  },

  getPerms: function() {
    let perms = null;
    try{
      perms = this.session.data.authenticated.modules;
    } catch {}
    return perms;
  },

  model(params) {
    const _this = this;
    if (params.inst_id) {
      //console.log("yes");
      return new Ember.RSVP.Promise(function(resolve, reject){
        let instrument = _this.get('store').findRecord('instrument', params.inst_id),
        instrumentTypes = _this.store.findAll('instrument-type');
        //headAts = _this.store.findAll('head-at');
  
        instrumentTypes.then(function(instrumentTypes){
          instrument.then(function(instrument){
            //headAts.then(function(headAts){
              resolve({
                instrument:instrument,
                instrumentTypes:instrumentTypes,
                //headAts:headAts,
              });
            //});
          });
        });
      });
    } else {
      //console.log("no");
      return new Ember.RSVP.Promise(function(resolve, reject){
        let instruments = _this.store.query('instrument', {small: 'true', exclude: 15}) //Exclude BluVibe from device list
        let instrumentTypes = _this.store.findAll('instrument-type');
        //headAts = _this.store.findAll('head-at');
  
        instrumentTypes.then(function(instrumentTypes){
          instruments.then(function(instruments){
            //headAts.then(function(headAts){
              resolve({
                instruments:instruments,
                instrumentTypes:instrumentTypes,
                //headAts:headAts,
              });
            //});
          });
        });
      });
    }
  }, 
}) {}