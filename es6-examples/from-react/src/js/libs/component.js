/**
 * @author
 * Jonmathon Hibbard (https://github.com/infolock)
 * Joseph Chen (https://github.com/4chen500)
 * @license MIT
 */
const OBSERVER_CONFIG = {
	attributes: true,
	childList: true,
	subtree: true
};

var unixTimestamp = () => (new Date).getTime();

class Component {
	toString = this.render

	constructor() {
		this.id = `id-${ unixTimestamp() }`;
	}

	attach = () => this.el = document.getElementById(this.id);

	render() {
		throw new Error('render() must be implemented and the outermost tag must have an id of this.id');
	}
}

export default Component;
