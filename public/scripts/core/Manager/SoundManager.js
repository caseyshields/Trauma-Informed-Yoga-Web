/*
	SoundManager class

	acts as global controller for tone class, providing easy sound trigger interface for gameobjects.
	//TODO ALL OF IT
*/

import Manager from "./Manager.js";

export default class SoundManager extends Manager {
	/* Constructor */
	constructor() {
		super();
	}

	get instance() {
		return this.__instance;
	}

	set instance(instance) {
		this.__instance = instance;
	}

}