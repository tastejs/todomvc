define(['./indexOf', './filter'], function(indexOf, filter){

    /**
     * @return {array} Array of unique items
     */
    function unique(arr){
        return filter(arr, isUnique);
    }

    function isUnique(item, i, arr){
        return indexOf(arr, item, i+1) === -1;
    }

    return unique;
});

