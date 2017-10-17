'use strict'

import React from 'react'
import {AreaChart, BarChart} from 'rd3'


const ChartComponent = (props) => {
    console.log (props.data && props.data[0].values.length < 20)
    return props.data && props.data[0].values.length < 20 ? <BarChart {...props} />: <AreaChart {...props}/>
}

const RewardChart = ({generators, supporters, authors}) => {
    const commonMultiplier = 100
    return (
        <div className="charts">
            <div>
                <ChartComponent
                    grouped={true}
                    data={generators}
                    width={"100%"}
                    height={400}
                    title="Generators"
                    viewBoxObject={{
                        x: 0,
                        y: 0,
                        height: 400,
                        width: 500
                    }}
                    xAxisTickInterval={{unit: 'supports', interval: 5}}
                    xAxisLabel="Support count"
                    yAxisLabel="Reward"
                    xAccessor={(d) => {
                        return d[0];
                    }
                    }
                    yAccessor={(d) => d[1] * commonMultiplier}

                />
            </div>

            <div>
                <ChartComponent
                    data={supporters}
                    title="supporters"
                    width={"100%"}
                    height={400}
                    viewBoxObject={{
                        x: 0,
                        y: 0,
                        height: 400,
                        width: 600
                    }}
                    xAxisTickInterval={{unit: 'supports', interval: 15}}
                    xAxisLabel="Support count"
                    yAxisLabel="Reward"
                    xAccessor={(d) => {
                        return d[0];
                    }
                    }
                    yAccessor={(d) => d[1] * commonMultiplier}

                />
            </div>

            <div>
                <ChartComponent
                    data={authors}
                    title="authors"
                    width={"100%"}
                    height={400}
                    viewBoxObject={{
                        x: 0,
                        y: 0,
                        height: 400,
                        width: 600
                    }}
                    xAxisTickInterval={{unit: 'supports', interval: 25}}
                    xAxisLabel="Support count"
                    yAxisLabel="Reward"
                    xAccessor={(d) => {
                        return d[0];
                    }
                    }
                    yAccessor={(d) => d[1] * commonMultiplier}

                />
            </div>
        </div>
    )
}


export default RewardChart
