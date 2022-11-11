import Ember from 'ember';

export default Ember.Controller.extend({
    isVisibleExportDataForm: false,
    isVisibleImportDataForm: false,
    displacementValuesMeta: null,
    permissionError: false,
    linear: false,
    calib: false,
    depth: false,

    breadCrumbs: Ember.computed('model', {
        get() {
            let instrument = this.get('model').instrument;
            
            let obj = null

            if (instrument != null) {
                obj = [
                    {
                        label: "Dashboard",
                        path: 'index'
                    },
                    {
                        label: "Instruments",
                        path: 'instruments'
                    },
                    {
                        label: instrument.id,
                        path: 'edit-instrument',
                        model: instrument.id,
                    },
                    {
                        label: "Raw Data",
                        path: 'raw-data',
                        model: instrument.id,
                    }
                ]
            }
            return obj;
        }
    }),
    linearData: Ember.computed('displacementValuesMeta', function() {
        let linear = this.get('displacementValuesMeta')['linear'];
        return linear;
    }),
    calibData: Ember.computed('displacementValuesMeta', function() {
        let calib = this.get('displacementValuesMeta')['calib'];
        return calib;
    }),
    depthData: Ember.computed('displacementValuesMeta', function() {
        let depth = this.get('displacementValuesMeta')['depth'];
        return depth;
    }),
    isWire: Ember.computed('model', function(instrument) {
        let prop = this.get('model').instrument.get('instrumentType');
        return prop.get("title") === 'Wire';
    }),
    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        },
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
        toggleProperty(property) {
            // console.log(property);
            // console.log(this.get(property));
            if ( !this.get(property) ) {
                this.set(property, true);
            } else {
                this.set(property, false);
            }
            //console.log(this.get(property));
        }
    }
});
