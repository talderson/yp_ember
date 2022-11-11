import Ember from 'ember';

export default Ember.Controller.extend({
    _my_init: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            //this.send('updateNav',this.get('model').licence.content[0]._data);
        });
    }.on('init'),
    instrumentId: null,
    instrumentType: null,
    name: null,
    location: null,
    level: null,
    borehole: null,
    project: null,
    modelName: 'frequency-ppa',
    activeInstrumentMeta: null,
    frequencyGraphController: Ember.inject.controller("frequency-graphs/frequency-graph"),
    //eventType: null,
    //blastType: null,
    //seismicType: null,
    chartDataValueName: null,
    frequency: null,
    chartData: null,
    chart: null,
    chartDataPoints: null,
    adjust_scales: false,
    auto_scale: true,
    y_min: null,
    y_max: null,
    y_min_old: null,
    y_max_old: null,
    y_min_auto: null,
    y_max_auto: null,
    auto_scale_2: true,
    y_min_2: null,
    y_max_2: null,
    y_min_old_2: null,
    y_max_old_2: null,
    y_min_auto_2: null,
    y_max_auto_2: null,
    lastClick: null,
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
                        label: "Frequency " + chart + " Graph",
                        path: "frequency-graphs.frequency-graph",
                        model: instID,
                        model: mName
                    },
                ];
            }
            return obj;
        }
    }),


    chartChanged: Ember.observer('chart', function() {
        var chart = this.get('chart');
        var domain = chart.yAxis.scale().domain();
        this.set('y_min_auto',domain[0].toFixed(2));
        this.set('y_max_auto',domain[1].toFixed(2));
        this.set('y_min',domain[0].toFixed(2));
        this.set('y_max',domain[1].toFixed(2));
        this.set('y_min_old',null);
        this.set('y_max_old',null);
/*         var domain = chart.y2Axis.scale().domain();
        this.set('y_min_auto_2',domain[0].toFixed(1));
        this.set('y_max_auto_2',domain[1].toFixed(1));
        this.set('y_min_2',domain[0].toFixed(1));
        this.set('y_max_2',domain[1].toFixed(1));
        this.set('y_min_old_2',null);
        this.set('y_max_old_2',null);
 */    }),

    valueChanged: Ember.observer('y_min','y_max', function() {
        var chart = this.get('chart');
        //var points = this.get('chartDataPoints');
        //console.log("custom axis");
        chart.yDomain([this.get('y_min'),this.get('y_max')]);
        //chart.yScale(10);
        chart.update();
    }),

    autoScaleChanged: Ember.observer('auto_scale', function() {
        if (this.auto_scale) {
            this.set('y_min_old', this.y_min);
            this.set('y_max_old', this.y_max);
            this.set('y_min',this.get('y_min_auto'));
            this.set('y_max',this.get('y_max_auto'));
        } else {
            if (this.get('y_min_old') != null) {
                this.set('y_min', this.y_min_old);
                this.set('y_max',this.y_max_old);    
            }
        }
    }),

/*     valueChanged2: Ember.observer('y_min_2','y_max_2', function() {
        var chart = this.get('chart');
        //var points = this.get('chartDataPoints');
        //console.log("custom axis");
        chart.yDomain2([this.get('y_min_2'),this.get('y_max_2')]);
        //chart.yScale(10);
        chart.update();
    }),

    autoScaleChanged2: Ember.observer('auto_scale_2', function() {
        if (this.auto_scale_2) {
            this.set('y_min_old_2', this.y_min_2);
            this.set('y_max_old_2', this.y_max_2);
            this.set('y_min_2',this.get('y_min_auto_2'));
            this.set('y_max_2',this.get('y_max_auto_2'));
        } else {
            if (this.get('y_min_old_2') != null) {
                this.set('y_min_2', this.y_min_old_2);
                this.set('y_max_2',this.y_max_old_2);    
            }
        }
    }),
 */
    isThermo: Ember.computed('instrumentType', function() {
        //console.log(this.instrumentType);
        if (this.instrumentType === 'Thermostring') {
            return true;
        }
        return false;
    }),
    isWire: Ember.computed('instrumentType', function() {
        //console.log(this.instrumentType);
        return (this.instrumentType === 'Wire');
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
                detailString += this.borehole + ' / '; }
            if (detailString !== "") {
                detailString = detailString.substr(0,detailString.length - 3); }
        }
        return detailString;
    }),

    //--------------------------------------
