'use strict'

import React,{Component} from 'react'
import { Chart } from 'react-google-charts';
const {clipboard, nativeImage} =  window.require("electron")

const D3ChartComponent = (props) => props.data && props.data[0].values.length <= 2 ? <BarChart {...props} />: <AreaChart {...props}/>


class ChartComponent extends Component {
    constructor(props) {
        super(props);
        this.makeSnapshot = this.makeSnapshot.bind(this)
    }
    makeSnapshot(){
         const image = nativeImage.createFromDataURL(this._chart.chart.getImageURI())
         clipboard.writeImage(image)
    }

    render(){
        const { props } = this
        const {showData, rows, data, graph_id} = props
        return (
            <div>
                <Chart
                     ref={ref=>this._chart = ref}
                     width="600px"
                     height="400px"
                     {...props}
                     legend_toggle
                />
                 
                <button onClick={this.makeSnapshot}>
                    copy
                </button>

                <button onClick={()=>showData && showData(graph_id, rows || data)}>
                    data
                </button>
             </div>
         )
    }
}

const RewardChart = ({generators, supporters, authors, authorDegrees, authorRewardDistr, showData}) => {
    const options = ({ htitle, vtitle, custom }) => ({
        
        trendlines:{ 0: {
            color: 'purple',
            lineWidth: 2,
            opacity: 0.2,
            type: 'polynomial',
            degree: 3,
          } },

        legend: 'none', lineWidth: 3, chartArea: { left: 100, width: '80%', height: '80%' },
        hAxis: {
            titleTextStyle: { italic: false, fontSize: 17 },
            textStyle: { fontSize: '17' }, title:htitle
        },
        vAxis: {
            minValue: 0,
            titleTextStyle: { italic: false, fontSize: 17 },
            title: vtitle, format: '#.####', textStyle: { fontSize: '17' },
        },
        
        ...custom
    })

    return (
        <div className="charts">
                <ChartComponent
                    rows = {generators[0].values}
                    options = {options({htitle:'R node degree', vtitle:'% of reward'})}
                    graph_id="generators"
                    chartType="LineChart"
                    showData={showData}
                    columns={[{ "label": "time", "type": "number", "p": {} }, { "label": "Reward", "type": "number" }]} 
                />

                <ChartComponent
                    rows = {supporters[0].values}
                    options = {options({htitle:'S node degree', vtitle:'% of reward'})}
                    graph_id="supporters"
                    chartType="LineChart"
                    showData={showData}
                    columns={[{ "label": "time", "type": "number", "p": {} }, { "label": "Reward", "type": "number" }]} 
                />


                <ChartComponent
                    rows = {authors[0].values}
                    options = {options({htitle:'A node degree', vtitle:'% of reward'})}
                    graph_id="authors"
                    chartType="LineChart"
                    showData={showData}
                    columns={[{ "label": "time", "type": "number", "p": {} }, { "label": "Reward", "type": "number" }]} 
                />
                <ChartComponent
                    chartType="ColumnChart"
                    data={[["Number of nodes","Number of nodes",{"role":"annotation"}]].concat(authorDegrees[0].values.map(v=>[v[0].toString(),v[1],""]))}
                    options = {options({htitle:'Number of supports', vtitle:'Number of nodes'})}
                    graph_id="authorDegrees"
                    legend_toggle
                />

                <ChartComponent
                    chartType="ColumnChart"
                    data={[["Number of nodes","Number of nodes",{"role":"annotation"}]].concat(authorRewardDistr[0].values.map(v=>[v[0].toString(),v[1],""]))}
                    options = {options({htitle:'Reward', vtitle:'Number of nodes'})}
                    graph_id="authorRewardDistr"
                    legend_toggle
                />

        </div>
    )
}


export default RewardChart
