import todos from "./todos";
import * as types from "../constants/action-types";

describe("todos reducer", () => {
    it("should handle initial state", () => {
        expect(todos(undefined, {})).toEqual([]);
    });

    it("should handle ADD_TODO", () => {
        expect(
            todos([], {
                type: types.ADD_TODO,
                text: "Run the tests",
            })
        ).toMatchObject([
            {
                completed: false,
                text: "Run the tests",
            },
        ]);

        expect(
            todos(
                [
                    {
                        id: 0,
                        completed: false,
                        text: "Use Redux",
                    },
                ],
                {
                    type: types.ADD_TODO,
                    text: "Run the tests",
                }
            )
        ).toMatchObject([
            {
                completed: false,
                text: "Use Redux",
            },
            {
                completed: false,
                text: "Run the tests",
            },
        ]);

        expect(
            todos(
                [
                    {
                        text: "Use Redux",
                        completed: false,
                        id: 0,
                    },
                    {
                        text: "Run the tests",
                        completed: false,
                        id: 1,
                    },
                ],
                {
                    type: types.ADD_TODO,
                    text: "Fix the tests",
                }
            )
        ).toMatchObject([
            {
                text: "Use Redux",
                completed: false,
            },
            {
                text: "Run the tests",
                completed: false,
            },
            {
                text: "Fix the tests",
                completed: false,
            },
        ]);
    });

    it("should handle DELETE_TODO", () => {
        expect(
            todos(
                [
                    {
                        text: "Run the tests",
                        completed: false,
                        id: 1,
                    },
                    {
                        text: "Use Redux",
                        completed: false,
                        id: 0,
                    },
                ],
                {
                    type: types.DELETE_TODO,
                    id: 1,
                }
            )
        ).toEqual([
            {
                text: "Use Redux",
                completed: false,
                id: 0,
            },
        ]);
    });

    it("should handle EDIT_TODO", () => {
        expect(
            todos(
                [
                    {
                        text: "Run the tests",
                        completed: false,
                        id: 1,
                    },
                    {
                        text: "Use Redux",
                        completed: false,
                        id: 0,
                    },
                ],
                {
                    type: types.EDIT_TODO,
                    text: "Fix the tests",
                    id: 1,
                }
            )
        ).toEqual([
            {
                text: "Fix the tests",
                completed: false,
                id: 1,
            },
            {
                text: "Use Redux",
                completed: false,
                id: 0,
            },
        ]);
    });

    it("should handle TOGGLE_TODO", () => {
        expect(
            todos(
                [
                    {
                        text: "Run the tests",
                        completed: false,
                        id: 1,
                    },
                    {
                        text: "Use Redux",
                        completed: false,
                        id: 0,
                    },
                ],
                {
                    type: types.TOGGLE_TODO,
                    id: 1,
                }
            )
        ).toEqual([
            {
                text: "Run the tests",
                completed: true,
                id: 1,
            },
            {
                text: "Use Redux",
                completed: false,
                id: 0,
            },
        ]);
    });

    it("should handle TOGGLE_ALL", () => {
        expect(
            todos(
                [
                    {
                        text: "Run the tests",
                        completed: true,
                        id: 1,
                    },
                    {
                        text: "Use Redux",
                        completed: false,
                        id: 0,
                    },
                ],
                {
                    type: types.TOGGLE_ALL,
                }
            )
        ).toMatchObject([
            {
                text: "Run the tests",
                completed: true,
                id: 1,
            },
            {
                text: "Use Redux",
                completed: true,
                id: 0,
            },
        ]);

        // Unmark if all todos are currently completed
        expect(
            todos(
                [
                    {
                        text: "Run the tests",
                        completed: true,
                        id: 1,
                    },
                    {
                        text: "Use Redux",
                        completed: true,
                        id: 0,
                    },
                ],
                {
                    type: types.TOGGLE_ALL,
                }
            )
        ).toEqual([
            {
                text: "Run the tests",
                completed: false,
                id: 1,
            },
            {
                text: "Use Redux",
                completed: false,
                id: 0,
            },
        ]);
    });

    it("should handle CLEAR_COMPLETED", () => {
        expect(
            todos(
                [
                    {
                        text: "Run the tests",
                        completed: true,
                        id: 1,
                    },
                    {
                        text: "Use Redux",
                        completed: false,
                        id: 0,
                    },
                ],
                {
                    type: types.CLEAR_COMPLETED,
                }
            )
        ).toEqual([
            {
                text: "Use Redux",
                completed: false,
                id: 0,
            },
        ]);
    });

    it("should not generate duplicate ids after CLEAR_COMPLETED", () => {
        expect(
            [
                {
                    type: types.TOGGLE_TODO,
                    id: 0,
                },
                {
                    type: types.CLEAR_COMPLETED,
                },
                {
                    type: types.ADD_TODO,
                    text: "Write more tests",
                },
            ].reduce(todos, [
                {
                    id: 0,
                    completed: false,
                    text: "Use Redux",
                },
                {
                    id: 1,
                    completed: false,
                    text: "Write tests",
                },
            ])
        ).toMatchObject([
            {
                text: "Write tests",
                completed: false,
            },
            {
                text: "Write more tests",
                completed: false,
            },
        ]);
    });
});
