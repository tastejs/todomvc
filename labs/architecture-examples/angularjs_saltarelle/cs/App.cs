using System;
using ng;
using System.Runtime.CompilerServices;

[assembly: ScriptSharpCompatibility(OmitDowncasts = true,OmitNullableChecks = true)]

namespace todo.cs
{
    public class App
    {
        [ScriptName("controller")]
        static App()
        {
            angular.module("todomvc", new string[]{})
                   .controller("todoCtrl", new object[] { "$scope", "$location", "todoStorage", "filterFilter","$log", new Func<TodoScope, ILocationService, ITodoStorage, IFilterService,ILogService, object>((scope, location, todoStorage, filterFilter,log) => new TodoCtrl(scope, location, todoStorage, filterFilter,log)) })
                   .directive("todoBlur", new object[] { "$log", new Func<ILogService, object>((log) => new TodoBlur(log)) })
                   .directive("todoFocus", new object[] { "$timeout", "$log", new Func<ITimeoutService, ILogService, object>((timeout, log) => new TodoFocus(timeout, log)) })
                   .service("todoStorage", () => { return new TodoStorage(); })
                ;
        }
    }
}
