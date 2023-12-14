
const component = 'credits';

/** Proof of concept for programmatically creating game menus in the DOM.
 * Creates a credits page with the following semantic structure;<pre>
</pre>*/
export default class credits {

    p5; // the global p5 instance
    main; // the containing P5.element
    
    data; // the credits to be displayed

    // DOM elements of the credits page
    section;
    back;
    aside;
    article;

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

        // this.back = p5.createElement('div');
        // this.back.parent(this.section);
        // this.back.child( p5.createElement('img', '') );

        this.aside = p5.createElement('aside');
        this.aside.parent(this.section);
        this.aside.child( p5.createElement('h3', 'Gameplay') );
        this.aside.child( p5.createElement('h3', 'Design') );
        this.aside.child( p5.createElement('h3', 'Sound') );
        this.aside.child( p5.createElement('h3', 'Research') );

        this.article = p5.createElement('article');
        this.article.parent(this.section);
        this.article.child( p5.createElement('h1', 'Credits') );
        for (let credit of data) {
            let name = p5.createElement('h2', credit.name);
            let role = p5.createElement('h3', credit.role)
            this.article.child(name);
            this.article.child(role);
        }
    }

    /** @returns {p5.Element} The Dom section containing the credit page */
    get section() {return this.section;}

    /** Hides the credits page by adding a display:none; rule to the sections' style attribute. */
    hide() {this.section.style('display', 'none');}

    /** Shows the credits page by removing the style attribute */
    show() {this.section.style('display', '');}
}
