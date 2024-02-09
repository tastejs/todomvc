export interface ITodosState {
  todos: ITodo[],
  visibility: 'all'|'completed'|'active',
  count: number
}


export interface ITodo {
  title: string,
  id: number,
  completed: boolean
}