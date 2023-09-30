import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from 'todomvc/app';
import config from 'todomvc/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
