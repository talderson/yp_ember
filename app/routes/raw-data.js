import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {copy, Copyable} from 'ember-copy'

export default class RawDataRoute extends Route {
  @service session;

  queryParams = {
    page: {
      refreshModel: true
    },
    page_size: {
      refreshModel: true
    },
    paginate_from_zero: {
      refreshModel: true
    },
    port: {
      refreshModel: true
    },
    linear: {
      refreshModel: true
    },
    calib: {
      refreshModel: true
    },
    depth: {
      refreshModel: true
    }
  }

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  };

  model(params) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      //params.id = params.instrument_id;
      
      let instrument = _this.get('store').findRecord('instrument', params.instrument_id);
      
      if (!params.page_size) {
        params.page_size = 20;
      }

      let displacementValuesParams = copy(params);
      displacementValuesParams.model_name = 'displacement-values';

      let temperatureValuesParams = copy(params);
      temperatureValuesParams.model_name = 'temperature-values';

      let displacementValues = _this.store.query('displacement-value', displacementValuesParams, null, displacementValuesParams.instrument_id,  null);
      let temperatureValues = _this.store.query('temperature-value', temperatureValuesParams, null, temperatureValuesParams.instrument_id,  null);
    
      //let rawData = _this.get('store').findAll('displacement-value', params);
      let instrumentTypes = _this.store.findAll('instrument-type');
      instrument.then(function(instrument){
        instrumentTypes.then(function(instrumentTypes){
          displacementValues.then(function(displacementValues){
            temperatureValues.then(function(temperatureValues){
              resolve({
                instrument:instrument,
                instrumentTypes:instrumentTypes,
                displacementValues:displacementValues,
                temperatureValues:temperatureValues,
              });
            });
          });
        });
      });
    });
  };

  afterModel(resolvedModel, transition) {
    // transition.send('updateProperty', 'instrumentId', resolvedModel.instrument.id);
    // transition.send('updateProperty', 'instrumentType', resolvedModel.instrument.get('instrumentType').get('title'));
    // transition.send('updateProperty', 'pageSize', resolvedModel.displacementValues.query.page_size);
    // transition.send('updateProperty', 'displacementValuesMeta', resolvedModel.displacementValues.meta);


    let rawDataValuesController = this.controllerFor('raw-data');

    rawDataValuesController.send('updateProperty', 'instrumentId', resolvedModel.instrument.id);
    rawDataValuesController.send('updateProperty', 'instrumentType', resolvedModel.instrument.get('instrumentType').get('title'));
    rawDataValuesController.send('updateProperty', 'pageSize', resolvedModel.displacementValues.query.page_size);
    rawDataValuesController.send('updateProperty', 'displacementValuesMeta', resolvedModel.displacementValues.meta);
  };
}
