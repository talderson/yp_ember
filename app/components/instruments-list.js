import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Component.extend({
    router: service(),
    session: service(),
    isRowDeleteConfirmationDialog: {},
    licenceIsValid: Ember.computed('',function() {
        let valid = false;
        try {
            valid = this.session.data.authenticated.isValid;
        } catch {}
        return valid;
    }),
    actions: {
        createInstrument: function() {
            //console.log("create");
            this.get('router').transitionTo('create-instrument');
            //this.transitionTo('create-instrument');
        },
        toggleRowDeleteConfirmationDialog(id){
            //console.log(id);
            let curVal = this.get('isRowDeleteConfirmationDialog')[id] ? false : true;
            Ember.set(this.get('isRowDeleteConfirmationDialog'), id, curVal); //update isVisibleRowDetails variable for each single row
        },
        remove(model, object){
            let _this = this;
            let _store = this.get('store');

            let errBox = document.getElementById("instrumentListError");

            errBox.hidd = true;

            //object.get('isDeleted');
            object.save().then(function(){
                // deal with records that just were created
                // relates to the way I add new records to model https://github.com/emberjs/data/issues/3313
                //model.removeObject(object);
                object.deleteRecord();
                
                object.save().then(function(){                    
                    object.unloadRecord();
                }).catch(function(reason){
                    let status = reason.errors[0].status;

                    if (status == 403) {
                        errBox.hidden = false;
                    };
                });
            
            }).catch(function(reason){

                let status = reason.errors[0].status;

                if (status == 403) {
                    errBox.hidden = false;
                };
            });
        },
    }

})