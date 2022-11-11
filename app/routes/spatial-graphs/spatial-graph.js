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
        frequency_num: {
            refreshModel: true
        },
        events_only: {
            refreshModel: true
        },
        group_time: {
            refreshModel: true
        },
        group_window: {
            refreshModel: true
        },
        progress_timestamps: {
            refreshModel: true
        }
    },
    model(params) {
        const _this = this,
              page_size = (params.event_type)? 80 : 40
        ;
        let routeParams = this.paramsFor('spatial-graphs');
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

                let typeID = params.instrument_id.substr(params.instrument_id.length === 9 ? 5 : 6, 1);
                let prevModel = params.model_name;
                // let isRebarGraph = (params.model_name === 'axial-strain-values' || params.model_name === 'bending-strain-values' || params.model_name === 'axial-displacement-values');
                // if (typeID === "3") { //if is rebar
                //     if (!isRebarGraph && params.model_name !== 'load-values') {
                //         params.model_name = 'axial-displacement-values';
                //         window.history.replaceState({}, prevModel, '/spatial-graph/' + params.instrument_id + '/axial-displacement-values');
                //     }
                // } else { //if is not rebar
                //     if (isRebarGraph) {
                //             params.model_name = 'displacement-values';
                //             window.history.replaceState({}, prevModel, '/spatial-graph/' + params.instrument_id + '/displacement-values');
                //     }
                // }

                // second call to the same endpoint required because I can only fetch closest_zero_timestamp value from the previous API call
                let zoomDataSecondCall = _this.store.query(singularize(params.model_name),  params, null, params.instrument_id,  null);

                // third call should only be called after the first find is completed
                // let fullRangeData = _this.get('store').query(Ember.String.singularize(params.model_name), {model_name: params.model_name, instrument_id: params.instrument_id, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, flip_signs: params.flip_signs});
                let fullRangeData = _this.get('store').query(singularize(params.model_name), {model_name: params.model_name, instrument_id: params.instrument_id, start_timestamp: closestZeroTimestamp, num_points_requested: 300, ref_head_position: params.ref_head_position, ref_anchor: params.ref_anchor, zeroed: params.zeroed, flip_signs: params.flip_signs});

                // fetch an instrument to be able to get anchor distances and other useful info from the instrument
                //let instrument = _this.get('store').findRecord('instrument', params.instrument_id, { include: 'anchors' } );
                let instrument = _this.store.queryRecord('instrument', { instrument_id: params.instrument_id } );

                let graphs = _this.get('store').findAll('chart');

                // if blast events are requested
                if (!params.event_type || params.event_type === "blast") {
                    blastEvents = _this.store.query('blast-event', {page_size: page_size, is_visible: true, blast_type: params.blast_type, start_timestamp: zoomDataStartTimestamp, end_timestamp: zoomDataEndTimestamp});
                }
                // if promise events are requested
                if (!params.event_type || params.event_type === "seismic") {
                    seismicEvents = _this.store.query('seismic-event', {page_size: page_size, is_visible: true, seismic_type: params.seismic_type, start_timestamp: zoomDataStartTimestamp, end_timestamp: zoomDataEndTimestamp});
                }

                //wait for all promises to fulfil and then return resolved promis
                graphs.then(function(graphs) {
                    instrument.then(function(instrument){
                        zoomDataSecondCall.then(function(zoomDataSecondCall){
                            fullRangeData.then(function(fullRangeData){
                                seismicEvents.then(function(seismicEvents){
                                    blastEvents.then(function(blastEvents){
                                        resolve({
                                            graphs:graphs,
                                            instrument:instrument,
                                            zoomData:zoomDataSecondCall,
                                            fullRangeData:fullRangeData,
                                            seismicEvents:seismicEvents,
                                            blastEvents:blastEvents
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
        let spatialGraphsController = this.controllerFor('spatial-graphs')
            // , spatialGraphController = this.controllerFor('spatial-graph/spatial-graph')
            ;

        spatialGraphsController.send('updateProperties', ['instrumentId'], [resolvedModel.zoomData.query.instrument_id]);
        spatialGraphsController.send('updateProperties', ['instrumentType'], [resolvedModel.instrument.get('instrumentType').get('title')]);
        spatialGraphsController.send('updateProperties', ['instrumentTypeId'], [resolvedModel.instrument.get('instrumentType').get('id')]);
        spatialGraphsController.send('updateProperties', ['name'], [resolvedModel.instrument.get('name')]);
        spatialGraphsController.send('updateProperties', ['location'], [resolvedModel.instrument.get('location')]);
        spatialGraphsController.send('updateProperties', ['level'], [resolvedModel.instrument.get('level')]);
        spatialGraphsController.send('updateProperties', ['borehole'], [resolvedModel.instrument.get('borehole')]);
        spatialGraphsController.send('updateProperties', ['project'], [resolvedModel.instrument.get('project')]);

        let mName = resolvedModel.zoomData.query.model_name;
        let iName = resolvedModel.instrument.get('instrumentType').get('title');
        //let isRebarGraph = (mName === 'axial-strain-values' || mName === 'bending-strain-values' || mName === 'axial-displacement-values');
        // if(iName === 'dRebar') {
        //     if(!isRebarGraph && mName !== 'load-values') {
        //         resolvedModel.zoomData.query.model_name = 'axial-displacement-values';
        //         window.history.replaceState({}, mName, '/spatial-graph/' + resolvedModel.instrument.get('id') + '/axial-displacement-values');
        //     }
        // } else {
        //     if(isRebarGraph) {
        //             resolvedModel.zoomData.query.model_name = 'displacement-values';
        //             window.history.replaceState({}, mName, '/spatial-graph/' + resolvedModel.instrument.get('id') + '/displacement-values');
        //     }
        // }
        
        spatialGraphsController.send('updateProperties', ['modelName'], [resolvedModel.zoomData.query.model_name]);
        spatialGraphsController.send('updateActivefrequency', resolvedModel.zoomData.query);
        spatialGraphsController.send('updateGroupMode', resolvedModel.zoomData.query);
        spatialGraphsController.send('updateProperties', ['activeInstrumentMeta'], [resolvedModel.zoomData.meta]);
        spatialGraphsController.send('updateProperties', ['eventType'], [resolvedModel.zoomData.query.event_type]);
        spatialGraphsController.send('updateProperties', ['blastType'], [resolvedModel.zoomData.query.blast_type]);
        spatialGraphsController.send('updateProperties', ['seismicType'], [resolvedModel.zoomData.query.seismic_type]);

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
        
        let name = '';
        try {
            name = resolvedModel.zoomData.query.model_name.substr(0, resolvedModel.zoomData.query.model_name.lastIndexOf('-'));
        } catch (exception){
            
        }
        //console.log(name);

        switch(name) {
            case 'displacement':
                name = obj.spatialDisplacementName;
                break;
            case 'velocity':
                name = obj.spatialVelocityName;
                break;
            case 'acceleration':
                name = obj.spatialAccelerationName;
                break;
            case 'strain':
                name = obj.spatialStrainName;
                break;
            case 'strain_rate':
                name = obj.spatialStrainRateName;
                break;
            case 'load':
                name = obj.spatialLoadName;
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
            case 'axial_displacement':
                name = "Axial-displacement";
                break;
            default:
                break;
        }

        //console.log(obj);
        let chartName = name;
        try {
            let chartNameL = chartName.substr(0, chartName.indexOf('-')).capitalize();
            let chartNameR = chartName.substr(chartName.indexOf('-') + 1).capitalize();
            if(chartNameL !== "") {
                chartName = chartNameL + " " + chartNameR;
            }
        } catch (exception) {}
    
        
        spatialGraphsController.send('updateProperties', ['chartData'], [obj]);
        spatialGraphsController.send('updateProperties', ['chartDataValueName'], [chartName]);
        spatialGraphsController.send('updateProperties', ['instrumentAnchors'], [resolvedModel.instrument.get('anchors')]);
    },
    actions: {
        setDataR(data) {
            let temporalGraphsController = this.controllerFor('spatial-graphs');

            temporalGraphsController.send('setData',data);
        },
        setChartR(chart) {
            let temporalGraphsController = this.controllerFor('spatial-graphs');

            temporalGraphsController.send('setChart',chart);
        },
        willTransition() {
            let spatialGraphsController = this.controllerFor('spatial-graphs')
                // , spatialGraphController = this.controllerFor('spatial-graph/spatial-graph')
                ;

            spatialGraphsController.send('updateProperties', ['instrumentId'], [null]);
            spatialGraphsController.send('updateProperties', ['eventType'], [null]);
            spatialGraphsController.send('updateProperties', ['blastType'], [null]);
            spatialGraphsController.send('updateProperties', ['seismicType'], [null]);
        }
    }
});
