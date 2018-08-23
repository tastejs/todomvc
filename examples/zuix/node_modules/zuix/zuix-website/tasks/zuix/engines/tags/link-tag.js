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
        return '_output += "[[ DEV.TO POST '+args.join('')+' ]]";';
    }
};
