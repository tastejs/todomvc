export function router(onChange) {
    let route = "all";

    function handleChange() {
        switch (window.location.hash) {
            case "#/active":
                route = "active";
                break;
            case "#/completed":
                route = "completed";
                break;
            default:
                route = "all";
        }

        onChange(route);
    }

    function init() {
        window.addEventListener("hashchange", handleChange);
        // `hashchange` doesn't fire on initial load, so apply the current hash now.
        handleChange();
    }

    return {
        init,
    };
}
