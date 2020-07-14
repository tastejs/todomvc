declare module 'escalade' {
	type Promisable<T> = T | Promise<T>;
	export type Callback = (directory: string, files: string[]) => Promisable<string | false | void>;
	function escalade(directory: string, callback: Callback): Promise<string | void>;
	export = escalade;
}

declare module 'escalade/sync' {
	export type Callback = (directory: string, files: string[]) => string | false | void;
	function escalade(directory: string, callback: Callback): string | void;
	export = escalade;
}
