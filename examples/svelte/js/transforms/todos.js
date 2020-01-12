'use strict';
/* jshint esnext: false */
/* jshint esversion: 9 */

// Note: These transforms definitely have some commonality with reducers.
// It is far from being a complete redux implementation though, hence the
// alternative naming.

import { v4 as uuid } from '../helpers/uuid';
import { build } from '../models/todo';

export const add = function(list, changes) {
	const todo = build({id: uuid(), ...changes});
	return [...list, todo];
};

export const remove = function(list, id) {
	return list.filter(todo => todo.id !== id);
};

export const modify = function(list, id, changes) {
	return list.map(todo => (
		todo.id === id ? build({...todo, ...changes}) : todo
	));
};

export const modifyAll = function(list, changes) {
	return list.map(todo => build({...todo, ...changes}));
};

export const filterByUncompleted = function(list) {
	return list.filter(todo => !todo.completed);
};
