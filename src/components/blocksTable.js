'use strict'

import React from "react";
import "../../fixed-data-table.css";
import {Table, Column, Cell} from "fixed-data-table";


const BlockTable = ({data}) => (
    <div>
        <p>blocks: {data.length}</p>
        <p>{data.map(b => b.id+', ')}</p>
    </div>
)

export default BlockTable;