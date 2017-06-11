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

        const unsetMatrix = unsetAdjacencyMatrixIndices(matrix,false, {source: 1, target: 0},{source: 2, target: 3})

        expect(unsetMatrix).to.equal(fromJS([
            [, , , 1], //0
            [],    //1
            [1,,,],    //2
            [, , , 1], //3
        ]));
    });

});