using System;
using jQueryApi;
using ng;

namespace todo
{
    public class TodoBlur
    {
        public Action<IScope, jQueryObject, TodoAttrs> link;
        private readonly ILogService log;

        public TodoBlur(ILogService log)
        {
            this.log = log;
            link = linkFn;
        }

        private void linkFn(IScope scope, jQueryObject elem, TodoAttrs attrs)
        {
            log.log("TodoBlur link");
            elem.Bind("blur", e => {
                log.log("TodoBlur bind");
                scope.Apply(attrs.todoBlur);
            });
        }
    }
}

