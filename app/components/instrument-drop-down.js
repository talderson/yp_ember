import Component from '@glimmer/component';
import Ember from 'ember';

export default Ember.Component.extend({
    inst_id: "Select",
    actions: {
        setID(inst){
            this.set("inst_id", inst.id);
            this.setValue("instType", inst.instrumentTypeID);
            this.setValue("id", inst.id);
        },
    }
});