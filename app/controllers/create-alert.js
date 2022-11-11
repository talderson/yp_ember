import Ember from 'ember';
import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';
import { inject as service } from "@ember/service";

export default Ember.Controller.extend({
    instType: "",
    id: "",
    
    isVisibleError: false,
    duplicateError: false,
    typeError: false,
    fieldError: false,

    allInstruments: Ember.computed.filter('model.instruments', function(instrument) {
        return true;
    }),
    instruments: Ember.computed.map('allInstruments', function(instrument) {
        return {
            title: instrument.get('id'),
            value: instrument.get('id'),
            type: instrument.get('instrumentTypeID'),
        };
    }),

    instrumentChanged: observer('inst_id', function() {
        this.set('instType', this.get('model').instrument.instrumentTypeID);
        this.set('id',this.get('inst_id'));
    }),

    breadCrumbs: computed({
        get() {
            let obj = [
                {
                    label: "Dashboard",
                    path: 'index'
                },
                {
                    label: "Alerts",
                    path: 'alerts'
                },
                {
                    label: 'Create Alert',
                    path: 'create-alert',
                }
            ]
        
            return obj;
        }
    }),
    actions: {
        submit(id) {
            if (id != null) {
                this.transitionToRoute('edit-alert', id);
            } else {
                this.transitionToRoute('alerts');
            }
        },
        setError(error,value) {
            Ember.set(this, error, value);
        },
        setValue(property,value) {
            Ember.set(this, property, value)
        },
        setID(inst){
            //console.log(inst);
            //this.set("inst_id", inst.value);
            this.set("instType", inst.type);
            this.set("id", inst.value);
        },
    }
});
