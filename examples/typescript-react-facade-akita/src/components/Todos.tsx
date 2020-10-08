import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTransition, animated } from "react-spring";

import { IonItem, IonButton, IonLabel, IonIcon, IonContent } from '@ionic/react';
import { trash } from 'ionicons/icons';
import { Todo } from '../state';

export interface TodoListProps {
  todos: Todo[];
  onToggle: (item: Todo) => void;
  onDelete: (item: Todo) => void;
}

export interface TodoItemProps {
  todo: Todo;
  toggleComplete: (item: Todo) => void;
  deleteTodo: (item: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <IonItem href="#" style={{ width: '92vw' }}>
      <IonLabel style={{ marginRight: '10px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </IonLabel>
      <IonButton fill="clear" onClick={() => deleteTodo(todo)}>
        <IonIcon icon={trash} color="warning" size="large" slot="start" style={{ '--ion-color-warning': '#843939' }} />
      </IonButton>
      <IonButton onClick={() => toggleComplete(todo)}>Toggle Status</IonButton>
      <IonButton onClick={() => (todo.completed = true)} color="danger">
        Mutate Status (error)
      </IonButton>
    </IonItem>
  );
};

/**
 * Animation using 'react-transition-group'
 * see class 'todo' in styles.csss
 */
export const TodoList_Orig: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  return (
    <IonContent className="content">
      <ul>
        <TransitionGroup className="todos">
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="todo" in={true}>
              <TodoItem key={todo.id} todo={todo} toggleComplete={onToggle} deleteTodo={onDelete} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    </IonContent>
  );
};

/**
 * Animation using React-Spring and `useTransition()` hook
 */
export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  const transitions = useTransition(todos, item => item.id, {
    from:  {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0},
    config: { duration: 300 }
  }, );
  return (
    <IonContent className="content">
      <ul>
          {transitions.map(({item: todo, props, key}) => (
            <animated.div style={props} key={key}>
              <TodoItem todo={todo} toggleComplete={onToggle} deleteTodo={onDelete} />
            </animated.div>              
          ))}
      </ul>
    </IonContent>
  );
};
