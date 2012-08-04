Please Note: this project has moved from briancavalier/aop to cujojs/aop.
Any existing forks have been automatically moved to cujojs/aop. However,
you'll need to update your clone and submodule remotes manually.

Update the url in your .git/config, and also .gitmodules for submodules:

```
git://github.com/cujojs/aop.git
https://cujojs@github.com/cujojs/aop.git
```

Helpful link for updating submodules:
[Git Submodules: Adding, Using, Removing, Updating](http://chrisjean.com/2009/04/20/git-submodules-adding-using-removing-and-updating/)

----

[Aspect Oriented Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming "Aspect-oriented programming - Wikipedia, the free encyclopedia") for Javascript.

## Changelog

### v0.5.3

* First official release as part of [cujojs](http://github.com/cujojs)
* Minor doc and package.json tweaks

### v0.5.2

* Revert to larger, more builder-friendly module boilerplate.  No functional change.

### v0.5.1

* Minor corrections and updates to `package.json`

### v0.5.0

* Rewritten Advisor that allows entire aspects to be unwoven (removed) easily.

# Beers to:

* [AspectJ](http://www.eclipse.org/aspectj/) and [Spring Framework AOP](http://static.springsource.org/spring/docs/3.0.x/reference/aop.html) for inspiration and great docs
* Implementation ideas from @phiggins42's [uber.js AOP](https://github.com/phiggins42/uber.js/blob/master/lib/aop.js)
* API ideas from [jquery-aop](http://code.google.com/p/jquery-aop/)
