(function () {
    var global = this,
        root = (typeof ProvideCustomRxRootObject == "undefined") ? global.Rx : ProvideCustomRxRootObject();

    var observable = root.Observable;
    var observableCreate = observable.Create;

    observable.FromAngularScope = function (angularScope, propertyName) {
        return observableCreate(function (observer) {
            var unwatch = angularScope.$watch(function(){
                return angularScope[propertyName];
            }, 
            function(){
                observer.OnNext(angularScope[propertyName]);
            });
            return function () {
                unwatch();
            };
        })
        .Skip(1); //In AngularJS 0.10.x There is no way to avoid initial evaluation. So we take care about it!
    };

    observable.prototype.ToOutputProperty = function (scope, propertyName) {
        var disposable = this.Subscribe(function (data) {
            scope[propertyName] = data;
            scope.$apply();
        });
        
        scope.$on('$destroy', function(event){
            //we need to asure that we only dispose the observable when it's our scope that
            //was destroyed.

            //TODO: Figure out if thats enough to asure the above (e.g what happens when
            //a child scope will be destroyed but ours won't be affected. Or the other way around, 
            //if a higher scope will be destroyed (and therefore ours as well) does it mean that $destroy() 
            //will be also called on our scope or will our scope get destroyed without actually 
            //calling $destroy() on it?
            if (event.targetScope === scope){
                disposable.Dispose();
            }
        });
    };

})();