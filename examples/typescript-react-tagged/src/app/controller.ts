import { AppProps, Action, Todo, TodoFilter, assertNever } from '../shared';

export interface ControllerResult {
  (s: AppProps): AppProps; 
}

export function controller(action: Action): ControllerResult {
  const a = action;
  switch (a.name) {
    case "filter": //, filter: TodoFilter }
      return funcHelper(s => s.filter = a.filter);

    case "todoAdd": //, readonly title: string }
      return funcHelper(s => s.todos.push(createToDo(""+s.appStateId, a.title)));

    case "todoToggle": //, readonly id: string; }
      return funcHelper(s => s.todos = s.todos.map(x => createToDo(x.id, x.title, x.id===a.id ? !x.completed : x.completed)));

    case "todoEdit": //, readonly id: string; }
      return s => {
        const found = s.todos.filter(x=>x.id===a.id);
        s.todoEdit = (found && found.length > 0) ? found[0] : undefined;
        return s;
      };

    case "todoDestroy": //, readonly id: string; }
      return funcHelper(s => s.todos = s.todos.filter(x => x.id!==a.id));

    case "todoSubmit": // }
      return s => {
        if (s.todoEdit) {
          s.todos = s.todos.map(x => x.id===s.todoEdit.id ? s.todoEdit : x);
          s.todoEdit = undefined;
        }
        return s;
      };

    case "todoChange": //, text: string }
      return s => {
        if (s.todoEdit) {
          s.todoEdit = createToDo(s.todoEdit.id, a.text, s.todoEdit.completed);
        }
        return s;
      };

    case "todoCancelEdit": // }
      return funcHelper(s => s.todoEdit = undefined);

    case "toggleAll": //, readonly checked: boolean }
      return funcHelper(s => s.todos = s.todos.map(x => createToDo(x.id, x.title, a.checked)));

    case "init": // }
      return s => {
        s.todos.push(createToDo("init1", "Get Milk", false));
        s.todos.push(createToDo("init2", "Learn TypeScript", true));
        s.todos.push(createToDo("init3", "Drink Coffee", false));
        return s;
      };

    case "clearCompleted": //, readonly checked: boolean }
      return funcHelper(s => s.todos = s.todos.filter(x => !x.completed));
      

    default: return assertNever(a);
  };
}

function funcHelper(f: (s: AppProps) => void): ControllerResult {
  return s => { f(s); return s; };
}

function createToDo(id: string, title: string, completed = false) : Todo {
  return { id: id, title: title, completed: completed};
}

