import Ember from 'ember';
import { singularize, pluralize } from 'ember-inflector';

export default Ember.Route.extend({
    queryParams: {
        start_timestamp: {
            refreshModel: true
        },
        end_timestamp: {
            refreshModel: true
        },
        num_points_requested: {
            refreshModel: true
        },
        ref_head_position: {
            refreshModel: true
        },
        ref_anchor: {
            refreshModel: true
        },
        zeroed: {
            refreshModel: true
        },
        raw: {
            refreshModel: true
        },
        flip_signs: {
            refreshModel: true
        },
        event_type: {
            refreshModel: true
        },
        blast_type: {
            refreshModel: true
        },
        seismic_type: {
            refreshModel: true
        },
        frequency: {
            refreshModel: true
        }
    },
    model(params) {
        const _this = this,
        page_size = (params.event_type)? 80 : 40;
        let routeParams = this.paramsFor('frequency-graphs');
        params.instrument_id = routeParams.instrument_id;
        // declare default empty promises in case if blase of seismic events are disabled
        let seismicEvents = new Ember.RSVP.Promise(function(resolve, reject){
          // succeed
          resolve(false);
          // or reject
          reject();
        });

        let blastEvents = new Ember.RSVP.Promise(function(resolve, reject){
          // succeed
          resolve(false);
          // or reject
          reject();
        });

        return new Ember.RSVP.Promise(function(resolve, reject){
            
            // Resolve zoomData model first, get start_timestamp and end_timestap values to be able to limit events to these boundaries
            let zoomDataQueryParams = Ember.copy(params);
                zoomDataQueryParams.num_points_requested = 1;
            _this.store.query(singularize(zoomDataQueryParams.model_name),  zoomDataQueryParams, null, zoomDataQueryParams.instrument_id,  null).then(function(zoomData){

                // let closestZeroTimestamp = "";
                let closestZeroTimestamp = zoomData.meta['closest-zero-timestamp'];

                let zoomDataStartTimestamp = zoomData.meta['start-timestamp'];
                let zoomDataEndTimestamp = zoomData.meta['end-timestamp'];

                // get closest_zero_timestamp (the date when an instrument was initialized) of zoomData query and use it as start_timestamp if no other start_timestamp query parameter is specified
                if (!zoomData.query.start_timestamp) {
                    params.start_timestamp = zoomData.meta['closest-zero-timestamp'];
                }
               
                // second call to the same endpoint required because I can only fetch closest_zero_timestamp value from the previous API call
                let zoomDataSecondCall = _this.store.query(singularize(params.model_name),  params, null, params.instrument_id,  null);

                //let zoomTempData = _this.store.query(Ember.String.singularize('temperature-value'),  params, null, params.instrument_id,  null);
                let tempParams = Ember.copy(params);
                tempParams.ref_anchor = "0";
                tempParams.flip_signs = null;
                tempParams.model_name = "displacement-values";

                let zoomTempData = _this.store.query("temperature-value", tempParams, null, params.instrument_id, null);

                // third call should only be called after the first find is completed
                // let fullRangeData = _this.get('store').query(Ember.String.singularize(params.model_name), {model_name: params.model_name, instrument_id: params.instrument_id, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, flip_signs: params.flip_signs});
                let fullRangeData = _this.get('store').query(singularize(params.model_name), {model_name: params.model_name, instrument_id: params.instrument_id, start_timestamp: closestZeroTimestamp, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, raw: params.raw, flip_signs: params.flip_signs});

                //let fullRangeTempData = _this.get('store').query("temperature-value", {model_name: params.model_name, instrument_id: params.instrument_id, start_timestamp: closestZeroTimestamp, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: false});
                // fetch an instrument to be able to get anchor distances and other useful info from the instrument
                //let instrument = _this.get('store').findRecord('instrument', params.instrument_id, { include: 'anchors' } );
                let instrument = _this.store.queryRecord('instrument', { instrument_id: params.instrument_id } );

                let graphs = _this.get('store').findAll('chart');
/* 
                // if blast events are requested
                if (!params.event_type || params.event_type === "blast") {
                    blastEvents = _this.store.query('blast-event', {page_size: page_size, ordering: "-tonnes", is_visible: true, blast_type: params.blast_type, start_timestamp: zoomDataStartTimestamp, end_timestamp: zoomDataEndTimestamp});
                }
                // if promise events are requested
                if (!params.event_type || params.event_type === "seismic") {
                    seismicEvents = _this.store.query('seismic-event', {page_size: page_size, ordering: "-moment_magnitude", is_visible: true, seismic_type: params.seismic_type, start_timestamp: zoomDataStartTimestamp, end_timestamp: zoomDataEndTimestamp});
                } */

                //wait for all promises to fulfil and then return resolved promis
                graphs.then(function(graphs) {
                    instrument.then(function(instrument){
                        zoomDataSecondCall.then(function(zoomDataSecondCall){
                            fullRangeData.then(function(fullRangeData){
                                //seismicEvents.then(function(seismicEvents){
                                    //blastEvents.then(function(blastEvents){
                                        zoomTempData.then(function(zoomTempData){
                                            //fullRangeTempData.then(function(fullRangeTempData) {
                                                resolve({
                                                    graphs:graphs,
                                                    instrument:instrument,
                                                    zoomData:zoomDataSecondCall,
                                                    //fullRangeData:fullRangeData,
                                                    //seismicEvents:seismicEvents,
                                                    //blastEvents:blastEvents,
                                                    zoomTempData:zoomTempData,
                                                    //fullRangeTempData:fullRangeTempData
                                                });        
                                            //});
                                        });
                                    //});
                                //});
                            });
                        });
                    });
                });
            });
        });
    },
    afterModel: function(resolvedModel) {
        let frequencyGraphsController = this.controllerFor('frequency-graphs')
            // , temporalGraphController = this.controllerFor('frequency-graph/temporal-graph')
            ;

        frequencyGraphsController.send('updateProperties', ['instrumentId'], [resolvedModel.zoomData.query.instrument_id]);
        frequencyGraphsController.send('updateProperties', ['instrumentType'], [resolvedModel.instrument.get('instrumentType').get('title')]);
        frequencyGraphsController.send('updateProperties', ['name'], [resolvedModel.instrument.get('name')]);
        frequencyGraphsController.send('updateProperties', ['location'], [resolvedModel.instrument.get('location')]);
        frequencyGraphsController.send('updateProperties', ['level'], [resolvedModel.instrument.get('level')]);
        frequencyGraphsController.send('updateProperties', ['borehole'], [resolvedModel.instrument.get('borehole')]);
        frequencyGraphsController.send('updateProperties', ['project'], [resolvedModel.instrument.get('project')]);
        frequencyGraphsController.send('updateProperties', ['modelName'], [resolvedModel.zoomData.query.model_name]);
        frequencyGraphsController.send('updateProperties', ['activeInstrumentMeta'], [resolvedModel.zoomData.meta]);
        //frequencyGraphsController.send('updateProperties', ['eventType'], [resolvedModel.zoomData.query.event_type]);
        //frequencyGraphsController.send('updateProperties', ['blastType'], [resolvedModel.zoomData.query.blast_type]);
        //frequencyGraphsController.send('updateProperties', ['seismicType'], [resolvedModel.zoomData.query.seismic_type]);
        frequencyGraphsController.send('updateProperties', ['frequency'], [resolvedModel.zoomData.query.frequency]);
        
        //get pretty chart name if chart has multiple parts to it
        let obj = resolvedModel.graphs.content;
        let type = resolvedModel.instrument.get('instrumentTypeID').toString();
        //get the chart data for the instrument
        obj.forEach(function(item) {
            if(item.id === type) {
                obj = item;
                return;
            }
        });
        
        let name = '';
            name = resolvedModel.zoomData.query.model_name;
        switch(name) {
            case 'frequency-ppv':
                name = "PPV vs Frequency";
                break;
            case 'frequency-ppa':
                name = "PPA vs Frequency";
                break;
            default:
                break;
        }

        //console.log(obj);
        let chartName = name;
        let chartNameL = chartName.substr(0, chartName.indexOf('-')).capitalize();
        let chartNameR = chartName.substr(chartName.indexOf('-') + 1).capitalize();
        if(chartNameL !== "") {
            chartName = chartNameL + " " + chartNameR;
        }
        
        frequencyGraphsController.send('updateProperties', ['chartData'], [obj]);
        frequencyGraphsController.send('updateProperties', ['chartDataValueName'], [chartName]);
        frequencyGraphsController.send('updateProperties', ['instrumentAnchors'], [resolvedModel.instrument.get('anchors')]);
    },
    actions: {
        setDataR(data) {
            let frequencyGraphsController = this.controllerFor('frequency-graphs');

            frequencyGraphsController.send('setData',data);
        },
        setChartR(chart) {
            let frequencyGraphsController = this.controllerFor('frequency-graphs');

            frequencyGraphsController.send('setChart',chart);
        },
        willTransition() {
            let frequencyGraphsController = this.controllerFor('frequency-graphs')
                // , temporalGraphController = this.controllerFor('frequency-graph/frequency-graph')
                ;

            frequencyGraphsController.send('updateProperties', ['instrumentId'], [null]);
            //frequencyGraphsController.send('updateProperties', ['eventType'], [null]);
            //frequencyGraphsController.send('updateProperties', ['blastType'], [null]);
            //frequencyGraphsController.send('updateProperties', ['seismicType'], [null]);
        }
    }
});
