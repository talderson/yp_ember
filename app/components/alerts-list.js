import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Component.extend({
    
    authError: false,

    router: service(),
    isRowDeleteConfirmationDialog: {},
    actions: {
        toggleRowDeleteConfirmationDialog(id){
            //console.log(id);
            let errBox = document.getElementById("alertListError");
            errBox.hidden=true;
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
        },
        remove(model, object){
            let _this = this;
            let _store = this.get('store');

            //object.get('isDeleted');
            
            //_this.setError('authError',false);
            let errBox = document.getElementById("alertListError");

            // object.deleteRecord();

            errBox.hidd = true;
            //console.log(_store.find('user', params));

            object.save().then(function(){
                
                object.deleteRecord();
                
                object.save().then(function(){                    
                    object.unloadRecord();
                }).catch(function(reason){
                    let status = reason.errors[0].status;

                    if (status == 403) {
                        errBox.hidden = false;
                    };
                });
                // deal with records that just were created
                // relates to the way I add new records to model https://github.com/emberjs/data/issues/3313
                //model.removeObject(object);

            }).catch(function(reason){

                let status = reason.errors[0].status;

                if (status == 403) {
                    errBox.hidden = false;
                };
            });
        },
    }

})