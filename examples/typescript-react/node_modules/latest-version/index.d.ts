declare namespace latestVersion {
	interface Options {
		/**
		A semver range or [dist-tag](https://docs.npmjs.com/cli/dist-tag).
		*/
		readonly version?: string;
	}
}

declare const latestVersion: {
	/**
	Get the latest version of an npm package.

	@example
	```
	import latestVersion = require('latest-version');

	(async () => {
		console.log(await latestVersion('ava'));
		//=> '0.18.0'

		console.log(await latestVersion('@sindresorhus/df'));
		//=> '1.0.1'

		// Also works with semver ranges and dist-tags
		console.log(await latestVersion('npm', {version: 'latest-5'}));
		//=> '5.5.1'
	})();
	```
	*/
	(packageName: string, options?: latestVersion.Options): Promise<string>;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function latestVersion(
	// 	packageName: string,
	// 	options?: latestVersion.Options
	// ): Promise<string>;
	// export = latestVersion;
	default: typeof latestVersion;
};

export = latestVersion;
