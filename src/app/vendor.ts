import 'angular2/bundles/angular2-polyfills';

if ('production' === process.env.ENV) {
    let ngCore = require('angular2/core');
    ngCore.enableProdMode();
}

import 'angular2/core';
import 'angular2/router';
import 'angular2/platform/browser';
import 'rxjs/Rx';
import 'cuid';
