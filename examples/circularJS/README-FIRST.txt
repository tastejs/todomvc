Dear TodoMVC team,

reading "Considerations before submitting a new app" on your repository (already a long time ago) brigs me in a dilemma situation. CircularJS fulfills all criterias besides "The framework you are using should have at least 5k stars..." but is very strong if comes to "Your app should bring something truly new to the table".

I read all the blogs and articles you guys wrote about YAFS, "The cost of JavaScript", "Preload, Prefetch" an many more, and of course the articles about the meaning of TodoMVC, and I totally agree with that philosophy. I strongly believe though that CircularJS covers all those arguments and even a lot more. And this is what I'm going to explain in this following text, introducing https://github.com/PitPik/circularjs.

All you need to create simple or complex SPAs or just dynamic web-pages using MVC* is:
 - decent module loader (AMD, ...)
 - async way of programming (ajax, promise, ...)
 - messaging tool such as PubSub for decoupling
 - model controller
 - state management (model -> view -> model)
 - templateing engine with 1, 2 way data binding
 - a decent routing system
 - event management
 - component/module(/widget/app) management
 - structure to be able to componentize, create standalone/independent modules

Some more arguments for choosing the right framework are:
 - should be easy to learn
 - should be simple to use
 - should help you write less code and
 - still easy to understand (also for others) what you were writing
 - should help you structure your code
 - fast in performance
 - fast loading times (framework and your resources)
 - support the help of SSR for better user experience
 - ... and much more...

Most frameworks promise all those arguments but make me constantly disappointed about the obviously poor definition of "performance", "easy", "simple", "small", ... Most framework are very complex, over engineered, huge and therefore clumsy and slow and most of the times the learning curve is steep when it comes to a simple "Hello world" example but flattens dramatically out if you need to solve complex tasks.
A lot of them are also very opinionated and make you work a certain way so you have to learn an opinionated way of working and constantly get in conflict with the flexibility needed if product owners or UX designers ask for something "different" which you can't solve with your chosen framework as it is just not flexible or performant enough. Because of this strict rules, developers sometimes need to write very complex solutions for an actually simple task (I once saw a pagination plugin for AngularJS that was actually bigger than the framwork itself...)

It might sound very catchy, but CircularJS is not like that.
CircularJS is "really" very easy to learn as it uses a lot of well known design patterns for developers to use such as PubSub, ajax, Promise, Handlebars, amd, common router patterns, DOM like methods, ..., it is very close to "real" JavaScript and "definitely" very small (~36KB minified, ~13KB gZip) and therefore in a blink on your mobile, ready to fire up your optimized loaded app resources.

If you look at my implementation of the "TodoList" you might be able to understand the code even if you never saw the API documentation of CircularJS. With the original implementation you might even load 5000 todo items and the browser doesn't even flicker on load (Choice of coding style for high-performance items).
The code is very simple and small compared to all the other implementations and really concentrated on the state model and not on manipulating DOM elements or (de-)installing event listeners, as this is all managed by the framework.

There is a demo "heroes" from Angular that I reimplemented with CircularJS which shows even more features that I could not possibly show with the todoList demo.
I realized a lot more very complex projects with CircularJS that I'm not allowed to show in public, which might also be the reason why CircularJS is not known to the community...

So, did I "reinvent the wheel"? Well, I obviously did as probably anyone would do who considers writing an MVC framework, but I did it for a good reason though, so that my motorcycle doesn't need to run on an oversized, heavy carriage-wheels with iron mountings but on a lightweight aluminum wheels with slick rubber tires. I couldn't find an existing framework that fulfills all the criterias I posted earlier in this letter (even though they claim to do so).

I know, all this won't convince you to embed CircularJS to your collection of TodoMVC apps, but maybe you can see the potential power of CircularJS and give me advice on how to get it rolling in the front-end community.
As mentioned in the beginning, that I'm experiencing a dilemma, actually dealing with the classic chicken-egg dilemma: How can my framework get popular and reach 5k stars when it's not promoted on a popular page like TodoMVC ;o)
Well, I'm more of a developer than a hipe follower that's why I'm not that experienced with the flow of the community rules and therefore no clue how to promote open-source software.
Any ideas on that?
