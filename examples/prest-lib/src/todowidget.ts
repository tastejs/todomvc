import { WidgetE } from "prest-lib/src/main/widgete";
import { JsonMLs } from "prest-lib/src/main/jsonml";

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoState {
    todo: string;
    todos: Todo[];
    filter: string;
    edit: number;
}

export class TodoWidget extends WidgetE<TodoState> {

    constructor() {
        super("TodoWidget");
        this.setState({
            todo: "",
            todos: [],
            filter: "/",
            edit: null
        });
    }

    render(): JsonMLs {
        let todos = this._state.todos;
        const completed = this._state.todos.filter(t => t.completed);
        const active = this._state.todos.filter(t => !t.completed);
        switch (this._state.filter) {
            case "/active":
                todos = active;
                break;
            case "/completed":
                todos = completed;
                break;
        }

        return [
            ["section#app.todoapp",
                ["header.header",
                    ["h1", "todos"],
                    ["input.new-todo",
                        {
                            placeholder: "What needs to be done?",
                            autofocus: "autofocus",
                            value: new String(this._state.todo),
                            change: this.onInsert
                        }
                    ]
                ],
                this._state.todos.length ?
                    ["section.main",
                        ["input#toggle-all.toggle-all",
                            {
                                type: "checkbox",
                                change: this.onCompleteAll
                            }
                        ],
                        ["label", { for: "toggle-all" },
                            "Mark all as complete"
                        ],
                        ["ul.todo-list",
                            ...todos.map(t => {
                                    const classes = [];
                                    t.completed && classes.push("completed");
                                    t.id === this._state.edit && classes.push("editing");

                                    return ["li", { _key: t.id, classes: classes },
                                        ["div.view",
                                            ["input.toggle",
                                                {
                                                    type: "checkbox",
                                                    data: { id: t.id },
                                                    change: this.onComplete
                                                },
                                                (e: HTMLInputElement) => e.checked = t.completed
                                            ],
                                            ["label",
                                                {
                                                    data: { id: t.id },
                                                    dblclick: this.onEdit
                                                },
                                                t.title],
                                            ["button.destroy",
                                                {
                                                    data: { id: t.id },
                                                    click: this.onDelete
                                                }
                                            ]
                                        ],
                                        ["input.edit",
                                            {
                                                value: new String(t.title),
                                                change: this.onEdited,
                                                blur: this.onEdited
                                            },
                                            (e: HTMLInputElement) => setTimeout(() => e.select(), 0)
                                        ]
                                    ];
                                })
                        ]
                    ] :
                    "",
                this._state.todos.length ?
                    ["footer.footer",
                        ["span.todo-count",
                            ["strong", active.length],
                            active.length === 1 ? " item left" : " items left"
                        ],
                        ["ul.filters",
                            ["li",
                                ["a",
                                    {
                                        href: "#/",
                                        classes: this._state.filter === "/" ? ["selected"] : []
                                    },
                                    "All"
                                ]
                            ],
                            ["li",
                                ["a",
                                    {
                                        href: "#/active",
                                        classes: this._state.filter === "/active" ? ["selected"] : []
                                    },
                                    "Active"
                                ]
                            ],
                            ["li",
                                ["a",
                                    {
                                        href: "#/completed",
                                        classes: this._state.filter === "/completed" ? ["selected"] : []
                                    },
                                    "Completed"
                                ]
                            ]
                        ],
                        this._state.todos.filter(t => t.completed).length ?
                            ["button.clear-completed", { click: this.onClearCompleted },
                                "Clear completed"
                            ] :
                            ""
                    ] :
                    ""
            ]
        ];
    }

    private onInsert = (e: Event) => {
        const title = (e.target as HTMLInputElement).value.trim();
        if (title) {
            this.events.emit("insert", title);
        }
    }

    private onCompleteAll = (e: Event) => {
        const complete = (e.target as HTMLInputElement).checked;
        this.events.emit("complete-all", complete);
    }

    private onComplete = (e: Event) => {
        const id = Number((e.target as HTMLElement).dataset.id);
        this.events.emit("complete", id);
    }

    private onDelete = (e: Event) => {
        const id = Number((e.target as HTMLElement).dataset.id);
        this.events.emit("delete", id);
    }

    private onClearCompleted = (e: Event) => {
        this.events.emit("clear-completed");
    }

    private onEdit = (e: Event) => {
        const id = Number((e.target as HTMLElement).dataset.id);
        this.events.emit("edit", id);
    }

    private onEdited = (e: Event) => {
        const title = (e.target as HTMLInputElement).value.trim();
        this.events.emit("edited", title);
    }

}
