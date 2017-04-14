# [Mantri][] • [ember.js][] • [TodoMVC][]


A comprehensive showcase for the [Mantri][] Dependency System.

## Get Started

```shell
git clone git@github.com:thanpolas/todoAppMantri.git

cd todoAppMantri

npm install
```

### Launch Static Server

```shell
grunt server
```

Then point your browser to http://localhost:4242/

### Try Mantri's Tasks

#### Run Dependencies Generation

```shell
grunt deps
```

#### Build The Application
```shell
grunt build
```
The built file will be in the `dist` folder.


#### The Init Task

```shell
grunt mantriInit
```

The task will create a copy of `mantri.web.js` file and fail on `mantriConf.json` file as it already exists.


## Credit

Initial release by @tomdale.

Refactoring and maintenance by @stas.

Porting to mantri by @thanpolas

[ember.js]: http://emberjs.com/ "emberJS"
[Mantri]: https://github.com/thanpolas/mantri "Mantri - Traditionaλ Dependency System"
[TodoMVC]: http://todomvc.com "Todo MVC"
