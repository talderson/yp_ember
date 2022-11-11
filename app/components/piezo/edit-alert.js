import Ember from 'ember';
import moment from 'moment';
import { computed, observer } from "@ember/object";
//import alertAnchor from '../models/alert-anchor';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    tr: null,
    instID:"",
    activeSize: 2,
    activeExpanded: false,
    buttonSymbol: '+',
    activeLabel: 'Expand',
    saveMessage: '',
    updatedAnchors: null,
    anchors: null,
    initTriggerStamp: '',
    //anchEmpty: true,

    isVisibleError: false,
    emptyBoldError: false,
    noActChError: false,
    nonNumericValueError: false,
    wLError: false,
    wLNegError: false,
    targetError: false,
    phoneNumError: false,
    authError: false,

    
    handleAlertObjectChange: observer('tr', function() {
        console.log('Object Changed!');
    }),

    onMetricChanged: observer('alert.metric', function() {
        let metric = this.get('alert.metric');
        if(metric === 'TIME') {
            this.set('alert.method', 'IMM');
            this.set('alert.refAnchor', 'Ch0');
            this.set('alert.inverted', false);
            this.send('updateSelectedAnchors',document.getElementById("chan_select"));
        }
    }),

    onMethodChanged: observer('alert.method', function() {
        let method = this.get('alert.method');
        if(method === 'IMM') {
            this.set('alert.windowLength', 1);
            this.set('alert.windowType', 'NR');
        }
    }),

    onResponseChanged: observer('alert.response', function() {
        let response = this.get('alert.response');
        if(response == 'VP') {
            this.set('alert.target', '');
        }
    }),

    anchorList: Ember.computed('instID', 'anchors', function() {
        let anchors = this.get('anchors');
        let isSelected = {};
        //console.log("triggered");
        if (anchors == null) {
            anchors = this.get('alert').get('anchors');
            this.set('anchors', anchors);
        }

        anchors.forEach(element => {
            isSelected[element.get('selectedCh')] = true;
        });


        return isSelected;
    }),

    channelCount: Ember.computed('instID', function() {
        //console.log(this.get('alert').get('refAnchor'));
        let instrument = this.get('alert').instrument;
        let instID = this.get('instID');

        if(instID==="") {
            instID = instrument.get('id');
        }
        let pos = instID.length === 9 ? 5 : 6;
        let numChans = parseInt(instID.substring(4,pos));
        //console.log(numChans);
        return numChans-1;
    }),

    creationDateText: Ember.computed('instID', function() {
        let date = this.get('alert').creationDate;
        return moment(date);
    }),

    triggeredTimeText: Ember.computed('initTriggerStamp', function() {
        let date = this.get('alert').initTriggerStamp;
        return moment(date);
    }),

    // success(post) {
    //     console.log("success");
    //     //console.log(post);
    //     //console.log(this);
    //     //this.set('saving',false);
    //     //this.set('saved',true);
    //     //this.set('saveFailed',false);
    // },
    // failure(reason) {
    //     console.log("failure");
    //     //console.log(reason);
    //     //this.set('saving',false);
    //     //this.set('saved',false);
    //     //this.set('saveFailed',true);
    //     //console.log('help?');
    // },
    actions: {
        updateSelectedAnchors(thing) {
            let update = null;
            if (thing instanceof Event)
                update = Ember.$(thing.target).val();
            else
                update = Ember.$(thing).val();
            let dict = {};
            update.forEach(function(obj) {
                dict[obj] = true;
                return dict;
            });

            this.set('updatedAnchors', dict);
        },
        saveAlert() {
            const _this = this;
            const store = this.get('store');
            let tr = _this.get('alert');

            //get target value
            let alertObjectTarget = this.get('attrs.alert.value.target');
            
            //get response type 
            let respType = this.get('attrs.alert.value.response');
            
            //get value
            let alertObjectValue = this.get('attrs.alert.value.value');

            //notarget is used to see if no target is selected when one should be
            let noTarget = false;
            let addType = "";

            //convert the response type to a human friendly string
            if((typeof alertObjectTarget === 'undefined' || alertObjectTarget === "") && (respType != 'VP')) {
                noTarget = true;
                
                if (respType == 'EMAIL') {
                    addType = 'email address';
                } else if (respType == 'SMS') {    
                    addType = 'phone number';
                } else if (respType == 'TRIG') {
                    addType = 'ip address';
                }
            }

            //Check active channels
            let updatedAnchors = this.get('updatedAnchors');
            console.log(updatedAnchors);
            if ((updatedAnchors != null)) {
                let anchors = this.get('anchorList');

                let changes = new Map();
                
                //remove old values
                for(var key in anchors) {
                    if (!updatedAnchors.hasOwnProperty(key)) {
                        changes.set(key, false);
                    }
                }

                //add new values
                for(var key in updatedAnchors) {
                    if (!anchors.hasOwnProperty(key)) {
                        changes.set(key, true);
                    }
                }

                let anchorsFinal = tr.get('anchors');
                let newAnchorObject = null;

                for (const [key, value] of changes.entries()) {
                    if(value) {
                        newAnchorObject = {};
                        newAnchorObject.alert = tr;
                        newAnchorObject.selectedCh = key;

                        let newAnchor = store.createRecord('alert-anchor', newAnchorObject);
                        newAnchor.save();
                    } else {
                        anchorsFinal.forEach(element => {
                            if(element.get('selectedCh') === key) {
                                element.destroyRecord();
                            }
                        });
                    }
                }

                let result = store.findRecord('alert-anchor',tr.id).then(function(post) {
                    anchorsFinal = post.get('anchors');
                });

                this.set('updatedAnchors', null);
                this.set('anchors', anchorsFinal);
            }
            

            //Check if there are empty fields
            let val = this.get('attrs.alert.value.value');
            let cb = this.get('attrs.alert.value.creator');
            let wl = this.get('attrs.alert.value.windowLength');
            let sel = document.getElementById("chan_select").selectedIndex;

            //get response type 
            //let respType = this.get('attrs.alert.value.response');

            //get target value
            //let alertObjectTarget = this.get('attrs.alert.value.target')

            /*
            console.log(val);
            console.log((val == "" && val != 0));
            console.log(val.length == 0);
            console.log(val != 0);
            console.log(val != '0');
            */
            //console.log(cb);
            //console.log(wl);
            //console.log(((respType=='SMS') && (alertObjectTarget.match(/^[0-9]+$/) == null)));
            //console.log((alertObjectTarget.match(/^[0-9]+$/) == null));

            this.setError('isVisibleError',false);
            this.setError('emptyBoldError',false);
            this.setError('noActChError',false);
            this.setError('nonNumericValueError',false);
            this.setError('wLError',false);
            this.setError('wLNegError',false);
            this.setError('targetError',false);
            this.setError('phoneNumError', false);
            this.setError('authError', false);


            //If bolded values arn't entered
            if ((val.length == 0) || (cb.length == 0) || (wl.length == 0)) {
                this.setError('isVisibleError',true);
                this.setError('emptyBoldError',true);
                //_this.set('saveMessage', "Please ensure you've enterred all bolded fields");


            //If no channels are selected
            } else if ((sel == -1) && (this.get('attrs.alert.value.metric') != 'TIME')) {
                this.setError('isVisibleError',true);
                this.setError('noActChError',true);
                //_this.set('saveMessage', "Please ensure you've selected at least one active channel");

            //If the value is a non numeric
            }else if (isNaN(alertObjectValue)){
                this.setError('isVisibleError',true);
                this.setError('nonNumericValueError',true);
                //_this.set('saveMessage', "Please enter a valid numeric for the value");

            //If a negative or 0 is entered for window length
            } else if ((this.get('attrs.alert.value.method') != 'IMM') && (wl <= 1) && (this.get('attrs.alert.value.windowType') != 'LT')) {
                this.setError('isVisibleError',true);
                this.setError('wLError',true);
                //_this.set('saveMessage', "Please enter a window length larger than 1 if method is not immediate");

            } else if (wl < 1) {
                this.setError('isVisibleError',true);
                this.setError('wLNegError',true);
                //_this.set('saveMessage', "Please enter a window length of greater than or equal to 1");
                
            } else if (respType=='TRIG') {
                document.getElementById("alertObjectTarget").value = "";
                //_this.set('saveMessage', "Alert via Alarm will be available in future update");

            } else if (noTarget) {
                this.setError('isVisibleError',true);
                this.setError('targetError',true);
                //_this.set('saveMessage', "Please enter a target " + addType);

            } else if (!(alertObjectTarget.includes("@")) && (respType=='SMS')) {
                this.setError('isVisibleError',true);
                this.setError('phoneNumError',true);
                //_this.set('saveMessage', "Please ensure you've added a carrier to the phone number");


            //If target is correctly filled and the above condition did not happen
            } else if (!noTarget){

                let big = !this.get("activeExpanded");
                //console.log(big)

                tr.save()
                    .then(function(value){
                        _this.broken=false
                        _this.set('saveMessage', "SAVED");
                        _this.get('saved')();
                    })
                    .catch(function(reason) {

                        if (reason.errors[0].status == 403) {
                            _this.setError('isVisibleError',true);
                            _this.setError('authError',true);
                        } else {
                            // console.log(reason);
                            _this.set('saveMessage', "SAVED");
                            _this.get('saved')(); 
                        }
                    });
            }
            
        },
        staticChanged() {
            let tr = this.get('alert');
            tr.isPerm = document.getElementById('alertStaticDynamic').checked;
            this.set('alert',tr);
        },
        activeChanged() {
            let tr = this.get('alert');
            tr.isActive = document.getElementById('alertEnabled').checked;
            this.set('alert',tr);
        },
        repeatChanged() {
            let tr = this.get('alert');
            tr.repeats = document.getElementById('alertRepeat').checked;
            this.set('alert',tr);
        },
        invertChanged() {
            let tr = this.get('alert');
            tr.inverted = document.getElementById('alertInvert').checked;
            this.set('alert',tr);
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

        triggerTest() {
            let tr = this.get('alert');
            tr.isTriggered = true;

            let theDate = new Date();

            let dateString = theDate.getFullYear() + "-" + (theDate.getMonth()+1) + "-" + theDate.getDate() + " " + theDate.getHours() + ":" + theDate.getMinutes() + ":" + theDate.getSeconds();

            //console.log(dateString);
            tr.initTriggerStamp = dateString;
            this.set('initTriggerStamp', dateString);
            this.set('alert',tr);
            tr.save();
        },
        clearAlert() {
            let tr = this.get('alert');
            tr.isTriggered = false;
            tr.isHandled = false;
            tr.initTriggerStamp = null;
            tr.handleStamp = null;
            this.set('alert',tr);
            tr.save();
        },
        resetHandle() {
            let tr = this.get('alert');
            tr.isHandled = false;
            tr.handleStamp = null;
            this.set('alert',tr);
            tr.save();
        }
    }
});
