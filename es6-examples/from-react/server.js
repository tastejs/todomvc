/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

webpackDevServer.addDevServerEntrypoints(config, config.devServer);

const compiler = webpack(config);
const server = new webpackDevServer(compiler, {
	contentBase: './dist',
	port: 3000,
	host: 'localhost',
	hot: true,
	before(app) {
		app.use(bodyParser.json());
		app.use('/data', express.static(__dirname + '/data'));
		app.use(express.static(__dirname + '/data'));
		app.use(express.static(__dirname + '/src'));

		app.get('/todos', (request, response) => {
			response.status(200).sendFile(path.join(__dirname, '/data/todos.json'));
		});

		app.post('/todo', function(request, response) {
			const rawJSON = fs.readFileSync(path.join(__dirname, '/data/todos.json'));
			const TodoList = JSON.parse(rawJSON);
			const newTodo = JSON.parse(JSON.stringify(request.body));

			TodoList.todos.push(newTodo);

			const data = JSON.stringify(TodoList, null, 4);

			fs.writeFile(path.join(__dirname, '/data/todos.json'), data, (err) => {
				if (err) {
					response.status(500).send('Error saving todos!');
				} else {
					response.status(200).send();
				}
			});
		});
	}
});

server.listen(3000, function () {
	console.log('Demo listening on port 3000');
});
