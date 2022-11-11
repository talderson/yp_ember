import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: [
        'start_timestamp',
        'end_timestamp',
        'num_points_requested',
        'ref_head_position',
        'ref_anchor',
        'zeroed',
        'linear',
        'calib',
        'depth',
        'flip_signs',
        'event_type',
        'blast_type',
        'vibe_id',
        'window',
        'seismic_type',
        'frequency'
    ],
    start_timestamp: null,
    end_timestamp: null,
    num_points_requested: 300,
    ref_head_position: "",
    ref_anchor: "0",
    zeroed: true,
    linear: false,
    calib: true,
    depth: false,
    modelName: null,
    flip_signs: null,
    event_type: null,
    blast_type: null,
    vibe_id: null,
    tiltMode: null,
    window: 480,
    seismic_type: null,
    frequency: null,
    chart: null,
    temporalGraphsController: Ember.inject.controller("temporal-graphs"),

    linearObserver: Ember.observer('linear', function() {
        this.get('temporalGraphsController').send('setLinear', this.get('linear'));
    }),

    calibObserver: Ember.observer('calib', function() {
        this.get('temporalGraphsController').send('setCalib', this.get('calib'));
    }),

    depthObserver: Ember.observer('depth', function() {
        this.get('temporalGraphsController').send('setDepth', this.get('depth'));
    }),

    actions: {
        toggleDataType(property) {
            if (property == "raw"){
                this.set("linear", false);
                this.set("calib", false);
                this.set("depth", false);
            } else if (property == "linear") {
                this.set("linear", true);
                this.set("calib", false);
                this.set("depth", false);
            } else if (property == "calib") {
                this.set("linear", false);
                this.set("calib", true);
                this.set("depth", false);
            } else {
                this.set("linear", false);
                this.set("calib", false);
                this.set("depth", true);                
            }
        },
        setData(data) {
            this.send('setDataR',data);
        },
        setChart(chart) {
            this.send('setChartR',chart);
        },
        udpateVibe(vibeID) {
            this.set('vibe_id', vibeID);
        },
        updateWindow(window) {
            this.set('window', window);
        },
        updateProperties(propertyNames = [], propertyValues = []) {
            const _this = this;
            if (propertyNames.length > 0 && propertyValues.length > 0 && propertyNames.length === propertyValues.length) {
                propertyNames.forEach( function(propertyName, i) {
                    _this.set(propertyName, propertyValues[i]);
                });
            }
        },
        getQueryParams(variable) {
            return this.get(variable);
        },
        toggleProperty(property) {
            let propValue = false;
            if ( this.get(property) === null ) {
                propValue = true;
            } else if(this.get(property) === false ) {
                propValue = true; 
            }
            this.set(property, propValue);
        }
    }
});
