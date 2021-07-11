import { TodoModel } from './model';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { AppComponent } from './AppComponent';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

const model = new TodoModel('react-todos');

function render() {
	ReactDOM.render(
		<ThemeProvider theme={theme}>
			<AppComponent model={model} />
		</ThemeProvider>,
		document.getElementsByClassName('todoapp')[0]
	);
}

model.subscribe(render);
render();
