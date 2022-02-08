export class ComponentInstance {
	constructor({
		render,
		mount,
		...states
	}: {
		render: (state: Record<string, any>) => any | void;
		mount?: (state: Record<string, any>) => any | void;
		[k: string]: any;
	});

	private node: Node;
	private _state: Record<string, any>;
	public state: Record<string, any>;
	private renderMethod: Function;
	private mountMethod: Function;

	appendTo(element: Element): void;
	render(): Element;
}

export function Component({
	render,
	mount,
	...states
}: {
	render: (state: Record<string, any>) => any | void;
	mount?: (state: Record<string, any>) => any | void;
	[k: string]: any;
}): ({ ...initStates }?: Record<string, any>) => ComponentInstance;

export default Component;
