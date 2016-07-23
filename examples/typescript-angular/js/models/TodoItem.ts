/// <reference path='../_all.ts' />

module todos {
    'use strict';

    export class TodoItem {
        constructor(
            public title: string,
            public completed: boolean
            ) { }
    }
}
