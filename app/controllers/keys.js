import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class KeysController extends Controller{
    isRowDeleteConfirmationDialog = {};

    @action
    updateActive(theModel) {
        let valid = {};
        let active = {};
        let ctr = 0;
        let tooltip = {};

        theModel.licenceKeys.forEach(function(theItem){
            valid[theItem.id] = theItem.isValidKey;
            let count = theItem.numInst;
            let modules = theItem.modules;
            tooltip[theItem.id] = "";
            active[theItem.id] = false;
            //console.log(modules);
            for (var key in modules) {
                var type = typeof modules[key];
                if(type === "boolean") {
                    if(modules[key]) {
                        active[theItem.id] = true;
                        tooltip[theItem.id] += capitalizeFirstLetter(key) + "\n";
                    }
                } else {
                    for (var key2 in modules[key]) {
                        if(modules[key][key2]) {
                            active[theItem.id] = true;
                            tooltip[theItem.id] += capitalizeFirstLetter(key2) + " " + capitalizeFirstLetter(key) + "\n";
                        }
                    }
                }
            }
        });
        this.set('activeKeys',valid);
        this.set('activeModules',active);
        this.set('tooltip',tooltip);
    }

    @action
    remove(model, object) {
        let _this = this;
        let _store = this.get('store');
        object.deleteRecord();

        object.save().then(function(){                    
            object.unloadRecord();
        }).catch(function(reason){
            let status = reason.errors[0].status;

            if (status == 403) {
                errBox.hidden = false;
            };
        });        
    }

    @action
    toggleRowDeleteConfirmationDialog(id) {
        let curVal = this.get('isRowDeleteConfirmationDialog')[id] ? false : true;
        Ember.set(this.get('isRowDeleteConfirmationDialog'), id, curVal); //update isVisibleRowDetails variable for each single row    
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
