import { useDispatch } from "react-redux";
import TextInput from "./text-input";
import { addTodo } from "../store";

export default function Header() {
    const dispatch = useDispatch();

    const handleSave = (text) => {
        if (text.length !== 0) dispatch(addTodo(text));
    };

    return (
        <header className="header" data-testid="header">
            <h1>todos</h1>
            <TextInput newTodo onSave={handleSave} placeholder="What needs to be done?" />
        </header>
    );
}
