import Component from '@ember/component';
import Ember from 'ember';

function resetNewInstrumentObject(_this) {
    //console.log('reset');
    _this.set('newInstrumentObject', {strokeLength:10000});
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
    //_this.set('strokeLength', 0);
    //_this.set('referenceAnchor', null);
    //_this.set('headExclusionLength', 0);
    //_this.set('gaugeLength', 0);
    //_this.set('bulbed', false);
    //_this.set('plated', false);
    //_this.set('stacked', false);
    //_this.set('active', true);
}

export default class CreatePackInstrument extends Component {
    //@service session;
    //@service currentUser;


    init() {
        super.init(...arguments);
        resetNewInstrumentObject(this);
    }

    isAuthenticated = true;
    newInstrumentObject = {};
    headAt = 'HAC';
    zeroTimestamp = null;
    installDate = null;
    authError = false;


    actions = {
        createInstrument(object){
            //console.log('test');
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

            if(!error) {
                if(typeof newInstrumentObject.strokeLength === 'undefined' || newInstrumentObject.strokeLength === 0) {
                    error = true;
                    this.setError('fieldError',true);
                    this.setError('isVisibleError',true);
                }
            }

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
                        // console.log(dup);
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
}