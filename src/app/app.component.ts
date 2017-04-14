import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { PGLProvider } from '../lib/pgl/pgl-provider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(
    public platform: Platform,
    public pglProvider: PGLProvider
  ) {
    pglProvider.loadCookie()
      .then(() => {
        return pglProvider.tryLogin();
      })
      .then(loginStatus => {
        console.log(loginStatus);
        this.platformReady();
      });
  }

  platformReady() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
