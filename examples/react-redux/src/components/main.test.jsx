import { render, screen, fireEvent } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Main from "./main";
import { getCompletedTodos } from "../selectors/filters";

const WrappedComponent = withRouter(Main);

const setup = (propOverrides) => {
    const todos = (propOverrides && propOverrides.todos) || [
        {
            text: "Use Redux",
            completed: false,
            id: 0,
        },
        {
            text: "Run the tests",
            completed: true,
            id: 1,
        },
    ];

    const visibleTodos = [...todos];
    const completedCount = getCompletedTodos(todos).length;
    const activeCount = todos.length - completedCount;

    const props = Object.assign(
        {
            todos: [...todos],
            editTodo: jest.fn(),
            deleteTodo: jest.fn(),
            toggleTodo: jest.fn(),
            toggleAll: jest.fn(),
            clearCompleted: jest.fn(),
            completedCount,
            activeCount,
            visibleTodos,
        },
        propOverrides
    );

    const { rerender } = render(
        <HashRouter>
            <WrappedComponent {...props} />
        </HashRouter>
    );

    return {
        props,
        rerender,
    };
};

describe("components", () => {
    describe("Main", () => {
        it("should render container", async () => {
            setup();
            const main = await screen.queryByTestId("main");
            expect(main).toBeInTheDocument();
        });

        describe("toggle all input", () => {
            it("should render", async () => {
                setup();
                const toggle = await screen.queryByTestId("toggle-all");
                expect(toggle).toBeInTheDocument();
                expect(toggle.checked).toBeFalsy();
            });

            it("should be checked if all todos completed", async () => {
                setup({
                    todos: [
                        {
                            text: "Use Redux",
                            completed: true,
                            id: 0,
                        },
                    ],
                });
                const toggle = await screen.queryByTestId("toggle-all");
                expect(toggle).toBeInTheDocument();
                expect(toggle.checked).toBeTruthy();
            });

            it("should call toggleAll on change", async () => {
                const { props } = setup();
                const toggle = await screen.queryByTestId("toggle-all");
                fireEvent.click(toggle);
                expect(props.toggleAll).toBeCalled();
            });
        });

        describe("footer", () => {
            it("should render", async () => {
                setup();
                const footer = await screen.queryByTestId("footer");
                expect(footer).toBeInTheDocument();

                const text = await screen.queryByText(/1 item left/i);
                expect(text).toBeInTheDocument();

                const clearButton = await screen.queryByText(/Clear completed/i);
                expect(clearButton).toBeInTheDocument();
            });

            it("onClearCompleted should call clearCompleted", async () => {
                const { props } = setup();
                const clearButton = await screen.queryByText(/Clear completed/i);
                expect(clearButton).toBeInTheDocument();
                fireEvent.click(clearButton);
                expect(props.clearCompleted).toBeCalled();
            });
        });

        describe("todo list", () => {
            it("should render", async () => {
                setup();
                const list = await screen.queryByTestId(/todo-list/i);
                expect(list).toBeInTheDocument();
                const items = await screen.getAllByTestId("todo-item");
                expect(items.length).toEqual(2);
            });
        });
    });
});
