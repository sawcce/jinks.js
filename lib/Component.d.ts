type ComponentArgs = {
	render: Function | void;
	mount: Function | void;
	states: Record<string, any>;
};

export class ComponentInstance {
	
	private node: Node;
	private _state: Record<string, any>;
	public state: Record<string, any>;
	private renderMethod: Function;
	private mountMethod: Function;

	appendTo(element: Element): void;
	render() : Element;
}

export function Component({
	render,
	mount,
	...states
}: {
	render: Function | void;
	mount?: Function | void;
	[k: string]: any;
}): ({...initStates}?: Record<string, any>) => ComponentInstance;

export default Component;