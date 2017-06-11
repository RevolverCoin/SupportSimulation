'use strict'

import React from 'react';
import '../../fixed-data-table.css'
import {Table, Column, Cell} from 'fixed-data-table';


const StatTable  = ({data}) => (
    <Table
        rowHeight={50}
        rowsCount={data.length}
        width={5000}
        height={5000}
        headerHeight={50}>
        <Column
            header={<Cell>Node id</Cell>}
            cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                    {data[rowIndex].id}
                </Cell>
            )}
            width={100}
        />

        <Column
            header={<Cell>Reward</Cell>}
            cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                   {data[rowIndex].reward}
                </Cell>
            )}
            width={100}
        />


        <Column
            header={<Cell>Block reward</Cell>}
            cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                    {data[rowIndex].blockReward}
                </Cell>
            )}
            width={100}
        />

        <Column
            header={<Cell>Links</Cell>}
            cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                    {data[rowIndex].edgeCount}
                </Cell>
            )}
            width={100}
        />


        <Column
            header={<Cell>Node type</Cell>}
            cell={({rowIndex, ...props}) => (
                <Cell {...props}>
                    {data[rowIndex].type}
                </Cell>
            )}
            width={200}
        />
    </Table>
)

export default StatTable;