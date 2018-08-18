# MVC-Todo app complying to the TodoMVC specs on todomvc.com

## How it works (in the scope of newcomers to CircularJS)

CircularJS works a bit like AngularJS and a bit like EmberJS. There are attributes in the HTML like ```cr-component``` that remind of ```ng-directive``` you would find in AngularJS but there are also HandlebarsJS like template parts that you also can find in Ember apps.

### The template

CircularJS mainly works with ```cr-...``` attributes to make references to the DOM tree elements. There are the following used in the ToDo app (there are just a view more left though):

 - ```cr-component```: defines the element being the component's view and it's name. Will be started in the javaScript by calling ```circular.component('my-component', {...})``` where the attribute's value and the first argument of the method call have to match.
 - ```cr-container```: defines the element within the rendering will happen when the component is initialised.
 - ```cr-template-for```: defines the element (only one) that will act as a template for further rendering.
 - ```cr-event```: will install event listeners within the component. The syntax equals an object declaration where the key is the event type and the value would be the function name being defined within the options of you component.
 - ```cr-view```: defines the name of the reference that the components will provide later on inside the model to have easy access to those elements on runtime without having to make ```querySelector```.

Most of those attributes don't have an immediate effect on the view but makes it easy to write effective code inside your component definitions.


CircularJS uses a Handlebars implementation called ```Schnauzer``` that covers about 95% of the features of Handlebars, but it's just a fraction of code-size and up to 20 times faster.

Schnauzer uses ```Blick``` to get references between the Schnauzer template parts that end up in the DOM and CircularJS, so CircularJS can easily update the view(s) on any change of the component's model. This can almost be seen as what Glimmer, used by EmberJS, does.

In your Handlebars-like templates you can now use static variables that are only used the first time of rendering, or dynamic variables defined by the ```%``` sign in front of the variable (```{{#if %foo}}bar{{/if}}```). Those dynamic variables are responsible for keeping the components model and the view in sync (data-binding).

Dynamic variables usually don't trigger a view update if the model changes but the new value equals the old one accept if the variable is signed with a double ```%%```. This can be useful for example if you need to reset a value of an input field, where the value of the element is always out of sync with what you see while you're typing as the value only get's updated on blur.


In the index.html you will now recognise 2 ```cr-component``` definitions, ```app``` and ```list```, their templates for rendering defined by ```cr-template-for``` and the definition of where the templates should be rendered into defined by ```cr-container``` (which can have a value ```prepend``` if you want to not append but prepend the rendering).

In our case here, we have a very special edge-case situation: Not only the components are nested, which is a quite common case, but also the templates are nested, and this is the reason for the previously mentioned ```cr-container="prepend"``` and the last line of the code in ```app.js```, but I'll get back to this later on.

### The JS code (app.js)

CircularJS provides besides PubSub, routing, ajax, promise, resource-loader and a lot of other tools also an AMD-module loader, and there we explained the first line of code.

The following lines are just some variable declarations fo literals and then on line 12 we now define our first component, The list of TODO's, which is the nested component inside the UI, or 'app' component.
As mentioned in the "Template" section, we have a HTML element with the attribute ```cr-component="list"``` that waits to be initialised by ```const list = circular.component('list', {...});```.


Side Note: Components can be used to
 - just keep track of a state and maybe react on events on the UI and not render anything else,
 - render a single model item like we do in the following explained "app" component,
 - render a list of items re-using the same template over and over again or
 - render nested items like you would find in a menu-tree, category tree or actually a DOM-tree.


A very common use case of building components is by feeding it a ```model```, that might be used for rendering or just as a state model (but you should always think of it as a state model), the ```listeners``` that define the parts of the model we want to react on if they change (in our case it is all ```*```), ```subscribe```, the callback function that get's called in case a model property we're listening to has been modified and finally ```eventListeners``` where you can place all your event listener callback functions you defined in your template with ```cr-event```. That's pretty much it.


A best practise rule would be to try to only use ```eventListeners``` callbacks to set variables of the model unless you don't track view elements in you state-model but need to do something with it.

All the callbacks will provide you with the event, the DOM-element of the rendered item and the model-item.
If you look at the event listeners, it is probably very obvious what they do, and if you follow the template side by the JS, you can probably easily figure out how those model changes effect the view. So, I guess I don't even have to give further explanations here.

Maybe ```item.editable = ''``` and ```item.editable = 'focus'``` needs some further explanations:
In "Blick" there are some attributes defined that not only change their values on a model change but do a bit more. We're now talking about boolean DOM-Element attributes: disabled, checked, autocomplete, selected, ...
In case of the value of ```disabled=""``` receives a falsy value (here defined by ```item.editable```), the attribute doesn't get the value but the attribute is actually removed. In case of a truethy value, the attribute looks like ```disabled=""``` or ```disabled```. In the special case of the ```disabled``` attribute you can pass it a value of ```focus``` which will remove the attribute but also calls ```.focus()``` on the element.


