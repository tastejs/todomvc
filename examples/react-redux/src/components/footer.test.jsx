import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "./footer";
import { SHOW_ALL } from "../constants/todo-filters";

const setup = (propOverrides) => {
    const props = Object.assign(
        {
            completedCount: 0,
            activeCount: 0,
            filter: SHOW_ALL,
            onClearCompleted: jest.fn(),
        },
        propOverrides
    );

    const { rerender } = render(<Footer {...props} />);

    return {
        props,
        rerender,
    };
};

describe("components", () => {
    describe("Footer", () => {
        it("should render container", async () => {
            setup();
            const footer = await screen.queryByTestId("footer");
            expect(footer).toBeInTheDocument();
        });

        it("should display active count when 0", async () => {
            setup({ activeCount: 0 });
            const text = await screen.queryByText(/0 items left/i);
            expect(text).toBeInTheDocument();
        });

        it("should display active count when above 0", async () => {
            setup({ activeCount: 1 });
            const text = await screen.queryByText(/1 item left/i);
            expect(text).toBeInTheDocument();
        });

        it("should render filters", async () => {
            setup();
            const footer = await screen.queryByTestId("footer-navigation");
            expect(footer).toBeInTheDocument();
            const allLink = await screen.queryByText(/All/i);
            expect(allLink).toBeInTheDocument();
            const activeLink = await screen.queryByText(/Active/i);
            expect(activeLink).toBeInTheDocument();
            const completedLink = await screen.queryByText(/Completed/i);
            expect(completedLink).toBeInTheDocument();
        });

        it("shouldnt show clear button when no completed todos", async () => {
            setup({ completedCount: 0 });
            const clearButton = await screen.queryByText(/Clear completed/i);
            expect(clearButton).not.toBeInTheDocument();
        });

        it("should render clear button when completed todos", async () => {
            setup({ completedCount: 1 });
            const clearButton = await screen.queryByText(/Clear completed/i);
            expect(clearButton).toBeInTheDocument();
        });

        it("should call onClearCompleted on clear button click", async () => {
            const { props } = setup({ completedCount: 1 });
            const clearButton = await screen.queryByText(/Clear completed/i);
            expect(clearButton).toBeInTheDocument();
            fireEvent.click(clearButton);
            expect(props.onClearCompleted).toBeCalled();
        });
    });
});
