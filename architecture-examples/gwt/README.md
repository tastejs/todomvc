## TodoMVC - GWT Version

This is a Google Web Toolkit (GWT) implementation of the TodoMVC application. The GWT version
is rather different to all the other TodoMVC versions (Backbone, Knockout etc ...) in that it is
written in Java which is compiled to JavaScript. The files within the gwttodo folder are the result
of running the GWT compilation process on the Java files found within the src folder. The UI
pattern used by this application is Model-View-Presenter.

Whilst this application is very different to the other TodoMVC implementations, it still makes for 
an interesting comparison. Large-scale JavaScript applications are often written with GWT or Closure,
with the resulting JavaScript code delivered to the client being compiled. 

### Building this application

The GWT TodoMVC application was built with Java 1.6 and GWT 2.4.0. The easiest way to build this application
is to download the GWT SDK:

http://code.google.com/webtoolkit/gettingstarted.html

Together with the Eclipse plugin:

http://code.google.com/webtoolkit/usingeclipse.html

