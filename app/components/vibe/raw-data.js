import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed, set } from '@ember/object';

export default Ember.Component.extend({
    isVisibleCreateNewForm: false,

    anchorDistances: Ember.computed('instrument', function() {
        let dist = ['Frequency','Aplitude','PPV','PPA','Duration'];

        return dist;
    }),
    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        }
    }
});
