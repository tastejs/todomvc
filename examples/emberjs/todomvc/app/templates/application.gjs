import title from 'ember-page-title/helpers/page-title';
import Route from 'ember-route-template';
import App from 'todomvc/components/app';
import Attribution from 'todomvc/components/attribution';

export default Route(
  <template>
    {{title "TodoMVC"}}

    <App>
      {{outlet}}
    </App>

    <Attribution />
  </template>
)

