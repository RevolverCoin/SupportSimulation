import {Range, List} from 'immutable'

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


/**
 * returns @count uniformly distributed numbers that add to 1
 * @param count
 */
export function randFixedSum(count) {
    const segments = Range(0, count).map(i => Math.random()).toList()
    const sum = segments.reduce((acc, next) => acc + next, 0);
    return segments.map(i => i / sum)
}

export function createProbabilityTable(probs) {
    return probs.reduce((acc, next) => {
        return acc.push(acc.last() + next)
    }, List())
}

export function createAdjacencyMatrix(edges) {
    return edges.reduce((acc, next) => {
        console.log()
        return acc.update(next.get('source'), List(), val => (val || List()).set(next.get('target'), 1));
    }, List())
}

export function isTerminal(nodeId, matrix) {
    return !getAdjacentNodes(nodeId, matrix).size
}

export function getAdjacentNodes(nodeId, matrix) {
    const rowNodes = matrix.get(nodeId) ? matrix.get(nodeId).reduce((acc, next, index) => next ? acc.push(index) : acc, List()) : List();
    const colNodes = matrix.reduce((acc, next, index) => next && next.get(nodeId) ? acc.push(index) : acc, List())
    return rowNodes.concat(colNodes)
}

export function isSet(matrix, source, target) {
    return matrix.hasIn([source, target])
}

/**
 * unsets specified indexes in specified matrix
 * @param indices
 */
export function unsetAdjacencyMatrixIndices(matrix, bidirectional, ...indices) {
    const safeDelete = (map, s, t) => map.hasIn([s, t]) ? map.setIn([s, t], undefined) : map
    console.log()
    return indices.reduce((acc, idx) => {
        let res = safeDelete(acc, idx.source, idx.target)
        return bidirectional ? safeDelete(res, idx.target, idx.source) : res
    }, matrix);
}


