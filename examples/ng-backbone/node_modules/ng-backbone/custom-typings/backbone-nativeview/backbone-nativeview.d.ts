// Type definitions for Backbone.NativeView 0.3.3
// Project: https://github.com/akre54/Backbone.NativeView
// Definitions by: Dmitry sheiko <https://github.com/dsheiko/>

declare namespace Backbone {

  class NativeView<TModel extends Model> extends Events {

        private static extend(properties: any, classProperties?: any): any;

        constructor(options?: ViewOptions<TModel>);
        initialize(options?: ViewOptions<TModel>): void;

        /**
        * Events hash or a method returning the events hash that maps events/selectors to methods on your View.
        * For assigning events as object hash, do it like this: this.events = <any>{ "event:selector": callback, ... };
        * That works only if you set it in the constructor or the initialize method.
        **/
        events(): EventsHash;

        $(selector: string): NodeList;
        model: TModel;
        collection: Collection<TModel>;

        //template: (json, options?) => string;

        setElement(element: HTMLElement, delegate?: boolean): NativeView<TModel>;

        id: string;
        cid: string;
        className: string;
        tagName: string;

        el: any;

        setElement(element: any): NativeView<TModel>;

        /**
         * A hash of attributes that will be set as HTML DOM element attributes on the view's el
         * (id, class, data-properties, etc.), or a function that returns such a hash.
         */
        attributes: any;

        render(): NativeView<TModel>;
        remove(): NativeView<TModel>;
        delegateEvents(events?: EventsHash): any;

        delegate(eventName: string, selector: string, listener: Function): NativeView<TModel>;

        undelegateEvents(): any;
        undelegate(eventName: string, selector?: string, listener?: Function): NativeView<TModel>;

        _ensureElement(): void;
    }
}

