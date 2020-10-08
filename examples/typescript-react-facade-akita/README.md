# TodoMVC (React) using Facades + Akita

A simple Todo application written in React + TypeScript. This application was architected using react hooks, facades, and Akita state management. With Akita, we also get powerful undo/redo features.

![](https://i.imgur.com/LciTKuC.png)

> A live demo is available at: https://codesandbox.io/s/react-todo-akita-final-u6gx3

This project was created with `npx create-react-app todo-akita --template typescript`

<br>

----

<br>

## Why Facades + Akita 

Using Akita to manage state data (Todo items), we then use a Facade as a 'smart' view model to the UI components.

![](https://i.imgur.com/49yCZV4.png)

Learn more about Facades here: [State Management in React w/ Facades & RxJS](https://medium.com/@thomasburlesonIA/react-facade-best-practices-1c8186d8495a)

<br>

### 1-way Data flows

The benefits of using hooks + **facades** is a super clean view layer AND event delegation to the facade. This maintains a 1-way data flow.

![](https://i.imgur.com/zWroE9c.png)


* The view components render data output from the Facade.
* The Facade pushes data updates/changes to the view using **RxJS streams**
* The view components delegate user interactions to the Facade.

<br>

### Super-Clean UI Components


With facades ( + hooks), the UI components do not have any business logic, state management, nor data persistance.

![](https://i.imgur.com/S3ujhty.png)

![](https://i.imgur.com/Rqoet7b.png)

This also means that the TodosPage is using presentational children components. Each child component output events to the parent business container `TodoPages`; which - in turn - delegates directly to Facade methods.
