import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed, set } from '@ember/object';

export default Ember.Component.extend({
    anchorDistances: Ember.computed('instrument', function() {
        let anchors = this.get("instrument").get('anchors');
        let dist = anchors.map(function(anchor){
            return anchor.get('distance');
        });

        return dist;                
    }),
    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        }
    }
});
