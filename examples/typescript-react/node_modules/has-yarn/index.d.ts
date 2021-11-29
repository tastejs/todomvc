declare const hasYarn: {
	/**
	 * Check if a project is using [Yarn](https://yarnpkg.com).
	 *
	 * @param cwd - Current working directory. Default: `process.cwd()`.
	 * @returns Whether the project uses Yarn.
	 */
	(cwd?: string): boolean;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function hasYarn(cwd?: string): boolean;
	// export = hasYarn;
	default: typeof hasYarn;
};

export = hasYarn;
