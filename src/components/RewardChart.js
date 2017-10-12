'use strict'

import React from 'react'
import {AreaChart} from 'rd3'

const RewardChart = ({generators, supporters, authors}) => {
    const commonMultiplier = 100
    console.log(generators, supporters, authors, authors[0].values.reduce((acc, next) => acc +parseFloat(next), 0))
    return (
        <div className="charts">
            <div>
                <AreaChart
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
                <AreaChart
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
                <AreaChart
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
