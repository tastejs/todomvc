import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./header";

const setup = () => {
    const props = {
        addTodo: jest.fn(),
    };

    const { rerender } = render(<Header {...props} />);

    return {
        props,
        rerender,
    };
};

describe("components", () => {
    describe("Header", () => {
        it("should render correctly", async () => {
            setup();

            const header = await screen.queryByTestId("header");
            expect(header).toBeInTheDocument();

            const title = await screen.queryByText(/todos/i);
            expect(title).toBeInTheDocument();

            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            expect(input).toBeInTheDocument();
        });

        it("should call addTodo if length of text is greater than 0", async () => {
            const { props } = setup();
            const input = await screen.queryByPlaceholderText(/What needs to be done?/i);
            // no value
            fireEvent.change(input, { target: { value: "" } });
            expect(input.value).toBe("");
            fireEvent.keyDown(input, {
                keyCode: 13,
            });
            expect(props.addTodo).not.toHaveBeenCalled();

            fireEvent.change(input, { target: { value: "test" } });
            expect(input.value).toBe("test");
            fireEvent.keyDown(input, {
                keyCode: 13,
            });
            expect(props.addTodo).toHaveBeenCalledWith("test");
        });
    });
});
