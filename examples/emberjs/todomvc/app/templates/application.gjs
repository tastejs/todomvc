import Route from 'ember-route-template';
import App from 'todomvc/components/app';
import Attribution from 'todomvc/components/attribution';

export default Route(
  <template>
    {{page-title "TodoMVC"}}

    <App>
      {{outlet}}
    </App>

    <Attribution />
  </template>
)

