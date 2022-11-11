import Ember from 'ember';
import { camelize } from '@ember/string';

var originVal;
var field;

export default Ember.Component.extend({
    editChanged: Ember.observer('isEditing', function() {
        if (this.get('isEditing')==true) {
            if(typeof this.editField === "function") {
                this.editField();
            }
        } else {
            if(typeof this.stopEditField === "function") {
                this.stopEditField();
            }
        }
    }),

    store: Ember.inject.service(),
    isEditable: true,
    isEditing: false,
    isRelational: true,
    selectOptionsArray: Ember.computed.map('selectOptions', function(item){
        const selectOptionsKyes = this.get('selectOptionsKyes').split(",");
        return {
            key: Ember.get(item, selectOptionsKyes[0]),
            value: Ember.get(item, selectOptionsKyes[1])
        };
    }),
    modelName: Ember.computed('selectOptions', function() {
        return this.get('selectOptions.type.modelName');
    }),
    actions: {
        selectNewValue(value){
            this.set('newValue', value);
            this.send('save',this.get('parentObject'));
        },
        edit(){
            originVal = this.get(`object.${this.get('valueSource')}`);
            this.set('isEditing', true);
            this.set('newValue', this.get(`object.${this.get('valueSource')}`));
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        save(object){
            
            let modelName = this.get('modelName');
            if (this.get('isRelational')) {
                var newSelectValue = this.get('store').peekRecord(modelName, this.get('newValue'));
                object.set(camelize(modelName), newSelectValue);
            } else {
                object.set(this.get('valueSource'), this.get('newValue'));
            }

            // field = this.get('field');
            
            object.save().catch(function(reason) {
      
                let editError = document.getElementById("instrumentEditError");
                editError.hidden = false;
                
                // // let orig = "";
                // // if (originVal == 1) {
                // //     orig = "dExto";
                // // }

                // //console.log(field);
                // console.log(originVal);

                // const objectMaps = {
                //     'HAC': 'collar',
                //     'HAT': 'toe',
                //     '1': 'dExto',
                //     '2': 'dCable',
                //     '3': 'dRebar',
                //     '4': 'dMPBX',
                //     '5': 'dCOnv',
                //     '6': 'Tilt',
                //     '7': 'Slough',
                //     '8': 'Thermostring',
                //     '9': 'Piezo',
                //     '10': 'HID',
                //     '11': 'dGMM',
                //     '12': 'Wire',
                //     '13': 'Adict',
                //     '15': 'BluVibe',
                // };

                // let originString = objectMaps[originVal];

                // if (! ((originVal == 'HAC') || (originVal == 'HAT')) ) {
                //     //object.set("instrumentType.title", originString);
                // } else {
                //     //object.set("headAt.title", originString);
                // }

                object.set(camelize(modelName), newSelectValue);

                window.scrollTo(0,0);
            });
            this.set('isEditing', false);
        },
        cancel(){
            this.set('newValue', this.get(`object.${this.get('field')}`));
            this.set('isEditing', false);
        }
    },
    keyDown: function(e) {
        if (e.keyCode === 27) {
            this.send('cancel', this.get('object'));
        }
    }
});
