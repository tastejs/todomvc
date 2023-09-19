import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Item from "./item";

const setup = () => {
    const props = {
        todo: {
            id: 0,
            text: "Use Redux",
            completed: false,
        },
        editTodo: jest.fn(),
        deleteTodo: jest.fn(),
        toggleTodo: jest.fn(),
    };

    const { rerender } = render(<Item {...props} />);

    return {
        props,
        rerender,
    };
};

describe("components", () => {
    describe("TodoItem", () => {
        it("initial render", async () => {
            setup();

            const item = await screen.queryByTestId("todo-item");
            expect(item).toBeInTheDocument();

            const text = await screen.queryByText("Use Redux");
            expect(text).toBeInTheDocument();
        });

        it("input onChange should call toggleTodo", async () => {
            const { props } = setup();

            const toggle = await screen.getByTestId("todo-item-toggle");
            expect(toggle).toBeInTheDocument();
            fireEvent.click(toggle);
            expect(props.toggleTodo).toBeCalled();
        });

        it("button onClick should call deleteTodo", async () => {
            const { props } = setup();

            const button = await screen.getByTestId("todo-item-button");
            expect(button).toBeInTheDocument();
            fireEvent.click(button);
            expect(props.deleteTodo).toBeCalled();
        });

        it("label onDoubleClick should put component in edit state", async () => {
            const { props } = setup();

            const label = await screen.getByTestId("todo-item-label");
            expect(label).toBeInTheDocument();
            fireEvent.dblClick(label);

            const input = await screen.getByTestId("text-input");
            expect(input).toBeInTheDocument();

            fireEvent.change(input, { target: { value: "test" } });
            expect(input.value).toBe("test");
            fireEvent.keyDown(input, {
                keyCode: 13,
            });
            expect(props.editTodo).toHaveBeenCalledWith(0, "test");

            const after = await screen.getByTestId("todo-item-label");
            expect(after).toBeInTheDocument();
        });

        it("TodoTextInput onSave should call deleteTodo if text is empty", async () => {
            const { props } = setup();

            const label = await screen.getByTestId("todo-item-label");
            expect(label).toBeInTheDocument();
            fireEvent.dblClick(label);

            const input = await screen.getByTestId("text-input");
            expect(input).toBeInTheDocument();

            fireEvent.change(input, { target: { value: "" } });
            expect(input.value).toBe("");
            fireEvent.keyDown(input, {
                keyCode: 13,
            });
            expect(props.deleteTodo).toHaveBeenCalled();

            const after = await screen.getByTestId("todo-item-label");
            expect(after).toBeInTheDocument();
        });
    });
});
