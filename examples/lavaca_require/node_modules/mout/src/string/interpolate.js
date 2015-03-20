define(['../lang/toString'], function(toString) {

    var stache = /\{\{(\w+)\}\}/g; //mustache-like

    /**
     * String interpolation
     */
    function interpolate(template, replacements, syntax){
        template = toString(template);
        var replaceFn = function(match, prop){
            return (prop in replacements)? toString(replacements[prop]) : '';
        };
        return template.replace(syntax || stache, replaceFn);
    }

    return interpolate;

});
