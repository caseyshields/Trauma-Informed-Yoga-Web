export default class BackButton extends Button {
    
    state = this.states.idle;

    constructor(layout = {}, style = {}, disabled = false) {
        super(0, 0, {}, true, 5, 255, 0, 1, 1, false);

        Object.assign(this.layout, layout);
		Object.assign(this.style, style);

		this.state = disabled ? this.states.disabled : this.states.idle;
    }

    



}