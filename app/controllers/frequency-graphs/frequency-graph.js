import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: [
        'start_timestamp',
        'end_timestamp',
        'num_points_requested',
        'ref_head_position',
        'ref_anchor',
        'zeroed',
        'raw',
        'flip_signs',
        'event_type',
        'blast_type',
        'seismic_type',
        'frequency'
    ],
    start_timestamp: null,
    end_timestamp: null,
    num_points_requested: 300,
    ref_head_position: "",
    ref_anchor: "0",
    zeroed: true,
    raw: false,
    modelName: null,
    flip_signs: null,
    //event_type: null,
    //blast_type: null,
    //seismic_type: null,
    frequency: null,
    chart: null,
    actions: {
        setData(data) {
            this.send('setDataR',data);
        },
        setChart(chart) {
            this.send('setChartR',chart);
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
            if ( this.get(property) === null ) {
                this.set(property, true);
            } else if(this.get(property) === false ) {
                this.set(property, true);
            } else {
                this.set(property, false);
            }
        }
    }
});
