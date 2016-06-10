define(['../lang/toString'], function(toString){
    /**
     * Remove non-word chars.
     */
    function removeNonWord(str){
        str = toString(str);
        return str.replace(/[^0-9a-zA-Z\xC0-\xFF \-_]/g, '');
    }

    return removeNonWord;
});
