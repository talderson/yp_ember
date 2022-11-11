import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default class EditInstrument extends Component.extend({
}) {
    @service router;
    @service store;
    //@service session;
    //@service currentUser;
    isAuthenticated = true;
    selectedVendor= null;
    selectedModel= null;
    editing= 0;
    actions = {
        updatePage(){
            let store = this.get('store');
            let instrument = this.get('instrument');
            let anchors = instrument.get('anchors');

            anchors.forEach(function(anchor, index) {
                let number = anchor.get('number') - 1;
                let total = anchors.length-1;
                if(number >= 0) {
                    let gauge = instrument.get('gaugeLength');
                    let distance = instrument.get('headExclusionLength') + gauge;
                    if(!instrument.get('stacked') && number >= total / 2) {
                        distance += (gauge + 20) / 2;
                    }
                    distance += (gauge + 20) * (number % (total / 2));
                    if (isNaN(distance)) {
                        distance = 0;
                    }
                    //let val = anchors[index];
                    anchor.set('distance', distance);
                    anchor.save();
                }
            });

            //instrument.set('anchors',anchors);
            //instrument.save();
            setTimeout(function() { alert('To see changes, please refresh the page.'); }, 1);
        },
        viewData(id) {
            this.get('router').transitionTo('raw-data', id);
            //this.viewData(id);
        },
        tGraph(id) {
            this.get('router').transitionTo('temporal-graphs.temporal-graph', id, 'displacement-values');
            //this.tGraph(id, 'displacement-values');
        },
        sGraph(id) {
            this.get('router').transitionTo('spatial-graphs.spatial-graph', id, 'displacement-values');
            //this.sGraph(id, 'displacement-values');
        },
        editField() {
            this.set('editing', this.get('editing') + 1);
        },
        stopEditField() {
            this.set('editing', this.get('editing') - 1);
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