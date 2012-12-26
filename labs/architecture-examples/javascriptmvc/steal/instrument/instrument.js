
/**
 * @class steal.instrument
 * @parent stealjs
 * @plugin steal/instrument
 * @test steal/instrument/qunit.html
 * 
 * Instruments JavaScript code blocks.  As the code runs, a block counter object keeps track 
 * of which blocks of code were run per file.  This information can be used to determine code 
 * coverage statistics.
 * 
 * ## Usage
 * 
 * To turn on instrumentation, simply load a page with the steal option instrument set to true.  One way 
 * to do this is to open any page with steal[instrument]=true in the URL, like 
 * http://localhost/mypage.html?steal[instrument]=true.
 * 
 * ## Ignoring files
 * 
 * If you want to tell steal.instrument to ignore certain directories, files, or file patterns, add a 
 * list of patterns to the steal instrument param value.  This param accepts an array of strings which are used to ignore files.  For 
 * example: http://localhost/mypage.html?steal[instrument]=jquery,*_test.js.
 * 
 * The * is a wildcard character.  The above example would ignore any files in the jquery directory, along with 
 * any file ending in _test.js.  Ignored files are stolen normally, without any instrumentation.
 * 
 * To ignore all JMVC and test directories, pass !jmvc steal[instrument]=!jmvc, which ignores "jquery","funcunit","steal","documentjs","*\/test","*_test.js", "mxui"
 * 
 * To ignore nothing, pass true, like http://localhost/mypage.html?steal[instrument]=true
 * 
 * ## How it works
 * 
 * steal.instrument works by adding a custom JS converter.  When an instrumented file is stolen, it:
 * 
 * 1. Is loaded via AJAX (hence cross domain files are ignored, since the AJAX request would fail)
 * 2. The text from the file is parsed, using the JS parser written by Mihai Bazon for the [https://github.com/mishoo/UglifyJS UglifyJS project]
 * 3. The text from the file is rebuilt from the parse tree.  At the start of any block of code, a line like 
 * __s("foo.js", 3) is added.  When this block runs, this function call will increment the counter for block 3 
 * in foo.js.
 * 4. This text is then eval-ed in global scope.
 * 
 * To make this as fast as possible, localStorage is used where possible.  Instrumented files are cached in 
 * localStorage with a hash representing their contents.  Next run, this cache is checked first.  If the file has changed, 
 * the hash will change and invalidate the cache.  Otherwise, the cached file is eval-ed.
 * 
 * If the app opens a popup window or iframe, these children frames will all be loaded with instrumentation turned on also.  
 * Each instrumented file is stored in a global object on the opener window, so if children steal the same file, those files will 
 * use the stored version.  This is useful for FuncUnit runs, where child apps are loaded multiple times.
 * 
 * ## Reporting coverage results
 * 
 * When you're ready to calculate results and show them, call steal.instrument.compileStats.  This function inspects all the block 
 * counters, calculates statistics for each file and total statistics for the collection of all files.  Each file has its:
 * 
 * 1. src - not matching the real source because its rebuild from the parse tree
 * 2. linesUsed - an object representing which lines were run in the src.  Each key in the key-value map is a line number.  
 * Each value is the counter for how many times that line was run.  Non-statements are skipped.
 * 3. lineCoverage - percent of lines run
 * 4. blockCoverage - percent of blocks run
 * 5. lines - number of total lines
 * 6. blocks - number of total blocks
 * 
 * FuncUnit has a plugin in funcunit/coverage that uses these stats and builds a reporting view, showing 
 * percentages and which lines were run for each file.
 * 
 * ## Disclaimers
 * 
 * - steal.instrument is very slow in Firefox, but very fast in Chrome.
 * - If you use steal.instrument with apps that steal inside a script tag, these scripts won't 
 * be instrumented when running in Firefox (it works in Chrome).  The reason 
 * is the order in which this script is executed happens before steal/instrument can be loaded.  
 * If this is an important case, you can manually load the plugin yourself before any code.  An example of this:
 * 
 * @codestart
 * &lt;script type='text/javascript'&gt;
 *   steal('app', function(){
 * 	   // code
 *   })
 * &lt;/script&gt;
 * @codeend
 * 
 * - Remote files (not on the same domain) are skipped because they can't be loaded via AJAX.
 * 
 */



