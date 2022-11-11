import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default class EditInstrument extends Component.extend({
    editing: 0,
    selectedVendor: null,
    selectedModel: null,

    selectedVendorID: Ember.computed('instrument', function() {
        try {
            let vendor = this.get('instrument').get('vwproperty').toArray()[0].get('vwmodel').get('vwvendor');
            this.set('selectedVendor', vendor.id);
            
            return vendor.id;
        } catch (ex) {}
        return 0;
    }),

    selectedModelID: Ember.computed('instrument', function() {
        //console.log('test');
        try {
            let model = this.get('instrument').get('vwproperty').toArray()[0].get('vwmodel');
            //console.log(model.get('id'));
            this.set('selectedModel', model.get('id'));

            
            return model.get('id');
        } catch (ex) {}
        return 0;
    }),

    modelList: Ember.computed('selectedVendor', 'instrument', function() {
        let modelList = this.get('vwModels');
        
        let shortModelList = [];

        modelList.toArray().forEach(element => {
            if (element.get('vwvendor').id === this.get('selectedVendor')) {
                shortModelList.push(element);
            }
        });

        return shortModelList;
    }),

    vendorName: Ember.computed('selectedModel', function() {
        try {
            let vendor = this.get('instrument').get('vwproperty').toArray()[0].get('vwmodel').get('vwvendor');
            return vendor.vendorName;
        } catch (ex) {}
        return ""
    })
}) {
    @service router;
    @service store;
    //@service session;
    //@service currentUser;
    isAuthenticated = true;
    _this = this;

    actions = {
        viewData(id) {
            this.get('router').transitionTo('raw-data', id);
            //this.viewData(id);
        },
        tGraph(id) {
            this.get('router').transitionTo('temporal-graphs.temporal-graph', id, 'displacement-values');
            //this.tGraph(id, 'displacement-values');
        },
        fGraph(id) {
            this.get('router').transitionTo('frequency-graphs.frequency-graph', id, 'displacement-values');
            //this.sGraph(id, 'displacement-values');
        },
        setVendor(vendorID) {
            //console.log('setVendor: ' + vendorID);
            this.set('selectedVendor', vendorID);
            this.set('selectedModel', null);
            this.send('setModel', null);
        },
        setModel(modelID) {
            //console.log('setModel');
            this.set('selectedModel', modelID);
            let inst = this.get('instrument');
            let prop = inst.get('vwproperty').toArray()[0];
            let model = this.get('vwModels').findBy('id', modelID);

            if (typeof model === "undefined") {
                model = null;
            }

            if(prop.get('serial') == null) {
                prop.set('serial', "");
            }

            prop.set('vwmodel', model);

            prop.save();
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

