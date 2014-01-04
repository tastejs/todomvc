(todomvc.factory 'todoStorage
                 (di-fn ()
                   (def storage-id "todos-angularjs")
                   {get: #(JSON.parse (or (localStorage.getItem storage-id) "[]"))
                    put: #(localStorage.setItem storage-id (JSON.stringify %))}))
