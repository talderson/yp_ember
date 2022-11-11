import Ember from 'ember';

export default Ember.Component.extend({
    
    isEditing: false,
    tagName: 'tr',
    classNameBindings: ['isEditing:active-cell-values-inline-edit', 'isZeroTimestampClass'],
    isRowDeleteConfirmationDialog: {},
    rdcd: {},
    instrumentType: null,

    setRDCD(value) {
        let rdcd = this.get('isRowDeleteConfirmationDialog');
        rdcd[value[0]] = value[1];
        this.set('isRowDeleteConfirmationDialog', rdcd);
        this.notifyPropertyChange('isRowDeleteConfirmationDialog');
    },

    valueOver: Ember.computed('instrument',function(self, value) {
        //console.log(value);
        return true;
    }),

    tableRowIndexString: Ember.computed('tableRowIndex', function() {
        return String(this.get('tableRowIndex'));
    }),

    displacementValueObjectValues: Ember.computed('displacementValueObject', function() {
        let obj = this.get('displacementValueObject.values');
        let instType = this.get('instrumentType').get('title');
        return Object.assign({}, obj); // convert array to an object, to be able to get it's items by index in handlebars template
    }),

    temperatureValuesObject: Ember.computed('temperatureValuesModel', function() {
        return this.get('temperatureValuesModel').objectAt( this.get('tableRowIndex') );
    }),

    temperatureObjectValue: Ember.computed('temperatureValuesObject', function() {
        return this.get('temperatureValuesObject').get('values')[0].toFixed(1);
    }),

    actions: {
        edit() {
            this.set('isEditing', true);
            //this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
            //return this.$().attr({ tabindex: 1 }), this.$().focus(); // brings the view into focus in order to capture keyUps.
        },
        save() {
            let _this = this;
            // save displacement values
            let obj = Object.values(this.get('displacementValueObjectValues'));

            let instrumentType = this.instrumentType.get('title');

            if(instrumentType == 'Wire' || instrumentType === 'Tilt' || instrumentType === 'BluVibe' || instrumentType === 'Piezo') {
                obj.unshift(0);
            }

            this.get('displacementValueObject').set('values', obj ); //set values property to displacementValueObjectValues converted to array
            this.get('displacementValueObject').save({adapterOptions: this.get('instrumentId')}).then(function(results){
                let instType = instrumentType;
                if (instType == 'Wire' || instType === 'Tilt' || instType === 'BluVibe' || instrumentType === 'Piezo') {
                    // if displacement-value was successfully saved to DB, then display it
                    //console.log(results._internalModel._record.get('values'));
                    let values = results._internalModel._record.get('values');
                    values.shift();
                    results._internalModel._record.set('values', values);
                }
                // save temperature
                _this.get('temperatureValuesObject').set('values', [_this.get('temperatureObjectValue')] );
                _this.get('temperatureValuesObject').save({adapterOptions: _this.get('instrumentId')});

            })
            .catch(function(reason){
                console.log(reason);
                if (reason.errors[0].status == 403) {
                    _this.setProp('permissionError', true);
                }
            });


            // hide form
            this.set('isEditing', false);
            //this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
        },
        cancel() {
            // reset displacementValueObjectValues and temperatureObjectValue to original values
            //this.set('displacementValueObjectValues', Object.assign({}, this.get('displacementValueObject.values')) );
            //this.set('temperatureObjectValue', this.get('temperatureValuesObject').get('values')[0]);

            this.set('isEditing', false);
            //this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
        },
        remove(){
            let _this = this;
            let displacementValueObject = this.get('displacementValueObject'),
                temperatureValuesObject = this.get('temperatureValuesObject'),
                displacementValuesModel = this.get('displacementValuesModel'),
                temperatureValuesModel = this.get('temperatureValuesModel')
            ;

            temperatureValuesObject.deleteRecord();
            temperatureValuesObject.get('isDeleted');
            temperatureValuesObject.save({adapterOptions: this.get('instrumentId')}).then(function(){
                // deal with records that just were created
                // relates to the way I add new records to model https://github.com/emberjs/data/issues/3313
                temperatureValuesModel.removeObject(temperatureValuesObject);
            });

            displacementValueObject.deleteRecord();
            displacementValueObject.get('isDeleted');
            displacementValueObject.save({adapterOptions: this.get('instrumentId')}).then(function(){
                // deal with records that just were created
                // relates to the way I add new records to model https://github.com/emberjs/data/issues/3313
                displacementValuesModel.removeObject(displacementValueObject);
            })
            .catch(function(reason){
                if (reason.errors[0].status == 403) {
                    _this.setProp('permissionError', true);
                }
            });
        },
        toggleRowDeleteConfirmationDialog(id){
            let list = this.get('isRowDeleteConfirmationDialog');
            let value = list[id] ? false : true;
            this.setRDCD([id,value]);
            //this.set('isRowDeleteConfirmationDialog', list); //update isVisibleRowDetails variable for each single row
            //this.notifyPropertyChange('isRowDeleteConfirmationDialog');
        },
    },
    didRender(){
        //this.$('.has-tooltip-info').tooltip(); //activate tooltips
        //console.log(this.get('instrumentType').get('title'));
    },
    keyDown: function(e) {
        if (e.keyCode === 27) {
            this.send('cancel');
        }
        if (e.keyCode === 13) {
            this.send('save', this.get('object'));
        }
    }
});


// function escape(myStr) {
//     return myStr.replace('.', ',');
// }