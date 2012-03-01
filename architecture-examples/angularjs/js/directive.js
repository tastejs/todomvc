
angular.directive('my:blur', function(expression, compiledElement) {
    var compiler = this;
    return function(linkElement) {
        var scope = this;
        linkElement.bind('blur', function(event) {
            scope.$apply(expression, linkElement);
            event.stopPropagation();
        });
    };
});

angular.directive('my:dblclick', function(expression, compiledElement) {
    var compiler = this;
    return function(linkElement) {
        var scope = this;
        linkElement.bind('dblclick', function(event) {
            scope.$apply(expression, linkElement);
            event.stopPropagation();
        });
    };
});

angular.directive("my:focus", function(expression, compiledElement){

  return function(element){
    this.$watch(expression, function(){
      if(angular.formatter.boolean.parse(expression)){
        element[0].focus();
        element[0].select();
      } 
    }, element);
  };
});
