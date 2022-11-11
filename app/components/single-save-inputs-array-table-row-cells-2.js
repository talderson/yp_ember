import Ember from 'ember';

export default Ember.Component.extend({
    isEditing: false,
    tagName: 'tr',
    classNameBindings: ['isEditing:active-cell-values-inline-edit', 'isZeroTimestampClass'],
    isRowDeleteConfirmationDialog: {},
    instrumentType: null,

    valueOver: Ember.computed('instrument',function(self, value) {
        //console.log(value);
        return true;
    }),

    // isFine: Ember.computed('instrumentType', function() {
    //     var isFine = false;
    //     //console.log(this.get('instrumentType').get('title'));
    //     switch(this.get('instrumentType').get('title')) {
    //         case 'Tilt':
    //             isFine=true;
    //             break;
    //         case 'BluVibe':
    //             isFine=true;
    //             break;
    //         case 'Wire':
    //             isFine=true;
    //             break;
    //     }
    //     return isFine;
    // }),

    tableRowIndexString: Ember.computed('tableRowIndex', function() {
        return String(this.get('tableRowIndex'));
    }),

    displacementValueObjectValues: Ember.computed('displacementValueObject', function() {
        let obj = this.get('displacementValueObject.values');
/*         let instType = this.get('instrumentType').get('title');
        if (instType == "Wire") {
            let chans = this.get('instrument').get('channelsNum');
            if (obj.length >= chans) {
                obj.shift();
                this.set('displacementValueObject.values',obj);
            }

        } */
        return Object.assign({}, obj); // convert array to an object, to be able to get it's items by index in handlebars template
    }),

    temperatureValuesObject: Ember.computed('temperatureValuesModel', function() {
        return this.get('temperatureValuesModel').objectAt( this.get('tableRowIndex') );
    }),

    temperatureObjectValue: Ember.computed('temperatureValuesObject', function() {
        return this.get('temperatureValuesObject').get('values')[0];
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

            if(instrumentType === 'Wire' || instrumentType === 'Tilt' || instrumentType === 'BluVibe') {
                obj.unshift(0);
            }

            //console.log(obj);
            this.get('displacementValueObject').set('values', obj ); //set values property to displacementValueObjectValues converted to array
            this.get('displacementValueObject').save({adapterOptions: this.get('instrumentId')}).then(function(results){
                let instType = _this.get('instrumentType').get('title');
                if (instType === "Wire" || instType === 'Tilt' || instType === 'BluVibe') {
                    // if displacement-value was successfully saved to DB, then display it
                    //console.log(results._internalModel._record.get('values'));
                    let values = results._internalModel._record.get('values');
                    values.shift();
                    results._internalModel._record.set('values', values);
                }
            });

            // save temperature
            this.get('temperatureValuesObject').set('values', [this.get('temperatureObjectValue')] );
            this.get('temperatureValuesObject').save({adapterOptions: this.get('instrumentId')});

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
            });
        },
        toggleRowDeleteConfirmationDialog(id){
            let curVal = this.get('isRowDeleteConfirmationDialog')[id] ? false : true;
            Ember.set(this.get('isRowDeleteConfirmationDialog'), id, curVal); //update isVisibleRowDetails variable for each single row
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
    }
});
