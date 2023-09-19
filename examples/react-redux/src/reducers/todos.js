import { ADD_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO, TOGGLE_ALL, CLEAR_COMPLETED } from "../constants/action-types";

const initialState = [];
function uuid() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        const random = (Math.random() * 16) | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20)
            uuid += "-";

        let currentNumber = random;
        if (i === 12)
            currentNumber = 4;
        else if (i === 16)
            currentNumber = 8 | (random & 3);
        uuid += currentNumber.toString(16);
    }
    return uuid;
}

export default function todos(state = initialState, action) {
    switch (action.type) {
        case ADD_TODO:
            return state.concat({ id: uuid(), text: action.text, completed: false });
        case DELETE_TODO:
            return state.filter((todo) => todo.id !== action.id);
        case EDIT_TODO:
            return state.map((todo) => (todo.id === action.id ? { ...todo, text: action.text } : todo));
        case TOGGLE_TODO:
            return state.map((todo) => (todo.id === action.id ? { ...todo, completed: !todo.completed } : todo));
        case TOGGLE_ALL:
            // eslint-disable-next-line no-case-declarations
            const areAllMarked = state.every((todo) => todo.completed);
            return state.map((todo) => (todo.completed === areAllMarked ? { ...todo, completed: !areAllMarked } : todo));
        case CLEAR_COMPLETED:
            return state.filter((todo) => !todo.completed);
        default:
            return state.slice();
    }
}
