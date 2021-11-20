// src/model.js
import {createStore, createEvent, combine} from 'effector';
import connectLocalStorage from "effector-localstorage/sync";

// сторы

const $todosLocalStorage = connectLocalStorage("todos")
  .onError((err) => console.log(err)) // setup error callback
//   .onChange(setCounter) // call event on external storage change

// все задачи
export const $todos = createStore($todosLocalStorage.init([]));
$todos.watch($todosLocalStorage)

// текущий фильтр, для простоты будет null/true/false
export const $activeFilter = createStore(null);

// отфильтрованные задачи
export const $filteredTodos = combine(
  $todos,
  $activeFilter,
  (todos, filter) => filter === null
    ? todos
    : todos.filter(todo => todo.completed === filter)
);

// все ли завершены
export const $isAllCompleted = $todos.map((todos) => todos.every(todo => todo.completed ));

// события

// добавление новой задачи
export const appended = createEvent();

// выполнение/снятие выполнения задачи
export const toggled = createEvent();

// удаление задачи
export const removed = createEvent();

// выполнение всех задач
export const allCompleted = createEvent();

// удаление выполненных задач
export const completedRemoved = createEvent();

// фильтрация задач
export const filtered = createEvent();
$todos
  // добавление новой задачи
  .on(appended, (state, title) => [...state, {title, completed: false}])
  // удаление задачи. Для простоты будем проверять title
  .on(removed, (state, title) => state.filter(item => item.title !== title))
  // выполнение/снятие выполнения
  .on(toggled, (state, title) => state.map(item => item.title === title
    ? ({...item, completed: !item.completed})
    : item))
  // выполнение всех задач
  .on(allCompleted, (state) => { const val = !$isAllCompleted.getState(); return state.map(item => item.completed === val
    ? item
    : ({...item, completed: val}))
  })
  // удаление выполненных задач
  .on(completedRemoved, state => state.filter(item => !item.completed));

$activeFilter
  // фильтрация
  .on(filtered, (_, filter) => filter);
