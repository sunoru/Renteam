import { Globalization } from 'ionic-native';

import * as md5 from 'md5';

import { postAPI, postFrontendAPI, PGLCookie } from './api-helper';

export enum PGLLanguage {
  ja = 1,
  en = 2,
  fr = 3,
  it = 4,
  de = 5,
  es = 7,
  ko = 8,
  ch = 9,
  tw = 10
}

export enum PGLSite {
  pdc = 1,
  com = 2,
  pki = 3
}

export enum PGLRegion {
 JP = 0,
  US = 1,
  EU = 2,
  CN = 4,
  KR = 5,
  HK = 6
}

export enum PGLCountry {
  JP = 999,
  GB = 175,
  FR = 60,
  IT = 82,
  DE = 63,
  ES = 154,
  KR = 88,
  US = 176,
  CA = 31,
  MX = 106,
  CH = 75,
  HK = 75
}

export class PGLSaveData {
  trainerNameRuby: string;
  languageId: PGLLanguage;
  lastGameSyncDate: Date;
  memberSavedataIdCode: string;
  countryId: number;
  countryCooperationId: PGLCountry;
  timezone3DS: string;
  accountId: string;
  gameSyncIdCode: string;
  romId: string;
  trainerName: string;
  site: PGLSite;
  regionId: PGLRegion;
  countryCode: string;
  timezoneAccunt: string;
  savedataId: string;
}

export class PGLAccount {
  accountId: string;
  memberId: string;
  nickname: string;
  birthday: string;
  countryName: string;
  addressName: string;
  site: PGLSite;
  publicFlg: number;
  softCount: number;
  countryCooperationId: PGLCountry;
}

export class PGLLoginStatus {
  status_code: string;
  selectedSavedata?: PGLSaveData;
  loginStatus: string;
  account?: PGLAccount;
}

function getPreferredLanguage(): Promise<PGLLanguage> {
  if (Globalization) {
    return Globalization.getPreferredLanguage()
    .then(lang => PGLLanguage[lang.value.slice(0, lang.value.search('-'))])
  } else {
    return Promise.resolve(PGLLanguage.en);
  }
}

function getTimezoneFromRegion(region: PGLRegion): Promise<string> {
  return new Promise (resolve => {
    switch (region) {
      case PGLRegion.JP: resolve('Asia/Tokyo'); break;
      case PGLRegion.KR: resolve('Asia/Seoul'); break;
      case PGLRegion.US: resolve('America/New_York'); break;
      default:
        resolve(getPreferredLanguage().then(lang => {
          if (lang == PGLLanguage.en) {
            return 'Europe/London';
          } else {
            return 'Europe/Rome';
          }
        }));
    };
  });
}

function loginPDC(
  username: string, password: string, cookie: PGLCookie
): Promise<any> {
  let login_data = {
    ISMORE_FLG: 1,
    LOGIN_ROOT: "PGL_XY",
    URL: "3ds.pokemon-gl.com",
    MID: username,
    PASSWORD: md5(password)
  };

  return postAPI('https://member.pokemon-gl.com/api/login', {
    DATA: login_data
  }, cookie).then(response => {
    let data = JSON.parse(response.data);
    if (data.ERROR.CODE === 'ok') {
      return null;
    } else {
      let reason = new Error(data.ERROR.MESSAGE);
      reason.name = data.ERROR.CODE;
      return Promise.reject(reason);
    }
  });
}

function loginCOM(
  username: string, password: string, cookie: PGLCookie
): Promise<any> { 
  // TODO
  return Promise.resolve(null);
}

function loginPKI(
  username: string, password: string, cookie: PGLCookie
): Promise<any> { 
  // TODO
  return Promise.resolve(null);
}

const LOGIN_FUNCTIONS = (() => {
  let x = {};
  x[PGLSite.pdc] = loginPDC;
  x[PGLSite.com] = loginCOM;
  x[PGLSite.pki] = loginPKI;
  return x;
})();

export function loginPGL(
  username: string, password: string, cookie: PGLCookie
): Promise<PGLLoginStatus> { 
  if (!('region' in cookie && 'language_id' in cookie && 'site' in cookie)) {
    return Promise.reject(new Error('Region, language and site should be set before login'));
  }
  let login = LOGIN_FUNCTIONS[cookie.site];
  if (!login) {
    return Promise.reject(new Error(`Unknown site: ${cookie.site}`));
  }
  return getLoginStatus(cookie, true)
    .then(data => {
      if (data.status_code != '0000') {
        return Promise.reject(new Error('Failed to get session ID'));
      }
    })
    .then(() => login(username, password, cookie))
    .then(() => getLoginStatus(cookie))
    .then(data => {
      if (data.status_code != '0000' || data.loginStatus != '1') {
        return Promise.reject(new Error('Login failed'));
      }
    });
}

export function getLoginStatus(cookie: PGLCookie, setCookie = false): Promise<PGLLoginStatus> {
  return getTimezoneFromRegion(cookie['region']) // It's OK when undefined.
    .then(tz => postFrontendAPI("getLoginStatus", {
        languageId: 1,
        timezone: tz,
        timeStamp: new Date().valueOf()
      }, cookie, setCookie))
    .then(response => {
      let jsondata = response.data;
      return JSON.parse(jsondata) as PGLLoginStatus;
    });
  // No need to catch now.
}
