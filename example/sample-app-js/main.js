import './style.css';
import { el } from '../../index';
import Component from '../../lib/Component';

let paragraphs = Component({
	render: (state) => [
		el({
			name: 'p',
			text: state.text,
		}),
		el({
			name: 'p',
			text: state.text,
			id: state.text,
		}),
		el({
			name: 'input',
			id: state.id,
		}),
	],
	mount: () => console.log('Mounted !'),
	text: 'lorem ipsum',
	id: "dsfdf",
});

let button = Component({
	render(state, set) {
		return el({
			name: 'button',
			text: state.text,
			$click: () => {
				set({
					count: state.count + 1,
					text: `You clicked me ${state.count} ${
						state.count == 1 ? 'time' : 'times'
					}`,
				});
			},
		});
	},
	text: 'Click me!',
	count: 0,
});

const app = document.querySelector('#app');

let par = paragraphs({text: "More like lorem ipsumn't"});
let btn1 = button();
let btn2 = button({text: "I'm a button!"});


par.appendTo(app);
btn1.appendTo(app);
btn2.appendTo(app);

setInterval(() => {par.state.id = Date.now()}, 1000);