steal.instrument = {};
steal("./parser.js").then("./process.js", "./utils.js", function(){

var utils = steal.instrument.utils,
	origJSConverter = steal.types.js.require,
	extend = function(orig, newO){
		for(var k in newO){
			orig[k] = newO[k];
		}
	}

extend(steal.instrument, {
	// keep track of all current instrumentation data (also stored in localStorage)
	files: {},
	ignores: steal.options.instrument || utils.parentWin().steal.instrument.ignores || [],
	/**
	 * Calculates block and line coverage information about each file and the entire collection.  Call this 
	 * when you are ready to display a coverage report, like:
	 * 
	 * @codestart
	 * QUnit.done = function(){
	 *   var coverage = steal.instrument.compileStats();
	 *   // show report
	 * }
	 * @codeend
	 * 
	 * @return {Object} an object with coverage information about each file and the project as a whole
	 */
	compileStats: function(){
		var cov = utils.parentWin().steal.instrument.files;
		var stats = {
			files: {},
			total: {}
		};
		for(var fileName in cov){
			var lines = steal.instrument.lineCoverage(cov[fileName], cov[fileName].blocksCovered);
			stats.files[fileName] = lines;
		}
		var totalLines = 0,
			totalLinesHit = 0,
			totalBlocks = 0,
			totalBlocksHit = 0;
		for(var fileName in stats.files){
			totalLines += stats.files[fileName].lines;
			totalBlocks += stats.files[fileName].blocks;
			totalLinesHit += stats.files[fileName].lines*stats.files[fileName].lineCoverage;
			totalBlocksHit += stats.files[fileName].blocks*stats.files[fileName].blockCoverage;
		}
		var totalLineCoverage = 0,
			totalBlockCoverage = 0;
			
		if(totalLines){
			totalLineCoverage = totalLinesHit/totalLines;
		}
		if(totalBlocks){
			totalBlockCoverage = totalBlocksHit/totalBlocks;
		}
		
		var total = {
			lineCoverage: totalLineCoverage,
			blockCoverage: totalBlockCoverage,
			lines: totalLines,
			blocks: totalBlocks
		}
		stats.total = total;
		return stats;
	},
	// The following method was adapted from Google's ScriptCover tool
	// Copyright 2011 Google Inc. All Rights Reserved.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//     http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	addInstrumentation: function(scriptContent, fileName) {
	
		// parse() constructs the syntax tree by given JS code.
		// gen_code() generates the JS code by given syntax tree.
		var rebuiltScript = exports.gen_code(exports.parse(scriptContent), { beautify: true }),
			tokens = rebuiltScript.split('\n'),
			instrumentedContent = [], index = 1,
			// Counter of instructions in this script.
			counter = 0,
			// Counter of blocks in this script.
			blockCounter = 0,
			// Stack for numbers of blocks we are in.
			blockStack = [],
			// object that keeps track of which line numbers correspond to which block numbers: {1: [2, 3, 4], 2: [5, 8, 9]}
			blockMap = {},
			lineCount = 0,
			commands = [];
	
		for (var j = 0; j < tokens.length; j++) {
			var trimmedToken = utils.trim(tokens[j]);
			if (trimmedToken != '') {
				var concreteToken = tokens[j],
					isCommand = true;
				
				if (concreteToken.indexOf('%BRT_BLOCK_BEGIN%') != -1) {
					var blockNumber = ++blockCounter;
					blockStack.push(blockNumber);
					blockMap[blockNumber] = [];
					concreteToken = concreteToken.replace('%BRT_BLOCK_BEGIN%',
						'//BRT_BLOCK_BEGIN:' + blockNumber);
					isCommand = false;
				} else if (concreteToken.indexOf('%BRT_BLOCK_COUNTER%') != -1) {
					var blockNumber = blockStack[blockStack.length - 1];
					concreteToken = concreteToken.replace(
						'window.scriptObjects[%BRT_SCRIPT_INDEX%].' +
						'executedBlock[%BRT_BLOCK_COUNTER%] = true',
						'__s("'+fileName+'", '+blockNumber+')');
					isCommand = false;
				} else if (concreteToken.indexOf('%BRT_BLOCK_END%') != -1) {
					blockStack.pop();
					var blockNumber = blockStack[blockStack.length-1];
					concreteToken = concreteToken.replace('%BRT_BLOCK_END%',
						'//BRT_BLOCK_END:' + blockNumber);
					isCommand = false;
				}
				
				if (isCommand) {
					if (trimmedToken.indexOf('}') != 0) { // if line starts with }, don't include it
						blockMap[blockNumber].push(counter);
						lineCount++;
					}
					commands.push(concreteToken)
					counter++;
				}
				instrumentedContent.push(concreteToken);
			}
		}
		
		return {
			fileName: fileName,
			nbrBlocks: blockCounter,
			nbrLines: lineCount,
			blockMap: blockMap,
			instrumentedCode: instrumentedContent.join("\n"),
		  	code: commands.join("\n")
		};
	},
	lineCoverage: function(data, blocksUsed) {
		var linesUsed = {},
			blockMap,
			lines = 0,
			lineHits = 0,
			blockHits = 0;
		for(var i=0; i<data.nbrBlocks; i++){
			blockMap = data.blockMap[i+1];
			if(blocksUsed[i] > 0){
				blockHits++;
			}
			for(var j=0; j<blockMap.length; j++){
				linesUsed[blockMap[j]] = blocksUsed[i];
				if(blocksUsed[i] > 0){
					lineHits++;
				}
			}
		}
		var lineCoverage = lineHits/data.nbrLines,
			blockCoverage = blockHits/data.nbrBlocks;
		return {
			linesUsed: linesUsed,
			src: data.code,
			lineCoverage: lineCoverage,
			blockCoverage: blockCoverage,
			lines: data.nbrLines,
			blocks: data.nbrBlocks
		}
	},
	jsConvert: function(options, success, error){
		var files = utils.parentWin().steal.instrument.files,
			fileName = options.rootSrc,
			instrumentation = files[fileName],
			processInstrumentation = function(instrumentation){
				var code = instrumentation.instrumentedCode;
				// console.log(code)
				// use globalEval so anything declared as a var is a global
				utils.globalEval(code);
				success();
			}
		if(utils.shouldIgnore(fileName) ||  
			options.type != "js" || 
			// if both are file: URLs its fine, otherwise make sure its the same domain
			(!(location.protocol == "file:" && steal.File(options.originalSrc).protocol() == "file:") &&
				location.host !== steal.File(options.originalSrc).domain())){
			return origJSConverter.apply(this, arguments);
		}	
		if(instrumentation){
			processInstrumentation(instrumentation)
			return;
		}
		
		
		steal.request(options, function(text){
			// check cache first
			var fileHash = utils.hashCode(text),
				instrumentation = utils.cache.get(fileName, fileHash);
			if(!instrumentation){
				instrumentation = steal.instrument.addInstrumentation(text, fileName);
				utils.cache.set(options.rootSrc, fileHash, instrumentation);
			}
			if(!files[fileName]){
				files[fileName] = instrumentation;
			}
			steal.instrument._setupCoverage(instrumentation.fileName, instrumentation.nbrBlocks);
			processInstrumentation(instrumentation);
		});
	},
	blockRun: function(fileName, blockNbr){
		// only keep track in top window
		var cov = utils.parentWin().steal.instrument.files;
		cov[fileName].blocksCovered[blockNbr-1]++;
	},
	// only keep track in top window
	// total statements per file
	// fileName, lines
	_setupCoverage: function(fileName, totalBlocks){
		var cov = utils.parentWin().steal.instrument.files;
		cov[fileName].blocksCovered = [];
		for(var i=0; i<totalBlocks; i++){
			cov[fileName].blocksCovered.push(0)
		}
	}
});

if(typeof steal.instrument.ignores === "string"){
	steal.instrument.ignores = [steal.instrument.ignores];
}

// defaults to this if nothing provided
for(var i=0; i<steal.instrument.ignores.length; i++){
	if(steal.instrument.ignores[i] === "!jmvc"){
		// remove it and add jmvc files
		steal.instrument.ignores.splice(i, 1, "jquery","funcunit","steal","documentjs","*/test","*_test.js", "*funcunit.js", "mxui");
		
	}
}

steal.type("js", steal.instrument.jsConvert)
window.__s = steal.instrument.blockRun;

})