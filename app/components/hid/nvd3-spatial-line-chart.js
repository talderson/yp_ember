import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    chartId: 'spatial-chart',
    startTimestamp: null,
    endTimestamp: null,
    progressAnimationDuration: 100, //set 50, was 700
    isDistXTooltip: true,
    distXRiseUpAnimationDuration: 50, //set 25, was 500

    seismicEventsChartDistXData: Ember.computed('seismicEvents', function() {
        if ( this.get('seismicEvents') ) {
            return [{
                key: 'Seismic',
                type: 'distX',
                color: '#429CBA',
                values: this.get('seismicEvents').map(function(event) {
                    return [
                        moment( event.get('timestamp') ).valueOf(),
                        event.get('size') ? (event.get('size') * -15) + 15 : 15
                    ];
                })
            }];
        }
        return false;
    }),

    blastEventsChartDistXData: Ember.computed('blastEvents', function() {
        if ( this.get('blastEvents') ) {
            return [{
                key: 'Blast',
                type: 'distX',
                color: '#D14240',
                values: this.get('blastEvents').map(function(event) {
                    return [
                        moment( event.get('timestamp') ).valueOf(),
                        event.get('size') ? (event.get('size') * -15) + 15 : 15
                    ];
                })
            }];
        }
        return false;
    }),

    seismicEventsArray: Ember.computed('seismicEvents', function() {
        if ( this.get('seismicEvents') ) {
            return this.get('seismicEvents').map(function(event) {
                return {
                    type: 'Seismic',
                    timestamp: moment( event.get('timestamp') ).format("DD MMM, YYYY HH:mm:ss"),
                    // timestamp: moment( event.get('timestamp') ).valueOf(),
                    eventSize: event.get('size') ? (event.get('size') * -15) + 15 : 15,
                    momentMagnitude: event.get('momentMagnitude')
                };
            }).sortBy('timestamp');
        }
        return false;
    }),

    blastEventsArray: Ember.computed('blastEvents', function() {
        if ( this.get('blastEvents') ) {
            return this.get('blastEvents').map(function(event) {
                return {
                    type: 'Blast',
                    timestamp: moment( event.get('timestamp') ).format("DD MMM, YYYY HH:mm:ss"),
                    eventSize: event.get('size') ? (event.get('size') * -15) + 15 : 15,
                    tonnes: event.get('tonnes')
                };
            }).sortBy('timestamp');
        }
        return false;
    }),

    //TODO: Try/Catch is a temporary fix, if there isn't enough data, or its not valid, Frequency dropdown will act strangely
    zoomDataPoints: Ember.computed.map('zoomChartData', function(item){
        try {
            let linesKyes = Object.keys(item.toJSON());
            var chartData = item.getProperties(linesKyes);

            var modelName = this.get('chartDataModelName');

            if (modelName === 'strain-values' || modelName === 'load-values') { 
                var plated = this.get('instrument').get('plated');
                var type = this.get('instrument').get('instrumentType').get('title');
                //console.log(type);
                
                if (type === 'dCable') {
                    chartData.values.splice(0,1);
                    chartData.values.unshift(0);
                    if(plated) {
                        chartData.values.push(chartData.values[chartData.values.length - 1]);
                    } else {
                        chartData.values.push(0);
                    }
                } else if (type === 'dExto') {
                    chartData.values.unshift(chartData.values[0]);
                }
            }
                        
            return chartData;
        } catch (error) {
            return [];
        }
    }),

    //TODO: Try/Catch is a temporary fix, if there isn't enough data, or its not valid, Frequency dropdown will act strangely
    fullRangeDataPoints: Ember.computed.map('fullRangeChartData', function(item){
        try {
            let linesKyes = Object.keys(item.toJSON());
            return item.getProperties(linesKyes);            
        } catch (error) {
            return [];
        }
    }),

    zoomTimePoints: Ember.computed.map('zoomChartData', function(item){
        return item.get('id');
    }),

    fullRangeTimePoints: Ember.computed.map('fullRangeChartData', function(item){
        return item.get('id');
    }),

    anchorDistances: Ember.computed('instrument', 'zoomChartData', function() {
        let dataValuesCount = this.get('zoomChartData').get('firstObject').toJSON().values.length,
            anchors = this.get('instrument').get('anchors')
        ;
        let anchorDistances = anchors.map(function(anchor){
            return anchor.get('distance');
        });


/*         if (this.get('instrument').get('instrumentType').get('title') == 'dRebar') {
            for(let ctr = 1; ctr < anchorDistances.length / 2; ctr++) {
                anchorDistances[ctr] = (ctr) + '-' + anchorDistances[ctr];
            }

            for(let ctr = 4; ctr < anchorDistances.length; ctr++) {
                anchorDistances[ctr] = (ctr) + '-' + anchorDistances[ctr];
            }
        }
 */
        var modelName = this.get('chartDataModelName');
        //if (this.get('instrument').get('instrumentType').get('title') != 'dRebar') {
            if (anchorDistances.length > dataValuesCount && (modelName === 'strain-values' || modelName === 'load-values')) {
                anchorDistances.splice(0, 1);
            }
        //}

        if (modelName === 'axial-displacement-values') {
            if (this.get('instrument').get('stacked')) {
                let half_anchors = (anchorDistances.length / 2) + 1;
                let gauge = this.get('instrument').get('gaugeLength');
                while (anchorDistances.length > half_anchors) {
                    anchorDistances.pop();
                }
                anchorDistances[0] = anchorDistances[1] - gauge;
            } else {
                let last = anchorDistances[anchorDistances.length-1];
                anchorDistances.sort(function(a,b){return a-b;});
                let gauge = this.get('instrument').get('gaugeLength');
                //console.log('gauge: ' + gauge);
                anchorDistances.forEach(function(item, index) {
                    anchorDistances[index] = item - gauge;
                    //console.log(item);
                });
                //anchorDistances.push(this.get('instrument').get('instrumentLength') * 1000);
                anchorDistances.shift();
                anchorDistances.push(last);
            }
        }




        return anchorDistances;
    }),

    anchorAXDistances: Ember.computed('instrument', 'zoomChartData', function() {
        let dataValuesCount = this.get('zoomChartData').get('firstObject').toJSON().values.length,
            anchors = this.get('instrument').get('anchors')
        ;
        let anchorDistances = anchors.map(function(anchor){
            return anchor.get('distance');
        });

        var modelName = this.get('chartDataModelName');

        let midPoints = [];

        if(this.get('instrument').get('stacked')) {
            let headExclusion = this.get('instrument').get('headExclusionLength');
            let leftAnchors = [headExclusion];
            
            let center = anchorDistances.length - 1;
            center = Math.ceil(center / 2);

            leftAnchors = leftAnchors.concat(anchorDistances.slice(1, center + 1));

            let midLeft = [];
            for(var ctr = 0; ctr < leftAnchors.length - 1; ctr++) {
                midLeft[ctr] = (leftAnchors[ctr] + leftAnchors[ctr + 1]) / 2;
            }
            midPoints = midLeft;
        } else { //staggered
            let headExclusion = this.get('instrument').get('headExclusionLength');
            let center = anchorDistances.length - 1;
            center = Math.ceil(center / 2);
    
            midPoints = $.map(anchorDistances.slice(1, center + 1), function(v, i) {
                return [v, anchorDistances.slice(center + 1)[i]];
              });

            midPoints.unshift(headExclusion);
            let mid_temp = [];
            for(let ctr = 1;ctr < midPoints.length; ctr++) {
                mid_temp.push((midPoints[ctr - 1] + midPoints[ctr]) / 2);
            }
            midPoints = mid_temp;

            if (modelName === 'bending-strain-values') {
                midPoints.shift();
                midPoints.pop();
            }    
            
        }

        midPoints.push(this.get('instrument').get('instrumentLength') * 1000);
        
        //console.log(midPoints);
        
        return midPoints;
    }),

    anchorBXDistances: Ember.computed('instrument', 'zoomChartData', function() {
        let dataValuesCount = this.get('zoomChartData').get('firstObject').toJSON().values.length,
            anchors = this.get('instrument').get('anchors')
        ;
        let anchorDistances = anchors.map(function(anchor){
            return anchor.get('distance');
        });

        var modelName = this.get('chartDataModelName');

        let midPoints = [];

        if(this.get('instrument').get('stacked')) {
            let headExclusion = this.get('instrument').get('headExclusionLength');
            let leftAnchors = [headExclusion];
            
            let center = anchorDistances.length - 1;
            center = Math.ceil(center / 2);

            leftAnchors = leftAnchors.concat(anchorDistances.slice(1, center + 1));

            let midLeft = [];
            for(var ctr = 0; ctr < leftAnchors.length - 1; ctr++) {
                midLeft[ctr] = (leftAnchors[ctr] + leftAnchors[ctr + 1]) / 2;
            }
            midPoints = midLeft;
        } else {

        let center = anchorDistances.length - 1;
        center = Math.ceil(center / 2);

        midPoints = $.map(anchorDistances.slice(1, center + 1), function(v, i) {
            return [v, anchorDistances.slice(center + 1)[i]];
          });
            midPoints.shift();
            midPoints.pop();                  
        }

        midPoints.push(this.get('instrument').get('instrumentLength') * 1000);

        return midPoints;
    }),

    // calculate mid distances between anchors for strain values
    anchorMidDistances: Ember.computed('anchorDistances', function() {
        let anchorDistances = Ember.copy(this.get('anchorDistances')),
            dataValuesCount = this.get('zoomChartData').get('firstObject').toJSON().values.length,
            midDistances = []
        ;

        var type = this.get('instrument').get('instrumentType').get('title');

        if (this.get('instrument').get('instrumentType').get('title') === 'dRebar') {
            if (this.get('instrument').get('stacked')) {
                anchorDistances.shift(0);
                let finalSize = anchorDistances.length / 2;
                while (anchorDistances.length > finalSize) {
                    anchorDistances.pop(finalSize);
                }
                anchorDistances.unshift(this.get('instrument').get('headExclusionLength'));
            } else { //staggered

            }
        } else { //not rebar
            anchorDistances.unshift(0);
        }

        for (let i = 0; i <= anchorDistances.length - 2; i++) {
            let mid = (anchorDistances[i] + anchorDistances[i + 1]) / 2;
            midDistances.push( +mid.toFixed(2) );
        }

        if(type === 'dCable') {
            midDistances.splice(0,1);
            //midDistances.unshift(0);
            midDistances[0] = 0;
            var len = this.get('instrument').get('length');
            var length = this.get('instrument').get('instrumentLength');

            var modelName = this.get('chartDataModelName');
            if (anchorDistances.length > dataValuesCount && (modelName === 'strain-values' || modelName === 'load-values')) {    
                if(length !== null && length !== 0) {
                    midDistances.push(length);
                } else {
                    midDistances.push(anchorDistances[anchorDistances.length - 1]);
                }
            }
        }
        // console.log("Anchors: " + anchorDistances);
         //console.log("Mids: " + midDistances);

        return midDistances;
    }),

    anchorColors: d3.scale.category10().range(),

    anchorDistancesChartReferencePoints: Ember.computed('chartDataModelName', 'instrument', 'anchorDistances', 'anchorMidDistances', 'anchorAXDistances', 'anchorBXDistances', function() {
        let anchorDistances = this.get('anchorDistances');
        var modelName = this.get('chartDataModelName');
        var anchorMidDistances = this.get('anchorMidDistances');

        //console.log(this.get('instrument').get('instrumentTypeID'));

        if(this.get('instrument').get('instrumentTypeID') === 3) {//rebar 
            if(this.get('instrument').get('stacked')) { //is stacked
                if (modelName === 'axial-strain-values' || modelName === 'load-values') {
                    anchorDistances = this.get('anchorAXDistances');
                } else if (modelName === 'bending-strain-values') {
                    anchorDistances = this.get('anchorBXDistances');
                }
            } else { //is NOT stacked
                if (modelName === 'axial-strain-values' || modelName === 'load-values') {
                    anchorDistances = this.get('anchorAXDistances');
                } else if (modelName === 'bending-strain-values') {
                    anchorDistances = this.get('anchorBXDistances');
                }
            }
        }

        if (this.get('instrument').get('instrumentType').get('title') !== 'dRebar') {
            if(modelName === 'strain-values' || modelName === 'strain-rate-values' || modelName === 'load-values') {
                return anchorMidDistances.map(function(anchorDistance){
                    return {
                        key: anchorDistance,
                        type: 'referencePoints',
                        values: [
                            anchorDistance
                        ]
                    };
                });
                    
            }
        }

        return anchorDistances.map(function(anchorDistance){
            return {
                key: anchorDistance,
                type: 'referencePoints',
                values: [
                    anchorDistance
                ]
            };
        });
    }),

    inlineHoverValuesSideOffset: Ember.computed('chartDataModelName', function() {
        var modelName = this.get('chartDataModelName');

        if (modelName === 'strain-values' || modelName === 'load-values') {
            return 28;
        } else if((modelName === 'axial-strain-values' || modelName === 'bending-strain-values') && this.get('instrument').get('stacked')) {
            return 28;
        }
        return 0;
    }),

    zoomChartLinesData: Ember.computed('zoomDataPoints', 'zoomTimePoints', 'seismicEventsChartDistXData', 'blastEventsChartDistXData', function() {
        const _this = this,
            seismicEventsChartDistXData = this.get('seismicEventsChartDistXData'),
            blastEventsChartDistXData = this.get('blastEventsChartDistXData'),
            zoomDataPoints = this.get('zoomDataPoints'),
            zoomTimePoints = this.get('zoomTimePoints'),
            anchorDistances = this.get('anchorDistances'),
            anchorAXDistances = this.get('anchorAXDistances'),
            anchorBXDistances = this.get('anchorBXDistances'),
            anchorDistancesChartReferencePoints = this.get('anchorDistancesChartReferencePoints'),
            anchorMidDistances = this.get('anchorMidDistances')
        ;
        let zoomChartLinesData = [];

        var modelName = this.get('chartDataModelName');

        
        if ((modelName === 'strain-values' || modelName === 'load-values') && this.get('instrument').get('instrumentType').get('title') !== 'dRebar') { 
            zoomChartLinesData = zoomDataPoints.map(function(chartLine, chartLineIndex){
                return {
                    key: chartLineIndex,
                    // mean: 3,
                    type: 'lines',
                    timestamp: zoomTimePoints[chartLineIndex],
                    values: chartLine.values.map(function(dataPoint, dataPointIndex) {
                        return [
                            anchorMidDistances[dataPointIndex],
                            dataPoint
                        ];
                    })
                };
            });
        } else if (modelName === 'axial-strain-values' || modelName === 'load-values' ) {//&& !this.get('instrument').get('stacked')) {
            zoomChartLinesData = zoomDataPoints.map(function(chartLine, chartLineIndex){
                return {
                    key: chartLineIndex,
                    // mean: 3,
                    type: 'lines',
                    timestamp: zoomTimePoints[chartLineIndex],
                    values: chartLine.values.map(function(dataPoint, dataPointIndex) {
                        return [
                            anchorAXDistances[dataPointIndex],
                            dataPoint
                        ];
                    })
                };
            });
        } else if (modelName === 'bending-strain-values' ) { //&& !this.get('instrument').get('stacked')) {
            zoomChartLinesData = zoomDataPoints.map(function(chartLine, chartLineIndex){
                return {
                    key: chartLineIndex,
                    // mean: 3,
                    type: 'lines',
                    timestamp: zoomTimePoints[chartLineIndex],
                    values: chartLine.values.map(function(dataPoint, dataPointIndex) {
                        return [
                            anchorBXDistances[dataPointIndex],
                            dataPoint
                        ];
                    })
                };
            });
        } else {
            zoomChartLinesData = zoomDataPoints.map(function(chartLine, chartLineIndex){
                return {
                    key: chartLineIndex,
                    // mean: 3,
                    type: 'lines',
                    timestamp: zoomTimePoints[chartLineIndex],
                    values: chartLine.values.map(function(dataPoint, dataPointIndex) {
                        return [
                            anchorDistances[dataPointIndex],
                            dataPoint
                        ];
                    })
                };
            });
        }

        // mix data with events
        if (seismicEventsChartDistXData) {
            zoomChartLinesData = zoomChartLinesData.concat(seismicEventsChartDistXData);
        }
        if (blastEventsChartDistXData) {
            zoomChartLinesData = zoomChartLinesData.concat(blastEventsChartDistXData);
        }
        if (anchorDistancesChartReferencePoints) {
            zoomChartLinesData = zoomChartLinesData.concat(anchorDistancesChartReferencePoints);
        }

        return zoomChartLinesData;
    }),

    fullRangeChartLinesData: Ember.computed('fullRangeDataPoints', 'fullRangeTimePoints', function() {
        const _this = this,
            fullRangeDataPoints = this.get('fullRangeDataPoints'),
            fullRangeTimePoints = this.get('fullRangeTimePoints')
        ;

        let anchorDistances = this.get('anchorDistances');

        var modelName = this.get('chartDataModelName');
        var type = this.get('instrument').get('instrumentType').get('title');

        if(type === 'dCable') {
            if(modelName === 'strain-values' || modelName === 'strain-rate-values' || modelName === 'load-values') {
                //console.log(fullRangeDataPoints);
                fullRangeDataPoints.forEach(element => element.values[0]=0);
            }
        }
        

        return anchorDistances.map(function(chartLineName, chartLineIndex){
            return {
                key: chartLineName,
                // mean: 3,
                type: 'lines',
                values: fullRangeDataPoints.map(function(dataPoint, dataPointIndex) {
                    return [
                        moment( fullRangeTimePoints[dataPointIndex] ).valueOf(),
                        dataPoint.values[chartLineIndex]
                    ];
                })
            };
        }).sortBy('timestamp');
    }),

    numLines: Ember.computed('zoomTimePoints', function() {
        return this.get('zoomTimePoints').length;
    }),

    lineDrawDelay: Ember.computed('numLines', function() {
        return (13000 / (this.get('numLines') + 1)) ^ (1 / 20);
    }),

    chartDataModelName: Ember.computed('zoomChartData', function() {
        return this.get('zoomChartData').query.model_name;
    }),

    yAxisLegend: Ember.computed('chartDataModelName', function() {
        let chartDataModelName = this.get('chartDataModelName');
        let promise = this.get('store').query('measurement', {title: chartDataModelName.substr(0, chartDataModelName.lastIndexOf('-')).replace('-','_') });
        return promise;
    }),

    didInsertElement: function() {
        const _this = this,
            zoomChartLinesData = _this.get('zoomChartLinesData'),
            fullRangeChartLinesData = _this.get('fullRangeChartLinesData'),
            inlineHoverValuesSideOffset = _this.get('inlineHoverValuesSideOffset'),
            progressAnimationDuration = _this.get('progressAnimationDuration'),
            isDistXTooltip = _this.get('isDistXTooltip'),
            distXRiseUpAnimationDuration = _this.get('distXRiseUpAnimationDuration')
        ;

        let seismicEventsArray = this.get('seismicEventsArray'),
            blastEventsArray = this.get('blastEventsArray'),
            zoomChartSVG = d3.select('#' + _this.get('chartId') + ' svg.nvd3-spatial-line-chart-svg'),
            fullRangeChartSVG = d3.select('#' + _this.get('chartId') + ' svg.nvd3-spatial-line-chart-focus-svg'),
            yAxisLegend = this.get('yAxisLegend'),
            apiCallsPromises = [yAxisLegend]
        ;

        // draw zoomChart only after yAxis label is fetched
        Ember.RSVP.Promise.all(apiCallsPromises).then(function(results){
            //code _this must be executed only after all of the promises in apiCallsPromises is resolved
            let title = "";
            if (yAxisLegend) {
                yAxisLegend = yAxisLegend.get('firstObject');

                //get pretty chart name if chart has multiple parts to it
                let type = _this.instrument.get('instrumentTypeID').toString();
                let chartData = _this.get('chartData');
                chartData.forEach(function(item) {
                    if(item.id === type) {
                        chartData = item;
                        return;
                    }
                });

                let axisName = '';
                let units = chartData.get('units');
                switch(yAxisLegend.get('title')) {
                    case 'displacement':
                        axisName = chartData.get('temporalDisplacementName');
                        break;
                    case 'velocity':
                        axisName = chartData.get('temporalVelocityName');
                        units += "/day";
                        break;
                    case 'acceleration':
                        axisName = chartData.get('temporalAccelerationName');
                        units += "/day²";
                        break;
                    case 'strain':
                        axisName = chartData.get('temporalStrainName');
                        units = "%";
                        break;
                    case 'strain_rate':
                        axisName = chartData.get('temporalStrainRateName');
                        units = "%/day";
                        break;
                    case 'load':
                        axisName = chartData.get('temporalLoadName');
                        break;
                    case 'axial_strain':
                        axisName = "Axial Strain";
                        units = "%";
                        break;
                    case 'bending_strain':
                        axisName = "Bending Strain";
                        units = "%";
                        break;
                    case 'axial_displacement':
                        axisName = "Axial Displacement";
                        break;
                    default:
                        axisName = "Unknown";
                }
                
                if(yAxisLegend.get('title')==='load') {
                    title = axisName + ", " + " kN";
                } else {
                    title = axisName + ", " + " " + units;
                }
            }

            let zoomChart = nv.models.lineChartProgressAnimationAPI()
                .margin({top: 55, right: 10, bottom: 85, left: 60})
                .useInteractiveGuideline(false)
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; })
                .distXAxisScale(function(d) { return d[1]; })
                .color(d3.scale.category10().range())
                .duration(300)
                .showDistX(true)
                .showLegend(true)
                .progressAnimationDuration(progressAnimationDuration)
                .showXAxis(true)
                .noData('No usable data')
                ;


            let length = 0;
            try {
                length = _this.instrument.get('instrumentLength');
                let type = _this.instrument.get('instrumentType');
                if (type === 'dRebar') {
                    length = length * 1000;
                }
                
            } catch (ex) {

            }
            
            if(length !== null && length === 0) {
                length = 0;
            }

            zoomChart.forceX([0, length]);
/*             if (yAxisLegend.get('title') != 'bending_strain' && yAxisLegend.get('title') != 'axial_strain') {
                
            }
 */
            // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs,
            // and may do more in the future... it's NOT required
            nv.addGraph(function() {

                zoomChart.xAxis
                    .tickPadding(40)
                    .showMaxMin(false)
                    // .tickFormat(d3.format(".2f"))
                    // .tickFormat(function(d) {
                    //     let zoomChartXDomainLength = zoomChartLinesData[0].values.length;
                    //     return nv.utils.getDateAutoscaleFormat (zoomChartLinesData[0].values[0][0], zoomChartLinesData[0].values[zoomChartXDomainLength-1][0])(new Date(d));
                    // })
                    ;
                zoomChart.yAxis
                    .axisLabel(title)
                    .tickFormat(d3.format(".2f"));

                zoomChart.distXAxis
                    .tickPadding(40)
                    .showMaxMin(false)
                    // .ticks(5)
                    .tickFormat(function(d) {
                        if (fullRangeChartLinesData.length > 0) {
                            let fullRangeChartXDomainLength = fullRangeChartLinesData[0].values.length;
                            return nv.utils.getDateAutoscaleFormat (fullRangeChartLinesData[0].values[0][0], fullRangeChartLinesData[0].values[fullRangeChartXDomainLength-1][0])(new Date(d));
                        } else {
                            return [0, 0];
                        }
                    });

                zoomChart.distX
                    .margin({top: 3, right: 0, bottom: 0, left: 0})
                    .size(30)
                    .distXTooltipBottomOffset(45)
                    .isDistXTooltip(isDistXTooltip)
                    .distXRiseUpAnimationDuration(distXRiseUpAnimationDuration)
                    .distXRiseUpAnimationDelay(false)
                    .lineWidth(2);

                //zoomChart.legend.inlineHoverValuesSideOffset(inlineHoverValuesSideOffset);

                zoomChartSVG.datum(zoomChartLinesData).call(zoomChart);

                zoomChart.dispatch.on('onBrushEnd', function (brushExtent) {
                    _this.set('startTimestamp', brushExtent[0]);
                    _this.set('endTimestamp', brushExtent[1]);
                    let startTimestamp = moment(_this.get('startTimestamp'), "x").format("YYYY-MM-DD HH:mm:ss.SSS");
                    let endTimestamp = moment(_this.get('endTimestamp'), "x").format("YYYY-MM-DD HH:mm:ss.SSS");

                    zoomChart.tooltip.hidden(true);

                    // update query params via updateProperties action it the controller
                    _this.attrs.updateProperties(['start_timestamp', 'end_timestamp'], [startTimestamp, endTimestamp]);
                 });

                zoomChart.dispatch.on('brush', function (brushExtent) {
                    if (brushExtent.extent[0] > 0) {
                        // chart.focus.dispatch.onBrushCall(brushExtent.extent);
                        fullRangeChart.dispatch.onBrushCall(brushExtent.extent);
                    }
                 });

                function updateDistXTooltip(tooltipContent) {

                    if (typeof tooltipContent === 'undefined') {
                        return false;
                    }

                    let tooltipText = '',
                        tooltipClass = '',
                        eventSize = null
                    ;

                    if (typeof(tooltipContent) === 'object') {
                        if (tooltipContent.type === 'Blast') {
                            tooltipClass = 'blast';
                            eventSize = '<span class="event-type">Tonnes: ' + tooltipContent.tonnes + '</span>';
                        } else if (tooltipContent.type === 'Seismic') {
                            tooltipClass = 'seismic';
                            eventSize = '<span class="event-type">Moment-magnitude: ' + tooltipContent.momentMagnitude + '</span>';
                        } else if (tooltipContent.type === 'Other') {
                            tooltipClass = 'other';
                        }
                        tooltipText = '<span class="time">' + tooltipContent.timestamp + '</span>' +
                                      '<span class="event-type">Type: ' + tooltipContent.type + '</span>' +
                                      eventSize
                        ;
                    } else {
                        tooltipText = '<span class="time">' + tooltipContent.timestamp + '</span>';
                    }

                    return {
                        tooltipClass: tooltipClass,
                        tooltipText: tooltipText
                    };

                }

/*                 zoomChart.xAxis.dispatch.on('xAxisMouseMove', function (mouseMove) {
                    console.log('test');
                });
 */
                zoomChart.distX.dispatch.on('distXMouseMove', function (distXMouseMove) {
                    //console.log('test');
                    if ( seismicEventsArray.length && distXMouseMove.distX0 > -1 ) {
                        zoomChart.distX.dispatch.onDistXTooltipShowCall( updateDistXTooltip(seismicEventsArray[distXMouseMove.distX0]) );
                    }
                    if ( blastEventsArray.length && distXMouseMove.distX1 > -1 ) {
                        zoomChart.distX.dispatch.onDistXTooltipShowCall( updateDistXTooltip(blastEventsArray[distXMouseMove.distX1]) );
                    }

                    if (!seismicEventsArray.length || !blastEventsArray.length) {
                        let distXIndex = distXMouseMove.distX0;
                        if (distXIndex === -1) {
                            distXIndex = distXMouseMove.distX1;
                        }

                        let activeTooltipContent = seismicEventsArray[distXIndex];
                        if (!activeTooltipContent) {
                            activeTooltipContent = blastEventsArray[distXIndex];
                        }
                        zoomChart.distX.dispatch.onDistXTooltipShowCall( updateDistXTooltip(activeTooltipContent) );
                    }
                });

                //TODO: Figure out a good way to do this automatically
                nv.utils.windowResize(zoomChart.update);

                zoomChart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
                zoomChart.state.dispatch.on('change', function(state){
                    nv.log('state', JSON.stringify(state));
                });

                return zoomChart;
            });

            // declare fullRangeChart because later in zoom chart we need axis from fullRangeChart for events axis on zoomChart
            let fullRangeChart = nv.models.focus(nv.models.line())
               .margin({top: 10, right: 10, bottom: 30, left: 60})
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; })
                .color(d3.scale.category10().range())
                .syncBrushing(false)
                .independentBrushing(true)
                .showXAxis(true)
                .showYAxis(false)
                ;


            nv.addGraph(function() {

                fullRangeChart.xAxis
                    .showMaxMin(false)
                    .tickFormat(function(d) {
                        if (fullRangeChartLinesData.length > 0) {
                            let fullRangeChartXDomainLength = fullRangeChartLinesData[0].values.length;
                            return nv.utils.getDateAutoscaleFormat (fullRangeChartLinesData[0].values[0][0], fullRangeChartLinesData[0].values[fullRangeChartXDomainLength-1][0])(new Date(d));
                        } else {
                            return [0, 0];
                        }
                    });

                fullRangeChart.yAxis.tickFormat(d3.format(".2f"));

                fullRangeChartSVG.datum(fullRangeChartLinesData).call(fullRangeChart);


                fullRangeChart.dispatch.on('onBrushEnd', function (brushExtent) {
                    _this.set('startTimestamp', brushExtent[0]);
                    _this.set('endTimestamp', brushExtent[1]);

                    let startTimestamp = moment(_this.get('startTimestamp'), "x").format("YYYY-MM-DD HH:mm:ss.SSS");
                    let endTimestamp = moment(_this.get('endTimestamp'), "x").format("YYYY-MM-DD HH:mm:ss.SSS");

                    // update query params via updateProperties action it the controller
                    _this.attrs.updateProperties(['start_timestamp', 'end_timestamp'], [startTimestamp, endTimestamp]);
                 });

                fullRangeChart.dispatch.on('brush', function (brushExtent) {
                    if (brushExtent.extent[0] > 0) {
                        // zoomChart.dispatch.onBrushCall(brushExtent.extent);
                    }
                 });

                //TODO: Figure out a good way to do this automatically
                nv.utils.windowResize(fullRangeChart.update);

                // set zoom based on query params if set
                let startTimestamp = moment(_this.attrs.getQueryParams('start_timestamp')).valueOf();
                let endTimestamp = moment(_this.attrs.getQueryParams('end_timestamp')).valueOf();
                if (startTimestamp && endTimestamp) {
                    fullRangeChart.dispatch.onBrushCall([startTimestamp, endTimestamp]);
                }

                return fullRangeChart;
            });

        });

    }

});
