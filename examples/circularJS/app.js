// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~76 effective lines of JavaScript.
require(['circular'], Circular => {
  const ENTER_KEY = 13;
  const ESCAPE_KEY = 27;
  const STORAGE_KEY = 'todos-circularjs-0.1';
  const get = 'getElementsByProperty';

  const circular = new Circular();
  const storage = Circular.Toolbox.storageHelper;

  const list = circular.component('list', {
    model: storage.fetch(STORAGE_KEY),
    listeners: ['*'],
    subscribe: (propName, item) => {
      propName === 'text' ? item.editable = '' :
        Circular.Toolbox.lazy(updateUI, list);
      if (propName !== 'editable')
        storage.saveLazy(list.model, STORAGE_KEY);
    },
    eventListeners: {
      toggle: (e, elm, item) => item.done = elm.checked,
      delete: (e, elm, item) => list.removeChild(item),
      save: (e, elm, item) => elm.value ?
        item.text = elm.value : list.removeChild(item),
      focus: (e, elm, item) => item.editable = 'focus',
      blur: (e, elm, item) => item.editable = '',
      keyup: (e, elm, item) => {
        if (e.keyCode === ESCAPE_KEY) item.text = item.text;
      },
    },
  });

  const updateUI = () => {
    const all = list.model.length;
    const done = list[get]('done', true).length;
    const appModel = circular.components['app'].model[0];

    appModel.all = all !== 0 && all === done;
    appModel.hide = all === 0;
    appModel.left = all - done;
    appModel.plural = all - done !== 1;
    appModel.none = done === 0;
  };

  circular.component('app', {
    model: [{
      filter: 'all',
      left: 0,
      plural: false,
      all: false,
      none: false,
      hide: true,
    }],
    listeners: ['*'],
    eventListeners: {
      addItem: (e, elm) => {
        const text = elm.value.trim();

        if (e.keyCode === ENTER_KEY && text) {
          list.appendChild({
            text: text,
            done: false,
            editable: '',
          });
          elm.value = '';
        }
      },
      deleteDone: () => list[get]('done', true)
        .forEach(unit => list.removeChild(unit)),
      toggleAll: e => list[get]('done', !e.target.checked)
        .forEach(unit => unit.done = e.target.checked),
    },
    onInit: self => {
      circular.addRoute({
        path: '(/)(:filter)',
        callback: data => self.model[0].filter =
          data.parameters.filter || 'all',
      }, true);
      updateUI();
      self.model[0].views.main.appendChild(list.container);
    },
  });
});