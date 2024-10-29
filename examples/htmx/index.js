'use strict';

import fastifyFactoryFunc from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import TodoRouter from './todos/todos-router.js';
import formBody from '@fastify/formbody';
import Etag from '@fastify/etag';

const fastify = fastifyFactoryFunc({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
	},
});

fastify.register(Etag, { algorithm: 'fnv1a' });

fastify.register(fastifyStatic, {
	root: path.resolve('public'),
	prefix: '/',
});

fastify.register(formBody);

// Routers
const todoRouter = new TodoRouter();
todoRouter.initRoutes(fastify);

fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
