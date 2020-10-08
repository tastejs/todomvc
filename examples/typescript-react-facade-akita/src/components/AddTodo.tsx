import * as React from 'react';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { InputChangeEventDetail } from '@ionic/core';
import { IonItem, IonInput, IonIcon } from '@ionic/react';

import { alarm } from 'ionicons/icons';

// ****************************************
// Styles
// ****************************************

export interface CSStyling {
  [key: string]: string;
}

const inlineItem = (hasText, isDirty) =>
  ({
    ['--min-height' as string]: '20px',
    ['--border-radius' as string]: '5px',
    ['--background' as string]: hasText ? '#a8f9d2' : isDirty ? 'pink' : 'white'
  } as CSStyling);

const addForm = {
  marginTop: '13px',
  width: '40vw',
  paddingLeft: '15px'
} as CSStyling;

const iconGap = hasText =>
  ({
    marginRight: '10px',
    marginTop: '3px',
    ['color' as string]: hasText ? 'green' : 'gray'
  } as CSStyling);

// ****************************************
// AddTodo Functional Component
// ****************************************

export interface AddTodoProps {
  showHint: boolean;
  onAdd: (text: string) => void;
}

export const URL_START_HERE =
  'https://user-images.githubusercontent.com/210413/72477181-9748e800-37b4-11ea-8abd-8db0da3d91de.png';

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd, showHint }) => {
  const [text, isDirty, updateText, reset] = useTextField('');
  const hasText = !!text.length;
  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    onAdd(text);
    reset();
    ev.preventDefault();
  };

  return (
    <>
      <CSSTransition in={showHint} timeout={500} classNames="help">
        <img src={URL_START_HERE} className="help" />
      </CSSTransition>
      <div style={addForm}>
        <IonItem style={inlineItem(hasText, isDirty)}>
          <IonIcon icon={alarm} style={iconGap(hasText)} />
          <form onSubmit={onSubmit}>
            <IonInput
              value={text}
              autofocus
              placeholder="Add a todo:"
              onIonChange={updateText}
              onIonBlur={() => reset()}
            ></IonInput>
          </form>
        </IonItem>
      </div>
    </>
  );
};

// ************************************************
// Custom Form Field Hook to track value + isDirty
// ************************************************

export interface TextState {
  isDirty: boolean;
  text: string;
}

export type TextHookResponse = [string, boolean, (e: CustomEvent<InputChangeEventDetail>) => void, () => void];

export function useTextField(initialValue): TextHookResponse {
  const [state, setState] = useState<TextState>({
    isDirty: false,
    text: initialValue
  });
  const updateText = (e: CustomEvent<InputChangeEventDetail>) => {
    const text = e.detail.value;
    setState(current => {
      const isDirty = !!text ? true : current.isDirty;
      return { text, isDirty };
    });
  };
  const reset = () => {
    setState(() => {
      return { text: '', isDirty: false };
    });
  };

  return [state.text, state.isDirty, updateText, reset];
}
