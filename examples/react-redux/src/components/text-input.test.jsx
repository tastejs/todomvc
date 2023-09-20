import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "./text-input";

const setup = (propOverrides) => {
    const props = Object.assign(
        {
            onSave: jest.fn(),
            text: "Use Redux",
            placeholder: "What needs to be done?",
            editing: false,
            newTodo: false,
        },
        propOverrides
    );

    const { rerender } = render(<TextInput {...props} />);

    return {
        props,
        rerender,
    };
};

describe("components", () => {
    describe("TodoTextInput", () => {
        it("should render correctly", async () => {
            setup();
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            expect(input).toBeInTheDocument();
            expect(input.value).toEqual("Use Redux");
        });

        it("should update value on change", async () => {
            setup();
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            expect(input.value).toEqual("Use Redux");
            fireEvent.change(input, { target: { value: "" } });
            expect(input.value).toEqual("");
        });

        it("should call onSave on return key press", async () => {
            const { props } = setup();
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            expect(input.value).toEqual("Use Redux");
            fireEvent.change(input, { target: { value: "test" } });
            expect(input.value).toEqual("test");
            fireEvent.keyDown(input, {
                keyCode: 13,
            });
            expect(props.onSave).toHaveBeenCalled();
        });

        it("should reset state on return key press if newTodo", async () => {
            setup({ newTodo: true });
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            fireEvent.change(input, { target: { value: "test" } });
            expect(input.value).toEqual("test");
            fireEvent.keyDown(input, {
                keyCode: 13,
            });
            expect(input.value).toEqual("");
        });

        it("should call onSave on blur", async () => {
            const { props } = setup();
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            expect(input.value).toEqual("Use Redux");
            fireEvent.change(input, { target: { value: "test" } });
            expect(input.value).toEqual("test");
            fireEvent.blur(input);
            expect(props.onSave).toHaveBeenCalled();
        });

        it("shouldnt call onSave on blur if newTodo", async () => {
            const { props } = setup({ newTodo: true });
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            expect(input.value).toEqual("Use Redux");
            fireEvent.blur(input);
            expect(props.onSave).not.toHaveBeenCalled();
        });
    });
});
