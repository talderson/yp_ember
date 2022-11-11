import Ember from 'ember';

export default Ember.Controller.extend({
    page_size: 20,
    page: 1,
    search: null,
    breadCrumbs: [
        {
            label: "Dashboard",
            path: 'index'
        },
        {
            label: "Alerts",
            path: 'alerts'
        },
        
    ],
    actions: {
        sortBy(property) {
            this.set('ordering', property);
        },
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        },
    }

});
