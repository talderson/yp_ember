import Ember from 'ember';
import moment from 'moment';
//import JSONAPISerializer from '@ember-data/serializers/json';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    chartId: 'temporal-chart',
    startTimestamp: null,
    endTimestamp: null,
    isDistXTooltip: true,
    distXRiseUpAnimationDuration: 500,

    seismicEventsChartDistXData: Ember.computed('seismicEvents', function() {
        if ( this.get('seismicEvents') ) {
            return [{
                key: 'Seismic',
                type: 'distX',
                color: '#429CBA',
                values: this.get('seismicEvents').map(function(event) {
                    return [
                        moment( event.get('timestamp') ).valueOf(),
                        event.get('size') ? (event.get('size') * -20) + 20 : 20
                    ];
                })
            }];
        }
        return false;
    }),

    vibeEventsChartDistXData: Ember.computed('vibeEvents', function() {
        var events = this.get('vibeEvents');
        //console.log('vibeEvents');
        //console.log(events);
        if ( this.get('vibeEvents') ) {
            return [{
                key: 'BluVibe',
                type: 'distX',
                color: '#80bf5c',
                values: this.get('vibeEvents').map(function(event) {
                    return [
                        moment( event.get('id') ).valueOf(),
                        event.get('size') ? (event.get('size') * -20) + 20 : 20
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
                        event.get('size') ? (event.get('size') * -20) + 20 : 20
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
                    time: event.get('timestamp'),
                    timestamp: moment( event.get('timestamp') ).format("DD MMM, YYYY HH:mm:ss"),
                    // timestamp: moment( event.get('timestamp') ).valueOf(),
                    eventSize: event.get('size') ? (event.get('size') * -15) + 15 : 15,
                    momentMagnitude: event.get('momentMagnitude'),
                    location: event.get('location')
                };
            }).sortBy('time');
        }
        return false;
    }),

    blastEventsArray: Ember.computed('blastEvents', function() {
        if ( this.get('blastEvents') ) {
            let data_set = this.get('blastEvents').map(function(event) {
                //console.log(event.get('timestamp'));
                return {
                    type: 'Blast',
                    time: event.get('timestamp'),
                    timestamp: moment( event.get('timestamp') ).format("DD MMM, YYYY HH:mm:ss"),
                    eventSize: event.get('size') ? (event.get('size') * -15) + 15 : 15,
                    tonnes: event.get('tonnes'),
                    location: event.get('location')
                };
            }).sortBy('time');
            //console.log(data_set);
            return data_set;
        }
        return false;
    }),

    vibeEventsArray: Ember.computed('vibeEvents', function() {
        var events = this.get('vibeEvents');
        //console.log(events);
        if ( events ) {
            return events.map(function(event) {
                return {
                    type: 'BluVibe',
                    time: event.get('id'),
                    timestamp: moment( event.get('id') ).format("DD MMM, YYYY HH:mm:ss"),
                    ppa: event.get('ppa'),
                    ppv: event.get('ppv'),
                    freq: event.get('frequency')
                };
            }).sortBy('time');
        }
        return false;
    }),

    zoomTempPoints: Ember.computed.map('zoomTempData', function(item){
        let linesKyes = Object.keys(item.toJSON());

        var chartData = item.getProperties(linesKyes);

        return chartData;
    }),

    zoomDataPoints: Ember.computed.map('zoomChartData', function(item){
        let linesKyes = Object.keys(item.toJSON());

        //console.log(linesKyes);

        var chartData = item.getProperties(linesKyes);

        var modelName = this.get('chartDataModelName');
        if (modelName === 'strain-values' || modelName === 'strain-rate-values' || modelName === 'load-values' || modelName === 'axial-strain-values' || modelName === 'bending-strain-values') { 
            var plated = this.get('instrument').get('plated');
            
            if (this.get('instrument').get('instrumentType').get('title') === 'dCable') {
                if(plated) {
                    chartData.values[0] = chartData.values[1];
                } else {
                    chartData.values[0] = 0;
                }
            } else {
                //chartData.values.unshift(0);
            }
            chartData.values.push(0);
        }
        //console.log(chartData);
        return chartData;
    }),

    fullRangeDataPoints: Ember.computed.map('fullRangeChartData', function(item){
        let linesKyes = Object.keys(item.toJSON());

        return item.getProperties(linesKyes);
    }),

/*     fullRangeTempDataPoints: Ember.computed.map('fullRangeTempData', function(item){
        let linesKyes = Object.keys(item.toJSON());

        return item.getProperties(linesKyes);
    }),
 */
    zoomTimePoints: Ember.computed.map('zoomChartData', function(item){
        return item.get('id');
    }),

    fullRangeTimePoints: Ember.computed.map('fullRangeChartData', function(item){
        return item.get('id');
    }),

    anchorDistances: Ember.computed('instrument', 'fullRangeChartData', function() {
        let instType = this.instrument.get('instrumentType').get('title');
        if(instType === 'Tilt') {
            return ['X','Y','Z'];
        } else if(instType === 'Wire') {
            let anchors = [];
            let numPorts = this.instrument.get('portsNum');
            let startVal = 0;
            let maxVal = numPorts;
/*             if (this.port != '') {
                //startVal = (1 * this.port) - 1;
                startVal = (1 * numPorts) - 1;
                maxVal = startVal + 1;
            }
 */            for(let ctr = startVal; ctr < maxVal; ctr++) {
                anchors.push('T' + (ctr + 1));
                anchors.push(ctr + 1);
            }
            return anchors;
        } else if(instType === 'BluVibe') {
            return ['Data'];
        }
        let chartData = this.get('fullRangeChartData');
        let dataValuesCount;
        try {
            dataValuesCount = chartData.get('firstObject').toJSON().values.length;
        } catch (error) {
            dataValuesCount = 0;
        }
        let anchors = this.get('instrument').get('anchors');
        
        let anchorDistances = anchors.map(function(anchor){
            return anchor.get('distance');
        });

        //anchorDistances.push('T'); //TODO: add temperature

        //IF chart is Strain-Values chart
        var modelName = this.get('chartDataModelName');

        if (modelName === 'strain-values' || modelName === 'strain-rate-values' || modelName === 'load-values' || modelName === 'axial-strain-values' || modelName === 'bending-strain-values') { 
            var midPoints = [];
            if (this.get('instrument').get('instrumentType').get('title') === 'dCable') {
                //Adjust anchors to mid points between anchors
                for(var ctr = 1; ctr < anchorDistances.length ; ctr++) {
                    var mid = (anchorDistances[ctr - 1] + anchorDistances[ctr]) / 2;
                    midPoints[ctr] = + mid.toFixed(2);
                }

                //console.log(midPoints);

                //add zero point and end point
                midPoints.splice(0,1);
                midPoints[0] = 0;
                midPoints.push(anchorDistances[anchorDistances.length - 1]);  //TODO: change to length of exto once known
                //console.log(midPoints);
            } else if (this.get('instrument').get('instrumentType').get('title') === 'dRebar') {
                //Adjust anchors to mid points between anchors
                //console.log(this.get('instrument'));
                let headExclusion = this.get('instrument').get('headExclusionLength');
                let leftAnchors = [headExclusion];
                let rightAnchors = [headExclusion];
                
                let center = anchorDistances.length - 1;
                center = Math.ceil(center / 2);

                leftAnchors = leftAnchors.concat(anchorDistances.slice(1, center + 1));
                rightAnchors = rightAnchors.concat(anchorDistances.slice(center + 1));

                rightAnchors[0] = (leftAnchors[1] + leftAnchors[0]) / 2;

                let midLeft = [];
                for(var ctr = 0; ctr < leftAnchors.length - 1; ctr++) {
                    midLeft[ctr] = (leftAnchors[ctr] + leftAnchors[ctr + 1]) / 2;
                }

                let midRight = [];
                for(var ctr = 0; ctr < rightAnchors.length - 1; ctr++) {
                    midRight[ctr] = (rightAnchors[ctr] + rightAnchors[ctr + 1]) / 2;
                }

                if (modelName === 'axial-strain-values' || modelName === 'bending-strain-values' || modelName === 'load-values') {
                    if(this.get('instrument').get('stacked')) {
                        midPoints = midLeft;
                        if (modelName === 'load-values') {
                            midPoints.push(this.get('instrument').get('instrumentLength') * 1000);
                        }
                    } else {
                        midPoints = midLeft.concat(midRight);
                        /* midPoints = $.map(midPoints.slice(1, center + 1), function(v, i) {
                            return [v, midPoints.slice(center + 1)[i]];
                          }); */
                        if (modelName === 'bending-strain-values') {
                            midPoints.shift();
                            midPoints.pop();
                        }

                    }
                } else {
                    midPoints = midLeft.concat(midRight);
                }
                if (modelName === 'strain-values' || modelName === 'strain-rate-values' || modelName === 'load-values') {
                    for(let ctr = 0; ctr < midPoints.length; ctr++) {
                        midPoints[ctr] = (ctr+1) + '-' + midPoints[ctr];
                    }
  
/*                     for(let ctr = 0; ctr < midPoints.length / 2; ctr++) {
                        midPoints[ctr] = (ctr+1) + '-' + midPoints[ctr];
                    }
        
                    for(let ctr = 3; ctr < midPoints.length; ctr++) {
                        midPoints[ctr] = (ctr+1) + '-' + midPoints[ctr];
                    }
 */                }
            } else {
                for(var ctr = 0; ctr < anchorDistances.length-1; ctr++) {
                    midPoints[ctr] = ((anchorDistances[ctr] + anchorDistances[ctr + 1]) / 2).toFixed(2);
                }
            }
            if(modelName==='displacement-values') {
                midPoints.unshift(0);
            }
            anchorDistances = midPoints;
        } else if (modelName === 'axial-displacement-values' && this.get('instrument').get('stacked')) {
            let mid = (anchorDistances.length - 1) / 2;
            while (anchorDistances.length > (mid + 1)) {
                anchorDistances.pop();
            }
            anchorDistances[0] = this.get('instrument').get('headExclusionLength');
        } else if (modelName === 'axial-displacement-values' && !this.get('instrument').get('stacked')) {
            anchorDistances.sort(function(a,b){return a-b;});

            //anchorDistances.push(this.get('instrument').get('instrumentLength') * 1000);
            anchorDistances[0] = this.get('instrument').get('headExclusionLength');
        } else {
            if (this.get('instrument').get('instrumentType').get('title') === 'dRebar') {
                if (modelName === 'displacement-values') { //rebar stretch
                    var midPoints = [];
                    let headExclusion = this.get('instrument').get('headExclusionLength');
                    let leftAnchors = [headExclusion];
                    let rightAnchors = [headExclusion];
                    
                    let center = anchorDistances.length - 1;
                    center = Math.ceil(center / 2);
    
                    leftAnchors = leftAnchors.concat(anchorDistances.slice(1, center + 1));
                    rightAnchors = rightAnchors.concat(anchorDistances.slice(center + 1));
    
                    if(!this.get('instrument').get('stacked')) {
                        rightAnchors[0] = (leftAnchors[1] + leftAnchors[0]) / 2;
                    }
    
                    let midLeft = [];
                    for(var ctr = 0; ctr < leftAnchors.length - 1; ctr++) {
                        midLeft[ctr] = (leftAnchors[ctr] + leftAnchors[ctr + 1]) / 2;
                    }
    
                    let midRight = [];
                    for(var ctr = 0; ctr < rightAnchors.length - 1; ctr++) {
                        midRight[ctr] = (rightAnchors[ctr] + rightAnchors[ctr + 1]) / 2;
                    }

                    midPoints = midLeft.concat(midRight);
                    anchorDistances = midPoints;

                    anchorDistances.unshift(0);
                }
                for(let ctr = 1; ctr < anchorDistances.length / 2; ctr++) {
                    anchorDistances[ctr] = ctr + '-' + anchorDistances[ctr];
                }
    
                for(let ctr = 4; ctr < anchorDistances.length; ctr++) {
                    anchorDistances[ctr] = ctr + '-' + anchorDistances[ctr];
                }
            }    
        }
        //console.log(anchorDistances);
        return anchorDistances;
    }),

    zoomChartLinesData: Ember.computed('zoomDataPoints', 'zoomTimePoints', 'zoomTempPoints', 'seismicEventsChartDistXData', 'blastEventsChartDistXData', 'vibeEventsChartDistXData', function() {
        const _this = this,
            seismicEventsChartDistXData = this.get('seismicEventsChartDistXData'),
            blastEventsChartDistXData = this.get('blastEventsChartDistXData'),
            vibeEventsChartDistXData = this.get('vibeEventsChartDistXData'),
            zoomDataPoints = this.get('zoomDataPoints'),
            zoomTempPoints = this.get('zoomTempPoints'),
            zoomTimePoints = this.get('zoomTimePoints')
        ;

        //console.log(blastEventsChartDistXData);
        //console.log(vibeEventsChartDistXData);

        let anchorDistances = this.get('anchorDistances'),
            zoomChartLinesData = []
        ;

        if (this.get('instrument').get('instrumentType').get('title') === 'dCable') {
            var mName = _this.get('chartDataModelName');
            if (mName === 'strain-values' || mName === 'strain-rate-values' || mName === 'load-values') {
                zoomDataPoints.forEach(element => element.values[0] = 0);
            }
        }    

/*         if (this.get('instrument').get('instrumentType').get('title') == 'Tilt') {
                zoomDataPoints.forEach(element => element.values.shift());
        }    
 */
        // an exception for temperature sensor in dExto
        if (_this.get('chartDataModelName') !== 'temperature-values') {
            zoomChartLinesData = anchorDistances.map(function(chartLineName, chartLineIndex){
                return {
                    key: chartLineName,
                    // mean: 3,
                    type: 'lines',
                    yAxis: 1,
                    values: zoomDataPoints.map(function(dataPoint, dataPointIndex) {
                        return [
                            moment( zoomTimePoints[dataPointIndex] ).valueOf(),
                            dataPoint.values[chartLineIndex]
                        ];
                    })
                };
            });
        } else {
            zoomChartLinesData = [{
                key: 'T. ???',
                // mean: 3,
                type: 'lines',
                yAxis: 1,
                values: zoomDataPoints.map(function(dataPoint, dataPointIndex) {
                    return [
                        moment( zoomTimePoints[dataPointIndex] ).valueOf(),
                        dataPoint.values[0]
                    ];
                })
            }];
        }

        //console.log(zoomDataPoints.length);
        //console.log(zoomTempPoints.length);

        if (_this.get('chartDataModelName') !== 'temperature-values') {
            if (_this.get('chartDataModelName') !== 'displacement-values' && this.get('instrument').get('instrumentType').get('title') !== 'BluVibe'){
                while(zoomTempPoints.length > zoomDataPoints.length) {
                    zoomTempPoints.pop();
                    zoomTempPoints.shift();
                }
            }
            var temp = {key: 'T',
                type: 'lines',
                yAxis: 2,
                values: zoomTempPoints.map(function(dataPoint, dataPointIndex) {
                    return [
                        moment( zoomTimePoints[dataPointIndex] ).valueOf(),
                        dataPoint.values[0],
                    ];
                })
            };
            //console.log(temp);
            zoomChartLinesData.push(temp); //#TODO: Add Temp Points
            //console.log(zoomChartLinesData);
        }

        // mix data with events
        if (seismicEventsChartDistXData) {
            zoomChartLinesData = zoomChartLinesData.concat(seismicEventsChartDistXData);
        }
        if (blastEventsChartDistXData) {
            zoomChartLinesData = zoomChartLinesData.concat(blastEventsChartDistXData);
        }
        if (vibeEventsChartDistXData) {
            zoomChartLinesData = zoomChartLinesData.concat(vibeEventsChartDistXData);
        }
        
        return zoomChartLinesData;
    }),

    fullRangeChartLinesData: Ember.computed('fullRangeDataPoints', 'fullRangeTimePoints', function() {
        const _this = this,
            fullRangeDataPoints = this.get('fullRangeDataPoints'),
            fullRangeTimePoints = this.get('fullRangeTimePoints')
        ;

        let anchorDistances = this.get('anchorDistances');

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

    chartDataModelName: Ember.computed('zoomChartData', function() {
        return this.get('zoomChartData').query.model_name;
    }),

    yAxisLegend: Ember.computed('chartDataModelName', function() {
        let chartDataModelName = this.get('chartDataModelName');
        let chartTitle = chartDataModelName.substr(0, chartDataModelName.lastIndexOf('-')).replace('-','_');
        let promise = this.get('store').queryRecord('measurement', {title: chartTitle });
        return promise;
    }),

    didInsertElement: function() {
        const _this = this,
            zoomChartLinesData = _this.get('zoomChartLinesData'),
            fullRangeChartLinesData = _this.get('fullRangeChartLinesData'),
            isDistXTooltip = _this.get('isDistXTooltip'),
            distXRiseUpAnimationDuration = _this.get('distXRiseUpAnimationDuration')
        ;

        let seismicEventsArray = this.get('seismicEventsArray'),
            blastEventsArray = this.get('blastEventsArray'),
            vibeEventsArray = this.get('vibeEventsArray'),
            zoomChartSVG = d3.select('#' + _this.get('chartId') + ' svg.nvd3-temporal-line-chart-svg'),
            fullRangeChartSVG = d3.select('#' + _this.get('chartId') + ' svg.nvd3-temporal-line-chart-focus-svg'),
            apiCallsPromises = [yAxisLegend]
            //below is attempted fix to get label changed.
            //yAxisLegend = this.get('yAxisLegend'),
            apiCallsPromises = yAxisLegend
        ;
        //console.log("ChartID: " + _this.get('chartId') );

        // draw zoomChart only after yAxis label is fetched
        Ember.RSVP.Promise.all(apiCallsPromises).then(function(results){
        // label fix code
        // Ember.RSVP.Promise.all([apiCallsPromises]).then(function(results){
            //code _this must be executed only after all of the promises in apiCallsPromises is resolved
            //console.log("rendering graph...");
            let title = "";
            if (yAxisLegend) {
                // label fix code
                //yAxisLegend = yAxisLegend;
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

                let instType = _this.instrument.get('instrumentType').get('title');

                let axisName = '';
                let units = chartData.get('units');
                title = '';
                if (instType === 'BluVibe') {
                    title = _this.get('chartDataModelName');
                } else {
                    title = yAxisLegend.get('title');
                }
                //console.log("Switch: " + title);
                switch(title) {
                    case 'displacement':
                        axisName = chartData.get('temporalDisplacementName');
                        break;
                    case 'velocity':
                        axisName = chartData.get('temporalVelocityName');
                        units += "/day";
                        break;
                    case 'acceleration':
                        axisName = chartData.get('temporalAccelerationName');
                        units += "/day??";
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
                    case 'temperature':
                        axisName = "Temperature";
                        units = "??C";
                        break;
                    case 'event-frequency':
                        axisName = "Event Frequency";
                        break;
                    case 'event-ppv':
                        axisName = "Event PPV";
                        break;
                    case 'event-ppa':
                        axisName = "Event PPA";
                        break;
                    case 'cumulative-event-frequency':
                        axisName = "Cumulative Frequency";
                        break;
                    case 'cumulative-event-ppv':
                        axisName = "Cumulative PPV";
                        break;
                    case 'cumulative-event-ppa':
                        axisName = "Cumulative PPA";
                        break;
                    default:
                        axisName = "Unknown";
                }
                //console.log("Title: " + title);

                /* let chartName = yAxisLegend.get('title').capitalize();
                let chartNameL = chartName.substr(0, chartName.indexOf('_'));
                let chartNameR = chartName.substr(chartName.indexOf('_') + 1).capitalize();
                if(chartNameL !== "") {
                    chartName = chartNameL + " " + chartNameR;
                } */

                if (yAxisLegend) {
                    let raw = _this.raw;
                    if(yAxisLegend.get('title')==='load') {
                        title = axisName + ", " + " kN";
                    } else if (instType === 'Wire') {
                        if (raw === true) {
                            title = "Frequency, Hz";
                        } else {
                            title = "Calculated Values";
                        }
                    } else {
                        title = axisName + ", " + " " + units;
                    }
                } else {
                    if (instType === 'BluVibe') {
                        title = axisName;
                    } else {
                        title = axisName + ", " + " " + units;
                    }
                }
                //title = yAxisLegend.get('unit');
            }

            function usesPoints(chartName) {
                //console.log(chartName);
                switch(chartName) {
                    case 'event-ppv':
                    case 'event-ppa':
                        return true;
                }
                return false;
            }
            //console.log(zoomChartLinesData);
            //console.log("chartDataModelName: " + _this.get('chartDataModelName'));

            let zoomChart = nv.models.lineChartWithFocusAPI(usesPoints(_this.get('chartDataModelName')))
                .margin({top: 55, right: 90, bottom: 60, left: 80})
                .useInteractiveGuideline(true)
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; })
                .color(d3.scale.category10().range())
                .duration(300)
                .showDistX(true)
                .noData('No usable data')
            ;

            zoomChart.legend.margin({bottom: 500});
            
            //console.log(title);

            // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs,
            // and may do more in the future... it's NOT required
            nv.addGraph(function() {

                zoomChart.xAxis
                    .tickPadding(40)
                    .showMaxMin(false)
                    .tickFormat(function(d) {
                        let zoomChartXDomainLength = zoomChartLinesData[0].values.length;
                        return nv.utils.getDateAutoscaleFormat (zoomChartLinesData[0].values[0][0], zoomChartLinesData[0].values[zoomChartXDomainLength-1][0])(new Date(d));
                    })
                ;
                zoomChart.y1Axis
                    .axisLabel(title)
                    .axisLabelDistance(10);
                zoomChart.y2Axis
                    .axisLabel('Temp')
                    .axisLabelDistance(10);
                zoomChart.distX
                    .margin({top: 3, right: 0, bottom: 0, left: 0})
                    .size(30)
                    .distXTooltipBottomOffset(5)
                    .isDistXTooltip(isDistXTooltip)
                    .isFixedDistXTooltip(false)
                    .distXRiseUpAnimationDuration(distXRiseUpAnimationDuration)
                    .distXRiseUpAnimationDelay(false)
                    .lineWidth(2)
                ;

                if (_this.instrument.get('instrumentType').get('title') === 'Tilt') {
                    zoomChart.y1Axis.tickFormat(d3.format(".3f"));
                    zoomChart.legend.numDecimals(3);
                } else {
                    zoomChart.y1Axis.tickFormat(d3.format(".2f"));
                }
                zoomChart.y2Axis.tickFormat(d3.format(".1f"));

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

                function selectControls() {
                    zoomChart.chartData.forEach(function(series) { series.disabled = false; });
                }

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
                            eventSize = '<span class="event-type">Location: ' + tooltipContent.location + '<br />Tonnes: ' + tooltipContent.tonnes + '</span>';
                        } else if (tooltipContent.type === 'Seismic') {
                            tooltipClass = 'seismic';
                            eventSize = '<span class="event-type">Location: ' + tooltipContent.location + '<br />Moment-magnitude: ' + tooltipContent.momentMagnitude + '</span>';
                        } else if (tooltipContent.type === 'BluVibe') {
                            tooltipClass = 'bluvibe';
                            eventSize = '<span class="event-type">PPV - mm/s: ' + tooltipContent.ppv + '<br />PPA - mm/s&#178;: ' + tooltipContent.ppa + '<br />Frequency - Hz: ' + tooltipContent.freq + '</span>';
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

                zoomChart.distX.dispatch.on('distXMouseMove', function (distXMouseMove) {
                    //console.log(blastEventsArray);
                    //console.log(vibeEventsArray);
                    //console.log(distXMouseMove);
/* 
                    if ( seismicEventsArray.length && distXMouseMove.distX0 > -1 ) {
                        zoomChart.distX.dispatch.onDistXTooltipShowCall( updateDistXTooltip(seismicEventsArray[distXMouseMove.distX0]) );
                    }
                    if ( blastEventsArray.length && distXMouseMove.distX1 > -1 ) {
                        zoomChart.distX.dispatch.onDistXTooltipShowCall( updateDistXTooltip(blastEventsArray[distXMouseMove.distX1]) );
                    }
                    if ( vibeEventsArray.length && distXMouseMove.distX2 > -1 ) {
                        //console.log('mouseMove');
                        //console.log(vibeEventsArray);
                        zoomChart.distX.dispatch.onDistXTooltipShowCall( updateDistXTooltip(vibeEventsArray[distXMouseMove.distX2]) );
                    } */
                    if (!seismicEventsArray.length || !blastEventsArray.length || !vibeEventsArray.length) {
                        let distXIndex = distXMouseMove.distX0;
                        let data_set = 0;
                        if (distXIndex === -1) {
                            distXIndex = distXMouseMove.distX1;
                            data_set = 1;
                        }
                        if (distXIndex === -1) {
                            distXIndex = distXMouseMove.distX2;
                            data_set = 2;
                        }

                        let activeTooltipContent = seismicEventsArray[distXIndex];
                        if (data_set===1) {
                            activeTooltipContent = blastEventsArray[distXIndex];
                        }
                        if (data_set===2) {
                            activeTooltipContent = vibeEventsArray[distXIndex];
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

                //console.log('nvd3 data: ', zoomChartLinesData);
                _this.sendAction('setData',zoomChartLinesData);
                _this.sendAction('setChart',zoomChart);

                return zoomChart;
            });
        });


        function usesPoints(chartName) {
            //console.log(chartName);
            switch(chartName) {
                case 'event-ppv':
                case 'event-ppa':
                    return true;
            }
            return false;
        }

        let graph_type = null;
        if (usesPoints(_this.get('chartDataModelName'))) {
            graph_type = nv.models.scatter();
        } else {
            graph_type = nv.models.line();
        }
        
        let fullRangeChart = nv.models.focus(graph_type)
            .margin({top: 10, right: 10, bottom: 30, left: 80})
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
                    //console.log("beep");
                    if (fullRangeChartLinesData.length > 0) {
                        let fullRangeChartXDomainLength = fullRangeChartLinesData[0].values.length;
                        try {
                            return nv.utils.getDateAutoscaleFormat (fullRangeChartLinesData[0].values[0][0], fullRangeChartLinesData[0].values[fullRangeChartXDomainLength-1][0])(new Date(d));
                        } catch (ex) {
                            return [0, 0];
                        }
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
    }
});
