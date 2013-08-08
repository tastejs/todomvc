
define("mo/easing/base", [], function(){

    return {

        def: 'ease',

        positions: {
            'linear'         :  [0.250, 0.250, 0.750, 0.750],
            'ease'           :  [0.250, 0.100, 0.250, 1.000],
            'easeIn'         :  [0.420, 0.000, 1.000, 1.000],
            'easeOut'        :  [0.000, 0.000, 0.580, 1.000],
            'easeInOut'      :  [0.420, 0.000, 0.580, 1.000]
        },

        values: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out'
        },

        // http://gsgd.co.uk/sandbox/jquery/easing/
        // t: current time, b: begInnIng value, c: change In value, d: duration
        functions: {
            linear: function(x, t, b, c) {
                return b + c * x;
            },
            ease: function(x, t, b, c) {
                return ((-Math.cos(x*Math.PI)/2) + 0.5) * c + b;
            },
            easeIn: function (x, t, b, c, d) {
                return c*(t /= d)*t + b;
            },
            easeOut: function (x, t, b, c, d) {
                return -c *(t /= d)*(t-2) + b;
            },
            easeInOut: function (x, t, b, c, d) {
                if ((t /= d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            }
        },

    };

});
