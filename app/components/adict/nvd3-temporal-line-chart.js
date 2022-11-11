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
    title: null,
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
        if (modelName === 'strain-values' || modelName === 'strain-rate-values') { 
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

        if (modelName === 'strain-values' || modelName === 'strain-rate-values') { 
            var midPoints = [];
            for(var ctr = 0; ctr < anchorDistances.length-1; ctr++) {
                midPoints[ctr] = ((anchorDistances[ctr] + anchorDistances[ctr + 1]) / 2).toFixed(2);
            }
            if(modelName==='displacement-values') {
                midPoints.unshift(0);
            }
            anchorDistances = midPoints;
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
                key: 'T. ℃',
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
            if (_this.get('chartDataModelName') !== 'displacement-values'){
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
        //console.log("********************************************");
        let chartDataModelName = this.get('chartDataModelName');
        this.title = chartDataModelName.substr(0, chartDataModelName.lastIndexOf('-')).replace('-','_');
        let promise = this.get('store').queryRecord('measurement', {title: this.title});
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
            yAxisLegend = [this.get('yAxisLegend')],
            apiCallsPromises = [yAxisLegend]
        ;

        //console.log(vibeEventsArray);

        // draw zoomChart only after yAxis label is fetched
        Ember.RSVP.Promise.call(apiCallsPromises).then(function(results){
            //code _this must be executed only after all of the promises in apiCallsPromises is resolved
            //console.log("rendering graph...");
            //let title = "";
            if (yAxisLegend) {
                yAxisLegend = yAxisLegend.get(this.title);
                
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
                title = yAxisLegend.get('title');
                
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
                    case 'temperature':
                        axisName = "Temperature";
                        units = "°C";
                        break;
                    default:
                        axisName = "Unknown";
                }

                if (yAxisLegend) {
                    let raw = _this.raw;
                    title = axisName + ", " + " " + units;
                } else {
                    title = axisName + ", " + " " + units;
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
