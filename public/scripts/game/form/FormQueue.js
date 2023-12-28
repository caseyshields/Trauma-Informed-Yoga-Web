/** FormQueue
 * 
 * Queue class for a list of forms. When a form is finished, loads next form
 * 
 */

export default class FormQueue {

    constructor(){
        this.__forms = {};
        this.__head = 0;
        this.__tail = 0;
    }
    
    enqueueForm(form) {
        this.forms[this.tail] = form;
        this.tail++;
    }

    dequeueForm() {
        const form = this.forms[this.head];
        delete this.forms[this.head];
        this.head++;
        return form;
    }

    peek() {
        return this.forms[this.head];
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    get forms(){
        return this.__forms;
    }

    set forms(forms){
        this.__forms = forms;
    }

    get head(){
        return this.__head;
    }

    set head(head){
        this.__head = head;
    }

    get tail(){
        return this.__tail;
    }

    set tail(tail){
        this.__tail = tail;
    }
}
