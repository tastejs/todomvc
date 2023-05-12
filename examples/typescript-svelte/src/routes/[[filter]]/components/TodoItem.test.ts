import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { render, screen, cleanup, type RenderResult } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { bindListeners } from '../../../tests/utils';

import TodoItem, { type Events } from './TodoItem.svelte';
import { tick } from 'svelte';

let rendered: RenderResult<TodoItem>;
let user: ReturnType<typeof userEvent.setup>;

function queryInContainer<
  E extends Element = Element
>(selector: string): E | null {
  return rendered.container?.querySelector?.(selector);
}

const origTodo = {
  id: 57,
  title: 'Hello World!',
  completed: false,
};

describe('<TodoItem>', () => {
	beforeEach(() => {
		user = userEvent.setup();
		rendered = render(TodoItem, {
      props: {
        todo: origTodo,
      },
    });
	});

	afterEach(() => {
		cleanup();
	});

	it('should show todo title', () => {
    const label = queryInContainer('.todo .view label')!;

    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe('Hello World!');
  });

  describe('complete', () => {
    it('should show correct checkbox by completed', () => {
      const todo = queryInContainer('.todo');
      const toggle = screen.getByRole<HTMLInputElement>('checkbox');

      expect(todo).not.toHaveClass('completed');
      expect(toggle).toBeInTheDocument();
      expect(toggle).not.toBeChecked();
    });

    it('should trigger complete event when change toggle checkbox', async () => {
      let completedTodo;
      const onComplete = vi.fn(({ detail: { completed }}) => completedTodo = {
        ...origTodo,
        completed,
      });
      bindListeners<Events>(rendered.component, {
        complete: onComplete,
      });

      const toggle = screen.getByRole('checkbox');

      await user.click(toggle);
      rendered.component.$set({
        todo: completedTodo,
      });
      await tick();

      expect(onComplete).toBeCalled();
      expect(completedTodo).toBeTruthy();
      expect(queryInContainer('.todo')).toHaveClass('completed');
    });
  });

  describe('edit', () => {
    function getLabelAndEditInput() {
      return {
        label: queryInContainer<HTMLLabelElement>('.todo .view label')!,
        editInput: screen.getByRole<HTMLInputElement>('textbox'),
      };
    }

    it('should not have `editing` class when not editing', () => {
      const todo = queryInContainer('.todo');

      expect(todo).not.toHaveClass('editing');
    });

    it('should enter edit mode when double click todo title', async () => {
      const todo = queryInContainer('.todo');
      const { label, editInput } = getLabelAndEditInput();

      await user.dblClick(label);

      expect(todo).toHaveClass('editing');
      expect(editInput).toBeVisible();
      expect(editInput.value).toBe('Hello World!');
      expect(editInput).toEqual(document.activeElement);
    });

    it('should trigger edit event when finish edit', async () => {
      let editedTodo;
      const onEdit = vi.fn(({ detail: todo }) => editedTodo = todo);
      bindListeners<Events>(rendered.component, {
        edit: onEdit,
      });

      const { label, editInput } = getLabelAndEditInput();

      await user.dblClick(label);
      await user.type(editInput, '-你好，世界');
      await user.keyboard('[Enter]');

      expect(onEdit).toBeCalled();
      expect(editedTodo).toEqual({
        ...origTodo,
        title: 'Hello World!-你好，世界',
      });
    });

    it('should reset completed to false when finish edit', async () => {
      let editedTodo;
      const onEdit = vi.fn(({ detail: todo }) => editedTodo = todo);
      bindListeners<Events>(rendered.component, {
        edit: onEdit,
      });
      rendered.component.$set({
        todo: {
          ...origTodo,
          completed: true,
        },
      });

      const { label, editInput } = getLabelAndEditInput();

      await user.dblClick(label);
      await user.type(editInput, '1');
      await user.keyboard('[Enter]');

      expect(onEdit).toBeCalled();
      expect(editedTodo).toEqual({
        ...origTodo,
        title: 'Hello World!1',
      });
    });

    it('should trigger edit event with trimed value', async () => {
      let editedTodo;
      const onEdit = vi.fn(({ detail: todo }) => editedTodo = todo);
      bindListeners<Events>(rendered.component, {
        edit: onEdit,
      });

      const { label, editInput } = getLabelAndEditInput();

      await user.dblClick(label);
      await user.type(editInput, '[Space]1[Space]');
      await user.keyboard('[Enter]');

      expect(onEdit).toBeCalled();
      expect(editedTodo).toEqual({
        ...origTodo,
        title: 'Hello World! 1',
      });
    });

    it('should not trigger edit event when press escape', async () => {
      const onEdit = vi.fn();
      bindListeners<Events>(rendered.component, {
        edit: onEdit,
      });

      const { label, editInput } = getLabelAndEditInput();

      await user.dblClick(label);
      await user.type(editInput, '[Backspace][Backspace][Escape]');

      expect(onEdit).not.toBeCalled();
    });

    it('should not trigger edit but remove event when finish edit with empty value', async () => {
      const onEdit = vi.fn();
      const onRemove = vi.fn();
      bindListeners<Events>(rendered.component, {
        edit: onEdit,
        remove: onRemove,
      });

      const { label, editInput } = getLabelAndEditInput();

      await user.dblClick(label);
      await user.type(editInput, '[Backspace]'.repeat(12));
      await user.keyboard('[Enter]');

      expect(onEdit).not.toBeCalled();
    });
  });

  describe('remove', () => {
    it('should show remove button on hover', async () => {
      const view = queryInContainer('.view')!;
      const destroyButton = screen.getByRole('button');

      expect(view).toBeInTheDocument();
      await user.hover(view);
      expect(destroyButton).toBeVisible();
    });

    it('should trigger remove event', async () => {
      let removedTodo;
      const onRemove = vi.fn(({ detail: todo }) => removedTodo = todo);
      bindListeners<Events>(rendered.component, {
        remove: onRemove,
      });

      const view = queryInContainer('.view')!;
      const destroyButton = screen.getByRole('button');

      await user.hover(view);
      await user.click(destroyButton);

      expect(onRemove).toBeCalled();
      expect(removedTodo).toEqual(origTodo);
    });
  });
});
