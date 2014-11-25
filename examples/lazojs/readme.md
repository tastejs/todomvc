# Lazojs TodoMVC Example

[Lazo](https://github.com/walmartlabs/lazojs) is a full stack client-server web framework based on Backbone,
Requirejs, and Handlebars (default template engine; you can use whatever template engine you like :)).

The name is derived from the Spanish word LAZO which means link. 

The goal of Lazo is to provide a ‘link’ between the client and server for application views, models, and business
logic allowing developer to create complex applications with ease.

* Lazo gives the front-end engineer 100% control over the UI layer.
* Lazo is 100% SEO compliant.
* Lazo has an optmized time to render.
* Lazo is being used to power the internal business tools [@WalmartLabs](http://www.walmartlabs.com).

## !important If You Read Anything Read this Section

> The majority of this code is based on other Backbone TodoMVC examples. Please refer to those examples
for further documentation.

Please note that these examples are written within the context of TodoMVC and certain aspects of the implementations
would not be the same outside of this context. For example, when filtering the todo list one would likely send back
up the filtered subset of data as opposed to the entire result set. The latter approach was taken so that these examples
would be easier to compare to other library and framework examples.

### Three different implementations are included:

* **components/todos-single:** This is TodoMVC in its most basic form. It is one component that renders the entire screen.
* **components/todos-multiple:** This example illustrates how to break up a page into reusable components. It consists
  of a parent component, `components/todos-multiple`, and three child components - `components/header`, `components/main`,
  `components/footer`.
* **components/todos-layout:** This example further expands upon the reusable components concept and intrdocues a new
  concept, layouts. A layout is a component that contains a component container with the reserved value "lazo-layout-body". The
  layout component is associated to route as a property in addition to the component property (see `app/app.json`).
  The component associated with the route in question is rendered in the "lazo-layout-body" component container. If an executed
  route handler references the last layout rendered then only the "lazo-layout-body" component is rendered
  on the client. An application can aslo specify a default layout outside of the route definitions.
* **components/hello:** This is strictly used to visualize the concept of a layout.

## Getting started

To install Lazo execute the following command:

```shell
npm install -g --production lazo
```

Next clone [TodoMVC](https://github.com/jstrimpel/todomvc):

```shell
git clone https://github.com/jstrimpel/todomvc.git
```

Finally start the new application:

```shell
lazo start todomvc/examples/lazojs
```

You are done.

Open `http://localhost:8080` in a browser to verify that the application is running.

## Questions

Great. We are glad this has peaked your interest.

There is alot going on behind the scenes that is not covered in this example.

Please direct any questions to Jason Strimpel, [jstrimpel@walmartlabs](mailto:jstrimpel@walmartlabs).
