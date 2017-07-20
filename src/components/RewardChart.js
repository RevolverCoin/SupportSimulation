'use strict'

import React from 'react';
import {BarChart, AreaChart} from 'rd3';

const RewardChart = ({reward}) => {
    return (
        <AreaChart
            data={reward}
            width={"100%"}
            height={400}
            viewBoxObject={{
                x: 0,
                y: 0,
                height: 400,
                width: 500
            }}
            xAxisTickInterval={{unit: 'supports', interval: 1}}
            xAxisLabel="Support count"
            yAxisLabel="Reward"
            xAccessor={(d)=> {
                return d[0];
            }
            }
            yAccessor={(d)=>d[1]*100}

        />
    )
}


export default RewardChart;