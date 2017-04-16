/// <reference path="typings/knockout.d.ts" />

module Model {
	'use strict';

	export class TodoItem {
		title: KnockoutObservable<string>;
		completed: KnockoutObservable<boolean>;
		editing: KnockoutObservable<boolean>;
		previousTitle: string;

		constructor(title: string, completed?: boolean) {
			this.title = ko.observable(title);
			this.completed = ko.observable(!!completed);
			this.editing = ko.observable(false);
		}
	}
}