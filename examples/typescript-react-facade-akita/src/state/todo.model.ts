import { ID, guid } from '@datorama/akita';

export type Todo = {
  id: ID;
  text: string;
  completed: boolean;
};

export function createTodo(text: string): Todo {
  return {
    id: guid(),
    text,
    completed: false
  };
}

export enum VISIBILITY_FILTER {
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
  SHOW_ALL = 'SHOW_ALL'
}
