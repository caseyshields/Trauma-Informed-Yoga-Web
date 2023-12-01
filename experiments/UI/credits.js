
const component = 'credits';

/** Proof of concept for programmatically creating game menus in the DOM.
 * Creates a credits page with the following semantic structure;<pre>
<section class="credit">
    <header><h1> Credits </h1></header>
    <nav> todo
        <a href="">topic 1</a>
        <a href="">topic 2</a>
        ...
    </nav>
    <dl>
        <dt> name 1 </dt>
        <dd> role 1 </dd>
        <dt> name 2 </dt>
        <dd> role 2 </dd>
        <dt> name 3 </dt>
        <dd> role 3 </dd>
        ...
    </dl>
</section>
</pre>*/
export default class credits {

    p5; // the global p5 instance
    main; // the containing P5.element
    
    data; // the credits to be displayed

    // DOM elements of the credits page
    section;
    header;
    navigation;
    list;

    // TODO get the navigation bar working! 
    // maybe add document anchors for each section
    // then link the navigation to them?
    // or should I do it programmatically?

    /** @constructor Creates DOM elements for the Credit page component.
     * @param {Object} p5 a P5 instance
     * @param {p5.Element} parent The DOM element which will contain the Credit page
     * @param {Object[]} data An array of credits in the form; {name:String, role:String}
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
        this.header.child( p5.createElement('h1', 'Credits') );

        this.navigation = p5.createElement('nav');
        this.navigation.parent(this.section);
        this.navigation.child( p5.createElement('h2', 'Gameplay') );
        this.navigation.child( p5.createElement('h2', 'Design') );
        this.navigation.child( p5.createElement('h2', 'Sound') );
        this.navigation.child( p5.createElement('h2', 'Research') );

        this.list = p5.createElement('dl');
        this.list.parent(this.section);

        for (let credit of data) {
            let term = p5.createElement('dt', credit.name);
            let def = p5.createElement('dd', credit.role)
            this.list.child(term);
            this.list.child(def);
        }
    }

    /** @returns {p5.Element} The Dom section containing the credit page */
    get section() {return this.section;}

    /** Hides the credits page by adding a display:none; rule to the sections' style attribute. */
    hide() {this.section.style('display', 'none');}

    /** Shows the credits page by removing the style attribute */
    show() {this.section.style('display', '');}
}
