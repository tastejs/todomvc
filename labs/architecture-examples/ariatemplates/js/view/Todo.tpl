{Template {
	$classpath: 'js.view.Todo',
	$hasScript: true,
	$css: ['js.view.TodoStyle'],
	$wlibs: {
		html: 'aria.html.HtmlLibrary'
	}
}}
	{macro main()}
		<header id="header">
			<h1>todos</h1>
			<input id="new-todo" placeholder="What needs to be done?" {on keydown {fn: "newTaskOnEnter", scope: this}/}>
		</header>
		{section {
			macro: "mainDisplay",
			type: "div",
			bindRefreshTo: [{to: "emptylist", inside: data}]
		}/}
	{/macro}

	{macro mainDisplay()}
		{if !data.emptylist}
			<section id="main">
				{@html:CheckBox {
					attributes: {
						classList: ["toggle-all"]
					},
					bind: {
						checked: {
							to: "toggleall",
							inside: data,
							transform: {
								fromWidget: toggleAll
							}
						}
					}
				}/}
				<label id="label-toggle-all">Mark all as complete</label>
				{repeater {
					id: "tasklist",
					content: data.todolist,
					type: "ul",
					attributes: {
						classList: (data.route.length > 0 ? ["todo-list", "filter-" + data.route] : ["todo-list"])
					},
					childSections: {
						id: "task",
						type: "li",
						macro: "taskDisplay",
						bindRefreshTo: function (e) { return [{to: "title", inside: e.item}] },
						attributes: function (e) {
							return { classList: e.item.completed ? ["completed"] : [] }
						}
					}
				}/}
			</section>
			<footer id="footer">
				{section {
					type: "span",
					attributes: {
						classList: ["todo-count"]
					},
					macro: "itemsleft",
					bindRefreshTo: [{to: "itemsleft", inside: data}]
				}/}
				{section {
					attributes: {
						classList: ["filters"]
					},
					macro: "routing",
					type: "ul",
					bindRefreshTo: [{to: "route", inside: data}]
				}/}
				{section {
					type: "span",
					macro: "itemsclear",
					bindRefreshTo: [{to: "itemscompleted", inside: data}]
				}/}
			</footer>
		{/if}
	{/macro}

	{macro routing()}
		<li>
			<a {if data.route.length==0}class="selected"{/if} href="#/">All</a>
		</li>
		<li>
			<a {if data.route == "active"}class="selected"{/if} href="#/active">Active</a>
		</li>
		<li>
			<a {if data.route == "completed"}class="selected"{/if} href="#/completed">Completed</a>
		</li>
	{/macro}

	{macro itemsleft()}
		<strong>${data.itemsleft}</strong> ${data.itemsleft == 1 ? "item" : "items"} left
	{/macro}

	{macro itemsclear()}
		{if data.itemscompleted > 0}
			<button id="clear-completed" {on click "clearCompleted"/}>Clear completed (${data.itemscompleted})</button>
		{/if}
	{/macro}

	{macro taskDisplay(iter)}
		{if data.editedTask == iter.sectionId}
			<input class="edit" value="${iter.item.title|escapeForHTML}"
				{id "editbox"/}
				{on blur {fn: "stopEdit", scope: this, args: iter}/}
				{on keydown {fn: "confirmEdit", scope: this, args: iter}/}>
		{else/}
			<div class="view">
				{@html:CheckBox {
					attributes: {
						classList: ["toggle"]
					},
					bind: {
						checked: {
							to: "completed",
							inside: iter.item,
							transform: function (v) { return changeTaskStyle(v, iter.sectionId) }
						}
					}
				}/}
				<label {on dblclick {fn: "editTask", scope: this, args: iter}/}>${iter.item.title|escapeForHTML}</label>
				<button class="destroy" {on click {fn: "deleteTask", scope: this, args:iter}/}></button>
			</div>
		{/if}
	{/macro}

{/Template}
