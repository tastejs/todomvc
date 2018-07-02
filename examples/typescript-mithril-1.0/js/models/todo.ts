'use strict'

import Stream = Mithril.Stream;
declare const stream: Mithril.StreamFactory;

interface ITodoData {
	title: string;
	completed: boolean;
	editing: boolean;
	key: number;
}

class TodoItem  {
	title: Stream<string>;
	completed: Stream<boolean>;
	editing: Stream<boolean>
	key: number;

	static count = 0;

	constructor(data: ITodoData) {
		this.title = stream(data.title);
		this.completed = stream(data.completed || false);
		this.editing = stream(data.editing || false);
		this.key = ++TodoItem.count;
	}
}

