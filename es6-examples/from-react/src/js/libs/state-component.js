/**
 * @author
 * Jonmathon Hibbard (https://github.com/infolock)
 * Joseph Chen (https://github.com/4chen500)
 * @license MIT
 * An example of how to create a lightweight stateful component (that behaves like a React Component)
 * Also employs a Backbone-like event management and configuration.
 */
import isEmptyObj from './is-empty-obj';
import Component from './component';
import shallowEqual from './shallow-equal';
import { noop } from '@app-constants';

const FN_TYPE = 'function';
const SPACE = ' ';

/**
 * Additional Reading
 * --------------------
 *
 * How to (re)create your very own, custom JSX renderer.
 * Spoiler Alert: You just need a custom pragma for plugin-transform-react-jsx
 *
 * @see https://github.com/alecsgone/jsx-render
 */

class StateComponent extends Component {
	actualProps = {};
	actualState = {};
	rendered = false;

	// discussion point
	events = {};

	constructor(props) {
		super();

		if (props && typeof props === 'object' && !isEmptyObj(props)) {
			this.props = Object.assign({}, this.defaultProps, props);
		}
	}

	// discussion point
	get html() {
		if (this.props.hasOwnProperty('el')) {
			return this.props.el.innerHTML;
		}

		return null;
	}

	// discussion point
	set html(html) {
		if (!this.props.hasOwnProperty('el')) {
			return;
		}

		this.willRender();

		this.props.el.innerHTML = html;

		this.attachEvents();
		this.didRender();
	}

	getHTML() {
		return this.html;
	}

	setHTML(html) {
		this.html = html;
	}

	get defaultProps() {
		return {};
	}

	get props() {
		return Object.assign({}, this.actualProps);
	}

	set props(obj) {
		if (!obj || typeof obj !== 'object' || Object.prototype.toString.call(obj) === '[object Array]') {
			this.actualProps = {};

			return;
		}

		this.actualProps = Object.assign({}, obj);
	}

	get state() {
		return Object.assign({}, this.actualState);
	}

	set state(obj) {
		this.actualState = Object.assign({}, obj);
	}

	// discussion point
	setState(partialState) {
		const nextProps = this.props;

		let nextState;

		if (partialState === null) {
			nextState = null;
		} else if (typeof partialState === 'object') {
			nextState = Object.assign({}, this.actualState, partialState);
		} else if (typeof partialState === 'function') {
			nextState = partialState(this.state, nextProps);
		}

		const shouldUpdate = this.shouldComponentUpdate(nextState, nextProps);

		if (shouldUpdate) {
			this.actualState = Object.assign({}, nextState);

			const shouldRender = this.shouldComponentRender(nextState, nextProps, shouldUpdate);

			if (shouldRender) {
				this.render();
			}
		}
	}

	// discussion point
	setProps(partialProps) {
		if (!partialProps || isEmptyObj(partialProps)) {
			return;
		}

		const nextProps = Object.assign({}, this.actualProps, partialProps);
		const nextState = this.state;
		const shouldUpdate = this.shouldComponentUpdate(nextState, nextProps);

		if (shouldUpdate) {
			this.actualProps = Object.assign({}, nextProps);

			const shouldRender = this.shouldComponentRender(nextState, nextProps, shouldUpdate);

			if (shouldRender) {
				this.render();
			}
		}
	}

	shouldComponentRender(nextState, nextProps, didUpdate = true) {
		return didUpdate;
	}

	/**
	 * @see https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/using_should_component_update.html
	 */
	shouldComponentUpdate(nextState = {}, nextProps = {}) {
		return !shallowEqual(this.actualState, nextState) || !shallowEqual(this.actualProps, nextProps);
	}

	// discussion point
	attachEvents() {
		const { el } = this.props;

		if (!el) {
			return;
		}

		Object.keys(this.events).map(eventTarget => {
			const callback = this.events[eventTarget];

			let [event, ...target] = eventTarget.split(SPACE);

			event = event.trim();
			target = target.join(SPACE).trim();

			if (event && target && callback && typeof this[callback] === FN_TYPE) {
				const nodeList = el.querySelectorAll(target);

				[].map.call(nodeList, nodeItem => {
					nodeItem.removeEventListener(event, e => this[callback](e));
					nodeItem.addEventListener(event, e => this[callback](e));
				});
			}
		});
	}

	// discussion point
	detachEvents() {
		const { el } = this.props;

		if (!el) {
			return;
		}

		Object.keys(this.events).map(eventTarget => {
			const callback = this.events[eventTarget];

			let [event, ...target] = eventTarget.split(SPACE);

			event = event.trim();
			target = target.join(SPACE).trim();

			if (event && target && callback && typeof this[callback] === FN_TYPE) {
				const nodeList = el.querySelectorAll(target);

				[].map.call(nodeList, nodeItem => nodeItem.removeEventListener(event, e => this[callback](e)));
			}
		});
	}

	remove() {
		if (!this.props.hasOwnProperty('el')) {
			return;
		}

		this.detachEvents();
		this.props.el.innerHTML = '';
	}

	destroy() {
		const { el } = this.props;
		const { unsubscribe } = this.state;

		this.remove();

		if (unsubscribe && typeof unsubscribe === 'function') {
			unsubscribe();
		}
	}

	/**
 	 * @abstract
 	 */
	willRender() {
		// Implementation provided by child
	}

	render() {
		/*
		this.willRender();
		this.attachEvents();
		this.didRender();
		*/
	}

	/**
 	 * @abstract
 	 */
	didRender() {
		// Implementation provided by child
	}
}

export default StateComponent;
