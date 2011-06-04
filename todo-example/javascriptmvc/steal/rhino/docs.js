/*
@page stealjs StealJS
@tag core
<h1>StealJS</h1>
<p>The StealJS project is a collection of comamnd and client based JavaScript utilities
that make building, packaging, sharing and consuming JavaScript applications easy.</p>

<h2>Tools</h2>

<h3>Dependency Management</h3>
The [steal steal script] (steal/steal.js) is a script loader and 
dependency management tool.  Features:
<ul>
	<li>Loads JavaScript, CSS, Less, CoffeeScript, and a variety of client-side templates.</li>
	<li>Only loads a file once.</li>
	<li>Can load relative to the current file.</li>
</ul>
@codestart
steal.plugins('jquery/controller','jquery/view/ejs');
@codeend
<h3>JS/CSS Concatenation and Compression</h3>
The steal [steal.build build] plugin makes compressing an application into a single compressed 
JavaScript and CSS file extremely easy.  Features:
<ul>
	<li>Works with any application, even ones not using the steal script.</li>
	<li>Configurable compressors (defaults to Google Closure).</li>
	<li>Compresses Less and CoffeeScript.</li>
	<li>Pre-processes and compresses client-side templates (templates don't have to be parsed).</li>
	<li>Expandable architecture makes it easy to build other resources.</li>
</ul>
@codestart text
js steal/buildjs mypage.html
@codeend

<h3>Logging</h3>
Steal [steal.dev dev] logs messages cross browser.  Messages are removed in production builds.
@codestart
steal.dev.log('something is happening');
@codeend

<h3>Code Generators</h3>
Steal [steal.generate generate]  makes building code generators extremely easy.  Features:
<ul>
	<li>Pre-packaged JMVC style code generators.</li>
	<li>Very easy to write custom generators.</li>
</ul>
@codestart text
js steal/generate/app cookbook
@codeend

<h3>Package Management</h3>
Steal [steal.get get] is a simple JavaScript version of [http://rubygems.org/ ruby gems].  Features:
 <ul>
	<li>Download and install plugins from remote SVN or GIT repositories.  </li>
	<li>Installs dependencies.</li>
</ul>

@codestart text
js steal/getjs http://github.com/jupiterjs/mxui/
@codeend
<h3>Code Cleaner</h3>
Steal [steal.clean clean] cleans your code and checks it against JSLint. 

@codestart text
js steal/clean path/to/page.html
@codeend
 */
//blah