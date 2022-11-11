import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed, set } from '@ember/object';

export default Ember.Component.extend({
    isVisibleCreateNewForm: false,

    anchorDistances: Ember.computed('instrument','linear','calib', 'depth', function() {
        if (this.get('linear') == true)
            return ['LU/digits']
        if (this.get('calib') == true)
            return ['Pressure (kPa)']
        if (this.get('depth') == true)
            return ['Depth (mm-Water)']
        return ['Freqency (Hz)'];
    }),
    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        }
    }
});
