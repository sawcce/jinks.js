function similarNodesReplace(node, newNode) {
	let areNodesEqual = node.isEqualNode(newNode) || node.tagName == newNode.tagName;
	let haveCommonSiblings = node.nextSibling?.isEqualNode(newNode.nextSibling) 
		|| node.previousSibling?.isEqualNode(newNode.previousSibling);
	if(areNodesEqual && haveCommonSiblings) {
		newNode.value = node?.value
	}
}

export default function Component({ render, mount, ...states }) {
	let node;


	function set(newNode) {
		node = newNode;
	}

	let _state = states;

	return () => {
		return {
			render() {
				console.log(this);
				return render(this.state);
			},
			state: new Proxy(_state, {
				get (obj, prop, receiver) {
					console.log(this);
					console.log(`Getting ${obj} to ${prop}`);
					return obj[prop];
				},

				set(obj, prop, newval) {
					console.log(obj);
					console.log(`Setting ${prop} to ${newval}`);
					obj[prop] = newval;
					let newNodes = render(_state);

					if (newNodes instanceof Array && node instanceof Array) {
						let nodes = node;
						for(let i = 0; (i < newNodes.length && i < node.length); i++) {
							let node = nodes[i];
							let newNode = newNodes[i];

							nodes[i]?.parentNode?.replaceChild(newNodes[i],nodes[i]);
							similarNodesReplace(node, newNode);
						}

						if(newNodes.length > nodes.length) {
							for(let i = node; (i < newNodes.length); i++) {
								let node = nodes[i];
								let newNode = newNodes[i];

								nodes[i].parentNode.replaceChild(newNodes[i],nodes[i]);
								similarNodesReplace(node, newNode);
							}
						}

					} else {
						console.log('one node !', newNodes, node);
						node.parentNode.replaceChild(newNodes, node);
					}

					//node.appendChild(newNodes);
					//console.log("Dirty!", node);
					return true;
				},
			}),
			set: set,
			mount:
				mount != null
					? () => {
							mount(this.state);
					  }
					: null,
			node,
		};
	};
}
