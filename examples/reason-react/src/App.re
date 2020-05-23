open Belt;

module Decode = Decode.AsResult.OfParseError;
let ((<$>), (<*>)) = Decode.(map, apply);

let persistentKey = "todos-reason-react";

let rec any = (xs, predicate) =>
  switch (xs) {
  | [] => false
  | [y, ...ys] =>
    if (predicate(y)) {
      true;
    } else {
      any(ys, predicate);
    }
  };

module Todo = {
  type t = {
    title: string,
    completed: bool,
    id: int,
  };
  let make = (title, completed, id) => {title, completed, id};

  let decode =
    Decode.(
      make
      <$> field("title", string)
      <*> field("completed", boolean)
      <*> field("id", intFromNumber)
    );

  let encode = (todo): Js.Json.t => {
    Js.Dict.fromList([
      ("title", Js.Json.string(todo.title)),
      ("completed", Js.Json.boolean(todo.completed)),
      ("id", Js.Json.number(todo.id->float_of_int)),
    ])
    ->Js.Json.object_;
  };
};

type todosFilter =
  | Active
  | Completed
  | All;

type state = {
  nextId: int,
  inputField: string,
  todos: list(Todo.t),
  filter: todosFilter,
};

module PersistentState = {
  type t = {
    nextId: int,
    todos: list(Todo.t),
  };

  let make = (nextId, todos) => {nextId, todos};

  let decode =
    Decode.(
      make
      <$> field("nextId", intFromNumber)
      <*> field("todos", list(Todo.decode))
    );

  let encode = (persistentState): Js.Json.t => {
    Js.Dict.fromList([
      ("nextId", Js.Json.number(persistentState.nextId->float_of_int)),
      (
        "todos",
        persistentState.todos
        ->List.map(Todo.encode)
        ->List.toArray
        ->Js.Json.array,
      ),
    ])
    ->Js.Json.object_;
  };

  let fromState = (state: state): t => {
    nextId: state.nextId,
    todos: state.todos,
  };
};

type action =
  | UpdateState(PersistentState.t)
  | UpdateFilter(todosFilter)
  | ClearCompleted
  | DeleteTodo(int)
  | AddTodo
  | UpdateInputField(string)
  | CompleteAll
  | ToggleTodo(int)
  | UpdateTodo(int, Todo.t);

let reducer = (state, action) =>
  switch (action) {
  | UpdateState(persistentState) => {
      ...state,
      todos: persistentState.todos,
      nextId: persistentState.nextId,
    }
  | UpdateFilter(filter) => {...state, filter}
  | ClearCompleted =>
    let newState = {
      ...state,
      todos: state.todos->List.keep(todo => !todo.completed),
    };
    Dom.Storage2.(
      setItem(
        localStorage,
        persistentKey,
        Js.Json.stringify(
          newState->PersistentState.fromState->PersistentState.encode,
        ),
      )
    );
    newState;
  | DeleteTodo(id) =>
    let newState = {
      ...state,
      todos: state.todos->List.keep(todo => todo.id != id),
    };
    Dom.Storage2.(
      setItem(
        localStorage,
        persistentKey,
        Js.Json.stringify(
          newState->PersistentState.fromState->PersistentState.encode,
        ),
      )
    );
    newState;
  | AddTodo =>
    let newState = {
      ...state,
      inputField: "",
      nextId: state.nextId + 1,
      todos:
        List.concat(
          state.todos,
          [
            {id: state.nextId + 1, completed: false, title: state.inputField},
          ],
        ),
    };
    Dom.Storage2.(
      setItem(
        localStorage,
        persistentKey,
        Js.Json.stringify(
          newState->PersistentState.fromState->PersistentState.encode,
        ),
      )
    );
    newState;
  | UpdateInputField(inputField) => {...state, inputField}
  | CompleteAll =>
    let newState = {
      ...state,
      todos: {
        let completed = any(state.todos, todo => !todo.completed);
        state.todos->List.map(todo => {...todo, completed});
      },
    };
    Dom.Storage2.(
      setItem(
        localStorage,
        persistentKey,
        Js.Json.stringify(
          newState->PersistentState.fromState->PersistentState.encode,
        ),
      )
    );
    newState;
  | ToggleTodo(id) =>
    let newState = {
      ...state,
      todos: {
        state.todos
        ->List.map(todo =>
            if (id == todo.id) {
              {...todo, completed: !todo.completed};
            } else {
              todo;
            }
          );
      },
    };
    Dom.Storage2.(
      setItem(
        localStorage,
        persistentKey,
        Js.Json.stringify(
          newState->PersistentState.fromState->PersistentState.encode,
        ),
      )
    );
    newState;
  | UpdateTodo(id, todo) =>
    let newState = {
      ...state,
      todos: {
        state.todos
        ->List.map(newTodo =>
            if (id == newTodo.id) {
              todo;
            } else {
              newTodo;
            }
          );
      },
    };
    Dom.Storage2.(
      setItem(
        localStorage,
        persistentKey,
        Js.Json.stringify(
          newState->PersistentState.fromState->PersistentState.encode,
        ),
      )
    );
    newState;
  };

let initialState = {nextId: 0, inputField: "", todos: [], filter: All};

