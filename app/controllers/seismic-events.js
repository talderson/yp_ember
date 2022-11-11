import Ember from 'ember';
import { on } from '@ember/object/evented';

export default Ember.Controller.extend({

    _my_init: on('init', function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            //this.send('updateNav',this.get('model').licence.content[0]._data);
        });
    }),
    queryParams: ['page', 'page_size', 'ordering', 'search'],
    page_size: 20,
    eventsMeta: null,
    ordering: null,
    search: null,
    isVisibleImportDataForm: null,
    isVisibleRowDetails: {},
    isRowDeleteConfirmationDialog: {},
    isVisibleCreateNewForm: false,
    permissionError: false,
    
    breadCrumbs: [
        {
            label: "Dashboard",
            path: 'index'
        },
        {
            label: "Seismic Events",
            path: 'seismic-events'
        },
        
    ],
    
    actions: {
        updateProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        },
        vewRowDetails(id){
            let curVal = this.get('isVisibleRowDetails')[id] ? false : true;
            Ember.set(this.get('isVisibleRowDetails'), id, curVal); //update isVisibleRowDetails variable for each single row
        },
        toggleRowDeleteConfirmationDialog(id){
            let curVal = this.get('isRowDeleteConfirmationDialog')[id] ? false : true;
            Ember.set(this.get('isRowDeleteConfirmationDialog'), id, curVal); //update isVisibleRowDetails variable for each single row
        },
        toggleProperty(property) {
            //console.log('toggle property: ' + property);
            if ( !this.get(property) ) {
                this.set(property, true);
            } else {
                this.set(property, null);
            }
        },
        remove(model, object){
            let _this = this
            object.deleteRecord();
            object.get('isDeleted');
            object.save().then(function(){
                // deal with records that just were created
                // relates to the way I add new records to model https://github.com/emberjs/data/issues/3313
                model.removeObject(object);
            })
            .catch(function(reason){
                if (reason.errors[0].status == 403) {
                    _this.send('updateProperty','permissionError', true);
                }
            });
        },
        sortBy(property) {
            this.set('ordering', property);
        }
    }
});
