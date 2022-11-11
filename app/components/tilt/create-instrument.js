import Component from '@ember/component';
import Ember from 'ember';

function resetNewInstrumentObject(_this) {
    _this.set('newInstrumentObject', {});
    _this.set('name', null);
    _this.set('zeroTimestamp', null);
    //_this.set('project', null);
    _this.set('installDate', null);
    _this.set('east', null);
    _this.set('north', null);
    _this.set('depth', null);
    _this.set('azimuth', null);
    _this.set('dip', null);
    _this.set('instrumentType', 0);
    _this.set('headAt', 'HAC');
    _this.set('instrumentLength', 0);
    _this.set('strokeLength', 0);
    _this.set('referenceAnchor', null);
    _this.set('headExclusionLength', 0);
    _this.set('gaugeLength', 0);
    _this.set('bulbed', false);
    _this.set('plated', false);
    _this.set('stacked', false);
    _this.set('active', true);
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
            newInstrumentObject.zeroTimestamp = this.get('zeroTimestamp');
            newInstrumentObject.installDate = this.get('installDate');
            //newInstrumentObject.east = this.get('east');
            //newInstrumentObject.north = this.get('north');
            //newInstrumentObject.depth = this.get('depth');
            newInstrumentObject.strokeLength = 0;
            newInstrumentObject.instrumentType = store.peekRecord('instrument-type', this.get('typeID'));
            newInstrumentObject.headAt = store.peekRecord('head-at', this.get('headAt'));
            newInstrumentObject.active = true;
            newInstrumentObject.instrumentStiffness = 0;
            //console.log('here');
            if(typeof newInstrumentObject.id === 'undefined' || newInstrumentObject.id === "") {
                error = true;
                this.setError('fieldError',true);
                this.setError('isVisibleError',true);
            }

            if(!error) {
                if(typeof newInstrumentObject.strokeLength === 'undefined') {
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
                        
                        if(results.id != null) {
                            store.createRecord('anchor', {number: 0, distance: 0, instrument: results}).save();
                            store.createRecord('anchor', {number: 1, distance: 1, instrument: results}).save();
                            store.createRecord('anchor', {number: 2, distance: 2, instrument: results}).save();
                            store.createRecord('anchor', {number: 3, distance: 3, instrument: results}).save(); 
                            store.createRecord('anchor', {number: 4, distance: 4, instrument: results}).save(); 
                            store.createRecord('anchor', {number: 5, distance: 5, instrument: results}).save(); 
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
}