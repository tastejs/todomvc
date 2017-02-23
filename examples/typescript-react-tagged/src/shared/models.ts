export enum TodoFilter {  All, Active, Completed};

export type Action = 
  | { name: "filter", readonly filter: TodoFilter }
  | { name: "todoAdd", readonly title: string }
  | { name: "todoToggle", readonly id: string; }
  | { name: "todoEdit", readonly id: string; }
  | { name: "todoDestroy", readonly id: string; }
  | { name: "todoSubmit" }
  | { name: "todoChange", readonly text: string }
  | { name: "todoCancelEdit" }
  | { name: "toggleAll", readonly checked: boolean }
  | { name: "init" }
  | { name: "clearCompleted" }
  ;

export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

export interface AppProps {
  appStateId: number;
  controller(action: Action): void;
  filter: TodoFilter;
  todos: Todo[];
  todoEdit?: Todo;
}
