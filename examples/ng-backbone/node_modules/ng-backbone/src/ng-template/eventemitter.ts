interface Task {
  event: string;
  callback: Function;
  context: Object;
}


export class EventEmitter {

    eventQueue: Task[];

    constructor(){
      this.eventQueue = [];
    }

    /**
     * Trigger callbacks for the given event
     * @example
     * this.trigger( "myevent", 1, 2, 3 );
     */
    trigger( event: string, ...args: any[] ) {
      this.eventQueue.forEach(function( dto: Task ) {
        if ( dto.event !== event ) {
          return;
        }
        dto.callback.apply( dto.context, args );
      }, this );
    }

    /**
     * Just like on, but causes the bound callback to fire only once before being removed.
     */
    once( ev: string, cb: Function, context?: Object ) {
      this.off( ev, cb );
      this.on( ev, cb, context );
      return this;
    }

    /**
     * Subscribe a cb hundler for a given event in the object scope
     */
    on( ev: string, cb: Function, context?: Object ) {
      this.eventQueue.push({
          event: ev,
          callback: cb,
          context: context || { event: ev }
        });
      return this;
    }

    /**
     * Unsubscribe a cb hundler
     *
     */
    off( ev: string, target: Function ) {
      this.eventQueue = this.eventQueue.filter(function( task ) {
        return task.event !== ev || task.callback.toString() !== target.toString();
      });
      return this;
    }

}
