import Ember from 'ember';
import { computed, observer } from "@ember/object";
import moment from 'moment';

function resetNewAlertObject(_this) {
    let newAlertObject = {
        'repeatWindow': '',
        'metric': 'DISP',
        'direction': 'GT',
        'value': null,
        'severity': 'HIGH',
        'response': 'VP',
        'target': '',
        'message': '',
        'windowType': 'NR',
        'windowLength': 1,
        'method': 'IMM',
        'creator': '',
        'refAnchor': 'Ch0',
        'inverted': false,
        'creationDate': null
    };
    _this.set('creationTimestamp',null);
    _this.set('newAlertObject', newAlertObject);
    //console.log(_this.get('newAlertObject'));
}

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        resetNewAlertObject(this);
    },
    //@service session;
    //@service currentUser;
    //@service store;
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    newAlertObject: {},
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    installDate: null,
    activeSize: 2,
    activeExpanded: false,
    buttonSymbol: '+',
    activeLabel: 'Expand',
    createMessage: '',

    isPerm: true,
    isActive: true,
    repeats: false,
    inverted: false,
    creationTimestamp: null,
    isAuthenticated: true,

    isVisibleError: false,
    emptyBoldError: false,
    noActChError: false,
    nonNumericValueError: false,
    wLError: false,
    wLNegError: false,
    targetError: false,
    phoneNumError: false,
    authError: false,

    username: computed('',function() {
        return this.get('session').data.authenticated['user'];
    }),

    channelCount: computed('id', function() {
        var id = this.get('id');
        //console.log(id);
        var pos = (id.length === 9 ? 5 : 6);
        var count = id.substring(4,pos);
        //console.log(count);
        return count;
    }),

    onMetricChanged: observer('newAlertObject.metric', function() {
        let metric = this.get('newAlertObject.metric');
        if(metric === 'TIME') {
            this.set('newAlertObject.method', 'IMM');
            this.set('newAlertObject.refAnchor', 'Ch0');
            this.set('newAlertObject.inverted', false);
        }
    }),

    onMethodChanged: observer('newAlertObject.method', function() {
        let method = this.get('newAlertObject.method');
        if(method === 'IMM') {
            this.set('newAlertObject.windowLength', 1);
            this.set('newAlertObject.windowType', 'NR');
        }
    }),

    onResponseChanged: observer('newAlertObject.response', function() {
        let response = this.get('newAlertObject.response');
        if(response == 'VP') {
            this.set('newAlertObject.target', '');
        }
    }),

    actions: {
        checkChanged(object) {
            this.set(object[0],object[1]);
        },
        staticChanged() {
            this.set("isPerm",document.getElementById('newAlertStaticDynamic').checked);
        },
        activeChanged() {
            this.set("isActive",document.getElementById('newAlertEnabled').checked);
        },
        repeatChanged() {
            this.set("repeats",document.getElementById('newAlertRepeat').checked);
        },
        invertChanged() {
            this.set("inverted",document.getElementById('newAlertInvert').checked);
        },

        toggleActive() {
            let big = !this.get("activeExpanded");

            if(big) {
                this.set('activeSize',this.get('channelCount'));
                this.set('buttonSymbol', '-');
                this.set('activeLabel','Collapse');
            } else {
                this.set('activeSize',2);
                this.set('buttonSymbol', '+');
                this.set('activeLabel','Expand');
            }
            this.set('activeExpanded', big);
        },
        createAlert(object){
            let _this = this,
                store = this.get('store'),
                newAlertObject = this.get('newAlertObject')
            ;

            let selector = this.element.querySelector('[name="chan_select"]');

            let selected = {};

            for(const elem of selector.selectedOptions)
            {
                selected[elem.value] = true;
            };

            this.set('isVisibleError',false);
            this.set('fieldError',false);

            let error = false;

            if(!error) {
                newAlertObject.isTriggered = false;
                newAlertObject.isHandled = false;
                newAlertObject.initTriggerStamp = null;
                newAlertObject.handleStamp = null;
                Ember.set(newAlertObject, 'creationDate', moment().format('YYYY-MM-DD HH:mm:ss'));
                //newAlertObject.creationDate = _this.get('creationTimestamp');
                newAlertObject.isPerm = _this.get('isPerm');
                newAlertObject.isActive = _this.get('isActive');
                newAlertObject.repeats = _this.get('repeats');
                newAlertObject.inverted = _this.get('inverted');
                newAlertObject.instrument = store.peekRecord('instrument', this.get('id'));

                if (newAlertObject.instrument !== null)
                {
                    let newAlert = null;

                    if(!error) {
                        try {
                            newAlert = store.createRecord('alert', newAlertObject);
                        } catch (err) {
                            this.set('isVisibleError',true);
                        }
                    }

                    if(!error) {

                        let val = false;
            
                        let alertObjectValue = this.get('newAlertObject.value');

                        let respType = this.get('newAlertObject.response');
                        let addType="";

                        //Check if there are empty fields
                        let value = this.get('newAlertObject.value');
                        let cb = this.get('newAlertObject.creator');
                        let wl = this.get('newAlertObject.windowLength');
                        let target = this.get('newAlertObject.target');
                        let sel = document.getElementById("chan_select").selectedIndex;

                        /*
                        console.log(value);
                        console.log(cb);
                        console.log(wl);
                        console.log(sel);
                        */

                        this.setError('isVisibleError',false);
                        this.setError('emptyBoldError',false);
                        this.setError('noActChError',false);
                        this.setError('nonNumericValueError',false);
                        this.setError('wLError',false);
                        this.setError('wLNegError',false);
                        this.setError('targetError',false);
                        this.setError('phoneNumError', false);
                        this.setError('authError', false);


                        // console.log(document.getElementById("newAlertObjectTarget"));
                       
                        //If bolded values arn't entered
                        if ((val.length == 0) || (cb.length == 0) || (wl.length == 0)) {
                            this.setError('isVisibleError',true);
                            this.setError('emptyBoldError',true);
                            //_this.set('createMessage', "Please ensure all bolded entries are completed");
                        
                        //If no channels are selected
                        } else if ((sel == -1) && (this.get('newAlertObject.metric') != 'TIME')) {
                            this.setError('isVisibleError',true);
                            this.setError('noActChError',true);
                            //_this.set('createMessage', "Please ensure you've selected at least one active channel");

                        //If the value is a non numeric
                        }else if (isNaN(alertObjectValue)){
                            this.setError('isVisibleError',true);
                            this.setError('nonNumericValueError',true);
                            // _this.set('createMessage', "Please enter a valid numeric for the value");

                        //If a negative or 0 is entered for window length
                        } else if ((this.get('newAlertObject.method') != 'IMM') && (wl <= 1)  && (this.get('newAlertObject.windowType') != 'LT')) {
                            this.setError('isVisibleError',true);
                            this.setError('wLError',true);
                            //_this.set('createMessage', "Please enter a window length larger than 1 if method is not immediate");

                        } else if (wl < 1) {
                            this.setError('isVisibleError',true);
                            this.setError('wLNegError',true);
                            //_this.set('createMessage', "Please enter a window length of greater than or equal to 1");
            
                        } else if (respType=='TRIG') {
                            document.getElementById("newAlertObjectTarget").value = "";
                            //_this.set('createMessage', "Alert via Alarm will be available in future update");            
                    

                        } else if((typeof target === 'undefined' || target === "") && (respType != 'VP')) {
                            
                            if (respType == 'EMAIL') {
                                addType = 'email address';
                            } else if (respType == 'SMS') {    
                                addType = 'phone number';
                            } else if (respType == 'TRIG') {
                                addType = 'ip address';
                            }
                            
                            this.setError('isVisibleError',true);
                            this.setError('targetError',true);                
                            //_this.set('createMessage', "Please enter a target " + addType);

                        } else if ((!(target.includes("@")))&&(respType=='SMS')) {
                            this.setError('isVisibleError',true);
                            this.setError('phoneNumError',true);
                            //_this.set('createMessage', "Please ensure you've added a carrier to the phone number");
                        
                        } else { 
                            newAlert.save().then(function(results){
                                val = true;
                                // hide create new item form
                                let newAnchorObject = null;
                                let newAnchor = null;
                                // console.log(error)
                                for(const elem of selector.selectedOptions) {
                                    // console.log(error)
                                    newAnchorObject = {};
                                    newAnchorObject.alert = results;
                                    newAnchorObject.selectedCh = elem.value;

                                    newAnchor = store.createRecord('alert-anchor', newAnchorObject);
                                    newAnchor.save();
                                }
        
                                if(results.id != null) {
                                    _this.get('submit')(results.id);
                                } else {
                                    this.setError('isVisibleError',true);
                                    error = true;
                                }
                                //_this.set('isVisibleCreateNewForm', false);
                            }).catch(function(reason) {
                                if (reason.errors[0].status == 403) {
                                    _this.setError('isVisibleError',true);
                                    _this.setError('authError',true);
                                }
                                
                            });
                            //console.log(val);
                            //if (!val){
                            //    _this.set('createMessage', "Please ensure all bolded values are entered");
                            //}
                        }
                    } 
                }
            }
        },
    }
});