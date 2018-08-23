module.exports = {
    parse: function(str, line, parser, types, options) {
        parser.on('start', function() {
            // called when a parse starts
        });
        parser.on('*', function(token) {
            // called on the match of any token at all ("*")
            this.out.push(token.match);
        });
        parser.on('end', function() {
            // called when a parse ends
        });
        return true; // parser is good to go
    },
    compile: function(compiler, args, content, parents, options, blockName) {
        const glitchEmbed = '<div class="glitch-embed-wrap" style="height: 420px; width: 100%;"><iframe src="https://glitch.com/embed/#!/embed/'+
            args.join('')+'?path=README.md&previewSize=100&previewFirst=true" style="height: 100%; width: 100%; border: 0;"></iframe></div>';
        return '_output += \''+glitchEmbed+'\';';
    }
};
