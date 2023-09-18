export function useKeyListener(props) {
    const { target, event, callbacks } = props;

    function handleEvent(event) {
        Object.keys(callbacks).forEach((key) => {
            if (event.key === key)
                callbacks[key](event);
        });
    }

    function connect() {
        target.addEventListener(event, handleEvent);
    }

    function disconnect() {
        target.removeEventListener(event, handleEvent);
    }

    return {
        connect,
        disconnect,
    };
}
