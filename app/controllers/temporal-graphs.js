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
    borehole: null,
    project: null,
    modelName: '',
    activeInstrumentMeta: null,
    temporalGraphController: Ember.inject.controller("temporal-graphs/temporal-graph"),
    eventType: null,
    blastType: null,
    vibeId: null,
    seismicType: null,
    chartDataValueName: null,
    frequency: null,
    chartData: null,
    tiltMode: null,
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
    test: null,
    zeroed: true,
    linearChecked: '',
    calibChecked: 'Checked',
    depthChecked: '',

    rawChecked: Ember.computed('linearChecked', 'calibChecked', 'depthChecked', function() {
        if (this.get('linearChecked') == '' && this.get('calibChecked') == '' && this.get('depthChecked') == '')
            return 'Checked'
        else
            return ''
    }),

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
                        label: "Temporal " + chart + " Graph",
                        path: "temporal-graphs.temporal-graph",
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
        var domain = chart.y1Axis.scale().domain();
        this.set('y_min',toFixed(domain[0],2));
        this.set('y_max',toFixed(domain[1],2));
        this.set('y_min_old',null);
        this.set('y_max_old',null);
        var domain = chart.y2Axis.scale().domain();
        this.set('y_min_2',toFixed(domain[0],2));
        this.set('y_max_2',toFixed(domain[1],2));
        this.set('y_min_old_2',null);
        this.set('y_max_old_2',null);
        this.send('disableTemp');
        this.set('auto_scale',true);
        this.set('auto_scale_2',true);
    }),

    valueChanged: Ember.observer('y_min','y_max', function() {
        var chart = this.get('chart');
        if (!this.auto_scale) {
            chart.yDomain1([this.get('y_min'),this.get('y_max')]);
        }
        chart.update();
    }),

    autoScaleChanged: Ember.observer('auto_scale', function() {
        var chart = this.get('chart');
        if (this.auto_scale) {
            this.set('y_min_old', this.y_min);
            this.set('y_max_old', this.y_max);

            chart.yDomain1(null,null);
            chart.update();

            var domain = chart.y1Axis.scale().domain();
            this.set('y_min',toFixed(domain[0],2));
            this.set('y_max',toFixed(domain[1],2));
                //chart.yScale = this.get('test');
        } else {
            if (this.get('y_min_old') !== null) {
                this.set('y_min', this.y_min_old);
                this.set('y_max',this.y_max_old);    
            }
            chart.yDomain1([this.get('y_min'),this.get('y_max')]);
            chart.update();
        }
    }),

    valueChanged2: Ember.observer('y_min_2','y_max_2', function() {
        var chart = this.get('chart');
        if (!this.auto_scale_2) {
            chart.yDomain2([this.get('y_min_2'),this.get('y_max_2')]);
            chart.update();
        }
    }),

    autoScaleChanged2: Ember.observer('auto_scale_2', function() {
        var chart = this.get('chart');
        if (this.auto_scale_2) {
            this.set('y_min_old_2', this.y_min_2);
            this.set('y_max_old_2', this.y_max_2);

            chart.yDomain2(null,null);
            chart.update();

            var domain = chart.y2Axis.scale().domain();
            this.set('y_min_2',toFixed(domain[0],2));
            this.set('y_max_2',toFixed(domain[1],2));
        } else {
            if (this.get('y_min_old_2') !== null) {
                this.set('y_min_2', this.y_min_old_2);
                this.set('y_max_2', this.y_max_old_2);    
            }
            chart.yDomain2([this.get('y_min_2'),this.get('y_max_2')]);
            chart.update();
        }
    }),

    isVelocityGraph: Ember.computed('modelName', function() {
        if (this.modelName === 'velocity-values' || this.modelName === 'acceleration-values')
            return true;
        return false;
    }),

    bluVibeEvent: Ember.computed('eventType', function() {
        //console.log(this.eventType);
        if(this.eventType === null || this.eventType === 'bluvibe') {
            return true;
        }
        return false;
    }),

    window_value: Ember.computed('window', function() {
        if (this.window === '60') {
            return '1 Hour';
        }
        if (this.window === '480') {
            return '8 Hours';
        }
        if (this.window === '1440') {
            return '24 Hours';
        }
    }),

    typeSelect: Ember.computed('instrumentType', function() {
        //console.log(this.instrumentType);
        switch(this.instrumentType) {
            case 'dExto':
                return 'pack';
                break;
            default:
                return 'pack';
        }
        if (this.instrumentType === 'Thermostring') {
            return true;
        }
        return false;
    }),
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
                detailString = detailString.substr(0,detailString.length - 3);
            }
        }
        return detailString;
    }),

    //--------------------------------------
    displacementIsValid: Ember.computed('instrumentType', function() {
        //console.log(this.get('instrumentType'));
        if (this.instrumentType==='BluVibe') {
            return false;
        }
        return true;
    }),
    axialDisplacementIsValid: Ember.computed('instrumentType', function() {
        //console.log(this.instrumentType);
        return this.instrumentType === 'dRebar';
    }),
    velocityIsValid: Ember.computed('chartData', function() {
        if (this.chartData !== null) {
            if (this.chartData.temporalVelocityName !== null) {
                return true;
            }
        }
        return false;
    }),
    accelerationIsValid: Ember.computed('chartData', function() {
        if (this.chartData !== null) {
            if (this.chartData.temporalAccelerationName !== null) {
                return true;
            }
        }
        return false;
    }),
    strainIsValid: Ember.computed('chartData', function() {
        if (this.chartData !== null) {
            if (this.chartData.temporalStrainName !== null) {
                return true;
            }
        }
        return false;
    }),
    strainRateIsValid: Ember.computed('chartData', function() {
        if (this.chartData !== null) {
            if (this.chartData.temporalStrainRateName !== null) {
                return true;
            }
        }
        return false;
    }),
    axialIsValid:  Ember.computed('instrumentType', function() {
        if(this.instrumentType === 'dRebar') {
            return true;
        }
        return false;

    }),
    bendingIsValid: Ember.computed('instrumentType', function() {
        if(this.instrumentType === 'dRebar') {
            return true;
        }
        return false;

    }),
    loadIsValid: Ember.computed('chartData', function() {
        if (this.chartData !== null) {
            if (this.chartData.temporalLoadName !== null) {
                return true;
            }
        }
        return false;
    }),
    temperatureIsValid: Ember.computed('instrumentType', function() {
        if(this.instrumentType === 'Thermostring' || this.instrumentType === 'BluVibe') {
            return false;
        }
        return true;
    }),
    bluVibe: Ember.computed('instrumentType', function() {
        if(this.instrumentType === 'BluVibe') {
            return true;
        }
        return false;
    }),
    //--------------------------------------

    instrumentAnchorsSorted: Ember.computed.sort('instrumentAnchors', 'instrumentAnchorsSorting'),
    refHeadPosition: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['ref-head-position'];
    }),
    linearData: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['linear'];
    }),
    calibData: Ember.computed('activeInstrumentMeta', function () {
        return this.get('activeInstrumentMeta')['calib'];
    }),
    depthData: Ember.computed('displacementValuesMeta', function() {
        let depth = this.get('displacementValuesMeta')['depth'];
        return depth;
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
    vibes: Ember.computed.map('model.vibes', function(vibe) {
        return {
            title: vibe.get('id'),
            value: vibe.get('id')
        };
    }),
    vibeSelection: Ember.computed('vibeId', 'vibes', function() {
        var id = this.get('vibeId');
        return this.get('vibes').findBy('id', id);
    }),
    // needed for filtered select list to be able to set active instrument on page reload
    initialInstrumentSelection: Ember.computed('instruments', 'instrumentId', function () {

        var id = this.get('instrumentId');
        
        if(id !== null) {
            writeCookie('instrumentId', id, 0.02);
        }

        return this.get('instruments').findBy('title', this.get('instrumentId'));
    }),
    actions: {
        setDepth(value) {
            this.set('depthChecked', value == true ? 'Checked' : '');
        },
        setLinear(value) {
            this.set('linearChecked', value == true ? 'Checked' : '');
        },
        setCalib(value) {
            this.set('calibChecked', value == true ? 'Checked' : '');
        },
        updateNav(licence) {
            // this.get('temporalGraphController').send('setController', this);
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
        toggleDataType(property) {
            this.get('temporalGraphController').send('toggleDataType', property);
        },
        toggleProperty(property) {
            this.get('temporalGraphController').send('toggleProperty', property);
        },
        toggleLocalProperty(property) {
            let propValue = false;
            if ( this.get(property) === null ) {
                propValue = true;
            } else if(this.get(property) === false ) {
                propValue = true; 
            }
            this.set(property, propValue);
        },
        updateLocalProperty(propertyName, propertyValue) {
            this.set(propertyName, propertyValue);
        },
        onUpdateTransitionTo(selection) {
            if (this.get('modelName') === null) {
                this.set('modelName', 'displacement-values');
            }
            this.transitionToRoute('temporal-graphs.temporal-graph', selection.value, this.get('modelName'));
        },
        onUpdateTransitionToVibe(selection) {
            //console.log(this.get('queryParams'));
            this.get('temporalGraphController').send('udpateVibe', selection.value);
        },
        setChart(chart) {
            this.set('chart',chart);
        },
        setData(data) {
            this.set('chartDataPoints', data);
        },
        disableTemp() {
            let chart = this.get('chart');
            let points = this.get('chartDataPoints');
            if (chart !== null) {
                points.forEach(function(element) {
                    if (element.yAxis === 2) {
                        element.disabled = true;
                        element.userDisabled = true;
                        //chart.update();
                    }
                });
            }
        },
        saveImage() {
            console.log("SAVE SCREEN");
            html2canvas(document.querySelector("#capture"), { allowTaint: true, foreignObjectRendering: true,
                onrendered: function (canvas) {
                    let downloadLink = document.createElement('a');
                    downloadLink.setAttribute('download', 'CanvasAsImage.png');
                    canvas.toBlob(function(blob) {
                        let url = URL.createObjectURL(blob);
                        downloadLink.setAttribute('href', url);
                        downloadLink.click();
                      });
                }
            });
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

        if(id === null) {
            id = readCookie('instrumentId');
            if(id !== "") {
                Ember.run.scheduleOnce('afterRender', this, function() {
                    //console.log("running re-load");
                    this.transitionToRoute('temporal-graphs.temporal-graph', id, this.get('modelName'));
                    });
            }
        } else {
            writeCookie('instrumentId', id, 1);
        }
    }
});

function toFixed(value, numDecimals) {
    var roundVal = Math.pow(10, numDecimals);
    var answer = 0;
    if (value > 0) {
        answer = Math.ceil(value * roundVal) / roundVal;
    } else {
        answer = Math.floor(value * roundVal) / roundVal;
    }
    return answer;
}

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
