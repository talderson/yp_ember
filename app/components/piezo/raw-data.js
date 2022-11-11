import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed, set } from '@ember/object';

export default Ember.Component.extend({
    isVisibleCreateNewForm: false,

    displacementData2: Ember.computed('displacementData', function() {
        //console.log('here');
        let dv = this.displacementData;
        dv.forEach(function(value) {
            value.values.shift();
            //console.log(value.values);
        })
        //dv.shift();
        return dv;
    }),

    anchorDistances: Ember.computed('instrument', function() {
        return['kPa'];
    }),
    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        }
    }
});
