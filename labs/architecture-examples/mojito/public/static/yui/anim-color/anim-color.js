/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('anim-color', function (Y, NAME) {

/**
 * Adds support for color properties in <code>to</code>
 * and <code>from</code> attributes.
 * @module anim
 * @submodule anim-color
 */

var NUM = Number;

Y.Anim.getUpdatedColorValue = function(fromColor, toColor, elapsed, duration,  fn)
{
    fromColor = Y.Color.re_RGB.exec(Y.Color.toRGB(fromColor));
    toColor = Y.Color.re_RGB.exec(Y.Color.toRGB(toColor));

    if (!fromColor || fromColor.length < 3 || !toColor || toColor.length < 3) {
        Y.error('invalid from or to passed to color behavior');
    }

    return 'rgb(' + [
        Math.floor(fn(elapsed, NUM(fromColor[1]), NUM(toColor[1]) - NUM(fromColor[1]), duration)),
        Math.floor(fn(elapsed, NUM(fromColor[2]), NUM(toColor[2]) - NUM(fromColor[2]), duration)),
        Math.floor(fn(elapsed, NUM(fromColor[3]), NUM(toColor[3]) - NUM(fromColor[3]), duration))
    ].join(', ') + ')';
};

Y.Anim.behaviors.color = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        anim._node.setStyle(att, Y.Anim.getUpdatedColorValue(from, to, elapsed, duration, fn)); 
    },
    
    // TODO: default bgcolor const
    get: function(anim, att) {
        var val = anim._node.getComputedStyle(att);
        val = (val === 'transparent') ? 'rgb(255, 255, 255)' : val;
        return val;
    }
};

Y.each(['backgroundColor',
        'borderColor',
        'borderTopColor',
        'borderRightColor', 
        'borderBottomColor', 
        'borderLeftColor'],
        function(v, i) {
            Y.Anim.behaviors[v] = Y.Anim.behaviors.color;
        }
);


}, '3.7.3', {"requires": ["anim-base"]});
