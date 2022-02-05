///<reference path="./Component.d.ts"/>

function similarNodesReplace(node, newNode, nodePrevious, nodeNext) {
	if(node.outerHTML == null) return false;
	if(node.outerHTML == newNode.outerHTML) return true;

	let areNodesEqual =
		node.isEqualNode(newNode) || node.tagName == newNode.tagName;
	let haveCommonSiblings =
		nodeNext?.isEqualNode(newNode.nextSibling) ||
		nodePrevious?.isEqualNode(newNode.previousSibling) ||
		false;

	let hasProperties =
		node.hasOwnProperty('innerHTML') && newNode.hasOwnProperty('innerHTML');


	if (areNodesEqual /*&& haveCommonSiblings*/ && hasProperties) {
		node.innerHTML = newNode.innerHTML;

		if( node.attributes == null ||  newNode.attributes == null) return true;
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
	node;
	_state = {};
	state = {};

	renderMethod;
	mountMethod;
	setParameter = ({ ...newStates }) => {
		let entries = Object.entries(newStates);

		for (let entry of entries) {
			this._state[entry[0]] = entry[1];
		}

		this.reRenderNodes();
	};

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
		let node = this.renderMethod(this._state, this.setParameter);

		this.node = node;

		if (node instanceof Array) {
			let fragment = new DocumentFragment();

			fragment.append(...node);

			return fragment;
		}

		return node;
	}

	reRenderNodes() {
		let newNodes = this.renderMethod(this._state, this.setParameter);

		let tempNODE = newNodes;

		if (newNodes instanceof Array && this.node instanceof Array) {
			let nodes = this.node;
			for (let i = 0; i < newNodes.length && i < this.node.length; i++) {
				let node = nodes[i];
				let newNode = newNodes[i];

				/// If the nodes weren't similar and couldn't be swapped while keeping values,
				if (
					!similarNodesReplace(
						node,
						newNode,
						this.node[i - 1],
						this.node[i + i]
					)
				) {
					/// We manually swap out the nodes instead of replacing props
					nodes[i].parentNode.replaceChild(newNodes[i], nodes[i]);
				} else {
					tempNODE[i] = node;
				}
			}

			if (newNodes.length > nodes.length) {
				for (let i = node; i < newNodes.length; i++) {
					let node = nodes[i];
					let newNode = newNodes[i];

					/// If the nodes weren't similar and couldn't be swapped while keeping values,
					if (
						!similarNodesReplace(
							node,
							newNode,
							this.node[i - 1],
							this.node[i + i]
						)
					) {
						/// We manually swap out the nodes instead of replacing props
						nodes[i].parentNode.replaceChild(newNodes[i], nodes[i]);
					} else {
						tempNODE[i] = node;
					}
				}
			}
		} else {
			this.node.parentNode.replaceChild(newNodes, this.node);
		}

		this.node = tempNODE;
		return tempNODE;
	}
}
