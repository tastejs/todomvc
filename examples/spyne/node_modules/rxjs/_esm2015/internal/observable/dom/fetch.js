import { Observable } from '../../Observable';
export function fromFetch(input, init) {
    return new Observable(subscriber => {
        const controller = new AbortController();
        const signal = controller.signal;
        let outerSignalHandler;
        let unsubscribed = false;
        if (init) {
            if (init.signal) {
                outerSignalHandler = () => {
                    if (!signal.aborted) {
                        controller.abort();
                    }
                };
                init.signal.addEventListener('abort', outerSignalHandler);
            }
            init.signal = signal;
        }
        else {
            init = { signal };
        }
        fetch(input, init).then(response => {
            subscriber.next(response);
            subscriber.complete();
        }).catch(err => {
            if (!unsubscribed) {
                subscriber.error(err);
            }
        });
        return () => {
            unsubscribed = true;
            controller.abort();
        };
    });
}
//# sourceMappingURL=fetch.js.map