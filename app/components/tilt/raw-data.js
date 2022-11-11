import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed, set } from '@ember/object';

export default Ember.Component.extend({
    isVisibleCreateNewForm: false,
    isVisibleReadingCreated: false,
    multi: false,
    
    anchorDistances: Ember.computed('instrument','displacementData', function() {
        let data = this.get('displacementData');
        try {
            let mode = data.get('lastObject').toJSON().values[4];
            switch (mode) {
                case 0:
                    return['Ax','Ay','Az','n/a','Mode'];
                case 1:
                    return['a','nx','ny','nz','Mode'];
                case 2:
                    return['φ','θ','n/a','n/a','Mode'];
                case 3:
                    return['φ','θ','ψ','n/a','Mode'];

            }
        } catch {}
        return ['a','b','c','d','Mode'];
    }),

    onCreateNewVisible: Ember.observer('isVisibleCreateNewForm', function() {
        if (this.get('isVisibleCreateNewForm') == true)
            this.set('isVisibleReadingCreated', false);
    }),

    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        }
    }
});
