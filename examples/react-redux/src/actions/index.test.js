import * as types from "../constants/action-types";
import * as actions from "./index";

describe("todo actions", () => {
    it("addTodo should create ADD_TODO action", () => {
        expect(actions.addTodo("Use Redux")).toEqual({
            type: types.ADD_TODO,
            text: "Use Redux",
        });
    });

    it("deleteTodo should create DELETE_TODO action", () => {
        expect(actions.deleteTodo(1)).toEqual({
            type: types.DELETE_TODO,
            id: 1,
        });
    });

    it("editTodo should create EDIT_TODO action", () => {
        expect(actions.editTodo(1, "Use Redux everywhere")).toEqual({
            type: types.EDIT_TODO,
            id: 1,
            text: "Use Redux everywhere",
        });
    });

    it("toggleTodo should create TOGGLE_TODO action", () => {
        expect(actions.toggleTodo(1)).toEqual({
            type: types.TOGGLE_TODO,
            id: 1,
        });
    });

    it("toggleAll should create TOGGLE_ALL action", () => {
        expect(actions.toggleAll()).toEqual({
            type: types.TOGGLE_ALL,
        });
    });

    it("clearCompleted should create CLEAR_COMPLETED action", () => {
        expect(actions.clearCompleted()).toEqual({
            type: types.CLEAR_COMPLETED,
        });
    });
});
