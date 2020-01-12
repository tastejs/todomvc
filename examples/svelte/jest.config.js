module.exports = {
	transform: {
		"^.+\\.js$": "babel-jest",
		"^.+\\.svelte$": "jest-transform-svelte"
	},
	moduleFileExtensions: ["js", "json", "svelte"],
	coverageReporters: ['html'],
	clearMocks: true,
	setupFilesAfterEnv: [
			"@testing-library/jest-dom/extend-expect"
	],
};