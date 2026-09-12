import { useReducer, useState } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { todoReducer } from "./reducer";

import "./app.css";

export function App() {
    const [todos, dispatch] = useReducer(todoReducer, []);
    const [search, setSearch] = useState("");

    return (
        <>
            <Header dispatch={dispatch} search={search} onSearchChange={setSearch} />
            <Main todos={todos} dispatch={dispatch} search={search} />
            <Footer todos={todos} dispatch={dispatch} />
        </>
    );
}
