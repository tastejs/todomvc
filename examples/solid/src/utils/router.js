import { createSignal, createContext, onCleanup, useContext } from 'solid-js';

const RouterContext = createContext(null);

export function Router(props) {
	const [location, setLocation] = createSignal(window.location.hash.slice(2) || '');

	const listener = () => setLocation(window.location.hash.slice(2));
	window.addEventListener('hashchange', listener);
	onCleanup(() => window.removeEventListener('hashchange', listener));

	return <RouterContext.Provider value={{location, matches(match) { return match === location() }}}>
		{props.children}
	</RouterContext.Provider>
}

export function useRouter() {
	return useContext(RouterContext);
}