The ```subscribe``` callback get's fired as soon as the model changes a registered property. In case of the ```text``` being changed, the variable ```editable``` will be changedd, so the input field blurs and hides, otherwise we trigger an update of the UI (in case we toggled a todo item).

If the text changed or the toggle was triggered, the list-component's model gets saved to the local storage by calling ```storage.saveLazy(list.model, STORAGE_KEY);```


The following function ```updateUI()``` is used to update the next component and won't be explained here as it will be very clear what it does when we go throug that next component ```circular.component('app', {...})```


So, ```circular.component('app', {...})``` sets up the UI components where we have 3 event listeners that add children to the list model, delete the done list items by first getting the model items by calling ```list.getElementsByProperty('done', true)``` and then loops through to actually delete them and finally the ```toggleAll``` callback, that does almost the same besides it gets all model  items that are not checked and changes its model items to done. I think there is not much explanation necessary as this is quite straight forward.

The items of its own model is used to keep track of the state of the UI. This also explains the function ```updateUI()``` which only updates the models properties and therefore triggers the Schnauzer-Blick template with its dynamic variables to update the view.


The last part to be explained is the ```onInit``` callback:
This callback is called right after the component is initialised and rendered.

The second function ```updateUI()``` was explained before, it just sets the UI to its initial state.

```circular.addRoute({...})``` sets up a router that, in this case, reacts on URL change and checks for a value after the hash. This variable is then extracted and used to update the filter ('all', 'active', 'Completed') in the view.

The ```true``` means that if there was a variable detected, even after the router was defined, it should already trigger its callback. Routers are based on PubSub that can do the same thing (look back on actual state). The argument ```self``` is actually the instance of the component itself.


So, now to that edge-case I was mentioning in the beginning: What does ```self.model[0].views.main.appendChild(list.container);``` actually do, and why.

Well, I chose to use ```<body>``` as my app-component because it includes all the UI components at once. But, actually the component is divided in two halves as there is the list-component inside. This would not be so much of a problem if there was not the other component even inside the app-component's template.

As soon as a component renders a template, the DOM-elements defining the template are removed from the document and are then only used as innerHTML (or in this case even outerHTML) of itself. But, as long as the component is not initialised, the elements act just like regular dome elements.

In our case, we initialised the list-components first, so it was embedded inside the outer template that was at this time still regular DOM stuff.

When we initialised the list-component we also got references to the component's element its container and all the other cr-view references for free. As soon as we initialise the app-component, the the list-component gets thrown out (as its part of the other template), but we also get the reference to the outer component's ```cr-view="main"``` element.

This way we can append the list-component back to the ```cr-view="main"``` of the outer component.

The ```cr-container="prepend"``` is because the fact that we choose to use ```<body>``` as a component which is also the container, a regular ```append``` would put our view on the end of the container and the ```<footer class="info">``` would then be above.

This seems all a bit hacky, but it's for the reason to not have to rebuild the TodoMVC's template too much and/or not to have to do a third component that would take care of the bottom part of the UI. This happens on init only anyhow and is therefore also not really expensive.


## Conclusion

As you can see, making SPAs or just dynamic Web-pages is quite straight forward. The JavaScript you need mostly just takes care of the state model to be up-to-date and the dynamic template takes care of the rest - the rendering. And there is no difference in how to think about the template rendering the first time and later on when the model changes as it is the same logic, it just differs by adding the "%" to the dynamic variables.

CircularJS has a lot more powerful tools not shown in this fairly easy app that are as easy to understand and use.

## Comparison to other frameworks

CircularJS is closer to real JavaScript than other frameworks and less oppinionated, that's why you don't have to learn that much about framework dependent features that are in my oppinion most of the times restrictions to your ideas. You're more flexible in how to solve problems and don't have to work around oppinionated restrictions.

To make something like AngularJS's features, directives or services you can always create your JavaScript components using ```define``` and ```require``` to create reusable components, but then JavaScript components, that might even be used in plain javaScript projects or other frameworks. CircularJS doesn't limit you in how to think about components and also doesn't want to remind you to componentise. This is up to you. This will stay your responsibility.

One reason why I choose Schnauzer (Handlebars implementation) to be used as the rendering engine for CircularJS is as follows:
In my previous project there was always a struggle between Server-Side-Rendering (SSR) and Client-Side-Rendering. Most of the time you want to rely on the tools you can control, so the Server, as you never know what the client is using...
If it comes to multy-lingual apps, there is a lot of client-side solutions for translateing, ... but it is always a bit client side heavy solution, or even rebundling if you think of the Angular solution. I also think that language related things should never ever be reflected inside javaScript files,... only in templates.
With CircularJS using the HTML files as templates you can actually all you UI-components, forms, everything ... being translated by the backend or just served a pre-translated templates instead.
With JS-template based frameworks, this is also not that trivial. Getting translated templates is no efford at all.
