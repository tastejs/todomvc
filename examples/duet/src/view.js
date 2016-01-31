const {dom}  = require('duet');
const Header = require('./Header');
const Main   = require('./Main');
const Footer = require('./Footer');

module.exports = (state) => {
    return dom`
        <div>
            ${Header(state)}
            ${Main(state)}
            ${Footer(state)}
        </div>
    `;
};
