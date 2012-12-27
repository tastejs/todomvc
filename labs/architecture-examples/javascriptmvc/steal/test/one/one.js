order(1);

inserter("another/two.js", function(){console.log("after 2")})
inserter("one/four.js",function(){console.log("after 4")})

//something here
another = function(somevariablename){
    return somevariablename *2;
};