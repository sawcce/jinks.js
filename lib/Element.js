///<reference path="./Element.d.ts"/>

export function txt(text) {
	return document.createTextNode(text);
}


export function el({
	name,
	child,
	children,
	text,
	parent = null,
	dangerousHTML,
	$click,
	...opts
}) {
	let node = document.createElement(name);

	if (child) {
		if(!(child instanceof Node)) {
			node.appendChild(document.createTextNode(child.toString()));
		} else {
			node.appendChild(child);
		}
	} else if(children) {
		for (child of children) {
			if(!(child instanceof Node)) {
				node.appendChild(document.createTextNode(child.toString()));
				continue;
			}

			node.appendChild(child);
		}
	}

	if (text) node.innerText = text;

	if (dangerousHTML) node.innerHTML = dangerousHTML;

	if (parent) console.log(parent);

	for (let [option, value] of Object.entries(opts)) {
		node.setAttribute(option, value);
	}

  if($click) {
    node.addEventListener("click", $click);
  }

	return node;
}

export default el;