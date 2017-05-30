# Logging Events

* `log.sync` - fires every time the template synchronizes
* `log.listen` - fires when View subscribes a model or a collection
* `log.template` - fires on template warnings

You can subscribe for view events like that:
```javascript
let logger = {
  "log:sync log:template": function( msg: string, ...args: any[] ): void {
      console.log( `LOG(${this.cid}):`, msg, args );
   }
};

new FooView({ logger: logger });
```
