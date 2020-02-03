import { reducer } from "./useTodos";

describe("useTodos", () => {
  it("reduces addTodo", () => {
    const todos = reducer.addTodo([], "test");
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBeDefined();
    expect(todos[0].label).toBe("test");
    expect(todos[0].done).toBe(false);
  });

  it("reduces deleteTodo", () => {
    const todos = reducer.deleteTodo([{ id: "test" }], "test");
    expect(todos).toHaveLength(0);
  });

  it("reduces setLabel", () => {
    const todos = reducer.setLabel([{ id: "test" }], "test", "newLabel");
    expect(todos).toHaveLength(1);
    expect(todos[0].label).toBe("newLabel");
  });

  it("reduces toggleDone", () => {
    const todos = reducer.toggleDone([{ id: "test", done: false }], "test");
    expect(todos).toHaveLength(1);
    expect(todos[0].done).toBe(true);
  });
});
