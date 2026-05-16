'use strict';

import { STATUS_ACTIVE, STATUS_COMPLETED } from './consts.js';
import TodosController from './todos-controller.js';

export default class TodoRouter {
	constructor() {
		this.todoController = new TodosController();
	}

	initRoutes(fastify) {
		fastify.get('/', async (request, reply) => {
			let isHxBoosted = request.headers['hx-boosted'] === 'true';
			const { filter } = request.query;
			const markup = isHxBoosted
				? await this.todoController.renderTodos(filter) // jshint ignore:line
				: await this.todoController.renderIndexPage(filter);
			return reply.type('text/html').send(markup);
		});

		fastify.get('/todos', async (request, reply) => {
			const { filter } = request.query;
			const markup = await this.todoController.renderTodos(filter);
			return reply.type('text/html').send(markup);
		});

		fastify.post('/todos', async (request, reply) => {
			const { label } = request.body;
			if (label) {
				this.todoController.addTodo(label?.trim());
				reply.header('HX-Trigger', 'todoCreated');
				reply.status(201);
				return reply.send();
			}
		});

		fastify.delete('/todos/:id', async (request, reply) => {
			const { id } = request.params;

			if (id) {
				this.todoController.deleteTodo(id);
				reply.header('HX-Trigger', 'todoDeleted');
				reply.status(204);
				return reply.send();
			}
		});

		fastify.delete('/todos/completed', async (request, reply) => {
			this.todoController.deleteCompleted();
			reply.header('HX-Trigger', 'todoDeleted');
			reply.status(204);
			return reply.send();
		});

		fastify.patch('/todos/toggle', async (request, reply) => {
			const desiredStatus = !!request.body['toggle-all']
				? STATUS_COMPLETED
				: STATUS_ACTIVE;
			this.todoController.markAllAs(desiredStatus);

			reply.header('HX-Trigger', 'allToggled');
			reply.status(204);
			return reply.send();
		});

		fastify.patch('/todos/toggle/:id', async (request, reply) => {
			const { id } = request.params;
			const desiredStatus = !!request.body.completed
				? STATUS_COMPLETED
				: STATUS_ACTIVE;
			this.todoController.markSingleAs(id, desiredStatus);

			reply.header('HX-Trigger', 'singleToggled');
			reply.status(204);
			return reply.send();
		});

		fastify.patch('/todos/edit/:id', async (request, reply) => {
			const { id } = request.params;
			const { label } = request.body;
			const markup = await this.todoController.editTodoLabel(id, label?.trim());
			return reply.type('text/html').send(markup);
		});
	}
}
