import Ember from 'ember';
import { on } from '@ember/object/evented';

export default Ember.Controller.extend({
    _my_init: on('init', function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            //console.log(this.get('model'));
        });
    }),
    store: Ember.inject.service(),
    queryParams: ['page', 'page_size', 'ordering', 'search', 'searchTgt'],
    page_size: 20,
    instrumentsMeta: null,
    ordering: null,
    search: null,
    searchTgt: null,
    page: 1,
    lat: 40.574706,
    lng: -112.178131,
    zoom: 12,
    mapBounds: Ember.computed(function() {
        return [[40.574706, -112.178131],[40.492465, -112.099509]];
    }),
    actions: {
        sortByA(property) {
            this.set('ordering', "a:" + property);
        },
        sortByI(property) {
            this.set('ordering', "i:" + property);
        },
    }
})