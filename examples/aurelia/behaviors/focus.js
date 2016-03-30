import {Behavior} from 'aurelia-templating';

export class Focus {
	static metadata() {
		return Behavior
			.attachedBehavior('focus')
			.withProperty('value', 'valueChanged', 'focus');
	}

	static inject() { return [Element]; }
	constructor(element) {
		this.element = element;
	}

	valueChanged(value) {
		if (value) {
			this.element.focus();
		}
	}
}
