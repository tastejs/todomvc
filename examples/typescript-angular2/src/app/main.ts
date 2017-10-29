import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MainModule } from './main.module';
import {enableProdMode} from "@angular/core";


enableProdMode();

platformBrowserDynamic().bootstrapModule(MainModule).then();
