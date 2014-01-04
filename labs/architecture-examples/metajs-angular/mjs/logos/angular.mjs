(entity angular
        (fn module ()))

(entity $scope
        (fn $new (isolate))
        (fn $destroy ())
        (fn $watch (expression  listener:? equality:?))
        (fn $watchCollection (obj listener))
        (fn $digest ())
        (fn $eval (expression:?, locals:?))
        (fn $evalAsync (expression:?))
        (fn $apply (expression:?)))

(declare angular)
