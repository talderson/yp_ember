import Ember from 'ember';

export default Ember.Controller.extend({
    _my_init: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            //this.send('updateNav',this.get('model').licence.content[0]._data);
        });
    }.on('init'),
    instrumentId: null,
    instrumentType: null,
    instrumentTypeId: null,
    name: null,
    location: null,
    level: null,
    project: null,
    borehole: null,
    modelName: '',
    activeInstrumentMeta: null,
    spatialGraphController: Ember.inject.controller("spatial-graphs/spatial-graph"),
    eventType: null,
    blastType: null,
    seismicType: null,
    chartDataValueName: null,
    chartData: null,
    instrumentAnchors: {},
    instrumentAnchorsSorting: ['number'],
    breadCrumbs: Ember.computed("instrumentId", {
        get() {
            let chart = this.get('chartDataValueName');
            let mName = this.get('modelName');
            let instID = this.get('instrumentId');
            let instrument = this.get('content').instrument;
            
            let obj = null

            if (instrument != null && instID == null) {
                obj = [
                    {
                        label: "Dashboard",
                        path: 'index'
                    },
                    {
                        label: "Instruments",
                        path: 'instruments'
                    },
                    {
                        label: instrument.query,
                        path: 'edit-instrument',
                        model: instrument.query,
                    }
                ]
            }

            if (instID != null) {
                obj = [
                    {
                        label: "Dashboard",
                        path: 'index'
                    },
                    {
                        label: "Instruments",
                        path: 'instruments'
                    },
                    {
                        label: instID,
                        path: 'edit-instrument',
                        model: instID,
                    },
                    {
                        label: "Spatial " + chart + " Graph",
                        path: "spatial-graphs.spatial-graph",
                        model: instID,
                        model: mName
                    },
                ];
            }
            return obj;
        }
    }),
    isThermo: Ember.computed('instrumentType', function() {
        //console.log(this.instrumentType);
        if (this.instrumentType === 'Thermostring') {
            return true;
        }
        return false;
    }),
    
    displayData: Ember.computed('instrumentId', function() {
        if (this.instrumentId !== null) {
            return true;
        } else {
            return false;
        }
    }),

    details: Ember.computed('name', 'project', 'location', 'level', 'borehole', 'instrumentId', function() {
        var detailString = "";
        if (this.instrumentId !== null) {
            if (this.project !== null && this.project !== "") {
                detailString += this.project + ' / '; }
            if (this.location !== null && this.location !== "") {
                detailString += this.location + ' / '; }
            if (this.level !== null && this.level !== "") {
                detailString += this.level + ' / '; }
            if (this.borehole !== null && this.borehole !== "") {
                detailString += this.borehole + ' / ';}
            if (detailString !== "") {
                detailString = detailString.substr(0,detailString.length - 3);
            }
        }
        return detailString;
    }),

    // displacementIsValid: Ember.computed('chartData', function() {
    //     if (this.chartData !== null) {
    //         if (this.chartData._data.spatialDisplacementName !== null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }),
    // velocityIsValid: Ember.computed('chartData', function() {
    //     if (this.chartData !== null) {
    //         if (this.chartData._data.spatialVelocityName !== null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }),
    // accelerationIsValid: Ember.computed('chartData', function() {
    //     if (this.chartData !== null) {
    //         if (this.chartData._data.spatialAccelerationName !== null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }),
    // strainIsValid: Ember.computed('chartData', function() {
    //     if (this.chartData !== null) {
    //         if (this.chartData._data.spatialStrainName !== null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }),
    // strainRateIsValid: Ember.computed('chartData', function() {
    //     if (this.chartData !== null) {
    //         if (this.chartData._data.spatialStrainRateName !== null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }),
    // axialIsValid:  Ember.computed('instrumentType', function() {
    //     if(this.instrumentType==='dRebar') {
    //         return true;
    //     }
    //     return false;

    // }),
    // bendingIsValid: Ember.computed('instrumentType', function() {
    //     if(this.instrumentType==='dRebar') {
    //         return true;
    //     }
    //     return false;

    // }),
    // loadIsValid: Ember.computed('chartData', function() {
    //     if (this.chartData !== null) {
    //         if (this.chartData._data.spatialLoadName !== null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }),   //--------------------------------------

    instrumentAnchorsSorted: Ember.computed.sort('instrumentAnchors', 'instrumentAnchorsSorting'),
    allInstruments: Ember.computed.filter('model.instruments', function(instrument) {
        if (instrument.get('anchorCount') > 0) {
            return true;
        }
    }),
    refHeadPosition: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['ref-head-position'];
    }),
    timeRef: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['zeroed'];
    }),
    flipSigns: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['flip-signs'];
    }),
    instruments: Ember.computed.map('allInstruments', function(instrument) {
        return {
            title: instrument.get('id'),
            value: instrument.get('id')
        };
    }),
    frequencySelect: '10',
    groupTime: false,
    groupWindow: true,
    // needed for filtered select list to be able to set active instrument on page reload
    initialInstrumentSelection: Ember.computed('instruments', 'instrumentId', function () {

        var id = this.get('instrumentId');
        
        if(id !== null) {
            writeCookie('instrumentId', id, 0.02);
        }
        
        return this.get('instruments').findBy('title', this.get('instrumentId'));
    }),
    actions: {
        updateNav(licence) {
            let modules = licence.modules;
            if(licence.isValid) {
                if(licence.withinLimit) {
                    if(!modules.temporal) {
                        document.getElementById("temp-link").style.display = "none";
                    } else {
                        document.getElementById("temp-link").style.display = "block";
                    }
                    if(!modules.spatial) {
                        document.getElementById("licence-error-module").style.display = "block";
                        document.getElementById("spat-link").style.display = "none";
                    } else {
                        document.getElementById("spat-link").style.display = "block";
                    }
                    if(!modules.frequency) {
                        document.getElementById("freq-link").style.display = "none";
                    } else {
                        document.getElementById("freq-link").style.display = "block";
                    }    
                    if(!modules.alerts) {
                        document.getElementById("alert-link").style.display = "none";
                    } else {
                        document.getElementById("alert-link").style.display = "block";
                    }
                    document.getElementById("licence-error-instruments").style.display = "none";
                } else {
                    document.getElementById("licence-error-instruments").style.display = "block";
                }
                document.getElementById("licence-error-expired").style.display = "none";
            } else {
                document.getElementById("licence-error-expired").style.display = "block";
            }
        },
        updateProperties(propertyNames = [], propertyValues = []) {
            const _this = this;
            if (propertyNames.length > 0 && propertyValues.length > 0 && propertyNames.length === propertyValues.length) {
                propertyNames.forEach( function(propertyName, i) {
                    _this.set(propertyName, propertyValues[i]);
                });
            }
        },
        toggleProperty(property) {
            this.get('spatialGraphController').send('toggleProperty', property);
        },
        updateActivefrequency(query) {
            if (query.frequency) {
                this.set('frequencySelect', query.frequency.capitalize());
            } else if (query.frequency_num) {
                this.set('frequencySelect', query.frequency_num);
            } else if (query.events_only) {
                this.set('frequencySelect', 'Events only');
            }
        },
        updateGroupMode(query) {
            if (query.group_window==='true') {
                var freq = this.get('frequencySelect');
                this.set('groupWindow', true);
                this.set('groupTime', false);
            } else if (query.group_time==='true') {
                var freq = this.get('frequencySelect');
                this.set('groupWindow', false);
                this.set('groupTime', true);
            } else {
                this.set('groupTime', false);
                this.set('groupWindow', true);
                //this.set('frequencySelect', 10);
            }
        },
        onUpdateTransitionTo(selection) {
            if (this.get('modelName') === null) {
                this.set('modelName', 'displacement-values');
            }
/*             console.log("inst type: ");
            console.log(this.instrumentType);
 */            let typeID = selection.value.substr(selection.value.length === 9 ? 5 : 6, 1);
            let modelName = this.get('modelName');
            let isRebarGraph = (modelName === 'axial-strain-values' || modelName === 'bending-strain-values' || modelName === 'axial-displacement-values');
            if (typeID === "3") { //isrebar
                if (!isRebarGraph && modelName !== 'load-values') {
                    this.set('modelName', 'axial-displacement-values');
                }
            } else {
                if (isRebarGraph) {
                    this.set('modelName', 'displacement-values');
                }
            }
            this.transitionToRoute('spatial-graphs.spatial-graph', selection.value, this.get('modelName'));
        }
    },
    setChart(chart) {
        this.set('chart',chart);
    },
    setData(data) {
        this.set('chartDataPoints', data);
    },
    activate: function() {
        //static var blah = "";
        var id = this.get('instrumentId');
        var inst = null;

        //console.log(blah);

        //console.log("before cookies: " + id);
        if(id === null) {
            id = readCookie('instrumentId');
            //inst = this.get('instruments').findBy('title', id);
            //window.location.href = "/spatial-graph/" + id + "/displacement-values";

            //console.log("after cookies: " + id);
            if(id !== "") {
                Ember.run.scheduleOnce('afterRender', this, function() {
                    //console.log("running re-load");
                    this.transitionToRoute('spatial-graphs.spatial-graph', id, this.get('modelName'));
                    });        
            }

        } else {
            writeCookie('instrumentId', id, 1);
        }
    }
});

function writeCookie(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)===' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}
