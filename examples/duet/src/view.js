const {dom}  = require('./utils');
const Header = require('./Header');
const Main   = require('./Main');
const Footer = require('./Footer');

module.exports = (state, send) => {
  return dom`
    <section class="todoapp">
      ${Header(state, send)}
      ${Main(state, send)}
      ${Footer(state, send)}
    </section>
  `;
};
