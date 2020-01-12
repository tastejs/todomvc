// Needed for Jest commonjs support
module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					node: "current"
				}
			}
		]
	]
};