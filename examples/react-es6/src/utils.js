export const uuidFunc = () => {
	/*jshint bitwise:false */
	let random;
	let uuid = '';

	for (let i = 0; i < 32; i++) {
		random = (Math.random() * 16) | 0;
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += '-';
		}
		uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
	}

	return uuid;
};

export const pluralize = (count, word) => {
	return count === 1 ? word : word + 's';
};

export const getStore = (namespace, data) => {
	if (data) {
		localStorage.setItem(
			namespace,
			JSON.stringify(data.filter(todo => !todo.hasOwnProperty('exports')))
		);
		const store = localStorage.getItem(namespace);
		return (store && JSON.parse(store)) || [];
	}

	const store = localStorage.getItem(namespace);
	return (store && JSON.parse(store)) || [];
};
