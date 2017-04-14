
/*global define*/
define('scalejs.linq-linqjs',[
    'scalejs!core',
    'linqjs'
], function (
    core,
    Enumerable
) {
    

    Enumerable.Utils.extendTo(Array);

    core.registerExtension({
        linq: {
            enumerable: Enumerable
        }
    });
});

