import {expect} from 'chai';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);


import {fromJS, Map} from 'immutable'

import {
    createAdjacencyMatrix,
    unsetAdjacencyMatrixIndices,
    getAdjacentNodes
} from '../src/core/utils'

import {
    distributeReward,
} from '../src/core/rewardDistribution'

import {
    generateBlocks
} from '../src/core/core'

import {
    createGetNodeFeeFunc
} from '../src/core/core'

import {graph1} from '../src/data/data'

describe('application logic', () => {
    it('tests adjacent matrix create', () => {


        const edges = fromJS([
            {source: "1", target: "0"},
            {source: "2", target: "0"},
            {source: "0", target: "3"},
            {source: "3", target: "3"},
        ])

        const matrix = createAdjacencyMatrix(edges)

        expect(matrix).to.equal(fromJS([
            [, , , 1], //0
            [1],    //1
            [1],    //2
            [, , , 1], //3
        ]));
    });


    it('tests get adjacent nodes', () => {
        const edges = fromJS([
            {source: 1, target: 0},
            {source: 2, target: 0},
            {source: 0, target: 3},
            {source: 3, target: 1},
            {source: 3, target: 5},
            {source: 3, target: 6},
            {source: 1, target: 4},
            {source: 4, target: 3},
        ])
        const matrix = createAdjacencyMatrix(edges)
        expect(getAdjacentNodes(3, matrix)).to.equal(fromJS([
            1, 5, 6, 0, 4
        ]));
    });


    it('tests unsetAdjacencyMatrixIndices ', () => {
        const edges = fromJS([
            {source: "1", target: "0"},
            {source: "2", target: "0"},
            {source: "0", target: "3"},
            {source: "3", target: "3"},
            {source: "2", target: "3"},
        ])


        const matrix = createAdjacencyMatrix(edges)
        for (let i = 0; i < 100000;++i){
            unsetAdjacencyMatrixIndices(matrix,false, {source: 1, target: 0},{source: 2, target: 3})
        }
        const unsetMatrix = unsetAdjacencyMatrixIndices(matrix,false, {source: 1, target: 0},{source: 2, target: 3})

        expect(unsetMatrix).to.equal(fromJS([
            [, , , 1], //0
            [undefined],    //1
            [1,,,,],    //2
            [, , , 1], //3
        ]));
    });


    it('tests rewardDistribution ', () => {
        const initialState = graph1;
        const block = Map({finderId :0, subsidy : 10, blockReward: 10})
        const getNodeFee =createGetNodeFeeFunc(initialState.get('nodes'),0.1,0.5)
        const state = distributeReward({state:initialState, block, getNodeFee})
        const rewards = state.get('nodes').map(node=>fromJS({id:node.get('id'), reward : node.get('reward')}))
        expect(rewards).to.equal(fromJS([
            {id:0,reward:1},
            {id:1,reward:0.075},
            {id:2,reward:0.118125},
            {id:3,reward:1.5},
            {id:4,reward:1.5},
            {id:5,reward:1.5},
            {id:6,reward:0.39375},
            {id:7,reward:0.39375},
            {id:8,reward:0.7875},
            {id:9,reward:0.075},
            {id:10,reward:0.15},
            {id:11,reward:0.05},
            {id:12,reward:0.05},
            {id:13,reward:0.05}
        ]))
   
    });
    

    it('tests generateBlocks', () => {
        const initialState = graph1;
        const state = generateBlocks(initialState, fromJS([{id:0}, {id:1}]), 0.1,0.5)
        const rewards = state.get('nodes').map(node=>fromJS({id:node.get('id'), reward : node.get('reward')}))
        expect(rewards).to.equal(fromJS([
            {id:0,reward:1+0.1125},
            {id:1,reward:0.075+1},
            {id:2,reward:0.118125+0.075},
            {id:3,reward:1.5+0.534375},
            {id:4,reward:1.5+2.25},
            {id:5,reward:1.5+0.590625},
            {id:6,reward:0.39375+0.28125},
            {id:7,reward:0.39375+0.61875},
            {id:8,reward:0.7875+2.25},
            {id:9,reward:0.075+0.1434375},
            {id:10,reward:0.15+0.1875},
            {id:11,reward:0.05+0.075},
            {id:12,reward:0.05+0.02953125},
            {id:13,reward:0.05+0.02953125}
        ]))

    });


});




