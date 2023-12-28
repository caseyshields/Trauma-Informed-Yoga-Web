/** TargetQueue
 * 
 * Queue class for a list of targets. When a target is finished, loads next set of targets
 * 
 */

export default class TargetQueue {

    constructor(){
        this.__targets = {};
        this.__head = 0;
        this.__tail = 0;
    }
    
    enqueueTarget(target) {
        this.targets[this.tail] = target;
        this.tail++;
    }

    dequeueTarget() {
        const target = this.targets[this.head];
        delete this.targets[this.head];
        this.head++;
        return target;
    }

    peek() {
        return this.targets[this.head];
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    get targets(){
        return this.__targets;
    }

    set targets(targets){
        this.__targets = targets;
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
