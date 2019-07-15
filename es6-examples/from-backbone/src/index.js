import AppView from '@app-views/app-view';
/**
 * @author Jonmathon Hibbard
 * @license MIT
 */

document.body.innerHTML = `
	<section class="todoapp" id="root-section">
		<header class="header">
			<h1>todos</h1>
			<input class="new-todo" placeholder="What needs to be done?" autofocus>
		</header>
		<section class="main">
			<input class="toggle-all" id="toggle-all" type="checkbox" />
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list"></ul>
		</section>
		<footer class="footer"></footer>
	</section>
	<footer class="info">
		<p>Double-click to edit a todo</p>
		<p>Written by <a href="https://github.com/infolock">Jonathon Hibbard</a></p>
		<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
	</footer>
`;

const app = new AppView({
	el: document.querySelector('#root-section')
});

app.render();
