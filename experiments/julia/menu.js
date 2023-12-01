/** Trying out P5 interaction with the DOM */

export default class menu {

    p5; // the global p5 instance
    main; // the containing P5.element
    fractal; // the julia fractal this menu controls

    div;
    green;
    blue;

    constructor(instance, parent, julia) {
        this.p5 = instance;
        this.main = parent;
        this.fractal = julia;
        
        this.div = this.p5.createDiv('Color Mapping');
        this.div.parent(this.main);
        this.div.id("color");
        this.div.class('menu');

        this.div.child( this.p5.createElement('br') );
        
        this.div.child( this.p5.createSpan('Green Offset:') );
        this.green = this.p5.createSlider(0, 100, 0, 1); // min max value step
        this.green.parent(this.div);
        this.green.id('green');
        this.green.input( (e)=>{
            let d = this.green.value()/100.0;
            this.fractal.greenOffset = d;
        });

        this.div.child( this.p5.createElement('br') );

        this.div.child( this.p5.createSpan('Blue Offset:') );
        this.blue = this.p5.createSlider(0,100,0,1);
        this.blue.parent(this.div);
        this.blue.id('blue');
        this.blue.input( (e)=>{
            let b = this.blue.value()/100.0;
            this.fractal.blueOffset = b;
        });

    }

    get div() {return this.div;}
    get blueOffset() {return this.blue.value()/100;}
    get greenOffset() {return this.green.value()/100;}

    set blueOffset(offset) {
        if (offset<0)
            offset = 0;
        else if (offset>1)
            offset = 1;
        this.blue.value(offset*100.0);
    }

    set greenOffset(offset) {
        if (offset<0)
            offset = 0;
        else if (offset>1)
            offset = 1;
        this.green.value(offset*100.0);
    }
}
