///<reference path="./Component.d.ts"/>

/**
 * Function used to recursively replace nodes in a smart way.
 * When nodes are similar instead of replacing them, it'll
 * switch their properties.
 * If not, they get replaced but not erased, to avoid
 * flickers.
 */
function smartReplace(nodes, replacements, oldParent, newParent) {
	/** If both the nodes and the replacement nodes
	 * have the same amount of children
	 */
	if (replacements.length == 0) {
		return replacements;
	}

	if (nodes.length == 0) {
		return replacements;
	}

	if (nodes.length == replacements.length) {
		// We store the original nodes in a temporary variable
		let tempNodes = Array.from(nodes);
		// We loop through the nodes
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			let replacement = replacements[i];
			// If they didn't meet the criterias to be replaced
			if (!similarNodesReplace(node, replacement)) {
				// We switch the two nodes in the dom
				node.parentNode.replaceChild(replacement, node);
				// And then put the replacement in the temps nodes
				tempNodes[i] = replacement;
			}
		}

		return nodes;
	}

	if (nodes.length > replacements.length) {
		let tempNodes = [];
		for (let i = 0; i < replacements.length; i++) {
			let node = nodes[i];
			let replacement = replacements[i];
			if (!similarNodesReplace(node, replacement)) {
				node.parentNode.replaceChild(node, replacement);
			}
		}

		for (
			let i = nodes.length;
			i < nodes.length - replacements.length;
			i++
		) {
			nodes[i].remove();
		}
	}

	if (nodes.length < replacements.length) {
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			let replacement = replacements[i];
			if (!similarNodesReplace(node, replacement)) {
				node.parentNode.replaceChild(node, replacement);
			}
		}

		for (
			let i = nodes.length;
			i < replacements.length - nodes.length;
			i++
		) {
			let node = nodes[i];
			let replacement = replacements[i];

			if (!similarNodesReplace(node, replacement)) {
				node.parentNode.replaceChild(node, replacement);
			}
		}
	}
}

function similarNodesReplace(node, newNode) {
	if (node.outerHTML == null) return false;
	if (node.outerHTML == newNode.outerHTML) return true;

	let areNodesEqual =
		node.isEqualNode(newNode) || node.tagName == newNode.tagName;

	if (areNodesEqual) {
		smartReplace(node.childNodes, newNode.childNodes, node, newNode);

		if (node.attributes == null || newNode.attributes == null) return true;
		for (let row of newNode.attributes) {
			node.setAttribute(row.name, row.value);
		}
		return true;
	}

	return false;
}

export function Component({ render, mount, ...states }) {
	return ({ ...initStates } = {}) => {
		return new ComponentInstance({
			render,
			mount,
			...{ ...states },
			...initStates,
		});
	};
}

export default Component;

export class ComponentInstance {
	/// The generated nodes by the render function
	node;

	/// The state object
	_state = {};
	/// The state proxy
	state = {};

	renderMethod;
	mountMethod;

	constructor({ render, mount = () => {}, ...states }) {
		this._state = Object.assign({}, states);

		this.state = new Proxy(this._state, {
			get: (obj, prop, receiver) => {
				return obj[prop];
			},

			set: (obj, prop, newval) => {
				obj[prop] = newval;
				function set(key, val) {
					this.set(_state, key, val);
				}

				this.node = this.reRenderNodes();
				return true;
			},
		});

		this.renderMethod = render;
		this.mountMethod = mount;
	}

	appendTo(element) {
		element.append(this.render());
	}

	render() {
		if (this.mountMethod != null) this.mountMethod();
		let node = this.renderMethod(this.state);

		this.node = node;

		if (node instanceof Array) {
			let fragment = new DocumentFragment();

			fragment.append(...node);

			return fragment;
		}

		return node;
	}

	reRenderNodes() {
		let newNodes = this.renderMethod(this.state);

		let tempNODE = newNodes;

		if (newNodes instanceof Array && this.node instanceof Array) {
			let nodes = this.node;

			smartReplace(
				nodes.childNodes,
				newNodes.childNodes,
				nodes,
				newNodes
			);
		} else {
			if (!similarNodesReplace(this.node, newNodes)) {
				this.node.parentNode.replaceChild(newNodes, this.node);
			} else {
				tempNODE = this.node;
			}
		}

		this.node = tempNODE;
		return tempNODE;
	}
}
