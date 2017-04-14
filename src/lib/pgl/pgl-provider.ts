import { Injectable } from '@angular/core';

import { SecureStorage } from 'ionic-native';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { PGLCookie } from './api-helper';
import { PGLLoginStatus, PGLRegion, PGLLanguage, PGLSite, loginPGL, getLoginStatus } from './login-api';

@Injectable()
export class PGLProvider {

  private cookie: PGLCookie;
  private loginStatus: PGLLoginStatus;
  private secureStorage: SecureStorage;

  constructor(
    public storage: Storage,
    public events: Events
  ) {
    this.loginStatus = null;
    this.secureStorage = new SecureStorage();
    this.secureStorage.create('pgluser')
      .then(() => events.publish('sstorage:created'));
  }

  isLoggedin(): boolean {
    return this.loginStatus && this.loginStatus.loginStatus != '0';
  }

  loadCookie(): Promise<PGLCookie> {
    return this.storage.get('pgl-cookie').then(cookie => {
      if (cookie) {
        this.cookie = cookie;
      } else {
        this.cookie = {};
      }
      return this.cookie;
    });
  }

  saveCookie(): Promise<any> {
    return this.storage.set('pgl-cookie', this.cookie);
  }

  setRegionLanguageSite(region: PGLRegion, language: PGLLanguage, site: PGLSite): Promise<any> {
    this.cookie.region = region;
    this.cookie.language_id = language;
    this.cookie.site = site;
    return this.saveCookie();
  }

  setAccount(username: string, password: string): Promise<any> {
    return this.secureStorage.set('account', JSON.stringify({username: username, password: password}))
      .then(() => this.events.publish('sstorage:updated'));
  }

  tryLogin(): Promise<PGLLoginStatus> {
    // return Promise.resolve({});
    delete(this.cookie.AWSELB);
    delete(this.cookie.JSESSIONID);
    return this.secureStorage.get('account')
      .then(data => JSON.parse(data))
      .then(data => loginPGL(data.username, data.password, this.cookie))
      .then(x => {
        this.loginStatus = x;
        this.saveCookie();
        this.events.publish('login:succeeded')
        return x;
      })
      .catch(error => {
        console.log(error);
        this.events.publish('login:failed');
      });
  }

}
