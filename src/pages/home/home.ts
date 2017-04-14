import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PGLProvider } from '../../lib/pgl/pgl-provider';
import { PGLRegion, PGLLanguage, PGLSite } from '../../lib/pgl/login-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public pglProvider: PGLProvider
  ) {

  }

  testlogin() {
    this.pglProvider.storage.clear()
      .then(() => this.pglProvider.loadCookie())
      .then(() => this.pglProvider.setRegionLanguageSite(
        PGLRegion.JP, PGLLanguage.ja, PGLSite.pdc
      ))
      .then(() => this.pglProvider.setAccount('4315006', 'B3sGpDRy6gtdbHR'))
      .then(() => this.pglProvider.tryLogin());
  }
}
