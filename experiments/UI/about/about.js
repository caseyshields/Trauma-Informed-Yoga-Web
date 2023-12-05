
const component = 'credits';

/** Proof of concept for a menu screen.
 * TODO how should I add section to it?
 * Should component factories return a P5.Element, and it be added to a dismissable modal?
 * Creates an About page with the following semantic structure;<pre>
    <section class="about">
        <header>
            <button> <svg><path d=""/></svg> </button>
        </header>
        <nav>
            <button> How This Game Works </button>
            <button> Academic Credits </button>
            <button> Yoga: Culture and Practices </button>
            <button> TSY Resources </button>
        </nav>
    </section>
</pre> */
class About {

    p5; // the global p5 instance
    main; // the containing P5.element
    
    data; // the credits to be displayed

    // DOM elements of the credits page
    back;
    works;
    credits;
    yoga;
    tsy;

    // TODO get the navigation bar working! 
    // maybe add document anchors for each section
    // then link the navigation to them?
    // or should I do it programmatically?

    /** @constructor Creates DOM elements for the Credit page component.
     * @param {Object} p5 a P5 instance
     * @param {p5.Element} parent The DOM element which will contain the Credit page
     * @param {Object[]} data 
     */
    constructor(p5, parent, data) {
        this.p5 = p5;
        this.main = parent;
        this.data = data;

        this.section = p5.createElement('section');
        this.section.class(component);
        this.section.parent(parent);
        // this.section.id('');

        this.header = p5.createElement('header');
        this.header.parent(this.section);

        this.back = p5.createElement('button', 'Back');
        this.back.parent( this.header );

        this.navigation = p5.createElement('nav');
        this.navigation.parent(this.section);

        this.works = p5.createElement('button','How This Game Works');
        this.works.parent(this.navigation);

        this.credits = p5.createElement('button','Academic Credits');
        this.credits.parent(this.navigation);

        this.yoga = p5.createElement('button','Yoga: Culture and Practices');
        this.yoga.parent(this.navigation);

        this.tsy = p5.createElement('button','TSY Resources');
        this.tsy.parent(this.navigation);

    }

    /** @returns {p5.Element} The Dom section containing the credit page */
    get section() {return this.section;}

    /** Hides the credits page by adding a display:none; rule to the sections' style attribute. */
    hide() {this.section.style('display', 'none');}

    /** Shows the credits page by removing the style attribute */
    show() {this.section.style('display', '');}
}

export default function createAbout() {
    
}