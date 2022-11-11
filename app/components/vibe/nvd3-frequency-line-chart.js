import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    chartId: 'frequency-chart',
    startTimestamp: null,
    endTimestamp: null,
    isDistXTooltip: true,
    distXRiseUpAnimationDuration: 500,

    zoomDataPoints: Ember.computed.map('zoomChartData', function(item){
        let linesKyes = Object.keys(item.toJSON());

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

    zoomChartLinesData: Ember.computed('zoomDataPoints', function() {
        const _this = this,
            zoomDataPoints = this.get('zoomDataPoints')
        ;
        let anchorDistances = this.get('anchorDistances'),
            zoomChartLinesData = []
        ;  

        let chartType = '';
        let chartDataModelName = this.get('chartDataModelName');
        if (chartDataModelName === 'frequency-ppv') {
            chartType = 'PPV';
        } else {
            chartType = 'PPA';
        }

        // an exception for temperature sensor in dExto
        zoomChartLinesData = [{
            key: chartType,
            type: 'lines',
            yAxis: 1,
            values: zoomDataPoints.map(function(dataPoint, dataPointIndex) {
                return [
                    dataPoint.values[0],
                    dataPoint.values[1]
                ];
            })
        }];
        
        return zoomChartLinesData;
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
            zoomChartLinesData = _this.get('zoomChartLinesData')
        ;

        let zoomChartSVG = d3.select('#' + _this.get('chartId') + ' svg.nvd3-frequency-line-chart-svg'),
            yAxisLegend = this.get('yAxisLegend'),
            apiCallsPromises = [yAxisLegend]
        ;

        // draw zoomChart only after yAxis label is fetched
        Ember.RSVP.Promise.all(apiCallsPromises).then(function(results){
            //code _this must be executed only after all of the promises in apiCallsPromises is resolved
            //console.log("rendering graph...");
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

                let instType = _this.instrument.get('instrumentType').get('title');

                let axisName = '';
                let units = chartData.get('units');
                title = '';
                if (instType === 'BluVibe') {
                    title = _this.get('chartDataModelName');
                } else {
                    title = yAxisLegend.get('title');
                }
                
                switch(title) {
                    case 'frequency-ppv':
                        axisName = 'PPV';
                        break;
                    case 'frequency-ppa':
                        axisName = 'PPA';
                        break;
                    default:
                        axisName = "Unknown";
                        //console.log(yAxisLegend.get('title'));
                }

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
                        //title = axisName + ", " + " " + units;
                        title = axisName;
                    }
                } else {
                    //title = axisName + ", " + " " + units;
                    title = axisName;
                }
                //title = yAxisLegend.get('unit');
            }

            //let zoomChart = nv.models.lineChartWithFocusAPI(usesPoints(title))
            let zoomChart = nv.models.scatterChart()
                .margin({top: 55, right: 90, bottom: 60, left: 80})
                //.useInteractiveGuideline(true)
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; })
                .color(d3.scale.category10().range())
                .duration(300)
                .showDistX(true)
                .showLegend(false)
                .noData('No usable data')
            ;

            zoomChart.legend.margin({bottom: 500});

            //console.log(title);

            // Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs,
            // and may do more in the future... it's NOT required
            nv.addGraph(function() {

                zoomChart.xAxis
                    .axisLabel("Frequency")
                    .axisLabelDistance(20)
                    .tickPadding(30)
                    .showMaxMin(false)
                    .tickFormat(d3.format("1"));
                zoomChart.yAxis
                    .axisLabel(title)
                    .axisLabelDistance(10);

                //zoomChart.forceY([0]);

                zoomChart.yScale(d3.scale.log().base(10));
                
                zoomChart.xScale(d3.scale.log());
                zoomChart.distX
                    .margin({top: 3, right: 0, bottom: 0, left: 0})
                    .size(10)
                ;

                //zoomChart.yAxis.tickFormat(d3.format("1"));

                //Forcing Y Axis values and tick values for clean looking log graph
                zoomChart.forceY([0.5, 2000]); //Make sure y axis starts at 1 not 0
                zoomChart.yAxis.tickValues([1, 5, 10, 50, 100, 500, 1000, 2000]); //Continue pattern for more ticks
                zoomChart.forceX([0.5, 100]); //Make sure y axis starts at 1 not 0
                zoomChart.xAxis.tickValues([0.5, 1, 2, 5, 10, 20, 50, 100]); //Continue pattern for more ticks

                zoomChart.tooltip.contentGenerator(function (obj) { 
                    var tooltip;
                    tooltip = '<div style=\'margin: 5px 5px 5px 5px;\'>';
                    tooltip += 'Frequency: ' + obj['point'][0] + '<br />' + obj['series'][0]['key'] + ': ' + obj['point'][1];
                    tooltip += '</div>';
                    return tooltip;
                });

                zoomChartSVG.datum(zoomChartLinesData).call(zoomChart);

                //TODO: Figure out a good way to do this automatically
                nv.utils.windowResize(zoomChart.update);

                zoomChart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
/*                 zoomChart.state.dispatch.on('change', function(state){
                    nv.log('state', JSON.stringify(state));
                });
 */
                //console.log('nvd3 data: ', zoomChartLinesData);
                _this.sendAction('setData',zoomChartLinesData);
                _this.sendAction('setChart',zoomChart);

                return zoomChart;
            });
        });
    }
});
