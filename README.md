#TodoMVC - A Common Demo Application For Popular MVC Frameworks

Over the past year, we've seen interest in lightweight JavaScript MVC frameworks continue
to increase steadily. Backbone, Spine, SproutCore 2.0, YUILibrary, JavaScriptMVC...
the list of choices has never been so evergrowing and developers looking to select an 
option would be forgiven for feeling lost in a sea of what may appear to be (at face)
quite similar solutions.

In many cases it comes down to very subtle differences between these frameworks, so how 
do you choose exactly?. In my previous posts on structured application development I've
attempted to distinguish the pros and cons of such solutions, but when it comes down to
the MVC coding style they offer perhaps there's another way these differences can be 
compared.

##Introducing TodoMVC

You may know that many frameworks now come with their own variation of the 'Todo' example.
It's a simple demo that illustrates how models, views and controllers may be used to write
a completely functional list-based application. Whilst many frameworks do attempt to include
a version of the 'Todo' example, there are some problems here:

Implementations are inconsistant - there's no standard or specification around how the Todo
application should be written - indeed, some may ask if a demo app even needs one. Regardless,
This is why although some frameworks will implement the example with similar features and 
a look/feel consistant with their peers, others will stray away from this quite heavily. This 
is an issue because if you're attempting to directly compare how one framework might achieve
a task vs another, very disparate implementations make this significantly more difficult to do.

Some developers may claim that it's merely just adding or removing items from a list, there's not much more to it, is there?. When you actually delve into framework demos you might be surprised at just how much they can actually differ. Some solutions will opt for a completely different MVC structure to the application, others will opt for JavaScript templating to insert new items whilst some will prefer cloning HTML markup to insert new 'rows' instead. Again, the lack of what we consider a consistant experience causes problems here. 

Lack of a Todo example altogether - I can't speak for all developers, but after reviewing the feature list on such solutions, my first port of call is usually to look for their Todo app as I find this the quickest way to determine whether I'm going to like using their brand of MVC for structuring my apps. This isn't in any way stating an incapability of determining this from code samples in a frameworks docs, but rather, I prefer to review differences in a complete application. I know that other developers feel the same about this too.

So, I had an idea (which you may or may not find useful): 
Why not create a centralalized fork of the various framework Todo examples,
Attempt to make these Todo examples more consistant in features, look and feel
Add a Todo app for those that are missing one altogether or don't have an officially 'endorsed'
implementation. 

The initial result of my efforts is TodoMVC - a library of (almost) consistant Todo examples for MVC frameworks
which include:

<ul>
<li>SproutCore 2.0</li>
<li>Backbone.js</li>
<li>Spine.js</li>
<li>JavaScriptMVC</li>
<li>Sammy.js</li>
<li>YUILibrary</li>
<li>KnockoutJS (MVVM)</li>
</ul>

Code samples:
***coming soon

Screenshots:
**coming soon

All of the demos are completely self-contained, so in the case of say, a framework like 
JavaScriptMVC - not only are all dependencies included but the demo is also 'pre-compiled'
so you can try it out of the box (unlike the version on the official repo). I may also 
expand the example-set to include demos for other new libraries such as Batman.js and Agility
is these are requested.

At the end of the day, I want to make it easier for developers to make a choice between frameworks
and this may be just one other source of information about their differences which you may find 
of assistance.

TodoMVC is built on the efforts of a number of other developers including: **. list.

##Frequently Asked Questions:

####Q:Framework authors with a Todo example update their versions at regular intervals. Will TodoMVC be integrating the same changes into its versions? 

A: Time permitting, yes. I want to ensure that all examples in the collection are up to date and
relevant to current releases, otherwise whatever learning benefit might be gained from them 
goes straight out the door.

####Q:Why not simply fork the examples and push your changes upstream? 

A:Good question. Whilst this might be considered at some point, I like the idea of developers having a single pack of examples they can grab and study to decide whether a framework is right for them. I'd explored the option of maintaining forks as submodules however decided against it as changes to the demos that the project might suggest may not always be agreed upon, or seen as necessary by framework authors.

####Q:Will this collection contain tests for the Todo applications?. 

A:I'm currently still deciding whether there would be a great benefit to this. I regularly state that OS solutions should contain both tests and documentation, however, a few developers have suggested there not being a need nor  expectation as these are essentially usage examples. If enough people request tests, I'm happy to support them.

I don't really see the point of this project. Wtf, bro?. That's a valid viewpoint. I'm not in any way saying that a cosistant, common MVC example is going to take all of the headache out of selecting a framework to use for your project, but if I was looking at these for the first time personally I would find this helpful and I hope there are some developers out there that will feel the same way too.

