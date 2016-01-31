const {store}      = require('./utils');
const view         = require('./view');
const createModel  = require('./model');
const createRouter = require('./router');


module.exports = (start) => {
    store('todos-duet', (stored) => {
        const model = createModel(stored);
        const router = createRouter(model);

        start(view, model, router);
    })
};