module TodoView = {
  [@react.component]
  let make = (~todo: Todo.t, ~dispatch) => {
    let (editing, setEditing) = React.useState(() => false);
    let (inputValue, setInputValue) = React.useState(() => todo.title);
    React.useEffect1(
      () => {
        setInputValue(_ => todo.title);
        None;
      },
      [|todo.title|],
    );
    <li
      className={
        (todo.completed ? "completed " : "") ++ (editing ? "editing" : "")
      }>
      <div className="view">
        <input
          className="toggle"
          type_="checkbox"
          checked={todo.completed}
          onChange={_ => dispatch(ToggleTodo(todo.id))}
        />
        <label onDoubleClick={_ => setEditing(_ => true)}>
          {React.string(todo.title)}
        </label>
        <button
          className="destroy"
          onClick={_ => dispatch(DeleteTodo(todo.id))}
        />
      </div>
      {if (editing) {
         <input
           autoFocus=true
           className="edit"
           value=inputValue
           onChange={e => {
             let title = ReactEvent.Form.target(e)##value;
             setInputValue(_ => title);
           }}
           onKeyUp={e => {
             let key = ReactEvent.Keyboard.key(e);
             if (key == "Enter") {
               setEditing(_ => false);
               dispatch(UpdateTodo(todo.id, {...todo, title: inputValue}));
             } else {
               ();
             };
           }}
           onBlur={_ => setEditing(_ => false)}
         />;
       } else {
         React.null;
       }}
    </li>;
  };
};

[@react.component]
let make = () => {
  let ({inputField, todos, filter}, dispatch) =
    React.useReducer(reducer, initialState);
  let todosLength = todos->List.length;
  let showMain = todosLength > 0;
  let (remainingTodos, completedTodos) =
    todos->List.partition(todo => !todo.completed);
  let remainingTodosLength = remainingTodos->List.length;
  let completedTodosLength = completedTodos->List.length;
  let allComplete = remainingTodosLength == 0;
  let url = ReasonReactRouter.useUrl();
  let visibleTodos =
    switch (filter) {
    | All => todos
    | Active => remainingTodos
    | Completed => completedTodos
    };
  React.useEffect1(
    () => {
      switch (url.hash) {
      | "/" => dispatch(UpdateFilter(All))
      | "/active" => dispatch(UpdateFilter(Active))
      | "/completed" => dispatch(UpdateFilter(Completed))
      | _ => ReasonReactRouter.push("#/")
      };
      None;
    },
    [|url.hash|],
  );
  React.useEffect0(() => {
    let persistentStateMaybe =
      Dom.Storage.(getItem(persistentKey, localStorage));
    switch (persistentStateMaybe) {
    | Some(str) =>
      switch (Js.Json.parseExn(str)) {
      | json =>
        let persistentStateResult = PersistentState.decode(json);
        switch (persistentStateResult) {
        | Ok(persistentState) => dispatch(UpdateState(persistentState))
        | Error(err) =>
          Js.Console.error(Decode.ParseError.failureToDebugString(err))
        };
      | exception x => Js.Console.error(x)
      }
    | None => ()
    };
    None;
  });
  <>
    <section className="todoapp">
      <header className="header">
        <h1> {React.string("todos")} </h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus=true
          value=inputField
          onChange={e => {
            let inputField = ReactEvent.Form.target(e)##value;
            dispatch(UpdateInputField(inputField));
          }}
          onKeyUp={e => {
            let key = ReactEvent.Keyboard.key(e);
            if (key == "Enter" && String.trim(inputField) != "") {
              dispatch(AddTodo);
            } else {
              ();
            };
          }}
        />
      </header>
      {if (showMain) {
         <>
           /*<!-- This section should be hidden by default and shown when there are todos -->*/
           <section className="main">
             <input
               id="toggle-all"
               className="toggle-all"
               type_="checkbox"
               onChange={_ => dispatch(CompleteAll)}
               checked=allComplete
             />
             <label htmlFor="toggle-all">
               {React.string("Mark all as complete")}
             </label>
             <ul className="todo-list">
               /*<!-- List items should get the className `editing` when editing and `completed` when marked as completed -->*/

                 {visibleTodos
                  ->List.map(todo =>
                      <TodoView dispatch todo key={string_of_int(todo.id)} />
                    )
                  ->List.toArray
                  ->React.array}
               </ul>
           </section>
           /*<!-- This footer should hidden by default and shown when there are todos -->*/
           <footer className="footer">
             /*<!-- This should be `0 items left` by default -->*/

               <span className="todo-count">
                 <strong> {React.int(remainingTodosLength)} </strong>
                 {React.string(
                    " item"
                    ++ (remainingTodosLength == 1 ? "" : "s")
                    ++ " left",
                  )}
               </span>
               /*<!-- Remove this if you don't implement routing -->*/
               <ul className="filters">
                 <li>
                   <a className="selected" href="#/">
                     {React.string("All")}
                   </a>
                 </li>
                 <li> <a href="#/active"> {React.string("Active")} </a> </li>
                 <li>
                   <a href="#/completed"> {React.string("Completed")} </a>
                 </li>
               </ul>
               /*<!-- Hidden if no completed items are left ↓ -->*/
               {if (completedTodosLength > 0) {
                  <button
                    className="clear-completed"
                    onClick={_ => dispatch(ClearCompleted)}>
                    {React.string("Clear completed")}
                  </button>;
                } else {
                  React.null;
                }}
             </footer>
         </>;
       } else {
         React.null;
       }}
    </section>
    <footer className="info">
      <p> {React.string("Double-click to edit a todo")} </p>
      /*<!-- Remove the below line ↓ -->*/
      <p>
        {React.string("Template by ")}
        <a href="http://sindresorhus.com">
          {React.string("Sindre Sorhus")}
        </a>
      </p>
      /*<!-- Change this out with your name and url ↓ -->*/
      <p>
        {React.string("Created by ")}
        <a href="https://github.com/hamza0867">
          {React.string("hamza0867")}
        </a>
      </p>
      <p>
        {React.string("Part of ")}
        <a href="http://todomvc.com"> {React.string("TodoMVC")} </a>
      </p>
    </footer>
  </>;
};
