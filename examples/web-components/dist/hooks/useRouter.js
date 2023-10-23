/**
 * Listens for hash change of the url and calls onChange if available.
 *
 * @param {Function} callback
 * @returns Methods to interact with useRouter.
 */
export const useRouter = (callback) => {
    let onChange = callback;
    let current = "";

    /**
     * Change event handler.
     */
    const handleChange = () => {
        current = document.location.hash;
        /* istanbul ignore else */
        if (onChange)
            onChange(document.location.hash);
    };

    /**
     * Initializes router and adds listeners.
     *
     * @param {Function} callback
     */
    const initRouter = (callback) => {
        onChange = callback;
        window.addEventListener("hashchange", handleChange);
        window.addEventListener("load", handleChange);
    };

    /**
     * Removes listeners
     */
    const disableRouter = () => {
        window.removeEventListener("hashchange", handleChange);
        window.removeEventListener("load", handleChange);
    };

    const getRoute = () => current.split("/").slice(-1)[0];

    return { initRouter, getRoute, disableRouter };
};
