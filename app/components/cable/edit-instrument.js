import Ember from 'ember';
import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default class EditInstrument extends Component.extend({
}) {
    @service router;
    @service store;

    isAuthenticated = true;
    selectedVendor= null;
    selectedModel= null;
    editing= 0;

    actions = {
        updatePage(){
            let store = this.get('store');
            let instrument = this.get('instrument');
            //let instrument = this.get('tableRow');
            try {
                let stiffness = instrument.get('elasticLimitFce') / instrument.get('elasticLimitPct');
                stiffness = Math.round(stiffness * 1000) / 1000;
                instrument.set('instrumentStiffness', stiffness);
            } catch (ex) {
                instrument.set('instrumentStiffness', 0);
            }
            instrument.save();
        },
        viewData(id) {
            this.get('router').transitionTo('raw-data', id);
            //this.viewData(id);
        },
        tGraph(id) {
            this.get('router').transitionTo('temporal-graphs.temporal-graph', id, 'displacement-values');
            //this.tGraph(id, 'displacement-values');
        },
        editField() {
            this.set('editing', this.get('editing') + 1);
        },
        stopEditField() {
            this.set('editing', this.get('editing') - 1);
        },
        sGraph(id) {
            this.get('router').transitionTo('spatial-graphs.spatial-graph', id, 'displacement-values');
            //this.sGraph(id, 'displacement-values');
        },
        saveInstrument(){
            const _this = this;
            // console.log("test");
            if (this.get('editing') > 0) {
                var t = confirm("Some changes have not been saved!\r\nTo save changes, click cancel then\r\nclick the checkbox next to each open field.\r\nOtherwise click ok to continue.");
                if (t) {
                    window.location.href = "/instruments";    
                }
            } else {
                window.location.href = "/instruments";
            }            
        }
    }
}
