# W3View • [TodoMVC](http://todomvc.com)

> ## W3View • The HTML was created for this
> - Extremely light and fast
> - Simple and absolutely painless.
> - Componentize your work in easiest way.
> 
> Minimalistic **View** layer for any kind of MVC or Flux. 
> 
> Modularity allows you to separate your component libraries.
>
> Prebuilding helps you to optimize your application for using in production.
>    
> **11k  of documented, not minified code. ( 2.1k mimified and gzipped )**
>

## Resources

- [Website](https://github.com/vitalydmitriev1970/W3View)
- [Documentation](https://github.com/vitalydmitriev1970/W3View/blob/master/api-doc.md)
- Currently used only by my home projects :). 
<br>You can be FIRST!
- [FAQ](https://github.com/vitalydmitriev1970/W3View/blob/master/howto.md)

### Articles

No articles was published currently, 
but i hope - You can write some :)

### Support

- [GitHub](https://github.com/vitalydmitriev1970/W3View)

## Implementation

**How was the app created?**

The application was created during two evenings in simplest way.
Component library was inlined in the hidden DIV for simplifying the process.
As the bonus - the app can be loaded from file system without of server.
The W3View allows you also load modules of component libraries via XHR
or prebuild them together into JS bundle.

Bundling improves starting time by decreasing of delivering size and 
eliminate the HTML parsing.

Classical MVC pattern was used.

The **View** layer is fully based on W3View 
and renders data, passed by **Controller**. 
Active **Model** has no ideas
about how it can be presented and thin **Controller** uses
only public interfaces of both. 

**Anything worth sharing about the process of 
creating the app?**

Since the W3View is very thin layer on top of the DOM API and
each component looks like small and simple HTML page 
with script inlined,
the process of application writing is easy and painless.

You can focus on the business logic and forget the ugly 
sintaxis of data binding, framework-specific workarounds 
and tuning technics.

Just have fun while writing apps, like me.

**Any spec violations?**

No spec violations. No template and CSS modifications.

## Credit

Created by [Vitaly Dmitriev](https://github.com/vitalydmitriev1970/W3View)
