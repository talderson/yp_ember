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
        linear: {
            refreshModel: true
        },
        calib: {
            refreshModel: true
        },
        depth: {
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
        },
        vibe_id: {
            refreshModel: true
        },
        window: {
            refreshModel: true
        }
    },
    
    tiltMode: null,
    model(params) {
        //console.log('ping');
        let routeParams = this.paramsFor('temporal-graphs');
        params.instrument_id = routeParams.instrument_id;

        const _this = this,
              page_size = (params.event_type)? 80 : 40;

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

        let vibeEvents = new Ember.RSVP.Promise(function(resolve, reject){
            resolve(false);
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

                let mName = params.model_name;

                //console.log(mName);

                //let typeID = params.instrument_id.substr(params.instrument_id.length === 9 ? 5 : 6, 1);
                //let prevModel = params.model_name;
                //let isVibeGraph = (mName === 'event-ppv' || mName === 'event-ppa' || mName === 'event-frequency' || mName === 'cumulative-event-ppv' || mName === 'cumulative-event-ppa' || mName === 'cumulative-event-frequency');
                // if (typeID === "E") { //if is BluVibe
                //     if (!isVibeGraph) {
                //         params.model_name = 'event-ppv';
                //         window.history.replaceState({}, prevModel, '/temporal-graphs/' + params.instrument_id + '/event-ppv');
                //     }
                // } else { //if is not rebar
                //     if (isVibeGraph) {
                //             params.model_name = 'displacement-values';
                //             window.history.replaceState({}, prevModel, '/temporal-graphs/' + params.instrument_id + '/displacement-values');
                //     }
                // }

                // second call to the same endpoint required because I can only fetch closest_zero_timestamp value from the previous API call
                let zoomDataSecondCall = _this.store.query(singularize(params.model_name),  params, null, params.instrument_id,  null);

                let finalVal = _this.store.query(singularize('displacement-values'),  { page_size: -1, instrument_id: params.instrument_id }, null, params.instrument_id,  null).then(function(result) {
                    _this.set('tiltMode', result.get('firstObject').values[4]);
                })
                //console.log(zoomDataSecondCall);

                //let zoomTempData = _this.store.query(Ember.String.singularize('temperature-value'),  params, null, params.instrument_id,  null);
                let tempParams = Ember.copy(params);
                tempParams.ref_anchor = "0";
                tempParams.flip_signs = null;
                tempParams.model_name = "displacement-values";

                let zoomTempData = _this.store.query("temperature-value", tempParams, null, params.instrument_id, null);

                // third call should only be called after the first find is completed
                // let fullRangeData = _this.get('store').query(Ember.String.singularize(params.model_name), {model_name: params.model_name, instrument_id: params.instrument_id, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, flip_signs: params.flip_signs});
                let fullRangeData;
                if (typeof params.calib == 'undefined'){
                    fullRangeData = _this.store.query('displacement-value', {model_name: params.model_name, instrument_id: params.instrument_id, start_timestamp: closestZeroTimestamp, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, raw: params.raw, flip_signs: params.flip_signs, calib: true});
                } else {
                    fullRangeData = _this.store.query('displacement-value', {model_name: params.model_name, instrument_id: params.instrument_id, start_timestamp: closestZeroTimestamp, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, raw: params.raw, flip_signs: params.flip_signs, calib: params.calib});
                }
                //let fullRangeTempData = _this.get('store').query("temperature-value", {model_name: params.model_name, instrument_id: params.instrument_id, start_timestamp: closestZeroTimestamp, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: false});
                // fetch an instrument to be able to get anchor distances and other useful info from the instrument
                //let instrument = _this.store.findRecord('instrument', params.instrument_id, { include: 'anchors' } );
                let instrument = _this.store.queryRecord('instrument', { instrument_id: params.instrument_id } );

                let graphs = _this.store.findAll('chart');

                // if blast events are requested
                if (!params.event_type || params.event_type === "blast") {
                    blastEvents = _this.store.query('blast-event', {page_size: page_size, is_visible: true, blast_type: params.blast_type, start_timestamp: zoomDataStartTimestamp, end_timestamp: zoomDataEndTimestamp});
                }
                // if promise events are requested
                if (!params.event_type || params.event_type === "seismic") {
                    seismicEvents = _this.store.query('seismic-event', {page_size: page_size, is_visible: true, seismic_type: params.seismic_type, start_timestamp: zoomDataStartTimestamp, end_timestamp: zoomDataEndTimestamp});
                }
                if (!params.event_type || params.event_type === "bluvibe") {
                    if (params.vibe_id) {
                        let vibeEventParams = Ember.copy(params);
                        vibeEventParams.ref_anchor = "0";
                        vibeEventParams.flip_signs = null;
                        vibeEventParams.model_name = "vibe-event";
                        //vibeEventParams.instrument_id = params.vibe_id;
                        vibeEvents = _this.store.query("vibe-event", vibeEventParams, null, params.vibe_id, null);
                    }
                }

                //wait for all promises to fulfil and then return resolved promise
                graphs.then(function(graphs) {
                    instrument.then(function(instrument){
                        zoomDataSecondCall.then(function(zoomDataSecondCall){
                            fullRangeData.then(function(fullRangeData){
                                seismicEvents.then(function(seismicEvents){
                                    blastEvents.then(function(blastEvents){
                                        vibeEvents.then(function(vibeEvents){
                                            zoomTempData.then(function(zoomTempData){
                                            //fullRangeTempData.then(function(fullRangeTempData) {
                                                resolve({
                                                    graphs:graphs,
                                                    instrument:instrument,
                                                    zoomData:zoomDataSecondCall,
                                                    fullRangeData:fullRangeData,
                                                    seismicEvents:seismicEvents,
                                                    blastEvents:blastEvents,
                                                    zoomTempData:zoomTempData,
                                                    vibeEvents:vibeEvents,
                                                    //fullRangeTempData:fullRangeTempData
                                                    tiltMode:_this.get('tiltMode'),
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    afterModel: function(resolvedModel) {
        let temporalGraphsController = this.controllerFor('temporal-graphs')
            // , temporalGraphController = this.controllerFor('temporal-graphs/temporal-graph')
            ;

        temporalGraphsController.send('updateProperties', ['instrumentId'], [resolvedModel.zoomData.query.instrument_id]);
        temporalGraphsController.send('updateProperties', ['instrumentType'], [resolvedModel.instrument.get('instrumentType').get('title')]);
        temporalGraphsController.send('updateProperties', ['instrumentTypeId'], [resolvedModel.instrument.get('instrumentType').get('id')]);
        temporalGraphsController.send('updateProperties', ['name'], [resolvedModel.instrument.get('name')]);
        temporalGraphsController.send('updateProperties', ['location'], [resolvedModel.instrument.get('location')]);
        temporalGraphsController.send('updateProperties', ['level'], [resolvedModel.instrument.level]);//get('level')]);
        temporalGraphsController.send('updateProperties', ['borehole'], [resolvedModel.instrument.get('borehole')]);
        temporalGraphsController.send('updateProperties', ['project'], [resolvedModel.instrument.get('project')]);

        //let mName = resolvedModel.zoomData.query.model_name;
        //let iName = resolvedModel.instrument.get('instrumentType').get('title');
        //console.log(mName);
        //let isVibeGraph = (mName === 'event-ppv' || mName === 'event-ppa' || mName === 'event-frequency' || mName === 'cumulative-event-ppv' || mName === 'cumulative-event-ppa' || mName === 'cumulative-event-frequency');
        // if(iName === 'BluVibe') {
        //     if(!isVibeGraph) {
        //         resolvedModel.zoomData.query.model_name = 'event-ppv';
        //         window.history.replaceState({}, mName, '/temporal-graphs/' + resolvedModel.instrument.get('id') + '/event-ppv');
        //     }
        // } else {
        //     if(isVibeGraph) {
        //             resolvedModel.zoomData.query.model_name = 'displacement-values';
        //             window.history.replaceState({}, mName, '/temporal-graphs/' + resolvedModel.instrument.get('id') + '/displacement-values');
        //     }
        // }

        temporalGraphsController.send('updateProperties', ['modelName'], [resolvedModel.zoomData.query.model_name]);
        temporalGraphsController.send('updateProperties', ['activeInstrumentMeta'], [resolvedModel.zoomData.meta]);
        temporalGraphsController.send('updateLocalProperty', 'activeInstrumentMeta', resolvedModel.zoomData.meta);
        temporalGraphsController.send('updateProperties', ['eventType'], [resolvedModel.zoomData.query.event_type]);
        temporalGraphsController.send('updateProperties', ['blastType'], [resolvedModel.zoomData.query.blast_type]);
        if (resolvedModel.vibeEvents) {
            temporalGraphsController.send('updateProperties', ['vibeId'], [resolvedModel.vibeEvents.query.vibe_id]);
        }
        temporalGraphsController.send('updateProperties', ['seismicType'], [resolvedModel.zoomData.query.seismic_type]);
        temporalGraphsController.send('updateProperties', ['frequency'], [resolvedModel.zoomData.query.frequency]);
        temporalGraphsController.send('updateProperties', ['window'], [resolvedModel.zoomData.query.window]);
        
        //get pretty chart name if chart has multiple parts to it
        let obj = resolvedModel.graphs;
        let type = resolvedModel.instrument.get('instrumentTypeID').toString();
        //get the chart data for the instrument
        obj.forEach(function(item) {
            if(item.id === type) {
                obj = item;
                return;
            }
        });
        //let graphs = resolvedModel.get('graphs');
        
        let name = '';
        try {
            name = resolvedModel.zoomData.query.model_name.substr(0, resolvedModel.zoomData.query.model_name.lastIndexOf('-'));
        } catch (exception) {

        }
        if (name==="event" || name === "cumulative-event") {
            name = resolvedModel.zoomData.query.model_name;
        }
        switch(name) {
            case 'displacement':
                name = obj.temporalDisplacementName;
                break;
            case 'axial_displacement':
                name = "Axial-displacement";
                break;
            case 'velocity':
                name = obj.temporalVelocityName;
                break;
            case 'acceleration':
                name = obj.temporalAccelerationName;
                break;
            case 'strain':
                name = obj.temporalStrainName;
                break;
            case 'strain_rate':
                name = obj.temporalStrainRateName;
                break;
            case 'load':
                name = obj.temporalLoadName;
                break;
            case 'axial_strain':
                name = "Axial-strain";
                break;
            case 'bending_strain':
                name = "Bending-strain";
                break;
            case 'temperature':
                name = "Temperature";
                break;
            case 'event-frequency':
                name = "Event Frequency";
                break;
            case 'event-ppv':
                name = "Event PPV";
                break;
            case 'event-ppa':
                name = "Event PPA";
                break;
            case 'cumulative-event-frequency':
                name = "Cumulative Frequency";
                break;
            case 'cumulative-event-ppv':
                name = "Cumulative PPV";
                break;
            case 'cumulative-event-ppa':
                name = "Cumulative PPA";
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
        
        temporalGraphsController.send('updateProperties', ['chartData'], [obj]);
        temporalGraphsController.send('updateProperties', ['finalVal'], resolvedModel.finalVal);
        temporalGraphsController.send('updateProperties', ['chartDataValueName'], [chartName]);
        temporalGraphsController.send('updateProperties', ['instrumentAnchors'], [resolvedModel.instrument.get('anchors')]);
    },
    actions: {
        setDataR(data) {
            let temporalGraphsController = this.controllerFor('temporal-graphs');

            temporalGraphsController.send('setData',data);
        },
        setChartR(chart) {
            let temporalGraphsController = this.controllerFor('temporal-graphs');

            temporalGraphsController.send('setChart',chart);
        },
        willTransition() {
            let temporalGraphsController = this.controllerFor('temporal-graphs')
                // , temporalGraphController = this.controllerFor('temporal-graphs/temporal-graph')
                ;

            temporalGraphsController.send('updateProperties', ['instrumentId'], [null]);
            temporalGraphsController.send('updateProperties', ['eventType'], [null]);
            temporalGraphsController.send('updateProperties', ['blastType'], [null]);
            temporalGraphsController.send('updateProperties', ['seismicType'], [null]);
            temporalGraphsController.send('updateProperties', ['vibe_id'], [null]);
        }
    }
});
