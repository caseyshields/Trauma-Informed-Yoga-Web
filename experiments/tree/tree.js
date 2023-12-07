/**  */
export default class Tree {

    // Note these structures are implied;

    // Tree {
    //     level // number of levels of the tree
    //     branching-factor // number of stems per level
    //     nodes [] // len = (branch)^level - 1
    //     // make a balanced tree so we can avoid the overhead of pointers;
    //     // 
    // }
    // node {
    //     angle
    //     offset
    //     length // should this be implied by level?
    //     //thickness // visual thickness of the branch; should this be implied by level?
    //     //stiffness // how bendy it is when we animate; should this be implied by thickness?
    //     // leaf // implied by whether there is a child
    // }

    // seems onerous to unroll this into an array, but saves a huge amount of object and pointer overhead;
    // we want to fit as many leaves on the screen as possible...

    factor;
    levels;
    data;

    constructor(levels, branchingFactor=2) {
        this.factor = branchingFactor;
        this.levels = levels;
        data = Float32Array( Math.pow(this.factor, levels) * 3 );
    }

    getRoot() {
        return getNode(0);
    }

    getNode(n) {
        return {
            index: n,
            angle: data[n],
            offset: data[n+1],
            length: data[n+2],
        } 
    }

    getChild(parent, childIndex) {
        return getNode( 3 * (parent.index * factor + childIndex) );
    }

    isLeaf(parent) {
        return 3 * parent.index * factor > data.length;
    }

    // TODO Render method
    // TODO Animate growth
    // TODO animate wind deflection
};