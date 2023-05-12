import '@testing-library/jest-dom';
import { get } from 'svelte/store';
import { localStorage as localStorageStore } from './localStorage';

const TestLocalStorageKey = 'test-ls';

describe('localStorageStore', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should sync value to localStorage', () => {
    const store = localStorageStore({ key: TestLocalStorageKey });
    store.set({ text: 'Hello World!' });

    expect(localStorage[TestLocalStorageKey]).toBe(JSON.stringify({ text: 'Hello World!' }));
  });

  it('should use value in storage as initial value', () => {
    localStorage[TestLocalStorageKey] = JSON.stringify({ text: 'Boom~' });
    const store = localStorageStore({ key: TestLocalStorageKey });

    expect(get(store)).toEqual({
      text: 'Boom~',
    });
  });

  it('should use initialValue parameter as initial value when don\'t have storaged value', () => {
    const store = localStorageStore({ key: TestLocalStorageKey, initialValue: { appName: 'svelte-ts-todomvc' } });

    expect(get(store)).toEqual({
      appName: 'svelte-ts-todomvc',
    });
  });
});
