type ComponentArgs = {
	render: Function | void;
	mount: Function | void;
	states: Record<string, any>;
};

class ComponentInstance {
	
	private node: Node;
	private _state: Record<string, any>;
	public state: Record<string, any>;
	private renderMethod: Function;
	private mountMethod: Function;

	appendTo(element: Element);
	render() : Element;
}

export default function Component({
	render,
	mount,
	...states
}: ComponentArgs): ({...initStates}?: Record<string, any>) => ComponentInstance;
