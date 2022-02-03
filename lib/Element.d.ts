export default function el({
	name,
	child,
	children,
	text,
	parent,
	dangerousHTML,
	$click,
	...opts
}: {
	name: string;
	child?: Node;
	children?: Node[];
	text?: string;
	parent?: Node;
	dangerousHTML?: string;
	$click?: Function;
	[k: string]: any;
});
