/*eslint-disable no-script-url*/
import React, { Component } from 'react';
import { withRouter } from "react-router";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class LineChart extends Component {
    state = {
        graphOptions : {
            chart: { height: 200 },
            title: { text: '' },
            // tooltip: {
            //     pointFormat: '{series.name}: <b>{point.percentage}</b>'
            // },
            tooltip: { shared: true }, 
            subtitle: { text: '' },

            yAxis: { title: { text: '' }, opposite: true },
            xAxis: {
                gridLineWidth: 1,
                //plotBands: [{color: '#FCFFC5',from: 2,to: 10}],
                categories: [],
                tickInterval: 0,
                labels: {
                    tickPosition : 'inside',
                    autoRotation : false,
                    //style: {fontSize:'15px'}
                }
            },
            // legend: {
            //     layout: 'horizontal',
            //     align: 'right',
            //     verticalAlign: 'top'
            // },
            plotOptions: {
                series: {
                    label: {connectorAllowed: false},
                    //pointStart: '16 Mar, 5pm',
                    showInLegend : false,
                },
            },
            series: [{},{}],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }
    }

    render() {
        
        return (
            <div className="lineChartcontainer"> 
                <div className="label">
                    <span className="colorDot" style={{'background': this.state.graphOptions.series[0].color}}></span> Opens &nbsp;&nbsp; 
                    <span className="colorDot" style={{'background': this.state.graphOptions.series[1].color}}></span>&nbsp;
                    Link Clicks for first day &nbsp;
                    {!this.props.hideLink && (<a href="javascript:void(0)" onClick={() => this.props.history.push('/app/campaigns/reports/OpensClicks/'+this.props.match.params.campaignData)} >see all time</a>)}
                </div>
                <span id="cLineChart">
                    <HighchartsReact highcharts={Highcharts} options={this.state.graphOptions} />
                </span><span className="cLineChartEnd"></span>
            </div>
        );//End return
    }//End render

    componentWillMount(){
        let graphData = this.props.data;
        //console.log(graphData);
        if(graphData.xAxis){
            let graphOptions = this.state.graphOptions;
            graphOptions.xAxis.categories = graphData.xAxis;

            graphOptions.series[0].name = graphData.Opened.name;
            graphOptions.series[0].data = graphData.Opened.data;
            graphOptions.series[0].color = graphData.Opened.color;
            graphOptions.series[0].lineWidth = graphData.Opened.lineWidth;

            graphOptions.series[1].name = graphData.Clicked.name;
            graphOptions.series[1].data = graphData.Clicked.data;
            graphOptions.series[1].color = graphData.Clicked.color;
            graphOptions.series[1].lineWidth = graphData.Clicked.lineWidth;

            graphOptions.xAxis.tickInterval = graphData.others.tickInterval;
            graphOptions.chart.height = graphData.others.height;

            this.setState({graphOptions});
        }//End if condition
    }//End componentDidMount


}//End class

export default withRouter(LineChart);