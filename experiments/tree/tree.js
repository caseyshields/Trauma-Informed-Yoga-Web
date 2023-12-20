class Branch {
    constructor(data, index=0, factor=2) {
        this.data = data;
        this.index = index;
        this.factor = factor;
    }
    get index() { return this.index; }
    get angle() { return this.data[this.index]; }
    get length() { return this.data[this.index+1]; }
    set angle(value) { this.data[this.index] = value; }
    set length(value) { this.data[this.index+1] = value; }
    getParent() { return Math.ceil(this.index / this.factor)-1; }
    getChild(childIndex) { return new Branch(this.data, 2 * (parent.index * factor + childIndex)); }
    isLeaf() { return 2 * parent.index * factor > data.length; }
}

/**  */
export default class Tree {

    factor;
    levels;
    data;
    angle;

    constructor(p5, levels, branchingFactor=2) {
        this.factor = branchingFactor;
        this.levels = levels;
        this.data = Float32Array( Math.pow(this.factor, levels) * 2 );
        
        let root = new Branch(data, 0, factor);
        this.testInitialization(p5, root);
    }

    testInitialization(level, angle, node) {



        // draw a leaf if we reach the end of a branch
        if (node.isLeaf()) {

        } 
        
        // otherwise generate more branches and recurse
        else {

            for (let n=0; n<factor; n++) {
                let child = node.getChild(n);

            }
        }
    }

    // TODO Render method
    // TODO Animate growth
    // TODO animate wind deflection

};


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