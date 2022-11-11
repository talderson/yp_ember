import Ember from 'ember';
import moment from 'moment';
import getOwner from "ember-owner/get";

function resetNewRawDataValueObject(_this) {
    let displacementValueObjectValues = _this.get('displacementValueObjectValues');

    // reset variables to defaults
    _this.set('newTimestampValue', moment().format(_this.get('dateFormat')));
    _this.set('temperatureObjectValue', 0);
    Object.keys(displacementValueObjectValues).forEach(function(key,index) {
        displacementValueObjectValues[key] = 0;
    });
}

export default Ember.Component.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    isVisibleCreateNewForm: true,
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    dateTimePicker: null, // dateTimePicker object
    temperatureObjectValue: 0,
    newTimestampValue: null,
    // newTimestampValue: Ember.computed('dateFormat', function() {
    //     return moment().format(this.get('dateFormat'));
    // }),

    newDisplacementValuesObject: Ember.computed('newTimestampValue', function() {
        return {
            id: this.get('newTimestampValue')
        };
    }),

    newTemperatureValuesObject: Ember.computed('newTimestampValue', function() {
        return {
            id: this.get('newTimestampValue')
        };
    }),


    // look for isVisibleCreateNewForm variable change and reset newDisplacementValuesObject object if create new form was called twice
    handleIsVisibleCreateNewFormChange: Ember.observer('isVisibleCreateNewForm', function(){
        if ( this.get('isVisibleCreateNewForm') ) {
            resetNewRawDataValueObject(this);
        }
    }),

    displacementValueObjectValues: Ember.computed('instrumentAnchors', function() {
        let displacementValueObjectValues = [];
        for (let i = 0; i <= this.get('instrumentAnchors').length - 1; i++) {
            displacementValueObjectValues[i] = 0;
        }
        return displacementValueObjectValues;
    }),

    newDisplacementValueObjectValues: Ember.computed('instrumentAnchors', function() {
        let displacementValueObjectValues = [];
        for (let i = 0; i <= this.get('instrumentAnchors').length - 1; i++) {
            displacementValueObjectValues[i] = 0;
        }
        return displacementValueObjectValues;
    }),

    actions: {
        saveNew(){
            let _this = this,
                store = this.get('store'),
                newDisplacementValuesObject = this.get('newDisplacementValuesObject'),
                newTemperatureValuesObject = this.get('newTemperatureValuesObject'),
                displacementValues = this.get('displacementValues'),
                temperatureValues = this.get('temperatureValues')
            ;

            newTemperatureValuesObject.id = moment(this.get('newTimestampValue'),'YYYY MM DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            newTemperatureValuesObject.values = [this.get('temperatureObjectValue')];

            const newTemperatureValues = store.createRecord('temperature-value', newTemperatureValuesObject);
            // save new displacement-value to DB
            const savedTemperatureValuesObject = newTemperatureValues.save({adapterOptions: this.get('instrumentId')}).then(function(results){
                // hide create new item form
                //_this.set('isVisibleCreateNewForm', false);

                // if displacement-value was successfully saved to DB, then display it
                //temperatureValues.unshiftObject(results._internalModel); // https://github.com/emberjs/data/issues/3313
            });

            newDisplacementValuesObject.id = moment(this.get('newTimestampValue'),'YYYY MM DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            newDisplacementValuesObject.values = Object.values(this.get('newDisplacementValueObjectValues'));
            
            newDisplacementValuesObject.values.unshift("0");

            const newDisplacementValues = store.createRecord('displacement-value', newDisplacementValuesObject);
            // save new displacement-value to DB
            const savedDisplacementValuesObject = newDisplacementValues.save({adapterOptions: this.get('instrumentId')}).then(function(results){
                // hide create new item form
                _this.set('isVisibleReadingCreated', true);
                _this.set('isVisibleCreateNewForm', false);
                // if displacement-value was successfully saved to DB, then display it
                //results._internalModel._data.values.shift();
                //displacementValues.unshiftObject(results._internalModel); // https://github.com/emberjs/data/issues/3313
                const currentRouteName = _this.get("router.currentRouteName");
                const currentRouteInstance = getOwner(_this).lookup(`route:${currentRouteName}`);
                currentRouteInstance.refresh();
                
            })
            .catch(function(reason){
                if (reason.errors[0].status == 403) {
                    _this.setProp('permissionError', true);
                }
            });
        },
        cancelNew(object){
            // hide create new item form
            this.set('isVisibleCreateNewForm', false);
            // reset all variables
            resetNewRawDataValueObject(this);
        }
    },
    didRender() {
        let _this = this;
        // let dateTimePicker = this.$(".datetimepicker-input").datetimepicker({
        //     format: _this.get('dateFormat'),
        // }).on('dp.change', function(e) {
        //     if (e.date) {
        //         _this.set(e.currentTarget.id, e.date.format(_this.get('dateFormat')));
        //     } else {
        //         _this.set(e.currentTarget.id, null);
        //     }
        // });
        // this.set('dateTimePicker', dateTimePicker);

    },
    willDestroyElement() {
        if (this.get('dateTimePicker')) {
            this.get('dateTimePicker').datetimepicker("destroy");
        }

    },
});
