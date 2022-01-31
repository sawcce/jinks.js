export default function Render(_component) {
	let component = _component;
	//Object.assign(component, _component);

	if (component.mount != null) component.mount();
	let node = component.render();

	console.log(node);

	if (node instanceof Array) {
		let fragment = new DocumentFragment();

		fragment.append(...node);

		component.set(node);
		component.node = node;

		return fragment;
	}

	component.set(node);
	component.node = node;

	return node;
}
