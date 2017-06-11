import {fromJS} from 'immutable'
import * as NodeType from "../constants/NodeType";
export const INITIAL_STATE = fromJS({
    "blocks": [],
    "lastNodeId": 4,
    "nodes": [  {id: 1, label: "a1", color:"#80ff78", shape: "circle",  type: NodeType.AUTHOR},
        {id: 2, label: "a2", color:"#80ff78", type: NodeType.AUTHOR},
        {id: 3, label: "a3", color:"#80ff78", type: NodeType.AUTHOR},
        {id: 4, label: "a4", color:"#80ff78", type: NodeType.AUTHOR},


        {id: 5, label: "g1", color:"#dc9e88", type: NodeType.GENERATOR},
        {id: 6, label: "g2", color:"#dc9e88", type: NodeType.GENERATOR},

        {id: 7, label: "s1", color:"#aed7e0", type: NodeType.SUPPORTER},
        {id: 8, label: "s2", color:"#aed7e0", type: NodeType.SUPPORTER},
        {id: 9, label: "s3", color:"#aed7e0", type: NodeType.SUPPORTER},
        {id: 10, label: "s4", color:"#aed7e0", type: NodeType.SUPPORTER},
    ],
    "edges": [ {source:5,target:1},
        {source:5,target:2},
        {source:5,target:3},
        {source:5,target:4},


        {source:8,target:4},
        {source:8,target:3},

        {source:10,target:3},
        {source:6,target:2},
        {source:7,target:2},
        {source:9,target:2},


    ]
})

export default INITIAL_STATE