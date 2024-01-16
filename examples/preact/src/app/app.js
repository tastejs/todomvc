import { h, Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import TodoModel from "./model";
import TodoHeader from "./header";
import TodoMain from "./main.js";
import TodoFooter from "./footer";
import { FILTERS } from "./utils";

const getRoute = () => {
    let route = String(location.hash || "")
        .split("/")
        .pop();

    if (!FILTERS[route])
        route = "all";

    return route;
};

export default function App() {
    const [, setUpdatedAt] = useState(Date.now());
    const [route, setRoute] = useState("all");

    /**
     * The udpate function gets called from the model after changes are made.
     * This sets state in the app component, which forces a re-render.
     *
     */
    function update() {
        setUpdatedAt(Date.now());
    }

    const model = TodoModel(update);

    /**
     * useEffect with an empty dependency array runs on the initial mount of the component.
     * Since it doesn't depend on state or prop changes, it will only run once.
     */
    useEffect(() => {
        function handleHashChange() {
            setRoute(getRoute());
        }

        addEventListener("hashchange", handleHashChange);
        handleHashChange();
    }, []);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            const value = e.target.value.trim();

            if (value) {
                model.addItem(value);
                e.target.value = "";
            }
        }
    }

    function toggleAll(e) {
        model.toggleAll(e.target.checked);
    }

    return (
        <>
            <TodoHeader onKeyDown={handleKeyDown} />
            {model.getTodos().length > 0
                ? <>
                    <TodoMain todos={model.getTodos()} route={route} onChange={toggleAll} onToggle={model.toggleItem} onRemove={model.removeItem} onSave={model.updateItem} />
                    <TodoFooter todos={model.getTodos()} route={route} onClearCompleted={model.clearCompleted} />
                </>
                : null}
        </>
    );
}
