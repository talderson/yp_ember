import Component from '@ember/component';
import Ember from 'ember';
import { computed, observer } from "@ember/object";

function resetNewInstrumentObject(_this) {
    //console.log('reset');
    _this.set('newInstrumentObject', {});
    //_this.set('name', null);
    _this.set('zeroTimestamp', null);
    _this.set('installDate', null);
    //_this.set('east', null);
    //_this.set('north', null);
    //_this.set('depth', null);
    //_this.set('azimuth', null);
    //_this.set('dip', null);
    //_this.set('instrumentType', 0);
    //_this.set('headAt', 'HAC');
    //_this.set('instrumentLength', 0);
    _this.set('strokeLength', 0);
    //_this.set('referenceAnchor', null);
    //_this.set('headExclusionLength', 0);
    //_this.set('gaugeLength', 0);
    //_this.set('bulbed', false);
    //_this.set('plated', false);
    //_this.set('stacked', false);
    //_this.set('active', true);
}

export default class CreatePackInstrument extends Component.extend({
    //@service session;
    //@service currentUser;
    
    modelList: computed('selectedVendor', function() {
        let modelList = this.get('vwModels');
        //console.log('test');
        let shortModelList = [];

        modelList.toArray().forEach(element => {
            if (element.get('vwvendor').id === this.get('selectedVendor')) {
                shortModelList.push(element);
            }
        });

        return shortModelList;
    }),
    isTypeGeoPt: computed('selectedModel', function() {
        let selectedVendor = this.get('selectedVendor');
        let selectedModel = this.get('selectedModel');

        if (selectedModel != "" && selectedModel != null)
            if (selectedVendor == 2)
                return true;
        
        return false;
    }),
    isTypeRocPws: computed('selectedModel', function() {
        let selectedVendor = this.get('selectedVendor');
        let selectedModel = this.get('selectedModel');

        if (selectedModel != "" && selectedModel != null)
            if (selectedVendor == 1)
                return true;
        
        return false;
    }),

   
    authError:false,
    isAuthenticated:true,
    newInstrumentObject:{},
    headAt:'HAC',
    zeroTimestamp:null,
    installDate:null,
    selectedVendor:null,
    selectedModel:null,

    calcCoef1:null,
    calcCoef2:null,
    calcCoef3:null,
    calcCoef4:null,
    calcCoef5:null,

    actions: {
        setVendor(vendorID){
            this.set('selectedVendor', vendorID);
            this.set('selectedModel', null);
            this.send('setModel', null);
        },
        setModel(modelID){
            this.set('selectedModel', modelID);
        },
        setValue(prop, val){
            //console.log('setting' + prop + val);
            this.set(prop,val);
            //console.log(this.get(prop));
        },
        createInstrument(object){

            //console.log(this.get('prevDup'));
            //console.log((typeof this.get('prevDup') === "undefined"));
            

            let _this = this,
            store = this.get('store'),
            newInstrumentObject = this.get('newInstrumentObject');

            this.setError('isVisibleError',false);
            this.setError('duplicateError',false);
            this.setError('fieldError',false);

            let error = false;

            newInstrumentObject.id = this.get('id');

            newInstrumentObject.instrumentType = store.peekRecord('instrument-type', this.get('typeID'));
            newInstrumentObject.headAt = store.peekRecord('head-at', this.get('headAt'));
            newInstrumentObject.active = true;

            if(typeof newInstrumentObject.id === 'undefined' || newInstrumentObject.id === "") {
                error = true;
                this.setError('fieldError',true);
                this.setError('isVisibleError',true);
            }

            // if(!error) {
            //     if(typeof newInstrumentObject.strokeLength === 'undefined') {
            //         error = true;
            //         this.setError('fieldError',true);
            //         this.setError('isVisibleError',true);
            //     }
            // }

            if (this.get('zeroTimestamp') != null) {
                newInstrumentObject.zeroTimestamp = moment(this.get('zeroTimestamp'),'YYYY MM DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            }

            if (this.get('installDate') != null) {
                newInstrumentObject.installDate = moment(this.get('installDate'),'YYYY MM DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            }

            // console.log(Ember.get(this, 'duplicateError'));

            let newInstrument = null;
            let dup = false;
            if(!error) {
                try {
                    newInstrument = store.createRecord('instrument', newInstrumentObject);
                } catch (err) {
                    this.setError('isVisibleError',true);
                    //console.log(this.get('prevDup'));
                    if(err.message.includes('has already been used')) {
                        //console.log('duplicate');
                        this.setError('duplicateError',true);
                        
                        error = true;
                        dup = true;
                    }
                    // console.log(err.message);
                }
            }
            
            this.setError('authError', false);


            if (!error) {                
                newInstrument.save().then(function(results){

                    let model = _this.get('vwModels').findBy('id', _this.get('selectedModel'));

                    if(newInstrumentObject.instrumentType.id === '12') {
                        if(results.id != null) {
                            let anchorCount = parseInt(newInstrumentObject.id.substring(4,newInstrumentObject.id.length > 9 ? 6 : 5)) - 1;
                            for(var ctr = 0; ctr <= anchorCount; ctr++) {
                                store.createRecord('anchor', {number: ctr, distance: ctr, instrument: results}).save();
                            }
                            let vwp = store.createRecord('vwproperty', {port: 1, instrument: results, vwmodel: model, calcCoef1: _this.get('calcCoef1'), calcCoef2: _this.get('calcCoef2'), calcCoef3: _this.get('calcCoef3'), calcCoef4: _this.get('calcCoef4'), calcCoef5: _this.get('calcCoef5')});
                            vwp.save();
                        }
                    }

                    if(results.id != null) {
                        _this.get('submit')(results.id);
                    } else {
                        this.setError('isVisibleError',true);
                        error = true;
                    }
                }).catch(function(reason) {
                    
                    _this.setError('isVisibleError',true);
                    _this.setError('authError',true);
                });
            }
        }
    }
}){
    init() {
        super.init(...arguments);
        resetNewInstrumentObject(this);
    }
}