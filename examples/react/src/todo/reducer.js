import {
    ADD_ITEM,
    UPDATE_ITEM,
    REMOVE_ITEM,
    TOGGLE_ITEM,
    REMOVE_ALL_ITEMS,
    TOGGLE_ALL,
    REMOVE_COMPLETED_ITEMS,
} from "./constants";

/* nanoid implementation */
let urlAlphabet =
    "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

function nanoid(size = 21) {
    let id = "";
    let i = size;
    while (i--) {
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}

export const todoReducer = (state, action) => {
    switch (action.type) {

       case ADD_ITEM: {
    const title = action.payload.title.trim();

    if (!title) {
        return state;
    }

    return state.concat({
        id: nanoid(),
        title,
        completed: false,
    });
}


        case UPDATE_ITEM: {
            const id = action.payload.id;
            const title = action.payload.title.trim();

            if (!title) {
                return state.filter((todo) => todo.id !== id);
            }

            return state.map((todo) => (todo.id === id ? { ...todo, title } : todo));
        }

        case REMOVE_ITEM:
            return state.filter((todo) => todo.id !== action.payload.id);

        case TOGGLE_ITEM:
            return state.map((todo) =>
                todo.id === action.payload.id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            );

        case REMOVE_ALL_ITEMS:
            return [];

        case TOGGLE_ALL:
            return state.map((todo) =>
                todo.completed !== action.payload.completed
                    ? { ...todo, completed: action.payload.completed }
                    : todo
            );

        case REMOVE_COMPLETED_ITEMS:
            return state.filter((todo) => !todo.completed);

        default:
            return state;
    }
};
