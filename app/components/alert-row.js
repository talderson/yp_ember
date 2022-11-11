import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Component.extend({
    router: service(),
    deleteConfirmation: false,
    actions: {
        toggleRowDeleteConfirmationDialog(id){
            //console.log(id);
            let curVal = this.get('isRowDeleteConfirmationDialog')[id] ? false : true;
            Ember.set(this.get('isRowDeleteConfirmationDialog'), id, curVal); //update isVisibleRowDetails variable for each single row
        },
        createAlert: function() {
            //console.log("create");
            let instID = this.get("instrumentId");
            if (instID !== null) {
                this.get('router').transitionTo('create-alert', { queryParams: { inst_id: instID }});
            } else {
                this.get('router').transitionTo('create-alert');
            }
        }
    }

})