define(['../lang/toString'], function(toString){

    /**
     * Repeat string n times
     */
     function repeat(str, n){
         str = toString(str);
         return (new Array(n + 1)).join(str);
     }

     return repeat;

});