/*     velocityIsValid: Ember.computed('chartData', function() {
        if (this.chartData != null) {
            if (this.chartData._data.frequencyVelocityName != null) {
                return true;
            }
        }
        return false;
    }),
 */
    bluVibe: Ember.computed('instrumentType', function() {
        if(this.instrumentType==='BluVibe') {
            return true;
        }
        return false;
    }),
    //--------------------------------------

    instrumentAnchorsSorted: Ember.computed.sort('instrumentAnchors', 'instrumentAnchorsSorting'),
    refHeadPosition: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['ref-head-position'];
    }),
    rawData: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['raw'];
    }),
    timeRef: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['zeroed'];
    }),
    flipSigns: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['flip-signs'];
    }),
    allInstruments: Ember.computed.filter('model.instruments', function(instrument) {
        //return true;
        if (instrument.get('anchorCount') > 0) {
            return true;
        }
    }),
    instruments: Ember.computed.map('allInstruments', function(instrument) {
        return {
            title: instrument.get('id'),
            value: instrument.get('id')
        };
    }),
    // needed for filtered select list to be able to set active instrument on page reload
    initialInstrumentSelection: Ember.computed('instruments', 'instrumentId', function () {

        var id = this.get('instrumentId');
        
        if(id != null) {
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
                        document.getElementById("licence-error-module").style.display = "block";
                    } else {
                        document.getElementById("temp-link").style.display = "block";
                    }
                    if(!modules.spatial) {
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
            this.get('frequencyGraphController').send('toggleProperty', property);
        },
        toggleLocalProperty(property) {
            if ( this.get(property) === null ) {
                this.set(property, true);
            } else if(this.get(property) === false ) {
                this.set(property, true);
            } else {
                this.set(property, null);
            }
        },
        onUpdateTransitionTo(selection) {
            //console.log("selection: " + selection.value)
            if (this.get('modelName') == null) {
                this.set('modelName', 'displacement-values');
            }
            this.transitionToRoute('frequency-graphs.frequency-graph', selection.value, this.get('modelName'));
        },
        setChart(chart) {
            this.set('chart',chart);
        },
        setData(data) {
            this.set('chartDataPoints', data);
        },
        selectTemps() {
            let lastClick = this.get('lastClick');
            if (lastClick === null || lastClick !== "temp") {
                let chart = this.get('chart');
                let points = this.get('chartDataPoints');
                if (chart !== null) {
                    for (let ctr = 0; ctr < points.length - 2; ctr++) {
                        if (ctr % 2 === 0) {
                            if (!points[ctr + 1].disabled) {
                                points[ctr].disabled = false;
                                points[ctr].userDisabled = false;
                            }
                        } else {
                            points[ctr].disabled = true;
                            points[ctr].userDisabled = true;
                        }
                    }
                    chart.update();
                }
                this.set('lastClick', 'temp');
            }
        },
        selectReadings() {
            let lastClick = this.get('lastClick');
            if (lastClick === null || lastClick !== "vals") {
                let chart = this.get('chart');
                let points = this.get('chartDataPoints');
                if (chart !== null) {
                    for (let ctr = points.length - 2; ctr >= 0; ctr--) {
                        if (ctr % 2 === 0) {
                            points[ctr].disabled = true;
                            points[ctr].userDisabled = true;
                        } else {
                            if (!points[ctr - 1].disabled) {
                                points[ctr].disabled = false;
                                points[ctr].userDisabled = false;
                            }
                        }
                    }
                    chart.update();
                }
                this.set('lastClick', 'vals');
            }
        }
    },
    activate: function() {
        var id = this.get('instrumentId');
        var inst = null;

        if(id == null) {
            id = readCookie('instrumentId');
            if(id !== "") {
                Ember.run.scheduleOnce('afterRender', this, function() {
                    //console.log("running re-load");
                    this.transitionToRoute('frequency-graphs.frequency-graph', id, this.get('modelName'));
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
